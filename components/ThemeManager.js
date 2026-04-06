import Gio from 'gi://Gio';

const DESKTOP_SCHEMA   = 'org.gnome.desktop.interface';
const COLOR_SCHEME_KEY = 'color-scheme';

export const THEME = Object.freeze({
    SYSTEM: 'system',
    DARK:   'dark',
    LIGHT:  'light',
});

// ─── Light theme overrides ────────────────────────────────────────────────────
// Dark is the default — component CSS files define dark styles without a theme
// qualifier. This block adds .raven-light descendant overrides only.
// Owned here so individual component files stay untouched.
export const LIGHT_CSS = `
/* Sidebar shell */
.raven-light.raven-sidebar {
    background-color: rgba(240, 240, 248, 0.97);
    border-left: 1px solid rgba(0, 0, 0, 0.08);
}

/* Tab bar */
.raven-light .raven-tabbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    background-color: rgba(0, 0, 0, 0.015);
}
.raven-light .raven-tab         { color: rgba(0,0,0,0.4); }
.raven-light .raven-tab:hover   { color: rgba(0,0,0,0.7); background-color: rgba(0,0,0,0.06); }
.raven-light .raven-tab-active  { color: #000000; background-color: rgba(0,0,0,0.1); }

/* Theme bar */
.raven-light .raven-themebar    { border-bottom: 1px solid rgba(0,0,0,0.06); }
.raven-light .raven-theme-btn   { color: rgba(0,0,0,0.35); }
.raven-light .raven-theme-btn:hover       { color: rgba(0,0,0,0.7); background-color: rgba(0,0,0,0.06); }
.raven-light .raven-theme-btn-active      { color: rgba(0,0,0,0.85); background-color: rgba(0,0,0,0.1); }

/* Clock */
.raven-light .raven-clock-box {
    background: linear-gradient(145deg, rgba(100,120,220,0.12), rgba(150,80,200,0.10));
}
.raven-light .raven-clock-day   { color: rgba(0,0,0,0.5); }
.raven-light .raven-clock-date  { color: #1a1a1a; }
.raven-light .raven-clock-time  { color: #1a1a1a; }

/* Calendar */
.raven-light .raven-calendar-header-label { color: rgba(0,0,0,0.4); }
.raven-light .raven-calendar {
    background-color: rgba(0,0,0,0.03);
    border: 1px solid rgba(0,0,0,0.07);
}
.raven-light .raven-cal-nav       { color: rgba(0,0,0,0.5); }
.raven-light .raven-cal-nav:hover { color: #000; background-color: rgba(0,0,0,0.08); }
.raven-light .raven-cal-month-label         { color: #1a1a1a; }
.raven-light .raven-cal-weekday-label       { color: rgba(0,0,0,0.35); }
.raven-light .raven-cal-weekday-weekend     { color: rgba(50,70,200,0.55); }
.raven-light .raven-cal-day,
.raven-light .raven-cal-day:focus,
.raven-light .raven-cal-day:active,
.raven-light .raven-cal-day:checked,
.raven-light .raven-cal-day:insensitive     { color: rgba(0,0,0,0.72); background-color: transparent; border: none; }
.raven-light .raven-cal-day:hover           { background-color: rgba(0,0,0,0.07); color: #000; }
.raven-light .raven-cal-weekend,
.raven-light .raven-cal-weekend:focus,
.raven-light .raven-cal-weekend:active,
.raven-light .raven-cal-weekend:checked,
.raven-light .raven-cal-weekend:insensitive { color: rgba(50,70,200,0.65); }
.raven-light .raven-cal-weekend:hover       { color: #2030b8; background-color: rgba(50,70,200,0.09); }
.raven-light .raven-cal-today,
.raven-light .raven-cal-today:focus,
.raven-light .raven-cal-today:active,
.raven-light .raven-cal-today:checked       { background-color: rgba(50,80,210,0.15); border: 1px solid rgba(50,80,210,0.45); color: #1830a0; }
.raven-light .raven-cal-today:hover         { background-color: rgba(50,80,210,0.25); color: #1020a0; }

/* Audio & brightness sections */
.raven-light .raven-volume-section,
.raven-light .raven-mic-section,
.raven-light .raven-brightness-section      { background-color: rgba(0,0,0,0.04); }
.raven-light .raven-volume-icon,
.raven-light .raven-mic-icon,
.raven-light .raven-brightness-icon         { color: rgba(0,0,0,0.65); }
.raven-light .raven-volume-label,
.raven-light .raven-mic-label,
.raven-light .raven-brightness-label        { color: rgba(0,0,0,0.75); }
.raven-light .raven-volume-perc,
.raven-light .raven-mic-perc,
.raven-light .raven-brightness-perc         { color: rgba(0,0,0,0.45); }

/* Notifications */
.raven-light .raven-notif-count-label       { color: rgba(0,0,0,0.35); }
.raven-light .raven-notif-item              { background-color: rgba(0,0,0,0.04); }
.raven-light .raven-notif-icon              { color: rgba(0,0,0,0.65); }
.raven-light .raven-notif-icon-fallback     { color: rgba(0,0,0,0.4); }
.raven-light .raven-notif-title             { color: #1a1a1a; }
.raven-light .raven-notif-body              { color: rgba(0,0,0,0.55); }
.raven-light .raven-notif-empty             { color: rgba(0,0,0,0.3); }
.raven-light .raven-dismiss-btn             { color: rgba(0,0,0,0.3); }
.raven-light .raven-dismiss-btn:hover       { background-color: rgba(0,0,0,0.07); color: rgba(0,0,0,0.65); }
.raven-light .raven-dismiss-icon            { color: rgba(0,0,0,0.45); }
.raven-light .raven-clear-btn               { color: rgba(0,0,0,0.6); background-color: rgba(0,0,0,0.07); }
.raven-light .raven-clear-btn:hover         { color: #000; background-color: rgba(0,0,0,0.12); }
`;

