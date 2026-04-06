# GJS / GNOME Shell Extension — AI Working Guide

Reference for any AI assistant working on `raven-sidebar@dalpat.github.io`.
Source: https://gjs.guide/extensions/ (all sub-pages, GNOME 45–49).

---

## Project Context

| Field | Value |
|---|---|
| UUID | `raven-sidebar@dalpat.github.io` |
| Shell versions | 45, 46, 47, 48, 49 |
| Runtime (dev machine) | GNOME Shell **49.0**, Wayland, Ubuntu |
| Install path | `~/.local/share/gnome-shell/extensions/raven-sidebar@dalpat.github.io/` |
| Repo | `~/raven-sidebar/` |

After editing, copy to install path and run:
```bash
gnome-extensions disable raven-sidebar@dalpat.github.io
gnome-extensions enable raven-sidebar@dalpat.github.io
```
On Wayland a full logout/login is needed if the extension fails to reload cleanly.

Logs:
```bash
journalctl --user -b /usr/bin/gnome-shell -f
```

---

## Extension Lifecycle

```
gnome-shell loads extension
    → constructor(metadata)   [once, don't create UI here]
    → enable()                [create all UI, connect all signals]
        ... user uses extension ...
    → disable()               [destroy all UI, disconnect all signals, null all refs]
    → enable()                [called again on re-enable or screen lock]
```

**Rules:**
- All UI and signal setup goes in `enable()`, teardown in `disable()`
- `disable()` must null every reference it destroys
- Never leave live GLib timeout/idle sources after `disable()`

---

## Imports (GNOME 45+ ESM)

```javascript
// GObject-Introspection libraries
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Meta from 'gi://Meta';
import Gvc from 'gi://Gvc';

// GNOME Shell UI (only in extension.js, NOT prefs.js)
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Calendar from 'resource:///org/gnome/shell/ui/calendar.js';
import * as Slider from 'resource:///org/gnome/shell/ui/slider.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';

// Extension base
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
```

---

## St / Clutter Widgets

### BoxLayout (container)
```javascript
// GNOME 48+: use orientation, not vertical
new St.BoxLayout({
    orientation: Clutter.Orientation.VERTICAL,  // or HORIZONTAL
    x_expand: true,
    style: 'spacing: 8px; padding: 12px;',
    style_class: 'my-class',
})
```
`vertical: true` still works on 49 but is deprecated — use `orientation`.

### Common properties
| Property | Notes |
|---|---|
| `x_expand: true` | Fill horizontal space |
| `y_expand: true` | Fill vertical space |
| `reactive: true` | Receives pointer events |
| `can_focus: true` | Keyboard focusable |
| `style_class` | CSS class name(s) |
| `style` | Inline CSS string |

### St.Icon
```javascript
new St.Icon({ icon_name: 'audio-volume-muted-symbolic', icon_size: 16 })
new St.Icon({ gicon: someGioIcon, icon_size: 20 })
```

### St.Label
```javascript
const label = new St.Label({ text: 'Hello' });
label.clutter_text.set_line_wrap(true);
label.clutter_text.set_ellipsize(3); // PANGO_ELLIPSIZE_END = 3
```

### St.Button
```javascript
const btn = new St.Button({ label: 'Click', style_class: 'button' });
btn.connect('clicked', () => { /* handler */ });
```

### St.ScrollView
```javascript
new St.ScrollView({
    hscrollbar_policy: St.PolicyType.NEVER,
    vscrollbar_policy: St.PolicyType.AUTOMATIC,
    overlay_scrollbars: true,
    x_expand: true,
    y_expand: true,
})
```

---

## Panel Button (PanelMenu.Button)

```javascript
// Third arg true = dontCreateMenu (no popup menu, just a button)
this._button = new PanelMenu.Button(0.0, this.metadata.name, true);
this._button.add_child(new St.Icon({
    icon_name: 'my-icon-symbolic',
    style_class: 'system-status-icon',
}));
this._button.connect('button-press-event', () => {
    this._toggle();
    return Clutter.EVENT_STOP;
});
Main.panel.addToStatusArea(this.uuid, this._button, 0, 'right');

// cleanup
this._button.destroy(); // addToStatusArea handles removal automatically
```

Do NOT use `Main.panel._rightBox.insert_child_at_index()` — that's private API.

---

## Chrome (overlays outside panel)

```javascript
Main.layoutManager.addChrome(widget, {
    affectsStruts: false,
    trackFullscreen: false,
});
Main.layoutManager.removeChrome(widget); // before destroy()
```

`affectsStruts: true` would push window content aside (like a dock).

---

## Animations

```javascript
// Slide in from right
widget.ease({
    translation_x: -WIDTH,
    duration: 250,
    mode: Clutter.AnimationMode.EASE_OUT_QUAD,
});

// Slide out
widget.ease({
    translation_x: 0,
    duration: 250,
    mode: Clutter.AnimationMode.EASE_OUT_QUAD,
    onComplete: () => widget.hide(),
});

widget.remove_all_transitions(); // cancel in-flight animation
```

