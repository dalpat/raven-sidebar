import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { BaseWidget } from '../BaseWidget.js';

export const CSS = `
.raven-health-section {
    background-color: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 6px;
}
.raven-health-top    { spacing: 8px; }
.raven-health-pct    { font-size: 17pt; font-weight: bold; color: #ffffff; }
.raven-health-cap    { font-size: 9pt; color: rgba(255,255,255,0.5); }
.raven-health-row    { spacing: 8px; }
.raven-health-key    { font-size: 9.5pt; color: rgba(255,255,255,0.72); }
.raven-health-val    { font-size: 9.5pt; color: rgba(255,255,255,0.55); }
`;

export class BatteryHealthWidget extends BaseWidget {
    static isAvailable(deps) { return !!deps?.power && deps.power.healthAvailable; }

    constructor(deps) {
        super(deps);
        this._power = deps.power;
        this.actor  = this._build();
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
            style_class: 'raven-health-section',
        });

        section.add_child(new St.Label({ text: 'BATTERY HEALTH', style_class: 'raven-section-label' }));

        const top = new St.BoxLayout({ style_class: 'raven-health-top' });
        this._pctLabel = new St.Label({ text: '—', style_class: 'raven-health-pct' });
        top.add_child(this._pctLabel);
        top.add_child(new St.Label({
            text:        'of design capacity',
            y_align:     Clutter.ActorAlign.CENTER,
            style_class: 'raven-health-cap',
        }));
        section.add_child(top);

        this._cyclesRow   = this._kvRow('Cycles');
        this._capacityRow = this._kvRow('Capacity');
        section.add_child(this._cyclesRow.row);
        section.add_child(this._capacityRow.row);

        return section;
    }

    _kvRow(key) {
        const row = new St.BoxLayout({ x_expand: true, style_class: 'raven-health-row' });
        row.add_child(new St.Label({ text: key, x_expand: true, style_class: 'raven-health-key' }));
        const val = new St.Label({ text: '—', style_class: 'raven-health-val' });
        row.add_child(val);
        return { row, val };
    }

    _refresh() {
        if (!this.actor) return;
        const pct = this._power.healthPercent;
        this._pctLabel.text = pct != null ? `${pct}%` : '—';

        const cycles = this._power.cycles;
        this._cyclesRow.val.text = cycles != null ? String(cycles) : 'unknown';
        this._cyclesRow.row.visible = cycles != null;

        const full = this._power.energyFull, design = this._power.energyFullDesign;
        this._capacityRow.val.text = design > 0
            ? `${full.toFixed(1)} / ${design.toFixed(1)} Wh`
            : '—';
    }
}
