import St from 'gi://St';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

// Import each component's CSS string.
// This is the SFC "manifest" — add a line here whenever a new component has styles.
import { CSS as SidebarCSS }        from './Sidebar.js';
import { CSS as ThemeBarCSS }       from './ThemeBar.js';
import { LIGHT_CSS }                from './ThemeManager.js';
import { CSS as TabBarCSS }          from './TabBar.js';
import { CSS as SliderBarCSS }       from './SliderBar.js';
import { CSS as ClockWidgetCSS }     from './ClockWidget.js';
import { CSS as CalendarCSS }        from './CalendarWidget.js';
import { CSS as VolumeSectionCSS }   from './VolumeSection.js';
import { CSS as MicSectionCSS }      from './MicSection.js';
import { CSS as BrightnessSectionCSS } from './BrightnessSection.js';
import { CSS as WidgetsPageCSS }     from './WidgetsPage.js';
import { CSS as NotifPageCSS }       from './NotificationsPage.js';
import { CSS as NotifItemCSS }       from './NotificationItem.js';
import { CSS as NotifListCSS }       from './NotificationList.js';

const COMPONENT_STYLES = [
    SidebarCSS,
    ThemeBarCSS,
    LIGHT_CSS,
    TabBarCSS,
    SliderBarCSS,
    ClockWidgetCSS,
    CalendarCSS,
    VolumeSectionCSS,
    MicSectionCSS,
    BrightnessSectionCSS,
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
        this._styleFile = null;
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
            St.ThemeContext.get_for_stage(global.stage).get_theme().load_stylesheet(file);
            this._styleFile = file;
        } catch (e) {
            console.error('[Raven] StyleManager.load:', e);
        }
    }

    unload() {
        if (!this._styleFile) return;
        try {
            St.ThemeContext.get_for_stage(global.stage).get_theme().unload_stylesheet(this._styleFile);
        } catch (e) {}
        this._styleFile = null;
    }
}
