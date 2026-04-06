import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gvc from 'gi://Gvc';
import { Component } from './Component.js';
import { SliderBar } from './SliderBar.js';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-volume-section {
    background-color: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 10px;
}
.raven-volume-header {
    spacing: 10px;
}
.raven-volume-icon {
    color: rgba(255,255,255,0.7);
}
.raven-volume-label {
    font-size: 10pt;
    color: rgba(255,255,255,0.75);
}
.raven-volume-perc {
    font-size: 9pt;
    color: rgba(255,255,255,0.4);
}
`;

// Volume control section. Props: { mixer: Gvc.MixerControl }
// Connects to mixer signals itself and calls refresh() when state changes.
export class VolumeSection extends Component {
    constructor({ mixer }) {
        super();
        this._mixer  = mixer;
        this._slider = new SliderBar({ onChange: v => this._onSliderChange(v) });
        this.actor   = this._build();

        // Track external signals — will be disconnected by super.destroy()
        this._connect(mixer, 'state-changed',        () => this.refresh());
        this._connect(mixer, 'default-sink-changed', () => this.refresh());
        this.refresh();
    }

    refresh() {
        if (!this._mixer || this._mixer.get_state() !== Gvc.MixerControlState.READY) return;
        const sink = this._mixer.get_default_sink();
        if (!sink) return;
        const vol = Math.min(sink.volume / this._mixer.get_vol_max_norm(), 1.0);
        this._slider.setValue(vol);
        this._percLabel.text = `${Math.round(vol * 100)}%`;
        this._updateIcon(vol, sink.is_muted);
    }

    destroy() {
        this._slider.destroy();
        super.destroy();
    }

    // --- private ---

    _build() {
        const section = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-volume-section',
        });

        const header = new St.BoxLayout({ style_class: 'raven-volume-header' });

        this._volIcon = new St.Icon({
            icon_name:   'audio-volume-medium-symbolic',
            icon_size:   16,
            style_class: 'raven-volume-icon',
        });
        header.add_child(this._volIcon);
        header.add_child(new St.Label({
            text:        'Volume',
            x_expand:    true,
            style_class: 'raven-volume-label',
        }));
        this._percLabel = new St.Label({
            text:        '—',
            style_class: 'raven-volume-perc',
        });
        header.add_child(this._percLabel);

        section.add_child(header);
        section.add_child(this._slider.actor);
        return section;
    }

    _onSliderChange(val) {
        if (!this._mixer) return;
        const sink = this._mixer.get_default_sink();
        if (!sink) return;
        sink.volume = val * this._mixer.get_vol_max_norm();
        sink.push_volume();
        this._percLabel.text = `${Math.round(val * 100)}%`;
        this._updateIcon(val, false);
    }

    _updateIcon(vol, muted) {
        if (!this._volIcon) return;
        let name;
        if (muted || vol <= 0) name = 'audio-volume-muted-symbolic';
        else if (vol < 0.33)   name = 'audio-volume-low-symbolic';
        else if (vol < 0.66)   name = 'audio-volume-medium-symbolic';
        else                   name = 'audio-volume-high-symbolic';
        this._volIcon.icon_name = name;
    }
}
