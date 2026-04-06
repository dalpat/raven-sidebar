import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gvc from 'gi://Gvc';
import { Component } from './Component.js';
import { SliderBar } from './SliderBar.js';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-mic-section {
    background-color: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 10px;
}
.raven-mic-header {
    spacing: 10px;
}
.raven-mic-icon {
    color: rgba(255,255,255,0.7);
}
.raven-mic-label {
    font-size: 10pt;
    color: rgba(255,255,255,0.75);
}
.raven-mic-perc {
    font-size: 9pt;
    color: rgba(255,255,255,0.4);
}
`;

// Microphone control section. Props: { mixer: Gvc.MixerControl }
export class MicSection extends Component {
    constructor({ mixer }) {
        super();
        this._mixer  = mixer;
        this._slider = new SliderBar({ onChange: v => this._onSliderChange(v) });
        this.actor   = this._build();

        this._connect(mixer, 'state-changed',          () => this.refresh());
        this._connect(mixer, 'default-source-changed', () => this.refresh());
        this.refresh();
    }

    refresh() {
        if (!this._mixer || this._mixer.get_state() !== Gvc.MixerControlState.READY) return;
        const src = this._mixer.get_default_source();
        if (!src) return;
        const vol = Math.min(src.volume / this._mixer.get_vol_max_norm(), 1.0);
        this._slider.setValue(vol);
        this._percLabel.text = `${Math.round(vol * 100)}%`;
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
            style_class: 'raven-mic-section',
        });

        const header = new St.BoxLayout({ style_class: 'raven-mic-header' });
        header.add_child(new St.Icon({
            icon_name:   'audio-input-microphone-symbolic',
            icon_size:   16,
            style_class: 'raven-mic-icon',
        }));
        header.add_child(new St.Label({
            text:        'Microphone',
            x_expand:    true,
            style_class: 'raven-mic-label',
        }));
        this._percLabel = new St.Label({
            text:        '—',
            style_class: 'raven-mic-perc',
        });
        header.add_child(this._percLabel);

        section.add_child(header);
        section.add_child(this._slider.actor);
        return section;
    }

    _onSliderChange(val) {
        if (!this._mixer) return;
        const src = this._mixer.get_default_source();
        if (!src) return;
        src.volume = val * this._mixer.get_vol_max_norm();
        src.push_volume();
        this._percLabel.text = `${Math.round(val * 100)}%`;
    }
}
