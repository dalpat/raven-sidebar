import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gvc from 'gi://Gvc';
import { Component } from './Component.js';
import { ClockWidget } from './ClockWidget.js';
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

        // Build sub-components, catching construction errors individually
        this._clock    = this._safeBuild('clock',    () => new ClockWidget());
        this._calendar = this._safeBuild('calendar', () => new CalendarWidget());
        this._volume     = this._safeBuild('volume',     () => new VolumeSection({ mixer: this._mixer }));
        this._mic        = this._safeBuild('mic',        () => new MicSection({ mixer: this._mixer }));
        this._brightness = this._safeBuild('brightness', () => new BrightnessSection());

        this.actor = this._buildScroll();
    }

    onSidebarOpen() {
        this._clock?.start();
        if (this._mixer?.get_state() === Gvc.MixerControlState.READY) {
            this._volume?.refresh();
            this._mic?.refresh();
        }
        this._brightness?.refresh();
    }

    onSidebarClose() {
        this._clock?.stop();
    }

    destroy() {
        this._clock?.destroy();
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

        for (const [tag, component] of [
            ['clock',    this._clock],
            ['calendar', this._calendar],
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
