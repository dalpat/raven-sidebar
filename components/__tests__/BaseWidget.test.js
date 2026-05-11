// @ts-nocheck
import { vi, describe, test, expect } from 'vitest';
import { BaseWidget } from '../BaseWidget.js';

class WidgetWithDefaultId extends BaseWidget {
    constructor(deps) { super(deps); }
}

class ClockWidget extends BaseWidget {
    constructor(deps) { super(deps); }
}

class VolumeSection extends BaseWidget {
    constructor(deps) { super(deps); }
}

class MyCustomWidget extends BaseWidget {
    static id = 'custom';
    constructor(deps) { super(deps); }
}

class PlainName extends BaseWidget {
    constructor(deps) { super(deps); }
}

class UnavailableWidget extends BaseWidget {
    static isAvailable(deps) { return !!deps?.special; }
    constructor(deps) { super(deps); }
}

function createMockActor() {
    return { destroy: vi.fn() };
}

describe('BaseWidget', () => {
    describe('ID derivation', () => {
        test('derives id from class name ending with "Widget"', () => {
            // ClockWidget → clock
            expect(ClockWidget.id).toBe('clock');
        });

        test('derives id from class name ending with "Section"', () => {
            // VolumeSection → volume
            expect(VolumeSection.id).toBe('volume');
        });

        test('lowercases only the first character after stripping suffix', () => {
            // MyCustomWidget → myCustom (before override)
            // But MyCustomWidget has static id = 'custom', so test on WidgetWithDefaultId
            // Let's use a class name like "MyWidget" → "my"
            class MyWidget extends BaseWidget {}
            expect(MyWidget.id).toBe('my');
        });

        test('static id override takes precedence over auto-derivation', () => {
            expect(MyCustomWidget.id).toBe('custom');
        });

        test('leaves class name unchanged if no suffix', () => {
            // PlainName has no "Widget"/"Section" suffix
            // Auto-derive: lowercase first char → "plainName"
            expect(PlainName.id).toBe('plainName');
        });

        test('BaseWidget itself has null id', () => {
            expect(BaseWidget.id).toBe(null);
        });
    });

    describe('isAvailable', () => {
        test('returns true by default', () => {
            expect(BaseWidget.isAvailable()).toBe(true);
            expect(WidgetWithDefaultId.isAvailable()).toBe(true);
        });

        test('subclasses can override to return false', () => {
            expect(UnavailableWidget.isAvailable({})).toBe(false);
            expect(UnavailableWidget.isAvailable({ special: true })).toBe(true);
        });
    });

    describe('lifecycle hooks', () => {
        test('onSidebarOpen is a no-op and does not throw', () => {
            const widget = new WidgetWithDefaultId({});
            expect(() => widget.onSidebarOpen()).not.toThrow();
        });

        test('onSidebarClose is a no-op and does not throw', () => {
            const widget = new WidgetWithDefaultId({});
            expect(() => widget.onSidebarClose()).not.toThrow();
        });
    });

    describe('destroy', () => {
        test('calls super.destroy and cleans up signals', () => {
            const mockObj = { connect: vi.fn(() => 1), disconnect: vi.fn() };
            const widget = new WidgetWithDefaultId({});
            widget.actor = createMockActor();

            widget._connect(mockObj, 'signal', () => {});
            widget.destroy();

            expect(mockObj.disconnect).toHaveBeenCalledWith(1);
            expect(widget.actor).toBeNull();
        });

        test('destroy handles null actor gracefully', () => {
            const widget = new WidgetWithDefaultId({});
            widget.actor = null;
            expect(() => widget.destroy()).not.toThrow();
        });
    });
});