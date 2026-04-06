import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { StyleManager } from './components/StyleManager.js';
import { Sidebar } from './components/Sidebar.js';

export default class RavenSidebarExtension extends Extension {
    enable() {
        this._styles  = new StyleManager();
        this._styles.load();
        this._sidebar = new Sidebar({ settings: this.getSettings() });
        this._buildButton();
        this._registerKeybinding();
    }

    disable() {
        Main.wm.removeKeybinding('toggle-raven');

        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
        if (this._sidebar) {
            this._sidebar.destroy();
            this._sidebar = null;
        }
        if (this._styles) {
            this._styles.unload();
            this._styles = null;
        }
    }

    _buildButton() {
        this._button = new PanelMenu.Button(0.0, this.metadata.name, true);
        this._button.add_child(new St.Icon({
            icon_name:   'preferences-system-notifications-symbolic',
            style_class: 'system-status-icon',
        }));
        this._button.connect('button-press-event', () => {
            this._sidebar.toggle();
            return Clutter.EVENT_STOP;
        });
        Main.panel.addToStatusArea(this.uuid, this._button, 0, 'right');
    }

    _registerKeybinding() {
        Main.wm.addKeybinding(
            'toggle-raven',
            this.getSettings(),
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this._sidebar.toggle(),
        );
    }
}
