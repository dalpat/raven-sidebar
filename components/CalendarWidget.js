import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import { Component } from './Component.js';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-calendar-section {
    spacing: 8px;
}
.raven-calendar-header-label {
    font-size: 7.5pt;
    font-weight: bold;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1.5px;
}
.raven-cal-header-row {
    spacing: 4px;
    padding-bottom: 6px;
}
.raven-cal-month-label {
    font-size: 10.5pt;
    font-weight: bold;
    color: #fff;
    text-align: center;
}
.raven-cal-weekday-label {
    font-size: 8pt;
    text-align: center;
    padding-bottom: 4px;
    color: rgba(255,255,255,0.28);
}
.raven-cal-weekday-weekend {
    color: rgba(170,185,255,0.45);
}
.raven-calendar {
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 6px 4px;
    border: 1px solid rgba(255, 255, 255, 0.07);
}
.raven-cal-nav {
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 14pt;
    color: rgba(255, 255, 255, 0.5);
    background-color: transparent;
    border: none;
}
.raven-cal-nav:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
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
    color: rgba(255, 255, 255, 0.72);
    background-color: transparent;
    border: none;
}
.raven-cal-day:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

/* Saturday / Sunday — subtle blue-violet tint */
.raven-cal-weekend,
.raven-cal-weekend:focus,
.raven-cal-weekend:active,
.raven-cal-weekend:checked,
.raven-cal-weekend:insensitive {
    color: rgba(170, 185, 255, 0.65);
}
.raven-cal-weekend:hover {
    color: #c8d8ff;
    background-color: rgba(110, 140, 255, 0.12);
}

/* Today */
.raven-cal-today,
.raven-cal-today:focus,
.raven-cal-today:active,
.raven-cal-today:checked {
    background-color: rgba(75, 105, 240, 0.3);
    border: 1px solid rgba(110, 140, 255, 0.6);
    color: #c8d8ff;
    font-weight: bold;
}
.raven-cal-today:hover {
    background-color: rgba(75, 105, 240, 0.45);
    color: #e0eaff;
}
`;

// Self-contained calendar with month navigation.
// State: currently displayed month (_calDate).
export class CalendarWidget extends Component {
    constructor() {
        super();
        this._calDate = GLib.DateTime.new_now_local();
        this.actor    = this._build();
    }

    // --- private ---

    _build() {
        const section = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-calendar-section',
        });

        section.add_child(new St.Label({
            text:        'CALENDAR',
            style_class: 'raven-calendar-header-label',
        }));

        this._grid = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-calendar',
        });
        this._render();
        section.add_child(this._grid);
        return section;
    }

    _render() {
        this._grid.destroy_all_children();

        const year  = this._calDate.get_year();
        const month = this._calDate.get_month(); // 1-12
        const today = GLib.DateTime.new_now_local();

        // Navigation header
        const header = new St.BoxLayout({
            x_expand:    true,
            style_class: 'raven-cal-header-row',
        });

        const prev = new St.Button({ label: '‹', style_class: 'raven-cal-nav' });
        prev.connect('clicked', () => { this._calDate = this._calDate.add_months(-1); this._render(); });

        const monthLabel = new St.Label({
            text:        `${this._calDate.format('%B')} ${year}`,
            x_expand:    true,
            style_class: 'raven-cal-month-label',
        });

        const next = new St.Button({ label: '›', style_class: 'raven-cal-nav' });
        next.connect('clicked', () => { this._calDate = this._calDate.add_months(1); this._render(); });

        header.add_child(prev);
        header.add_child(monthLabel);
        header.add_child(next);
        this._grid.add_child(header);

        // Weekday headings — Su and Sa use the weekend tint
        const headRow = new St.BoxLayout({ x_expand: true });
        for (const [i, d] of WEEKDAYS.entries()) {
            const isWeekend = i === 0 || i === 6;
            headRow.add_child(new St.Label({
                text:        d,
                x_expand:    true,
                style_class: `raven-cal-weekday-label${isWeekend ? ' raven-cal-weekday-weekend' : ''}`,
            }));
        }
        this._grid.add_child(headRow);

        // Day cells — JS Date for reliable arithmetic across GJS versions
        const startOffset = new Date(year, month - 1, 1).getDay(); // 0=Sun
        const daysInMonth = new Date(year, month,     0).getDate();

        // Use St.Button for ALL cells (including blanks) so every cell gets the same
        // internal padding from the theme — mixing St.Label + St.Button caused
        // column widths to diverge in partial rows (first / last row).
        const makeBlank = () => new St.Button({
            label:       '',
            x_expand:    true,
            reactive:    false,
            can_focus:   false,
            style_class: 'raven-cal-day',
            opacity:     0,   // invisible but occupies identical space to a day cell
        });

        let col = startOffset;
        let row = new St.BoxLayout({ x_expand: true });

        for (let i = 0; i < startOffset; i++)
            row.add_child(makeBlank());

        for (let day = 1; day <= daysInMonth; day++) {
            const dayOfWeek = (startOffset + day - 1) % 7; // 0=Sun … 6=Sat
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isToday   = today &&
                year  === today.get_year()        &&
                month === today.get_month()       &&
                day   === today.get_day_of_month();

            let cls = 'raven-cal-day';
            if (isToday)        cls += ' raven-cal-today';
            else if (isWeekend) cls += ' raven-cal-weekend';

            row.add_child(new St.Button({
                label:       String(day),
                x_expand:    true,
                style_class: cls,
            }));

            if (++col === 7) {
                this._grid.add_child(row);
                row = new St.BoxLayout({ x_expand: true });
                col = 0;
            }
        }

        // Pad last row with invisible blanks — same type ensures equal column widths
        if (col > 0) {
            while (col < 7) { row.add_child(makeBlank()); col++; }
            this._grid.add_child(row);
        }
    }
}
