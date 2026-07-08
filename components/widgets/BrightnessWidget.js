import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { BaseWidget } from '../BaseWidget.js';
import { SliderBar } from '../SliderBar.js';

export const CSS = `
.raven-brightness-section {
    background-color: st-transparentize(-st-accent-color, 0.93);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 10px;
}
.raven-brightness-header {
    spacing: 10px;
}
.raven-brightness-label {
    font-size: 10pt;
}
.raven-brightness-perc {
    font-size: 9pt;
}
`;

export class BrightnessWidget extends BaseWidget {
    static isAvailable(deps) {
        return !!Main.brightnessManager;
    }

    constructor(deps) {
        super(deps);
        this._slider = new SliderBar({ onChange: v => this._onSliderChange(v) });
        this.actor   = this._build();
        this._initBrightness();
    }

    onSidebarOpen() {
        this.refresh();
    }

    refresh() {
        if (!Main.brightnessManager) {
            this._percLabel.text = 'N/A';
            return;
        }

        const scale = Main.brightnessManager.globalScale;
        if (scale === undefined || scale === null) {
            this._percLabel.text = 'N/A';
            return;
        }

        const val = scale.value !== undefined ? scale.value : scale;
        this._slider.setValue(val);
        this._percLabel.text = `${Math.round(val * 100)}%`;
    }

    destroy() {
        this._slider.destroy();
        super.destroy();
    }

    _build() {
        const section = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-brightness-section',
        });

        const header = new St.BoxLayout({ style_class: 'raven-brightness-header' });
        header.add_child(new St.Icon({
            icon_name:   'display-brightness-symbolic',
            icon_size:   16,
            style_class: 'raven-brightness-icon',
        }));
        header.add_child(new St.Label({
            text:        'Brightness',
            x_expand:    true,
            style_class: 'raven-brightness-label',
        }));
        this._percLabel = new St.Label({
            text:        '—',
            style_class: 'raven-brightness-perc',
        });
        header.add_child(this._percLabel);

        section.add_child(header);
        section.add_child(this._slider.actor);
        return section;
    }

    _initBrightness() {
        if (!Main.brightnessManager) {
            this._percLabel.text = 'N/A';
            return;
        }

        const scale = Main.brightnessManager.globalScale;
        if (scale !== undefined && scale !== null) {
            if (scale.connect) {
                this._connect(scale, 'notify::value', () => {
                    this.refresh();
                });
            }
            this.refresh();
        } else {
            this._percLabel.text = 'N/A';
        }
    }

    _onSliderChange(val) {
        if (!Main.brightnessManager) {
            return;
        }

        const scale = Main.brightnessManager.globalScale;
        if (scale === undefined || scale === null) {
            return;
        }

        if (scale.value !== undefined) {
            scale.value = val;
        } else {
            Main.brightnessManager.globalScale = val;
        }
        this._percLabel.text = `${Math.round(val * 100)}%`;
    }
}