import St from 'gi://St';
import { Component } from './Component.js';

export const TAB = Object.freeze({
    WIDGETS:       'widgets',
    NOTIFICATIONS: 'notifications',
});

// ─── Styles ───────────────────────────────────────────────────────────────────
// No hardcoded colours: text inherits the themed foreground, dividers/hover/active
// derive from the system accent. Follows the system light/dark theme + accent.
export const CSS = `
.raven-tabbar {
    padding: 10px 12px 8px;
    spacing: 4px;
    border-bottom: 1px solid st-transparentize(-st-accent-color, 0.88);
}

.raven-tab {
    padding: 7px 0;
    border-radius: 8px;
    font-size: 10pt;
    font-weight: 500;
    background-color: transparent;
    border: none;
    transition-duration: 120ms;
}

.raven-tab:hover {
    background-color: st-transparentize(-st-accent-color, 0.9);
}

.raven-tab-active {
    color: -st-accent-color;
    background-color: st-transparentize(-st-accent-color, 0.86);
}
`;

// Tab bar component. Props: { onSwitch(tab: TAB) }
// Manages active-tab styling internally.
export class TabBar extends Component {
    constructor({ onSwitch }) {
        super();
        this._onSwitch   = onSwitch;
        this._activeTab  = TAB.WIDGETS;
        this.actor       = this._build();
    }

    // --- private ---

    _build() {
        const bar = new St.BoxLayout({ style_class: 'raven-tabbar' });

        this._btnWidgets = new St.Button({
            label:       'Widgets',
            x_expand:    true,
            style_class: 'raven-tab raven-tab-active',
        });
        this._btnNotifs = new St.Button({
            label:       'Notifications',
            x_expand:    true,
            style_class: 'raven-tab',
        });

        this._btnWidgets.connect('clicked', () => this._switch(TAB.WIDGETS));
        this._btnNotifs.connect('clicked',  () => this._switch(TAB.NOTIFICATIONS));

        bar.add_child(this._btnWidgets);
        bar.add_child(this._btnNotifs);
        return bar;
    }

    _switch(tab) {
        if (this._activeTab === tab) return;
        this._activeTab = tab;

        this._btnWidgets.style_class = tab === TAB.WIDGETS
            ? 'raven-tab raven-tab-active' : 'raven-tab';
        this._btnNotifs.style_class = tab === TAB.NOTIFICATIONS
            ? 'raven-tab raven-tab-active' : 'raven-tab';

        this._onSwitch(tab);
    }
}
