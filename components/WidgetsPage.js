import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gvc from 'gi://Gvc';
import { Component } from './Component.js';
import { WIDGETS } from './widgets/index.js';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-widgets-content {
    padding: 16px;
    spacing: 12px;
}
.raven-error-label {
    color: #ff4444;
    background: rgba(255,0,0,0.15);
    border-radius: 6px;
    padding: 8px;
    font-size: 9pt;
}
`;

export class WidgetsPage extends Component {
    constructor() {
        super();
        this._mixer = this._createMixer();
        const deps = { mixer: this._mixer };

        this._widgets = [];
        this._errorActors = [];
        this._buildErrors = {};

        for (const WidgetClass of WIDGETS) {
            if (!WidgetClass.isAvailable(deps)) continue;
            const tag = WidgetClass.id;
            const widget = this._safeBuild(tag, () => new WidgetClass(deps));
            if (!widget) {
                this._errorActors.push(this._errorLabel(tag));
                continue;
            }
            if (!widget.actor) {
                this._buildErrors[tag] = new Error('widget.actor is null');
                this._errorActors.push(this._errorLabel(tag));
                continue;
            }
            this._widgets.push(widget);
        }

        this.actor = this._buildScroll();
    }

    onSidebarOpen() {
        for (const widget of this._widgets) {
            widget.onSidebarOpen();
        }
    }

    onSidebarClose() {
        for (const widget of this._widgets) {
            widget.onSidebarClose();
        }
    }

    destroy() {
        for (const widget of this._widgets) {
            widget.destroy();
        }
        this._teardownMixer();
        super.destroy();
    }

    // --- private ---

    _createMixer() {
        const mixer = new Gvc.MixerControl({ name: 'Raven Sidebar' });
        mixer.open();
        return mixer;
    }

    _teardownMixer() {
        if (!this._mixer) return;
        this._mixer.close();
        this._mixer = null;
    }

    _safeBuild(tag, fn) {
        try {
            return fn();
        } catch (e) {
            this._buildErrors[tag] = e;
            console.error(`[Raven] ${tag}:`, e);
            return null;
        }
    }

    _errorLabel(tag) {
        const e = this._buildErrors[tag];
        return new St.Label({
            text:        `[${tag}] ${e?.message ?? 'init failed'}`,
            x_expand:    true,
            style_class: 'raven-error-label',
        });
    }

    _buildScroll() {
        const scroll = new St.ScrollView({
            hscrollbar_policy:  St.PolicyType.NEVER,
            vscrollbar_policy:  St.PolicyType.AUTOMATIC,
            overlay_scrollbars: true,
            x_expand:           true,
            y_expand:           true,
        });

        const content = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-widgets-content',
        });

        for (const widget of this._widgets) {
            content.add_child(widget.actor);
        }
        for (const errorActor of this._errorActors) {
            content.add_child(errorActor);
        }

        scroll.add_child(content);
        return scroll;
    }
}