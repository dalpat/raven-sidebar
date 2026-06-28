import NM from 'gi://NM';

// Shared NetworkManager wrapper. Created once by the Sidebar and injected into
// the widgets that need network state (Wi-Fi quick toggle + IP widget), so the
// extension holds a single NM.Client instead of each widget spawning `ip`.
//
// The client is created asynchronously; until it arrives isAvailable() is false
// and accessors return empty/false. Subscribe with onChange() to repaint when
// the client becomes ready or network state changes.
export class NetworkService {
    constructor() {
        this._client     = null;
        this._listeners  = new Set();
        this._clientIds  = [];          // [{ obj, id }] on the NM.Client
        this._deviceIds  = [];          // [{ obj, id }] on individual devices
        this._destroyed  = false;

        try {
            NM.Client.new_async(null, (_src, res) => {
                if (this._destroyed) return; // disabled before the client arrived
                try {
                    this._client = NM.Client.new_finish(res);
                    this._wireClient();
                    this._rewireDevices();
                    this._emit();
                } catch (e) {
                    console.error('[Raven] NetworkService: client init failed:', e);
                }
            });
        } catch (e) {
            console.error('[Raven] NetworkService: NM unavailable:', e);
        }
    }

    isAvailable()  { return !!this._client; }
    onChange(cb)   { this._listeners.add(cb); return () => this._listeners.delete(cb); }

    get wifiSupported() {
        return !!this._client && this._client.wireless_hardware_enabled;
    }

    get wifiEnabled() {
        return !!this._client && this._client.wireless_enabled;
    }

    setWifiEnabled(on) {
        if (this._client) this._client.wireless_enabled = on;
    }

    // SSID of the active Wi-Fi connection, or null.
    get ssid() {
        if (!this._client) return null;
        for (const dev of this._client.get_devices()) {
            if (dev instanceof NM.DeviceWifi) {
                const ap = dev.active_access_point;
                if (!ap) continue;
                const ssid = ap.get_ssid();
                if (ssid) return NM.utils_ssid_to_utf8(ssid.get_data());
            }
        }
        return null;
    }

    // All non-loopback IPv4 addresses across active devices.
    get addresses() {
        const out = [];
        if (!this._client) return out;
        for (const dev of this._client.get_devices()) {
            const ip4 = dev.get_ip4_config?.();
            if (!ip4) continue;
            for (const a of ip4.get_addresses()) {
                const addr = a.get_address();
                if (addr && !addr.startsWith('127.')) out.push(addr);
            }
        }
        return out;
    }

    destroy() {
        this._destroyed = true;
        this._unwireDevices();
        for (const { obj, id } of this._clientIds)
            try { obj.disconnect(id); } catch (_) {}
        this._clientIds = [];
        this._listeners.clear();
        this._client = null;
    }

    // --- private ---

    _emit() {
        for (const cb of this._listeners)
            try { cb(); } catch (_) {}
    }

    _wireClient() {
        const c = this._client;
        const refresh = () => this._emit();
        const rewire  = () => { this._rewireDevices(); this._emit(); };
        const track = (sig, fn) => this._clientIds.push({ obj: c, id: c.connect(sig, fn) });

        track('notify::wireless-enabled', refresh);
        track('notify::primary-connection', refresh);
        track('notify::connectivity', refresh);
        track('active-connection-added', refresh);
        track('active-connection-removed', refresh);
        track('device-added', rewire);
        track('device-removed', rewire);
    }

    // Re-attach per-device signals (active AP + state) for the current device set.
    _rewireDevices() {
        this._unwireDevices();
        if (!this._client) return;
        const refresh = () => this._emit();
        for (const dev of this._client.get_devices()) {
            if (dev instanceof NM.DeviceWifi)
                this._deviceIds.push({ obj: dev, id: dev.connect('notify::active-access-point', refresh) });
            this._deviceIds.push({ obj: dev, id: dev.connect('state-changed', refresh) });
        }
    }

    _unwireDevices() {
        for (const { obj, id } of this._deviceIds)
            try { obj.disconnect(id); } catch (_) {}
        this._deviceIds = [];
    }
}