// Watches the extension's 'theme' GSettings key and the system color-scheme.
// Applies .raven-dark or .raven-light to the sidebar shell actor.
// Dark is default; light overrides are in LIGHT_CSS above.
export class ThemeManager {
    constructor({ settings, shell }) {
        this._settings = settings;
        this._shell    = shell;
        this._signals  = [];

        try {
            this._desktop = new Gio.Settings({ schema_id: DESKTOP_SCHEMA });
            this._signals.push({
                obj: this._desktop,
                id:  this._desktop.connect(`changed::${COLOR_SCHEME_KEY}`, () => this._apply()),
            });
        } catch (_) {
            // System schema unavailable — system detection will always return dark.
            this._desktop = null;
        }

        this._signals.push({
            obj: this._settings,
            id:  this._settings.connect('changed::theme', () => this._apply()),
        });

        this._apply();
    }

    getTheme() {
        return this._settings.get_string('theme');
    }

    setTheme(theme) {
        this._settings.set_string('theme', theme);
        // _apply() fires via the 'changed::theme' signal above
    }

    destroy() {
        for (const { obj, id } of this._signals)
            try { obj.disconnect(id); } catch (_) {}
        this._signals = [];
        this._shell   = null;
    }

    // --- private ---

    _apply() {
        if (!this._shell) return;
        const pref = this._settings.get_string('theme');
        let useDark;

        if (pref === THEME.DARK) {
            useDark = true;
        } else if (pref === THEME.LIGHT) {
            useDark = false;
        } else {
            // 'prefer-light' → light; 'default' or 'prefer-dark' → dark
            const scheme = this._desktop?.get_string(COLOR_SCHEME_KEY) ?? 'default';
            useDark = scheme !== 'prefer-light';
        }

        this._shell.remove_style_class_name('raven-dark');
        this._shell.remove_style_class_name('raven-light');
        this._shell.add_style_class_name(useDark ? 'raven-dark' : 'raven-light');
    }
}