---

## GLib Timers

```javascript
// Start
this._clockId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
    this._updateClock();
    return GLib.SOURCE_CONTINUE; // keep repeating
});

// Stop (always do this in disable())
if (this._clockId) {
    GLib.source_remove(this._clockId);
    this._clockId = null;
}
```

---

## Notifications (MessageTray)

### Signals
```javascript
// New notification source appeared
Main.messageTray.connect('source-added', (_tray, source) => { ... });
Main.messageTray.connect('source-removed', (_tray, source) => { ... });

// Notification on a source
source.connect('notification-added', (_src, notification) => { ... });
source.connect('notification-removed', (_src, notification) => { ... });

// Notification destroyed
notification.connect('destroy', (_notif, reason) => { ... });
```

### Notification properties
```javascript
notification.title    // string — title text
notification.body     // string — body text (NOT .banner)
notification.gicon    // Gio.Icon or null
notification.urgency  // MessageTray.Urgency.{LOW, NORMAL, HIGH, CRITICAL}
```

### Get existing notifications
```javascript
for (const source of Main.messageTray.getSources())
    for (const notif of source.notifications)
        this._addNotification(notif);
```

### Dismiss a notification
```javascript
notification.destroy(); // triggers 'destroy' signal — DO NOT also call _remove manually
```

---

## Calendar Widget

```javascript
import * as Calendar from 'resource:///org/gnome/shell/ui/calendar.js';

this._calendar = new Calendar.Calendar();
// Optional: wire up DBus event source for calendar app events
// this._calendar.setEventSource(new Calendar.DBusEventSource());
```

The widget uses CSS class `calendar` internally — do not replace it.
Wrap in `St.Bin` with `x_expand: true` to control container styling without
breaking internal calendar CSS.

---

## Audio (Gvc)

```javascript
import Gvc from 'gi://Gvc';

this._mixer = new Gvc.MixerControl({ name: 'My Extension' });
this._mixer.connect('state-changed', () => { ... });
this._mixer.connect('default-sink-changed', () => { ... });
this._mixer.connect('default-source-changed', () => { ... });
this._mixer.open();

// When READY:
const sink = this._mixer.get_default_sink();   // output
const src  = this._mixer.get_default_source(); // microphone
const vol  = sink.volume / this._mixer.get_vol_max_norm(); // 0.0–1.0
sink.volume = newVol * this._mixer.get_vol_max_norm();
sink.push_volume();

// Cleanup
this._mixer.close();
this._mixer = null;
```

---

## Signals — cleanup pattern

```javascript
enable() {
    this._ids = [];
    this._ids.push(someObject.connect('signal', () => { ... }));
}
disable() {
    this._ids.forEach(id => someObject.disconnect(id));
    this._ids = null;
}
```

For signals on objects that get destroyed (widgets), disconnecting is
optional — GObject auto-cleans handlers when the emitter is destroyed.
For long-lived objects like `Main.messageTray` or `this._mixer`, always
disconnect manually.

---

## CSS in stylesheet.css

```css
/* Target by style_class */
.my-widget { padding: 8px; border-radius: 10px; }

/* Target child widget type */
.my-widget StLabel { color: white; }

/* Pseudo-classes */
.my-button:hover { background-color: rgba(255,255,255,0.1); }
.my-button:active { background-color: rgba(255,255,255,0.2); }

/* St uses inline units: px, pt, em */
/* No rem, no vh/vw */
```

Stylesheet is loaded automatically from `stylesheet.css` in extension dir.

---

## Version notes relevant to this project

| GNOME | Change |
|---|---|
| 45 | ESM imports (`import X from 'gi://X'`), no more `imports.gi.X` |
| 46 | `St.Bin` needs explicit `x_expand`; `Clutter.Container` removed → `add_child()` |
| 47 | `Clutter.Color` removed → `Cogl.Color` |
| 48 | `vertical` deprecated → `orientation: Clutter.Orientation.VERTICAL`; `Clutter.Image` → `St.ImageContent` |
| 49 | Running on this machine. `logError()` global removed → use `console.error()` |

---

## Common mistakes to avoid

1. **Do not import GTK/Adw/Gdk in extension.js** — they only work in prefs.js
2. **Do not use `Main.panel._rightBox` directly** — use `addToStatusArea()`
3. **Do not use `logError()`** — use `console.error()`
4. **Do not use `notification.banner`** — the body string is `notification.body`
5. **Always remove GLib sources in disable()** — even if callback returned SOURCE_REMOVE
6. **Always null references in disable()** — prevents memory leaks on re-enable
7. **Do not call `_removeNotification()` after `notification.destroy()`** — destroy fires the signal which calls remove; double-call is safe but noisy
