import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gvc from 'gi://Gvc';
import { Component } from './Component.js';
import { WIDGETS } from './widgets/index.js';
import { CalendarWidget } from './CalendarWidget.js';
import { VolumeSection } from './VolumeSection.js';
import { MicSection } from './MicSection.js';
import { BrightnessSection } from './BrightnessSection.js';

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

// Assembles the Widgets tab: clock, calendar, volume, mic.
// Owns the Gvc.MixerControl lifetime.
// Call onSidebarOpen() / onSidebarClose() from Sidebar.
export class WidgetsPage extends Component {
    constructor() {
        super();
        this._mixer = this._createMixer();
        const deps = { mixer: this._mixer };

        // Build registered widgets through the plugin pipeline
        this._widgets = [];
        this._buildErrors ??= {};
        for (const WidgetClass of WIDGETS) {
            if (!WidgetClass.isAvailable(deps)) continue;
            const widget = this._safeBuild(WidgetClass.id, () => new WidgetClass(deps));
            if (widget) this._widgets.push(widget);
        }

        // Build non-migrated widgets (will be moved to registry in subsequent slices)
        this._calendar   = this._safeBuild('calendar',   () => new CalendarWidget());
        this._volume     = this._safeBuild('volume',     () => new VolumeSection({ mixer: this._mixer }));
        this._mic        = this._safeBuild('mic',        () => new MicSection({ mixer: this._mixer }));
        this._brightness = this._safeBuild('brightness', () => new BrightnessSection());

        this.actor = this._buildScroll();
    }

    onSidebarOpen() {
        for (const widget of this._widgets) {
            widget.onSidebarOpen();
        }
        if (this._mixer?.get_state() === Gvc.MixerControlState.READY) {
            this._volume?.refresh();
            this._mic?.refresh();
        }
        this._brightness?.refresh();
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
        this._calendar?.destroy();
        this._volume?.destroy();
        this._mic?.destroy();
        this._brightness?.destroy();
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

    // Wraps a component constructor so a single failing widget shows an error label
    // rather than crashing the whole page.
    _safeBuild(tag, fn) {
        try {
            return fn();
        } catch (e) {
            this._buildErrors ??= {};
            this._buildErrors[tag] = e;
            console.error(`[Raven] ${tag}:`, e);
            return null;
        }
    }

    _errorLabel(tag) {
        const e = this._buildErrors?.[tag];
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

        // Registered widgets (in registry order)
        for (const widget of this._widgets) {
            content.add_child(widget.actor);
        }

        // Non-migrated widgets (will be moved to registry in subsequent slices)
        for (const [tag, component] of [
            ['calendar',   this._calendar],
            ['volume',     this._volume],
            ['mic',        this._mic],
            ['brightness', this._brightness],
        ]) {
            content.add_child(component ? component.actor : this._errorLabel(tag));
        }

        scroll.add_child(content);
        return scroll;
    }
}