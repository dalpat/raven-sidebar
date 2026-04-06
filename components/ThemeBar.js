import St from 'gi://St';
import { Component } from './Component.js';
import { THEME } from './ThemeManager.js';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-themebar {
    padding: 4px 12px 6px;
    spacing: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.raven-theme-btn {
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 8pt;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.35);
    background-color: transparent;
    border: none;
    transition-duration: 120ms;
}
.raven-theme-btn:hover {
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.06);
}
.raven-theme-btn-active {
    color: rgba(255, 255, 255, 0.85);
    background-color: rgba(255, 255, 255, 0.1);
}
`;

// Thin row showing Light / Dark / Auto theme buttons.
// Props: { themeManager: ThemeManager }
export class ThemeBar extends Component {
    constructor({ themeManager }) {
        super();
        this._themeManager = themeManager;
        this.actor         = this._build();
        this._refresh();
    }

    // --- private ---

    _build() {
        const bar = new St.BoxLayout({ style_class: 'raven-themebar' });

        // Left spacer pushes buttons to the right
        bar.add_child(new St.Widget({ x_expand: true }));

        this._btnLight = new St.Button({ label: 'Light', style_class: 'raven-theme-btn' });
        this._btnDark  = new St.Button({ label: 'Dark',  style_class: 'raven-theme-btn' });
        this._btnAuto  = new St.Button({ label: 'Auto',  style_class: 'raven-theme-btn' });

        this._btnLight.connect('clicked', () => { this._themeManager.setTheme(THEME.LIGHT);  this._refresh(); });
        this._btnDark.connect( 'clicked', () => { this._themeManager.setTheme(THEME.DARK);   this._refresh(); });
        this._btnAuto.connect( 'clicked', () => { this._themeManager.setTheme(THEME.SYSTEM); this._refresh(); });

        bar.add_child(this._btnLight);
        bar.add_child(this._btnDark);
        bar.add_child(this._btnAuto);
        return bar;
    }

    _refresh() {
        const current = this._themeManager.getTheme();
        const active   = 'raven-theme-btn raven-theme-btn-active';
        const inactive = 'raven-theme-btn';
        this._btnLight.style_class = current === THEME.LIGHT  ? active : inactive;
        this._btnDark.style_class  = current === THEME.DARK   ? active : inactive;
        this._btnAuto.style_class  = current === THEME.SYSTEM ? active : inactive;
    }
}
