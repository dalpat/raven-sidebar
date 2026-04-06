import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Component } from './Component.js';
import { SliderBar } from './SliderBar.js';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-brightness-section {
    background-color: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 10px;
}
.raven-brightness-header {
    spacing: 10px;
}
.raven-brightness-icon {
    color: rgba(255,255,255,0.7);
}
.raven-brightness-label {
    font-size: 10pt;
    color: rgba(255,255,255,0.75);
}
.raven-brightness-perc {
    font-size: 9pt;
    color: rgba(255,255,255,0.4);
}
`;

// Helper to write debug messages to a file
function _debugLog(message) {
    const filePath = GLib.build_filenamev([GLib.get_tmp_dir(), 'raven-brightness-debug.txt']);
    try {
        const file = Gio.File.new_for_path(filePath);
        let contents = '';
        if (file.query_exists(null)) {
            let [, data] = file.load_contents(null);
            contents = new TextDecoder().decode(data);
        }
        contents += `${new Date().toISOString()} - ${message}\n`;
        file.replace_contents(
            new TextEncoder().encode(contents),
            null, false,
            Gio.FileCreateFlags.REPLACE_DESTINATION,
            null,
        );
    } catch (e) {
        console.error(`[Raven Debug Log Error] ${e.message}`);
    }
}


// Brightness control section. Uses Main.brightnessManager (GNOME 49+).
export class BrightnessSection extends Component {
    constructor() {
        super();
        _debugLog('BrightnessSection: constructor called');
        this._slider = new SliderBar({ onChange: v => this._onSliderChange(v) });
        this.actor   = this._build();
        this._initBrightness();
    }

    refresh() {
        _debugLog('BrightnessSection: refresh called');
        if (!Main.brightnessManager) {
            _debugLog('BrightnessSection: Main.brightnessManager is NOT available in refresh.');
            this._percLabel.text = 'N/A';
            return;
        }

        const scale = Main.brightnessManager.globalScale;
        if (scale === undefined || scale === null) {
            _debugLog('BrightnessSection: Main.brightnessManager.globalScale is undefined or null.');
            this._percLabel.text = 'N/A';
            return;
        }

        const val = scale.value !== undefined ? scale.value : scale;
        _debugLog(`BrightnessSection: Current brightness value (0-1): ${val}`);
        this._slider.setValue(val);
        this._percLabel.text = `${Math.round(val * 100)}%`;
    }

    destroy() {
        _debugLog('BrightnessSection: destroy called');
        this._slider.destroy();
        super.destroy();
    }

    // --- private ---

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
        _debugLog('BrightnessSection: _initBrightness called');
        if (!Main.brightnessManager) {
            _debugLog('BrightnessSection: Main.brightnessManager is NOT available during init.');
            this._percLabel.text = 'N/A';
            return;
        }

        _debugLog('BrightnessSection: Main.brightnessManager is available.');
        const scale = Main.brightnessManager.globalScale;
        if (scale !== undefined && scale !== null) {
            _debugLog('BrightnessSection: Main.brightnessManager.globalScale is available.');
            // BrightnessScale is usually a GObject with a 'value' property in GNOME 49
            if (scale.connect) {
                _debugLog('BrightnessSection: Connecting to notify::value signal on globalScale.');
                this._connect(scale, 'notify::value', () => {
                    _debugLog('BrightnessSection: globalScale notify::value signal received.');
                    this.refresh();
                });
            } else {
                _debugLog('BrightnessSection: globalScale does not have a connect method (not a GObject).');
            }
            this.refresh();
        } else {
            _debugLog('BrightnessSection: Main.brightnessManager.globalScale is undefined or null during init.');
            this._percLabel.text = 'N/A';
        }
    }

    _onSliderChange(val) {
        _debugLog(`BrightnessSection: _onSliderChange called with value: ${val}`);
        if (!Main.brightnessManager) {
            _debugLog('BrightnessSection: Main.brightnessManager is NOT available during slider change.');
            return;
        }

        const scale = Main.brightnessManager.globalScale;
        if (scale === undefined || scale === null) {
            _debugLog('BrightnessSection: Main.brightnessManager.globalScale is undefined or null during slider change.');
            return;
        }

        _debugLog(`BrightnessSection: Attempting to set brightness to ${val}`);
        if (scale.value !== undefined) {
            scale.value = val;
            _debugLog(`BrightnessSection: Set scale.value to ${val}. New reported value: ${scale.value}`);
        } else {
            // Fallback for cases where globalScale itself is the numeric value
            Main.brightnessManager.globalScale = val;
            _debugLog(`BrightnessSection: Set Main.brightnessManager.globalScale directly to ${val}. New reported value: ${Main.brightnessManager.globalScale}`);
        }
        this._percLabel.text = `${Math.round(val * 100)}%`;
    }
}

