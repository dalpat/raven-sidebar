# Raven Sidebar - Development Progress

## Project Overview

Build a GNOME Shell extension that brings macOS/Budgie-style unified sidebar to GNOME:
- Date/time header with live clock
- Calendar widget (GNOME built-in)
- Notifications list (via Main.messageTray signals)
- Quick Settings (visual only - deferred)

## Target

GNOME Shell extensions that bring macOS quality-of-life features to Linux.

---

## Phase 1: Discovery & Research ✅

**Completed:**
- Explored GNOME Shell internals (Main, St, Shell, Clutter)
- Investigated Calendar.Calendar widget sizing issues
- Researched MessageList.MessageView allocation issues
- Found that extension code changes on Wayland require session restart

**Key Discoveries:**
1. `raise_top()` doesn't exist in GNOME 49 — use `Main.layoutManager.uiGroup.set_child_above_sibling()` instead
2. `global.stage` doesn't receive clicks from app windows — need transparent full-screen overlay
3. Calendar widget conflicts with custom CSS — let it size naturally
4. MessageList.MessageView has allocation issues when embedded — use Main.messageTray signals instead

---

## Phase 2: Basic Implementation ✅

**Completed:**
- Created extension metadata (`metadata.json`)
- Implemented panel button (bell icon)
- Basic toggle with slide animation
- Transparent overlay for outside-click-to-close

**Files:**
- `extension.js` - Main extension code
- `stylesheet.css` - Minimal styling
- `metadata.json` - Extension metadata

---

## Phase 3: Calendar Widget ✅

**Completed:**
- Added GNOME built-in Calendar.Calendar
- Removed conflicting CSS to let widget size naturally
- Fixed today highlighting

**Status:** Working in v2

---

## Phase 4: Notifications List ✅

**Completed:**
- Custom notification list via Main.messageTray signals
- Shows: icon, title, body, dismiss button
- Listens to `notification-added` and `notification-removed` signals

**Status:** Working in v2

---

## Phase 5: UI Polish ✅

**Completed:**
- 24px padding throughout
- Premium section headers
- Toggle/slider tiles layout
- Premium and finished feel

**Status:** Working in v2

---

## Phase 6: Testing (Current)

**Fixed Brightness Control (GNOME 49+):**
- Brightness was failing because it relied on `gsd-power` D-Bus interface which is missing or deprecated in GNOME 49.
- Updated `BrightnessSection.js` to use `Main.brightnessManager` (Mutter-based) with a D-Bus fallback.
- Added support for both `globalScale.value` (object) and `globalScale` (number) APIs found in various GNOME Shell versions.

**Awaiting user feedback after logout/login:**
1. Brightness slider now works and updates the screen brightness.
2. Calendar shows proper month grid with correct today highlighting.
3. Notifications appear when using `notify-send`.
4. Layout feels premium and finished.

---

## Phase 7: Quick Settings (Deferred)

**Status:** Not yet implemented

**Notes:**
- Visual only (deferred)
- Would connect to Gio.Settings for working toggles
- Can be added later when needed

---

## Phase 8: Publishing (Future)

**Status:** Pending testing completion

**Steps:**
1. Fix any issues found in testing
2. Add working Quick Settings if time permits
3. Polish UI further if needed
4. Publish to extensions.gnome.org

---

## File Structure

```
~/.local/share/gnome-shell/extensions/
└── raven-sidebar@dalpat.github.io/
    ├── extension.js      # Main extension code (~400 lines)
    ├── stylesheet.css    # Minimal CSS
    └── metadata.json     # Extension metadata

~/raven-sidebar/          # Git repo
├── extension.js
├── stylesheet.css
├── metadata.json
└── progress.md           # This file
```

---

## Current State (v2)

Just pushed v2 with:
- ✅ Calendar: Let widget size naturally, removed conflicting CSS
- ✅ Notifications: Custom list via Main.messageTray signals
- ✅ Layout: 24px padding, premium section headers, toggle/slider tiles

**Awaiting user test after logout/login**
