# Raven Sidebar — CLAUDE.md

GNOME Shell extension: right-side sidebar with calendar, clock, volume/mic sliders, and notifications.

## Project Layout

```
extension.js      — single-file extension (all logic here)
stylesheet.css    — CSS for all custom widgets
metadata.json     — uuid: raven-sidebar@dalpat.github.io
docs/gjs-guide-updated.md  — comprehensive GJS/GNOME API reference (~14k lines)
install.sh        — copies files to ~/.local/share/gnome-shell/extensions/…
```

Deploy path: `~/.local/share/gnome-shell/extensions/raven-sidebar@dalpat.github.io/`

## Reload Constraint — Most Important Rule

**On Wayland, `gnome-extensions disable && enable` does NOT reload JS module code.**
Every JS change requires a full **logout → login** cycle to take effect.

CSS-only changes *may* reload without logout via:
```bash
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell \
  --method org.gnome.Shell.Eval 'Main.loadTheme()'
```

## Deploy Command

```bash
cp extension.js ~/.local/share/gnome-shell/extensions/raven-sidebar@dalpat.github.io/extension.js
cp stylesheet.css ~/.local/share/gnome-shell/extensions/raven-sidebar@dalpat.github.io/stylesheet.css
```

Then logout/login.

## Extension Architecture

```
enable()
 ├── _setupMixer()          — Gvc.MixerControl for audio
 ├── _buildButton()         — PanelMenu.Button in top-right panel
 ├── _buildOverlay()        — transparent click-outside-to-close layer
 ├── _buildSidebar()
 │    ├── _buildTabBar()         — Widgets / Notifications tabs
 │    ├── _buildWidgetsPage()    — ScrollView containing:
 │    │    ├── _buildClockHeader()      — day, date, time labels
 │    │    ├── _buildCalendarSection()  — self-built calendar grid
 │    │    ├── _buildVolumeSection()    — Gvc sink slider
 │    │    └── _buildMicSection()       — Gvc source slider
 │    └── _buildNotificationsPage()    — live notification list
 └── _connectNotifications()   — MessageTray signal listeners

disable()
 — Must undo everything: destroy actors, disconnect signals, remove chrome, clear timers
```

## Imports (ESM — GNOME 45+)

```javascript
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gvc from 'gi://Gvc';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
```

Never use the old `imports.gi.*` pattern — this is a GNOME 45+ ESM extension.

## Critical API Facts

### Layout
- `orientation: Clutter.Orientation.VERTICAL` — not deprecated `vertical: true`
- `x_expand: true` / `y_expand: true` — set on children, not on containers
- Sidebar overlay: `Main.layoutManager.addChrome(widget, {affectsStruts: false, trackFullscreen: false})`
- Sidebar slides in via `widget.ease({translation_x: -WIDTH, ...})`

### Clock / Labels
- **Initialize labels with real text at build time**, not lazily in `_show()`. If labels start empty, the ScrollView allocates height based on empty content and clips sections below when text is later added.
- `GLib.DateTime.new_now_local()` for current time
- Use JS `Date` for calendar arithmetic (more reliable than `GLib.DateTime.new_local()` in GJS):
  - `new Date(year, month-1, 1).getDay()` → start offset (0=Sun)
  - `new Date(year, month, 0).getDate()` → days in month

### Slider
- Single `St.Widget` with CSS `linear-gradient` as the visual track
- Outer `St.Widget` (22px, `BinLayout`) as click target; inner `St.Widget` (6px) as visual bar
- Click: `event.get_coords()` → `[evX]`, `outer.get_transformed_size()` → `[trackW]`, `outer.get_transformed_position()` → `[trackX]`
- Destructure correctly: `const [evX] = event.get_coords()` (not `const [ok, x]`)

### Audio (Gvc)
```javascript
this._mixer = new Gvc.MixerControl({ name: 'Raven Sidebar' });
this._mixer.connect('state-changed', () => { ... });
this._mixer.connect('default-sink-changed', () => { ... });
this._mixer.connect('default-source-changed', () => { ... });
this._mixer.open();

// When state === Gvc.MixerControlState.READY:
const sink = this._mixer.get_default_sink();
const vol = sink.volume / this._mixer.get_vol_max_norm(); // 0.0–1.0
sink.volume = val * this._mixer.get_vol_max_norm();
sink.push_volume();
```

