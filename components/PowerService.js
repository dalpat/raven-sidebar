import UPowerGlib from 'gi://UPowerGlib';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

// Shared power/battery state, injected into the Power and Battery-Health widgets
// (so the extension holds a single UPower client). Battery comes from UPower;
// the power-profile switch comes from power-profiles-daemon over the system bus
// and degrades to "unavailable" when ppd isn't running.
const PROFILE_NAMES = ['net.hadess.PowerProfiles', 'org.freedesktop.UPower.PowerProfiles'];

export class PowerService {
    constructor() {
        this._listeners = new Set();
        this._sigs      = [];
        this._client    = null;
        this._battery   = null;
        this._profiles  = null;
        this._profilesName = null;

        try {
            this._client  = UPowerGlib.Client.new_full(null);
            this._battery = this._pickBattery();
            const refresh = () => this._emit();
            const track = (obj, sig) => this._sigs.push({ obj, id: obj.connect(sig, refresh) });
            track(this._client, 'device-added');
            track(this._client, 'device-removed');
            if (this._battery) {
                for (const p of ['percentage', 'state', 'time-to-empty', 'time-to-full'])
                    track(this._battery, `notify::${p}`);
            }
        } catch (e) {
            console.error('[Raven] PowerService: UPower unavailable:', e);
        }

        this._initProfiles();
    }

    onChange(cb) { this._listeners.add(cb); return () => this._listeners.delete(cb); }

    // --- battery ---
    get hasBattery() { return !!this._battery; }
    get percentage() { return this._battery ? Math.round(this._battery.percentage) : 0; }
    get charging()   { return !!this._battery && this._battery.state === UPowerGlib.DeviceState.CHARGING; }

    get stateText() {
        if (!this._battery) return '';
        const S = UPowerGlib.DeviceState;
        switch (this._battery.state) {
            case S.CHARGING:        return 'charging';
            case S.FULLY_CHARGED:   return 'fully charged';
            case S.PENDING_CHARGE:  return 'not charging';
            default:                return 'discharging';
        }
    }

    get timeText() {
        if (!this._battery) return '';
        const S = UPowerGlib.DeviceState;
        let secs = 0, suffix = '';
        if (this._battery.state === S.CHARGING)        { secs = this._battery.time_to_full;  suffix = 'until full'; }
        else if (this._battery.state === S.DISCHARGING){ secs = this._battery.time_to_empty; suffix = 'remaining'; }
        else return '';
        if (!secs || secs <= 0) return '';
        const h = Math.floor(secs / 3600), m = Math.round((secs % 3600) / 60);
        return `${h > 0 ? `${h} h ${m} m` : `${m} m`} ${suffix}`;
    }

    iconName() {
        if (!this._battery) return 'battery-missing-symbolic';
        const p = this.percentage;
        if (this.charging) return 'battery-full-charging-symbolic';
        if (p > 80) return 'battery-full-symbolic';
        if (p > 40) return 'battery-good-symbolic';
        if (p > 10) return 'battery-low-symbolic';
        return 'battery-caution-symbolic';
    }

    // --- battery health ---
    get healthAvailable() { return !!this._battery && this._battery.energy_full_design > 0; }
    get healthPercent() {
        if (!this.healthAvailable) return null;
        const cap = this._battery.capacity;
        if (cap && cap > 0) return Math.round(cap);
        return Math.round((this._battery.energy_full / this._battery.energy_full_design) * 100);
    }
    get cycles()          { const c = this._battery?.charge_cycles ?? -1; return c > 0 ? c : null; }
    get energyFull()      { return this._battery?.energy_full ?? 0; }
    get energyFullDesign(){ return this._battery?.energy_full_design ?? 0; }

    // --- power profiles ---
    get profilesAvailable() { return !!this._profiles; }
    get activeProfile()     { return this._profiles?.get_cached_property('ActiveProfile')?.unpack() ?? null; }
    get profiles() {
        const v = this._profiles?.get_cached_property('Profiles');
        if (!v) return [];
        const out = [];
        for (const entry of v.deep_unpack()) {
            const pe = entry['Profile'];
            const name = pe ? pe.unpack() : null;
            if (name) out.push(name);
        }
        return out;
    }
    setProfile(name) {
        if (!this._profiles) return;
        const path = '/' + this._profilesName.replace(/\./g, '/');
        Gio.DBus.system.call(
            this._profilesName, path, 'org.freedesktop.DBus.Properties', 'Set',
            new GLib.Variant('(ssv)', [this._profilesName, 'ActiveProfile', new GLib.Variant('s', name)]),
            null, Gio.DBusCallFlags.NONE, -1, null, null);
    }

    destroy() {
        for (const { obj, id } of this._sigs) try { obj.disconnect(id); } catch (_) {}
        this._sigs = [];
        this._listeners.clear();
        this._client = this._battery = this._profiles = null;
    }

    // --- private ---

    _emit() { for (const cb of this._listeners) try { cb(); } catch (_) {} }

    _pickBattery() {
        try {
            for (const d of this._client.get_devices())
                if (d.kind === UPowerGlib.DeviceKind.BATTERY && d.is_present) return d;
        } catch (_) {}
        try {
            const disp = this._client.get_display_device();
            if (disp && disp.is_present) return disp;
        } catch (_) {}
        return null;
    }

    _initProfiles() {
        for (const name of PROFILE_NAMES) {
            try {
                const path = '/' + name.replace(/\./g, '/');
                const proxy = Gio.DBusProxy.new_for_bus_sync(
                    Gio.BusType.SYSTEM,
                    Gio.DBusProxyFlags.DO_NOT_AUTO_START, null,
                    name, path, name, null);
                if (proxy.get_cached_property('Profiles')) {
                    this._profiles = proxy;
                    this._profilesName = name;
                    this._sigs.push({ obj: proxy, id: proxy.connect('g-properties-changed', () => this._emit()) });
                    return;
                }
            } catch (_) { /* try next name */ }
        }
    }
}
