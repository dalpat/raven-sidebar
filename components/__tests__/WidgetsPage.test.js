// @ts-nocheck
import { vi, describe, test, expect, beforeEach } from 'vitest';

// ── Mock GNOME imports ──────────────────────────────────────────────────────
const { mockSt, mockClutter, MockMixerControl } = vi.hoisted(() => {
    function MockMixerControl() {
        this.open = vi.fn();
        this.close = vi.fn();
    }
    function MockLabel(opts) {
        Object.assign(this, opts);
        this.destroy = vi.fn();
        this._isError = true;
    }
    function MockScrollView(opts) {
        Object.assign(this, opts);
        this._children = [];
        this.add_child = function(child) { this._children.push(child); };
        this.destroy = vi.fn();
    }
    function MockBoxLayout(opts) {
        Object.assign(this, opts);
        this._children = [];
        this.add_child = function(child) { this._children.push(child); };
        this.destroy = vi.fn();
    }
    return {
        mockSt: {
            Label: MockLabel,
            ScrollView: MockScrollView,
            BoxLayout: MockBoxLayout,
            PolicyType: { NEVER: 0, AUTOMATIC: 1 },
        },
        mockClutter: {
            Orientation: { VERTICAL: 1 },
        },
        MockMixerControl,
    };
});

vi.mock('gi://St', () => ({ default: mockSt }));
vi.mock('gi://Clutter', () => ({ default: mockClutter }));
vi.mock('gi://Gvc', () => ({
    default: { MixerControl: MockMixerControl },
}));

// ── Mock widget registry ────────────────────────────────────────────────────
let WIDGETS = [];

vi.mock('../widgets/index.js', () => ({
    get WIDGETS() { return WIDGETS; },
    WIDGET_CSS: '',
}));

// ── Import after mocks ──────────────────────────────────────────────────────
const { WidgetsPage } = await import('../WidgetsPage.js');
const { BaseWidget } = await import('../BaseWidget.js');

// ── Helpers ─────────────────────────────────────────────────────────────────
function makeMockActor() {
    return { destroy: vi.fn() };
}

function makeWidgetClass({ id, isAvailable = true, actor = makeMockActor(), throwInConstructor = false } = {}) {
    const onSidebarOpen = vi.fn();
    const onSidebarClose = vi.fn();
    const destroy = vi.fn();

    class MockWidget extends BaseWidget {
        static get _mockOnSidebarOpen() { return onSidebarOpen; }
        static get _mockOnSidebarClose() { return onSidebarClose; }
        static get _mockDestroy() { return destroy; }

        constructor(deps) {
            if (throwInConstructor) throw new Error(throwInConstructor);
            super(deps);
            this.actor = typeof actor === 'function' ? actor() : actor;
        }

        onSidebarOpen() { onSidebarOpen(); }
        onSidebarClose() { onSidebarClose(); }
        destroy() { destroy(); super.destroy(); }
    }

    if (id !== undefined) {
        Object.defineProperty(MockWidget, 'id', { value: id });
    }

    if (isAvailable !== true) {
        MockWidget.isAvailable = (deps) => isAvailable(deps);
    }

    return { Klass: MockWidget, onSidebarOpen, onSidebarClose, destroy };
}

function extractActorsFromScroll(scroll) {
    return scroll._children.filter(c => !c._isError);
}

beforeEach(() => {
    WIDGETS = [];
});

