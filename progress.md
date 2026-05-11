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