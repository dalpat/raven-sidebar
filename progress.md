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