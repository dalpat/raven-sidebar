import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import { BaseWidget } from '../BaseWidget.js';

const SETTINGS_KEY = 'habits';
const HISTORY_RETAIN_DAYS = 56; // keep ~8 weeks of completion history

export const CSS = `
.raven-habits-section {
    background-color: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 8px;
}
.raven-habit-list { spacing: 3px; }
.raven-habit-row  { spacing: 6px; }
.raven-habit-main { padding: 6px 6px; border-radius: 8px; }
.raven-habit-main:hover { background-color: rgba(255,255,255,0.06); }
.raven-habit-name { font-size: 10pt; color: rgba(255,255,255,0.85); }
.raven-habit-dots { spacing: 5px; }
.raven-habit-dot  { width: 9px; height: 9px; border-radius: 99px; background-color: rgba(255,255,255,0.18); }
.raven-habit-dot-on {
    background-gradient-direction: horizontal;
    background-gradient-start: #6c8fff;
    background-gradient-end:   #a06cff;
}
.raven-habit-today { border: 1px solid rgba(255,255,255,0.55); }
.raven-habit-del   { color: rgba(255,255,255,0.3); border-radius: 6px; padding: 2px 6px; }
.raven-habit-del:hover { color: #ffffff; background-color: rgba(255,255,255,0.1); }
.raven-habit-empty { font-size: 9pt; color: rgba(255,255,255,0.4); padding: 4px 0; }
.raven-habit-entry {
    font-size: 9pt;
    border-radius: 8px;
    padding: 6px 10px;
    background-color: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.85);
}
`;

export class HabitTrackerWidget extends BaseWidget {
    static get section() { return 'Habits'; }

    static isAvailable(deps) { return !!deps?.settings; }

    constructor(deps) {
        super(deps);
        this._settings = deps.settings;
        this._habits   = this._load();
        this.actor     = this._build();
        this._rebuild();
    }

    onSidebarOpen() {
        // re-read in case the week rolled over while the sidebar was closed
        this._rebuild();
    }

    // --- private ---

    _load() {
        try { return JSON.parse(this._settings.get_string(SETTINGS_KEY)) || []; }
        catch (_) { return []; }
    }

    _save() {
        this._prune();
        try { this._settings.set_string(SETTINGS_KEY, JSON.stringify(this._habits)); }
        catch (e) { console.error('[Raven] HabitTracker save:', e); }
    }

    // Drop completion entries older than the retention window so the stored
    // JSON can't grow without bound over years of use.
    _prune() {
        const cutoff = GLib.DateTime.new_now_local().add_days(-HISTORY_RETAIN_DAYS).format('%Y-%m-%d');
        for (const h of this._habits) {
            if (!h.history) continue;
            for (const key of Object.keys(h.history))
                if (key < cutoff) delete h.history[key];
        }
    }

    _weekKeys() {
        const now = GLib.DateTime.new_now_local();
        const monday = now.add_days(-(now.get_day_of_week() - 1));
        const keys = [];
        for (let i = 0; i < 7; i++) keys.push(monday.add_days(i).format('%Y-%m-%d'));
        return { keys, today: now.format('%Y-%m-%d') };
    }

    _build() {
        const section = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-habits-section',
        });
        section.add_child(new St.Label({ text: 'HABITS', style_class: 'raven-section-label' }));

        this._list = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-habit-list',
        });
        section.add_child(this._list);

        this._entry = new St.Entry({ hint_text: 'Add a habit…', x_expand: true, style_class: 'raven-habit-entry' });
        this._entry.clutter_text.connect('activate', () => {
            const name = this._entry.get_text().trim();
            if (!name) return;
            this._habits.push({ name, history: {} });
            this._entry.set_text('');
            this._save();
            this._rebuild();
        });
        section.add_child(this._entry);

        return section;
    }

    _rebuild() {
        if (!this._list) return;
        this._list.destroy_all_children();

        if (this._habits.length === 0) {
            this._list.add_child(new St.Label({ text: 'No habits yet — add one below.', style_class: 'raven-habit-empty' }));
            return;
        }

        const { keys, today } = this._weekKeys();
        this._habits.forEach((habit, idx) => this._list.add_child(this._habitRow(habit, idx, keys, today)));
    }

    _habitRow(habit, idx, weekKeys, todayKey) {
        const row = new St.BoxLayout({ x_expand: true, style_class: 'raven-habit-row' });

        const main = new St.Button({ x_expand: true, style_class: 'raven-habit-main', can_focus: true });
        const inner = new St.BoxLayout({ x_expand: true });
        inner.add_child(new St.Label({
            text:        habit.name,
            x_expand:    true,
            y_align:     Clutter.ActorAlign.CENTER,
            style_class: 'raven-habit-name',
        }));

        const dots = new St.BoxLayout({ y_align: Clutter.ActorAlign.CENTER, style_class: 'raven-habit-dots' });
        const history = habit.history || {};
        for (const key of weekKeys) {
            let cls = 'raven-habit-dot';
            if (history[key]) cls += ' raven-habit-dot-on';
            if (key === todayKey) cls += ' raven-habit-today';
            dots.add_child(new St.Widget({ style_class: cls, y_align: Clutter.ActorAlign.CENTER }));
        }
        inner.add_child(dots);
        main.set_child(inner);
        main.connect('clicked', () => this._toggleToday(habit, todayKey));
        row.add_child(main);

        const del = new St.Button({ label: '✕', style_class: 'raven-habit-del', can_focus: true });
        del.connect('clicked', () => { this._habits.splice(idx, 1); this._save(); this._rebuild(); });
        row.add_child(del);

        return row;
    }

    _toggleToday(habit, todayKey) {
        habit.history = habit.history || {};
        if (habit.history[todayKey]) delete habit.history[todayKey];
        else habit.history[todayKey] = true;
        this._save();
        this._rebuild();
    }
}
