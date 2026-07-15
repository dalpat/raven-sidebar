import St from 'gi://St';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

// Import each component's CSS string.
// This is the SFC "manifest" — add a line here whenever a new component has styles.
import { CSS as SidebarCSS }        from './Sidebar.js';
import { CSS as TabBarCSS }          from './TabBar.js';
import { CSS as SliderBarCSS }       from './SliderBar.js';
import { WIDGET_CSS }              from './widgets/index.js';
import { CSS as WidgetsPageCSS }     from './WidgetsPage.js';
import { CSS as NotifPageCSS }       from './NotificationsPage.js';
import { CSS as NotifItemCSS }       from './NotificationItem.js';
import { CSS as NotifListCSS }       from './NotificationList.js';

const COMPONENT_STYLES = [
    SidebarCSS,
    TabBarCSS,
    SliderBarCSS,
    WIDGET_CSS,
    WidgetsPageCSS,
    NotifPageCSS,
    NotifItemCSS,
    NotifListCSS,
];

// Writes all component CSS strings into a single runtime file and loads it into
// GNOME Shell's theme. Mirrors the Vue SFC <style> block — each component owns
// its styles, this class just assembles and hot-loads them.
export class StyleManager {
    constructor() {
        this._styleFile   = null;
        this._themeCtx    = null;
        this._changedId   = 0;
        this._reapplying  = false;
    }

    load() {
        const combined = COMPONENT_STYLES.join('\n');
        const path     = `${GLib.get_user_runtime_dir()}/raven-sidebar-styles.css`;

        try {
            const file = Gio.File.new_for_path(path);
            file.replace_contents(
                new TextEncoder().encode(combined),
                null, false,
                Gio.FileCreateFlags.REPLACE_DESTINATION,
                null,
            );
            this._styleFile = file;
            this._apply();

            // When the system light/dark theme (or accent) changes, GNOME Shell
            // rebuilds its StTheme, which silently drops any externally-loaded
            // stylesheet — so our .raven-* rules would vanish and the panel would
            // fall back to the bare popup-menu-content look. Re-apply on every
            // theme-context change so our styles survive the switch.
            this._themeCtx  = St.ThemeContext.get_for_stage(global.stage);
            this._changedId = this._themeCtx.connect('changed', () => this._apply());
        } catch (e) {
            console.error('[Raven] StyleManager.load:', e);
        }
    }

    // Idempotent: load_stylesheet on an already-loaded file is a no-op, and on a
    // freshly-rebuilt theme it re-attaches our styles.
    _apply() {
        if (!this._styleFile || this._reapplying) return;
        this._reapplying = true;
        try {
            const theme = St.ThemeContext.get_for_stage(global.stage).get_theme();
            // Drop any stale copy first so a persisting theme can't double-attach.
            try { theme.unload_stylesheet(this._styleFile); } catch (_) {}
            theme.load_stylesheet(this._styleFile);
        } catch (e) {
            console.error('[Raven] StyleManager._apply:', e);
        } finally {
            this._reapplying = false;
        }
    }

    unload() {
        if (this._themeCtx && this._changedId) {
            this._themeCtx.disconnect(this._changedId);
            this._changedId = 0;
            this._themeCtx  = null;
        }
        if (!this._styleFile) return;
        try {
            St.ThemeContext.get_for_stage(global.stage).get_theme().unload_stylesheet(this._styleFile);
        } catch (e) {}
        this._styleFile = null;
    }
}
