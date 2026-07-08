import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { BaseWidget } from '../BaseWidget.js';

const PROFILE_ORDER  = ['power-saver', 'balanced', 'performance'];
const PROFILE_LABELS = { 'power-saver': 'Saver', 'balanced': 'Balanced', 'performance': 'Performance' };

export const CSS = `
.raven-power-section {
    background-color: st-transparentize(-st-accent-color, 0.93);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 8px;
}
.raven-power-header { spacing: 10px; }
.raven-power-label  { font-size: 10pt; }
.raven-power-pct    { font-size: 17pt; font-weight: bold; }
.raven-power-sub    { font-size: 8.5pt; }
.raven-power-seg    { spacing: 2px; padding: 3px; border-radius: 10px; background-color: st-transparentize(-st-accent-color, 0.9); }
.raven-power-seg-btn {
    font-size: 8pt; font-weight: 600; padding: 6px 0; border-radius: 8px;
    background-color: transparent; border: none;
}
.raven-power-seg-on {
    color: -st-accent-fg-color;
    background-color: -st-accent-color;
}
`;

export class PowerWidget extends BaseWidget {
    static get section() { return 'Power'; }

    static isAvailable(deps) {
        const p = deps?.power;
        return !!p && (p.hasBattery || p.profilesAvailable);
    }

    constructor(deps) {
        super(deps);
        this._power = deps.power;
        this._segBtns = new Map();
        this.actor = this._build();
        this._unsub = this._power.onChange(() => this._refresh());
        this._refresh();
    }

    onSidebarOpen() { this._refresh(); }

    destroy() {
        try { this._unsub?.(); } catch (_) {}
        super.destroy();
    }

    // --- private ---

    _build() {
        const section = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-power-section',
        });

        if (this._power.hasBattery) {
            const header = new St.BoxLayout({ style_class: 'raven-power-header' });
            this._icon = new St.Icon({ icon_name: 'battery-good-symbolic', icon_size: 18, style_class: 'raven-power-icon' });
            header.add_child(this._icon);
            header.add_child(new St.Label({ text: 'Battery', x_expand: true, style_class: 'raven-power-label' }));
            this._pctLabel = new St.Label({ text: '—', style_class: 'raven-power-pct' });
            header.add_child(this._pctLabel);
            section.add_child(header);

            this._subLabel = new St.Label({ text: '', style_class: 'raven-power-sub' });
            section.add_child(this._subLabel);
        }

        if (this._power.profilesAvailable) {
            const seg = new St.BoxLayout({ x_expand: true, style_class: 'raven-power-seg' });
            const available = new Set(this._power.profiles);
            for (const id of PROFILE_ORDER) {
                if (!available.has(id)) continue;
                const btn = new St.Button({
                    label:       PROFILE_LABELS[id] ?? id,
                    x_expand:    true,
                    style_class: 'raven-power-seg-btn',
                });
                btn.connect('clicked', () => { this._power.setProfile(id); this._refresh(); });
                this._segBtns.set(id, btn);
                seg.add_child(btn);
            }
            section.add_child(seg);
        }

        return section;
    }

    _refresh() {
        if (!this.actor) return;

        if (this._power.hasBattery && this._pctLabel) {
            this._pctLabel.text  = `${this._power.percentage}%`;
            this._icon.icon_name = this._power.iconName();
            const time = this._power.timeText;
            this._subLabel.text  = time ? `${time} · ${this._power.stateText}` : this._power.stateText;
        }

        if (this._segBtns.size) {
            const active = this._power.activeProfile;
            for (const [id, btn] of this._segBtns)
                btn.style_class = id === active
                    ? 'raven-power-seg-btn raven-power-seg-on'
                    : 'raven-power-seg-btn';
        }
    }
}
