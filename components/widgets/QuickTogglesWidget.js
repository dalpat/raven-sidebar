import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { BaseWidget } from '../BaseWidget.js';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-toggles        { spacing: 8px; }
.raven-toggle-rowwrap { spacing: 8px; }

.raven-toggle {
    border-radius: 13px;
    padding: 11px 12px;
    background-color: st-transparentize(-st-accent-color, 0.92);
    border: 1px solid transparent;
    transition-duration: 140ms;
}
.raven-toggle:hover { background-color: st-transparentize(-st-accent-color, 0.86); }

.raven-toggle-on {
    background-color: -st-accent-color;
    border: 1px solid -st-accent-color;
}

.raven-toggle-row    { spacing: 9px; }
.raven-toggle-label  { font-size: 9.5pt; font-weight: 600; }
.raven-toggle-status { font-size: 8pt; }

.raven-toggle-on .raven-toggle-icon,
.raven-toggle-on .raven-toggle-label,
.raven-toggle-on .raven-toggle-status { color: -st-accent-fg-color; }
`;

// Look up a GSettings schema only if it's installed, so a missing schema
// degrades the toggle to "Unavailable" instead of throwing at construction.
function settingsIfExists(schemaId) {
    const src = Gio.SettingsSchemaSource.get_default();
    if (src && src.lookup(schemaId, true)) return new Gio.Settings({ schema_id: schemaId });
    return null;
}

// ─── Toggle controllers ─────────────────────────────────────────────────────
// Each exposes the same shape: label, iconName(on), available(), get(), set(v),
// status(on), subscribe(cb)->unsub, destroy().

class WifiToggle {
    constructor(net) { this._net = net; this.label = 'Wi-Fi'; }
    iconName(on) { return on ? 'network-wireless-symbolic' : 'network-wireless-offline-symbolic'; }
    available()  { return !!this._net && this._net.wifiSupported; }
    get()        { return !!this._net && this._net.wifiEnabled; }
    set(v)       { this._net?.setWifiEnabled(v); }
    status(on)   { return on ? (this._net?.ssid ?? 'On') : 'Off'; }
    subscribe(cb){ this._unsub = this._net?.onChange(cb); return this._unsub; }
    destroy()    { try { this._unsub?.(); } catch (_) {} }
}

class BluetoothToggle {
    constructor() {
        this.label = 'Bluetooth';
        this._proxy = null;
        try {
            this._proxy = Gio.DBusProxy.new_for_bus_sync(
                Gio.BusType.SESSION, Gio.DBusProxyFlags.NONE, null,
                'org.gnome.SettingsDaemon.Rfkill',
                '/org/gnome/SettingsDaemon/Rfkill',
                'org.gnome.SettingsDaemon.Rfkill', null);
        } catch (e) {
            console.error('[Raven] Bluetooth rfkill proxy:', e);
        }
    }
    iconName(on) { return on ? 'bluetooth-active-symbolic' : 'bluetooth-disabled-symbolic'; }
    available()  {
        const p = this._proxy?.get_cached_property('BluetoothHasAirplaneMode');
        return !!p && p.unpack() === true;
    }
    // BT on == NOT in (soft) airplane mode.
    get() {
        const p = this._proxy?.get_cached_property('BluetoothAirplaneMode');
        return !!p && p.unpack() === false;
    }
    set(v) {
        if (!this._proxy) return;
        Gio.bus_get(Gio.BusType.SESSION, null, (_s, res) => {
            try {
                const bus = Gio.bus_get_finish(res);
                bus.call(
                    'org.gnome.SettingsDaemon.Rfkill',
                    '/org/gnome/SettingsDaemon/Rfkill',
                    'org.freedesktop.DBus.Properties', 'Set',
                    new GLib.Variant('(ssv)', [
                        'org.gnome.SettingsDaemon.Rfkill', 'BluetoothAirplaneMode',
                        new GLib.Variant('b', !v),
                    ]),
                    null, Gio.DBusCallFlags.NONE, -1, null, null);
            } catch (e) { console.error('[Raven] Bluetooth set:', e); }
        });
    }
    status(on)   { return on ? 'On' : 'Off'; }
    subscribe(cb){
        if (!this._proxy) return () => {};
        this._id = this._proxy.connect('g-properties-changed', () => cb());
        return () => { try { this._proxy.disconnect(this._id); } catch (_) {} };
    }
    destroy()    { try { if (this._id) this._proxy?.disconnect(this._id); } catch (_) {} }
}

class DndToggle {
    constructor() {
        this.label = 'Do Not Disturb';
        this._s = settingsIfExists('org.gnome.desktop.notifications');
    }
    iconName(on) { return on ? 'notifications-disabled-symbolic' : 'preferences-system-notifications-symbolic'; }
    available()  { return !!this._s; }
    // DND on == banners hidden.
    get()        { return !!this._s && !this._s.get_boolean('show-banners'); }
    set(v)       { this._s?.set_boolean('show-banners', !v); }
    status(on)   { return on ? 'On' : 'Off'; }
    subscribe(cb){
        if (!this._s) return () => {};
        this._id = this._s.connect('changed::show-banners', () => cb());
        return () => { try { this._s.disconnect(this._id); } catch (_) {} };
    }
    destroy()    { try { if (this._id) this._s?.disconnect(this._id); } catch (_) {} }
}

class NightLightToggle {
    constructor() {
        this.label = 'Night Light';
        this._s = settingsIfExists('org.gnome.settings-daemon.plugins.color');
        this._key = 'night-light-enabled';
    }
    iconName(_on) { return 'night-light-symbolic'; }
    available()   { return !!this._s; }
    get()         { return !!this._s && this._s.get_boolean(this._key); }
    set(v)        { this._s?.set_boolean(this._key, v); }
    status(on)    { return on ? 'On' : 'Off'; }
    subscribe(cb) {
        if (!this._s) return () => {};
        this._id = this._s.connect(`changed::${this._key}`, () => cb());
        return () => { try { this._s.disconnect(this._id); } catch (_) {} };
    }
    destroy()     { try { if (this._id) this._s?.disconnect(this._id); } catch (_) {} }
}

// ─── Widget ───────────────────────────────────────────────────────────────────
// 2×2 grid of system quick toggles. Individual toggles degrade to a dimmed
// "Unavailable" tile when their backing service/schema is missing.
export class QuickTogglesWidget extends BaseWidget {
    static get section() { return 'Quick Toggles'; }

    constructor(deps) {
        super(deps);
        this._net = deps?.net ?? null;
        this._controllers = [
            new WifiToggle(this._net),
            new BluetoothToggle(),
            new DndToggle(),
            new NightLightToggle(),
        ];
        this._tiles  = [];
        this._unsubs = [];
        this.actor   = this._build();

        for (const t of this._tiles) {
            const unsub = t.controller.subscribe(() => this._refresh());
            if (unsub) this._unsubs.push(unsub);
        }
        this._refresh();
    }

    onSidebarOpen() { this._refresh(); }

    destroy() {
        for (const u of this._unsubs) { try { u(); } catch (_) {} }
        for (const t of this._tiles) { try { t.controller.destroy?.(); } catch (_) {} }
        this._unsubs = [];
        super.destroy();
    }

    // --- private ---

    _build() {
        const box = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-toggles',
        });

        this._tiles = this._controllers.map(c => this._makeTile(c));

        for (let i = 0; i < this._tiles.length; i += 2) {
            const row = new St.BoxLayout({ x_expand: true, style_class: 'raven-toggle-rowwrap' });
            row.add_child(this._tiles[i].button);
            if (this._tiles[i + 1]) row.add_child(this._tiles[i + 1].button);
            box.add_child(row);
        }
        return box;
    }

    _makeTile(controller) {
        const button = new St.Button({ style_class: 'raven-toggle', x_expand: true, can_focus: true });

        const row  = new St.BoxLayout({ style_class: 'raven-toggle-row' });
        const icon = new St.Icon({ icon_size: 18, style_class: 'raven-toggle-icon' });

        const textBox = new St.BoxLayout({ orientation: Clutter.Orientation.VERTICAL, x_expand: true });
        const name    = new St.Label({ text: controller.label, style_class: 'raven-toggle-label' });
        const status  = new St.Label({ text: '', style_class: 'raven-toggle-status' });
        textBox.add_child(name);
        textBox.add_child(status);

        row.add_child(icon);
        row.add_child(textBox);
        button.set_child(row);

        button.connect('clicked', () => {
            if (!controller.available()) return;
            try { controller.set(!controller.get()); }
            catch (e) { console.error(`[Raven] toggle ${controller.label}:`, e); }
            this._refresh();
        });

        return { controller, button, icon, status };
    }

    _refresh() {
        for (const t of this._tiles) {
            const c     = t.controller;
            const avail = c.available();
            const on    = avail && c.get();

            t.button.style_class = on ? 'raven-toggle raven-toggle-on' : 'raven-toggle';
            t.button.reactive    = avail;
            t.button.opacity     = avail ? 255 : 110;
            t.icon.icon_name     = c.iconName(on);
            t.status.text        = avail ? c.status(on) : 'Unavailable';
        }
    }
}
