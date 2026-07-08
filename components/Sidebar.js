import St from "gi://St";
import Clutter from "gi://Clutter";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Component } from "./Component.js";
import { TabBar, TAB } from "./TabBar.js";
import { WidgetsPage } from "./WidgetsPage.js";
import { NotificationsPage } from "./NotificationsPage.js";
import { NetworkService } from "./NetworkService.js";
import { PowerService } from "./PowerService.js";

const WIDTH = 380;
const DURATION = 250;

// ─── Styles ───────────────────────────────────────────────────────────────────
// The panel inherits the shell's themed menu surface via the 'popup-menu-content'
// class (see _buildShell): an opaque background and foreground colour that follow
// the system light/dark theme. Here we only reset geometry for a full-height edge
// panel — no colours, so nothing is hardcoded and it tracks the system theme.
export const CSS = `
.raven-sidebar {
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    border: none;
}
`;

// Top-level sidebar component. Props: { settings: Gio.Settings }
// Manages the overlay, shell container, tab bar, and the two pages.
// Exposes toggle() / show() / hide().
//
// Does NOT extend Component because it has two root chrome actors (_overlay, _shell)
// rather than a single this.actor. Uses _disconnectAll() from the base for signal cleanup.
export class Sidebar extends Component {
  constructor({ settings }) {
    super();
    this._open = false;

    this._net = new NetworkService();
    this._power = new PowerService();
    this._tabBar = new TabBar({ onSwitch: (tab) => this._onTabSwitch(tab) });
    this._widgetsPage = new WidgetsPage({ net: this._net, power: this._power, settings });
    this._notifsPage = new NotificationsPage();

    this._buildOverlay();
    this._buildShell();
  }

  toggle() {
    if (this._open) this.hide();
    else this.show();
  }

  show() {
    if (this._open) return;
    this._open = true;

    const monitor = this._getMonitor();
    const panelH = Main.panel.height;

    // Re-read monitor geometry on each show — handles monitor changes
    this._overlay.set_position(monitor.x, monitor.y);
    this._overlay.set_size(monitor.width, monitor.height);
    this._overlay.show();

    this._shell.set_position(monitor.x + monitor.width, monitor.y + panelH);
    this._shell.set_size(WIDTH, monitor.height - panelH);
    this._shell.show();
    Main.layoutManager.uiGroup.set_child_above_sibling(
      this._shell,
      this._overlay,
    );

    this._shell.remove_all_transitions();
    this._shell.ease({
      translation_x: -WIDTH,
      duration: DURATION,
      mode: Clutter.AnimationMode.EASE_OUT_QUAD,
    });

    this._widgetsPage.onSidebarOpen();
    this._notifsPage.onVisible();
  }

  hide() {
    if (!this._open) return;
    this._open = false;

    this._overlay.hide();
    this._widgetsPage.onSidebarClose();

    this._shell.remove_all_transitions();
    this._shell.ease({
      translation_x: 0,
      duration: DURATION,
      mode: Clutter.AnimationMode.EASE_OUT_QUAD,
      onComplete: () => {
        if (this._shell) this._shell.hide();
      },
    });
  }

  destroy() {
    // Stop animation immediately — do not animate on extension disable
    this._open = false;
    if (this._shell) {
      this._shell.remove_all_transitions();
      this._shell.translation_x = 0;
    }

    this._widgetsPage.destroy();
    this._notifsPage.destroy();
    this._net?.destroy();
    this._power?.destroy();
    this._tabBar.destroy();

    if (this._overlay) {
      Main.layoutManager.removeChrome(this._overlay);
      this._overlay.destroy();
      this._overlay = null;
    }
    if (this._shell) {
      Main.layoutManager.removeChrome(this._shell);
      this._shell.destroy();
      this._shell = null;
    }

    // No tracked external signals on Sidebar itself, but call for completeness
    this._disconnectAll();
  }

  // --- private ---

  // primaryMonitor can be null early in startup or in a nested
  // (devkit) shell where no primary is assigned — fall back safely.
  _getMonitor() {
    return (
      Main.layoutManager.primaryMonitor ||
      Main.layoutManager.monitors[0] ||
      { x: 0, y: 0, width: 1920, height: 1080 }
    );
  }

  _buildOverlay() {
    const monitor = this._getMonitor();
    this._overlay = new St.Widget({
      reactive: true,
      visible: false,
      x: monitor.x,
      y: monitor.y,
      width: monitor.width,
      height: monitor.height,
    });
    this._overlay.connect("button-press-event", () => {
      this.hide();
      return Clutter.EVENT_STOP;
    });
    Main.layoutManager.addChrome(this._overlay, {
      affectsStruts: false,
      trackFullscreen: false,
    });
  }

  _buildShell() {
    const monitor = this._getMonitor();
    const panelH = Main.panel.height;

    // 'popup-menu-content' pulls the shell's themed menu surface (opaque
    // background + foreground that follow the system light/dark theme); our
    // 'raven-sidebar' rules only override geometry, never colour.
    this._shell = new St.BoxLayout({
      style_class: "popup-menu-content raven-sidebar",
      orientation: Clutter.Orientation.VERTICAL,
      reactive: true,
      visible: false,
      width: WIDTH,
      height: monitor.height - panelH,
      x: monitor.x + monitor.width,
      y: monitor.y + panelH,
    });

    this._shell.add_child(this._tabBar.actor);
    this._shell.add_child(this._widgetsPage.actor);
    this._shell.add_child(this._notifsPage.actor);
    this._notifsPage.actor.hide(); // start on Widgets tab

    Main.layoutManager.addChrome(this._shell, {
      affectsStruts: false,
      trackFullscreen: false,
    });
  }

  _onTabSwitch(tab) {
    const toWidgets = tab === TAB.WIDGETS;
    this._widgetsPage.actor.visible = toWidgets;
    this._notifsPage.actor.visible = !toWidgets;
    if (!toWidgets) this._notifsPage.onVisible();
  }
}
