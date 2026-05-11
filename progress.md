# Progress

## Issue #8: BaseWidget contract + unit tests

- [x] `BaseWidget.js` exists in `components/` and extends `Component`.
- [x] `BaseWidget.test.js` exists and all tests pass (`npm test`).
- [x] ID derivation handles edge cases (names without "Widget"/"Section" suffix).
- [x] No UI changes; this is a pure foundation slice.

### Implemented

- `components/BaseWidget.js`: New class extending `Component` with:
  - `static get id`: Auto-derives ID from class name (strips "Widget"/"Section" suffix, lowercases first char). Returns `null` on `BaseWidget` itself. Overridable via `static id = 'custom'` on subclasses.
  - `static isAvailable(deps)`: Returns `true` by default; subclasses override to opt-out.
  - `constructor(deps)`: Calls `super()`.
  - `onSidebarOpen()` / `onSidebarClose()`: No-op defaults.
  - `destroy()`: Inherited from `Component`.

- `components/__tests__/BaseWidget.test.js`: 10 tests covering:
  - Auto-derived IDs: `ClockWidget` → `clock`, `VolumeSection` → `volume`, `MyWidget` → `my`
  - `static id` override precedence
  - `BaseWidget.id` returns `null`
  - Plain names without suffix: `PlainName` → `plainName`
  - `isAvailable()` default returns `true`; subclass override
  - `onSidebarOpen()` / `onSidebarClose()` are no-ops
  - `destroy()` cleans up signals and null actor handling

## Issue #9: Registry + StyleManager + WidgetsPage refactor (single-widget PoC)

- [x] `ClockWidget` exists in `components/widgets/` and extends `BaseWidget`.
- [x] `widgets/index.js` exports `WIDGETS` and `WIDGET_CSS`.
- [x] `StyleManager` imports `WIDGET_CSS` from the registry; no per-widget CSS import remains for widgets in the registry.
- [x] `WidgetsPage` imports `WIDGETS` from the registry, filters by `isAvailable`, constructs with `deps`, and calls `onSidebarOpen` / `onSidebarClose`.
- [x] The sidebar still shows the Clock widget correctly; behavior is unchanged.
- [x] `npm test` and `npm run typecheck` pass.

### Implemented

- `components/widgets/ClockWidget.js`: ClockWidget moved from `components/ClockWidget.js` to `components/widgets/ClockWidget.js`. Now extends `BaseWidget` instead of `Component`. Lifecycle methods renamed: `start()`/`stop()` → `onSidebarOpen()`/`onSidebarClose()`. Accepts `deps` argument in constructor (passed to `super(deps)`).

- `components/widgets/index.js`: Widget registry. Exports `WIDGETS` (ordered array of widget classes, currently just `[ClockWidget]`) and `WIDGET_CSS` (concatenated CSS from all registered widgets).

- `components/StyleManager.js`: Replaced `import { CSS as ClockWidgetCSS } from './ClockWidget.js'` with `import { WIDGET_CSS } from './widgets/index.js'`. Uses `WIDGET_CSS` in `COMPONENT_STYLES` array. Other (non-registered) widget CSS imports remain.

- `components/WidgetsPage.js`: Imports `WIDGETS` from `./widgets/index.js`. Constructs registered widgets in a loop: filters by `isAvailable(deps)`, wraps each in `_safeBuild`, stores in `this._widgets`. Lifecycle dispatch (`onSidebarOpen`/`onSidebarClose`/`destroy`) iterates `this._widgets`. Non-migrated widgets (Calendar, Volume, Mic, Brightness) still constructed individually. Layout order: registered widgets first, then non-migrated widgets.

- Removed `components/ClockWidget.js` (moved to `components/widgets/ClockWidget.js`).

## Issue #10: Migrate remaining widgets + error boundaries

- [x] All five widgets live in `components/widgets/` and extend `BaseWidget`.
- [x] `widgets/index.js` exports `WIDGETS` in correct display order.
- [x] `BrightnessWidget` is skipped when `Main.brightnessManager` is unavailable.
- [x] A widget that throws during construction shows an error label instead of crashing the sidebar.
- [x] A widget with a null `actor` shows an error label.
- [x] Existing widget behavior (clock timer, volume slider, etc.) is unchanged.
- [x] `npm test` and `npm run typecheck` pass.

### Implemented

- `components/widgets/CalendarWidget.js`: Moved from `components/CalendarWidget.js`. Now extends `BaseWidget` instead of `Component`. Accepts `deps` in constructor (passed to `super(deps)`). No lifecycle overrides needed (calendar is static; `onSidebarOpen`/`onSidebarClose` inherited as no-ops).

- `components/widgets/VolumeWidget.js`: Moved from `components/VolumeSection.js`. Class renamed `VolumeSection` → `VolumeWidget`. Extends `BaseWidget`. `onSidebarOpen()` calls `this.refresh()`. Constructor takes `deps.mixer`. CSS class names unchanged (`.raven-volume-section` etc.).

- `components/widgets/MicWidget.js`: Moved from `components/MicSection.js`. Class renamed `MicSection` → `MicWidget`. Extends `BaseWidget`. `onSidebarOpen()` calls `this.refresh()`. Constructor takes `deps.mixer`. CSS class names unchanged (`.raven-mic-section` etc.).

- `components/widgets/BrightnessWidget.js`: Moved from `components/BrightnessSection.js`. Class renamed `BrightnessSection` → `BrightnessWidget`. Extends `BaseWidget`. `static isAvailable()` checks `Main.brightnessManager`. `onSidebarOpen()` calls `this.refresh()`. CSS class names unchanged (`.raven-brightness-section` etc.).

- `components/widgets/index.js`: Updated to export all five widgets in display order: `[ClockWidget, CalendarWidget, VolumeWidget, MicWidget, BrightnessWidget]`. `WIDGET_CSS` concatenates CSS from all five.

- `components/StyleManager.js`: Removed individual CSS imports for `CalendarWidget`, `VolumeSection`, `MicSection`, `BrightnessSection`. All widget CSS now comes from `WIDGET_CSS` via the registry.

- `components/WidgetsPage.js`: Removed individual imports and construction of Calendar, Volume, Mic, Brightness. All widgets now constructed via `WIDGETS` registry loop. Added null-actor validation: widgets with `actor === null` after construction get an error label. Error actors collected in `_errorActors` and appended to layout after valid widgets.

- Removed `components/CalendarWidget.js`, `components/VolumeSection.js`, `components/MicSection.js`, `components/BrightnessSection.js`.