### Notifications
```javascript
// Connect
Main.messageTray.connect('source-added', (_tray, source) => ...);
source.connect('notification-added', (_src, notification) => ...);
source.connect('notification-removed', (_src, notification) => ...);

// Properties
notification.title   // string
notification.body    // string  (NOT .banner)
notification.gicon   // icon

// Dismiss
notification.destroy();
```

### Panel Button
```javascript
this._button = new PanelMenu.Button(0.0, this.metadata.name, true);
this._button.add_child(icon);
Main.panel.addToStatusArea(this.uuid, this._button, 0, 'right');
// Destroy with: this._button.destroy()
```

### disable() Pattern
```javascript
disable() {
    this._open = false;
    if (this._sidebar) {
        this._sidebar.remove_all_transitions();
        this._sidebar.translation_x = 0;  // reset position before destroy
    }
    // Stop timers
    if (this._clockId) { GLib.source_remove(this._clockId); this._clockId = null; }
    // Disconnect notifications
    // Teardown mixer: disconnect signal IDs, call this._mixer.close()
    // Destroy actors: button.destroy(), overlay.destroy(), sidebar.destroy()
    // Remove chrome: Main.layoutManager.removeChrome(widget)
}
```

**Do NOT call `_hide()` from `disable()`** — the animation callback fires after the actor is destroyed and produces NaN errors.

## Error Visibility Rule

**Never use silent try/catch.** All catch blocks must render a visible error label in the sidebar UI:

```javascript
try {
    content.add_child(this._buildCalendarSection());
} catch (e) {
    content.add_child(new St.Label({
        text: `[calendar] ${e?.message ?? e}`,
        x_expand: true,
        style: 'color: #ff4444; background: rgba(255,0,0,0.15); border-radius: 6px; padding: 8px; font-size: 9pt;',
    }));
    console.error('[Raven] calendar:', e);
}
```

## CSS Classes (stylesheet.css)

| Class | Usage |
|---|---|
| `.raven-sidebar` | main sidebar container |
| `.raven-tabbar` | tab row |
| `.raven-tab` | inactive tab button |
| `.raven-tab-active` | active tab button (applied via JS) |
| `.raven-calendar` | calendar grid container |
| `.raven-cal-nav` | prev/next month buttons |
| `.raven-cal-day` | individual day cell button |
| `.raven-cal-today` | today's date highlight |
| `.raven-clear-btn` | "Clear all" notifications button |
| `.raven-dismiss-btn` | per-notification dismiss button |

## Debugging

**console.log/error goes to a socket, NOT journald** — invisible unless you're reading the socket. Use visible in-UI labels for debugging (see Error Visibility Rule above), or write to file:

```javascript
Gio.File.new_for_path('/tmp/raven-debug.txt')
    .replace_contents(new TextEncoder().encode(`${e}\n${e.stack ?? ''}`),
        null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
```

**Looking Glass** (Alt+F2 → `lg`) — live JS REPL in running GNOME Shell. Best tool for inspecting live actors.

## Known Gotchas

| Symptom | Cause | Fix |
|---|---|---|
| Code change has no effect | Wayland module cache | Logout/login |
| Sections below clock invisible | Clock labels empty at build time → ScrollView allocates wrong height | Initialize label text at build time |
| `disable()` NaN errors | `_hide()` animation fires after destroy | Skip animation in disable(); reset directly |
| Slider click wrong position | Wrong destructuring from `get_coords()` | `const [evX] = event.get_coords()` |
| `logError()` not found | Removed in GNOME 45+ | Use `console.error()` |
| `vertical: true` warning | Deprecated GNOME 48 | Use `orientation: Clutter.Orientation.VERTICAL` |
| Calendar/Slider import crashes | `Calendar.Calendar` and `Slider.Slider` throw silently | Use self-built calendar + custom CSS gradient slider |
