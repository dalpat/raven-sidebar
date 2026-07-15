import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import { BaseWidget } from '../BaseWidget.js';

export const CSS = `
.raven-clock-box {
    padding: 20px 24px 8px;
    spacing: 2px;
}
.raven-clock-day {
    font-size: 11pt;
    letter-spacing: 1px;
}
.raven-clock-date {
    font-size: 18pt;
    font-weight: bold;
}
.raven-clock-time {
    font-size: 46pt;
    font-weight: bold;
}
`;

export class ClockWidget extends BaseWidget {
    constructor(deps) {
        super(deps);
        this._timerId = null;
        this.actor = this._build();
    }

    onSidebarOpen() {
        this._tick();
        if (!this._timerId) {
            this._timerId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
                this._tick();
                return GLib.SOURCE_CONTINUE;
            });
        }
    }

    onSidebarClose() {
        if (this._timerId) {
            GLib.source_remove(this._timerId);
            this._timerId = null;
        }
    }

    destroy() {
        this.onSidebarClose();
        super.destroy();
    }

    _build() {
        const box = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-clock-box',
        });

        const now = GLib.DateTime.new_now_local();
        const h   = now ? now.get_hour() : 0;
        const m   = now ? String(now.get_minute()).padStart(2, '0') : '00';

        this._dayLabel = new St.Label({
            text:        now ? (now.format('%A') ?? '') : '',
            style_class: 'raven-clock-day',
        });
        this._dateLabel = new St.Label({
            text:        now ? `${now.format('%B') ?? ''} ${now.get_day_of_month()}` : '',
            style_class: 'raven-clock-date',
        });
        this._timeLabel = new St.Label({
            text:        now ? `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}` : '',
            style_class: 'raven-clock-time',
        });

        box.add_child(this._dayLabel);
        box.add_child(this._dateLabel);
        box.add_child(this._timeLabel);
        return box;
    }

    _tick() {
        const now = GLib.DateTime.new_now_local();
        if (!now || !this.actor) return;
        this._dayLabel.text  = now.format('%A') ?? '';
        this._dateLabel.text = `${now.format('%B') ?? ''} ${now.get_day_of_month()}`;
        const h = now.get_hour();
        const m = String(now.get_minute()).padStart(2, '0');
        this._timeLabel.text = `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
    }
}