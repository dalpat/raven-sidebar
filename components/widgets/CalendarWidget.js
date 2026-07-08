import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import { BaseWidget } from '../BaseWidget.js';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CSS = `
.raven-calendar-section {
    spacing: 8px;
}
.raven-calendar-header-label {
    font-size: 7.5pt;
    font-weight: bold;
    letter-spacing: 1.5px;
}
.raven-cal-header-row {
    spacing: 4px;
    padding-bottom: 6px;
}
.raven-cal-month-label {
    font-size: 10.5pt;
    font-weight: bold;
    text-align: center;
}
.raven-cal-weekday-label {
    font-size: 8pt;
    text-align: center;
    padding-bottom: 4px;
}
.raven-cal-weekday-weekend {
    color: -st-accent-color;
}
.raven-calendar {
    background-color: st-transparentize(-st-accent-color, 0.93);
    border-radius: 12px;
    padding: 6px 4px;
    border: 1px solid st-transparentize(-st-accent-color, 0.88);
}
.raven-cal-nav {
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 14pt;
    background-color: transparent;
    border: none;
}
.raven-cal-nav:hover {
    background-color: st-transparentize(-st-accent-color, 0.88);
}

/* Cover all pseudo-states so GNOME Shell's default button theme cannot bleed through */
.raven-cal-day,
.raven-cal-day:focus,
.raven-cal-day:active,
.raven-cal-day:checked,
.raven-cal-day:insensitive {
    min-width: 32px;
    min-height: 32px;
    border-radius: 7px;
    font-size: 9pt;
    background-color: transparent;
    border: none;
}
.raven-cal-day:hover {
    background-color: st-transparentize(-st-accent-color, 0.88);
}

/* Saturday / Sunday — accent tint */
.raven-cal-weekend,
.raven-cal-weekend:focus,
.raven-cal-weekend:active,
.raven-cal-weekend:checked,
.raven-cal-weekend:insensitive {
    color: -st-accent-color;
}
.raven-cal-weekend:hover {
    background-color: st-transparentize(-st-accent-color, 0.86);
}

/* Today */
.raven-cal-today,
.raven-cal-today:focus,
.raven-cal-today:active,
.raven-cal-today:checked {
    background-color: st-transparentize(-st-accent-color, 0.72);
    border: 1px solid st-transparentize(-st-accent-color, 0.4);
    color: -st-accent-color;
    font-weight: bold;
}
.raven-cal-today:hover {
    background-color: st-transparentize(-st-accent-color, 0.6);
}
`;

export class CalendarWidget extends BaseWidget {
    static get section() { return 'Calendar'; }

    constructor(deps) {
        super(deps);
        this._calDate = GLib.DateTime.new_now_local();
        this.actor = this._build();
    }

    _build() {
        const section = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand: true,
            style_class: 'raven-calendar-section',
        });

        section.add_child(
            new St.Label({
                text: 'CALENDAR',
                style_class: 'raven-calendar-header-label',
            }),
        );

        this._grid = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand: true,
            style_class: 'raven-calendar',
        });
        this._render();
        section.add_child(this._grid);
        return section;
    }

    _render() {
        this._grid.destroy_all_children();

        const year = this._calDate.get_year();
        const month = this._calDate.get_month();
        const today = GLib.DateTime.new_now_local();

        const header = new St.BoxLayout({
            x_expand: true,
            style_class: 'raven-cal-header-row',
        });

        const prev = new St.Button({ label: '‹', style_class: 'raven-cal-nav' });
        prev.connect('clicked', () => {
            this._calDate = this._calDate.add_months(-1);
            this._render();
        });

        const monthLabel = new St.Label({
            text: `${this._calDate.format('%B')} ${year}`,
            x_expand: true,
            style_class: 'raven-cal-month-label',
        });

        const next = new St.Button({ label: '›', style_class: 'raven-cal-nav' });
        next.connect('clicked', () => {
            this._calDate = this._calDate.add_months(1);
            this._render();
        });

        header.add_child(prev);
        header.add_child(monthLabel);
        header.add_child(next);
        this._grid.add_child(header);

        const headRow = new St.BoxLayout({ x_expand: true });
        for (const [i, d] of WEEKDAYS.entries()) {
            const isWeekend = i === 0 || i === 6;
            headRow.add_child(
                new St.Label({
                    text: d,
                    x_expand: true,
                    style_class: `raven-cal-weekday-label${isWeekend ? ' raven-cal-weekday-weekend' : ''}`,
                }),
            );
        }
        this._grid.add_child(headRow);

        const startOffset = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();

        const makeBlank = () =>
            new St.Button({
                label: '',
                x_expand: true,
                reactive: false,
                can_focus: false,
                style_class: 'raven-cal-day',
                opacity: 0,
            });

        let col = startOffset;
        let row = new St.BoxLayout({ x_expand: true });

        for (let i = 0; i < startOffset; i++) row.add_child(makeBlank());

        for (let day = 1; day <= daysInMonth; day++) {
            const dayOfWeek = (startOffset + day - 1) % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isToday =
                today &&
                year === today.get_year() &&
                month === today.get_month() &&
                day === today.get_day_of_month();

            let cls = 'raven-cal-day';
            if (isToday) cls += ' raven-cal-today';
            else if (isWeekend) cls += ' raven-cal-weekend';

            row.add_child(
                new St.Button({
                    label: String(day),
                    x_expand: true,
                    style_class: cls,
                }),
            );

            if (++col === 7) {
                this._grid.add_child(row);
                row = new St.BoxLayout({ x_expand: true });
                col = 0;
            }
        }

        if (col > 0) {
            while (col < 7) {
                row.add_child(makeBlank());
                col++;
            }
            this._grid.add_child(row);
        }
    }
}