describe('WidgetsPage', () => {
    describe('isAvailable filtering', () => {
        test('instantiates only widgets where isAvailable returns true', () => {
            const available = makeWidgetClass({ id: 'available', isAvailable: () => true });
            const unavailable = makeWidgetClass({ id: 'unavailable', isAvailable: () => false });

            WIDGETS.push(available.Klass, unavailable.Klass);
            const page = new WidgetsPage();

            expect(page._widgets).toHaveLength(1);
            expect(page._widgets[0]).toBeInstanceOf(available.Klass);
        });

        test('skips all widgets if none are available', () => {
            const a = makeWidgetClass({ id: 'a', isAvailable: () => false });
            const b = makeWidgetClass({ id: 'b', isAvailable: () => false });

            WIDGETS.push(a.Klass, b.Klass);
            const page = new WidgetsPage();

            expect(page._widgets).toHaveLength(0);
        });
    });

    describe('lifecycle dispatch', () => {
        test('calls onSidebarOpen on all widgets when sidebar opens', () => {
            const w1 = makeWidgetClass({ id: 'w1' });
            const w2 = makeWidgetClass({ id: 'w2' });

            WIDGETS.push(w1.Klass, w2.Klass);
            const page = new WidgetsPage();
            page.onSidebarOpen();

            expect(w1.onSidebarOpen).toHaveBeenCalledTimes(1);
            expect(w2.onSidebarOpen).toHaveBeenCalledTimes(1);
        });

        test('calls onSidebarClose on all widgets when sidebar closes', () => {
            const w1 = makeWidgetClass({ id: 'w1' });
            const w2 = makeWidgetClass({ id: 'w2' });

            WIDGETS.push(w1.Klass, w2.Klass);
            const page = new WidgetsPage();
            page.onSidebarClose();

            expect(w1.onSidebarClose).toHaveBeenCalledTimes(1);
            expect(w2.onSidebarClose).toHaveBeenCalledTimes(1);
        });

        test('does not call lifecycle hooks on unavailable widgets', () => {
            const skip = makeWidgetClass({ id: 'skip', isAvailable: () => false });

            WIDGETS.push(skip.Klass);
            const page = new WidgetsPage();
            page.onSidebarOpen();
            page.onSidebarClose();

            expect(skip.onSidebarOpen).not.toHaveBeenCalled();
            expect(skip.onSidebarClose).not.toHaveBeenCalled();
        });
    });

    describe('destroy', () => {
        test('calls destroy on all widgets during teardown', () => {
            const w1 = makeWidgetClass({ id: 'w1' });
            const w2 = makeWidgetClass({ id: 'w2' });

            WIDGETS.push(w1.Klass, w2.Klass);
            const page = new WidgetsPage();
            page.destroy();

            expect(w1.destroy).toHaveBeenCalledTimes(1);
            expect(w2.destroy).toHaveBeenCalledTimes(1);
        });

        test('does not call destroy on unavailable widgets', () => {
            const skip = makeWidgetClass({ id: 'skip', isAvailable: () => false });

            WIDGETS.push(skip.Klass);
            const page = new WidgetsPage();
            page.destroy();

            expect(skip.destroy).not.toHaveBeenCalled();
        });
    });

    describe('construction error boundary', () => {
        test('renders an error label when a widget throws during construction', () => {
            const good = makeWidgetClass({ id: 'good' });
            const bad = makeWidgetClass({ id: 'bad', throwInConstructor: 'construction failed' });

            WIDGETS.push(good.Klass, bad.Klass);
            const page = new WidgetsPage();

            expect(page._widgets).toHaveLength(1);
            expect(page._widgets[0]).toBeInstanceOf(good.Klass);
            expect(page._buildErrors['bad']).toBeInstanceOf(Error);
            expect(page._buildErrors['bad'].message).toBe('construction failed');
        });

        test('error label contains widget id and error message', () => {
            const bad = makeWidgetClass({ id: 'failing', throwInConstructor: 'boom' });

            WIDGETS.push(bad.Klass);
            const page = new WidgetsPage();

            expect(page._errorActors).toHaveLength(1);
            expect(page._errorActors[0].text).toBe('[failing] boom');
        });

        test('sidebar continues working after a widget fails to construct', () => {
            const bad = makeWidgetClass({ id: 'bad', throwInConstructor: 'oops' });
            const good = makeWidgetClass({ id: 'good' });

            WIDGETS.push(bad.Klass, good.Klass);
            const page = new WidgetsPage();

            page.onSidebarOpen();
            page.onSidebarClose();

            expect(page._widgets).toHaveLength(1);
        });
    });

    describe('null-actor validation', () => {
        test('renders an error label when a widget has a null actor', () => {
            const good = makeWidgetClass({ id: 'good' });
            const nullActor = makeWidgetClass({ id: 'nullish', actor: null });

            WIDGETS.push(good.Klass, nullActor.Klass);
            const page = new WidgetsPage();

            expect(page._widgets).toHaveLength(1);
            expect(page._errorActors).toHaveLength(1);
            expect(page._buildErrors['nullish'].message).toContain('null');
        });

        test('null-actor widget is not included in lifecycle dispatch', () => {
            const nullActor = makeWidgetClass({ id: 'nullish', actor: null });

            WIDGETS.push(nullActor.Klass);
            const page = new WidgetsPage();

            page.onSidebarOpen();
            page.onSidebarClose();

            expect(nullActor.onSidebarOpen).not.toHaveBeenCalled();
            expect(nullActor.onSidebarClose).not.toHaveBeenCalled();
        });
    });

    describe('registry order preservation', () => {
        test('widgets appear in the layout in the same order as the WIDGETS array', () => {
            const w1 = makeWidgetClass({ id: 'alpha' });
            const w2 = makeWidgetClass({ id: 'beta' });
            const w3 = makeWidgetClass({ id: 'gamma' });

            WIDGETS.push(w1.Klass, w2.Klass, w3.Klass);
            const page = new WidgetsPage();

            expect(page._widgets[0]).toBeInstanceOf(w1.Klass);
            expect(page._widgets[1]).toBeInstanceOf(w2.Klass);
            expect(page._widgets[2]).toBeInstanceOf(w3.Klass);
        });
    });

    describe('mixed availability', () => {
        test('some available, some not, some failing', () => {
            const good1 = makeWidgetClass({ id: 'good1' });
            const unavailable = makeWidgetClass({ id: 'unavail', isAvailable: () => false });
            const bad = makeWidgetClass({ id: 'bad', throwInConstructor: 'oops' });
            const good2 = makeWidgetClass({ id: 'good2' });
            const nullActor = makeWidgetClass({ id: 'nullActor', actor: null });

            WIDGETS.push(good1.Klass, unavailable.Klass, bad.Klass, good2.Klass, nullActor.Klass);
            const page = new WidgetsPage();

            expect(page._widgets).toHaveLength(2);
            expect(page._widgets[0]).toBeInstanceOf(good1.Klass);
            expect(page._widgets[1]).toBeInstanceOf(good2.Klass);
            expect(page._errorActors).toHaveLength(2);
            expect(page._buildErrors['bad']).toBeInstanceOf(Error);
            expect(page._buildErrors['nullActor']).toBeInstanceOf(Error);
        });
    });
});