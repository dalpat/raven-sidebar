import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { BaseWidget } from '../BaseWidget.js';

const MPRIS_PREFIX = 'org.mpris.MediaPlayer2.';
const PLAYER_PATH  = '/org/mpris/MediaPlayer2';
const PLAYER_IFACE = 'org.mpris.MediaPlayer2.Player';
const RESCAN_DEBOUNCE_MS = 250;

export const CSS = `
.raven-np-section {
    background-color: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 10px;
}
.raven-np-main  { spacing: 13px; }
.raven-np-art {
    width: 58px; height: 58px; border-radius: 10px;
    background-gradient-direction: vertical;
    background-gradient-start: rgb(125,91,230);
    background-gradient-end:   rgb(224,81,138);
}
.raven-np-art-icon { color: rgba(255,255,255,0.92); }
.raven-np-meta  { spacing: 2px; }
.raven-np-title  { font-size: 11pt; font-weight: bold; color: #ffffff; }
.raven-np-artist { font-size: 9pt; color: rgba(255,255,255,0.55); }
.raven-np-track {
    height: 4px; border-radius: 999px;
    background-color: rgba(255,255,255,0.18);
}
.raven-np-fill {
    border-radius: 999px;
    background-gradient-direction: horizontal;
    background-gradient-start: #6c8fff;
    background-gradient-end:   #a06cff;
}
.raven-np-time { font-size: 7.5pt; color: rgba(255,255,255,0.5); }
.raven-np-ctrl { spacing: 18px; }
.raven-np-btn  { color: #ffffff; padding: 4px; border-radius: 99px; }
.raven-np-btn:hover { background-color: rgba(255,255,255,0.10); }
.raven-np-play {
    background-color: rgba(255,255,255,0.14);
    border-radius: 99px; width: 34px; height: 34px;
}
.raven-np-play:hover { background-color: rgba(255,255,255,0.22); }
.raven-np-empty { font-size: 10pt; color: rgba(255,255,255,0.4); padding: 8px 0; }
`;

// Watches MPRIS players on the session bus and exposes the active one. Fully
// asynchronous: nothing here blocks the compositor thread. Bursts of
// NameOwnerChanged are debounced, and when several players exist the one that
// is actually Playing wins.
class MediaController {
    constructor(onChange) {
        this._onChange  = onChange;
        this._name      = null;
        this._proxy     = null;
        this._propsId   = null;
        this._dbus      = null;
        this._nocId     = null;
        this._rescanId  = 0;
        this._destroyed = false;

        Gio.DBusProxy.new_for_bus(
            Gio.BusType.SESSION, Gio.DBusProxyFlags.NONE, null,
            'org.freedesktop.DBus', '/org/freedesktop/DBus', 'org.freedesktop.DBus', null,
            (_src, res) => {
                if (this._destroyed) return;
                try {
                    this._dbus = Gio.DBusProxy.new_for_bus_finish(res);
                    this._nocId = this._dbus.connect('g-signal', (_p, _sender, signal, params) => {
                        if (signal !== 'NameOwnerChanged') return;
                        const [name] = params.deep_unpack();
                        if (name && name.startsWith(MPRIS_PREFIX)) this._scheduleRescan();
                    });
                    this._rescan();
                } catch (e) { console.error('[Raven] MPRIS bus:', e); }
            });
    }

    get hasPlayer() { return !!this._proxy; }
    get playing()   { return this.status === 'Playing'; }
    get status()    { return this._proxy?.get_cached_property('PlaybackStatus')?.unpack() ?? 'Stopped'; }
    get title()     { const t = this._meta()['xesam:title'];  return t ? t.deep_unpack() : null; }
    get artist()    {
        const a = this._meta()['xesam:artist'];
        if (!a) return null;
        const v = a.deep_unpack();
        return Array.isArray(v) ? v.join(', ') : String(v);
    }
    get artUrl()    { const u = this._meta()['mpris:artUrl']; return u ? u.deep_unpack() : null; }
    get length()    { const l = this._meta()['mpris:length']; return l ? Number(l.deep_unpack()) : 0; } // µs

    playPause() { this._call('PlayPause'); }
    next()      { this._call('Next'); }
    prev()      { this._call('Previous'); }

    // Position isn't push-updated, so it's fetched on demand (async, non-blocking).
    position(cb) {
        if (!this._name) { cb(0); return; }
        Gio.DBus.session.call(
            this._name, PLAYER_PATH, 'org.freedesktop.DBus.Properties', 'Get',
            new GLib.Variant('(ss)', [PLAYER_IFACE, 'Position']),
            new GLib.VariantType('(v)'), Gio.DBusCallFlags.NONE, -1, null,
            (conn, res) => {
                if (this._destroyed) return;
                try { const [v] = conn.call_finish(res).deep_unpack(); cb(Number(v.deep_unpack())); }
                catch (_) { cb(0); }
            });
    }

    destroy() {
        this._destroyed = true;
        if (this._rescanId) { GLib.source_remove(this._rescanId); this._rescanId = 0; }
        this._teardownPlayer();
        if (this._dbus && this._nocId) try { this._dbus.disconnect(this._nocId); } catch (_) {}
        this._dbus = null;
    }

    // --- private ---

    _meta() { const v = this._proxy?.get_cached_property('Metadata'); return v ? v.deep_unpack() : {}; }

    _call(method) {
        try { this._proxy?.call(method, null, Gio.DBusCallFlags.NONE, -1, null, null); }
        catch (e) { console.error(`[Raven] MPRIS ${method}:`, e); }
    }

    _scheduleRescan() {
        if (this._rescanId) return;
        this._rescanId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, RESCAN_DEBOUNCE_MS, () => {
            this._rescanId = 0;
            this._rescan();
            return GLib.SOURCE_REMOVE;
        });
    }

    _rescan() {
        if (this._destroyed || !this._dbus) return;
        this._dbus.call('ListNames', null, Gio.DBusCallFlags.NONE, -1, null, (proxy, res) => {
            if (this._destroyed) return;
            let names = [];
            try { [names] = proxy.call_finish(res).deep_unpack(); } catch (_) { return; }
            this._selectPlayer(names.filter(n => n.startsWith(MPRIS_PREFIX)));
        });
    }

    // Prefer a player that is actually Playing; otherwise the first available.
    _selectPlayer(players) {
        if (players.length === 0) { this._setActive(null); return; }
        let pending = players.length;
        let playing = null;
        for (const name of players) {
            Gio.DBus.session.call(
                name, PLAYER_PATH, 'org.freedesktop.DBus.Properties', 'Get',
                new GLib.Variant('(ss)', [PLAYER_IFACE, 'PlaybackStatus']),
                new GLib.VariantType('(v)'), Gio.DBusCallFlags.NONE, -1, null,
                (conn, res) => {
                    if (this._destroyed) return;
                    try {
                        const [v] = conn.call_finish(res).deep_unpack();
                        if (v.deep_unpack() === 'Playing' && !playing) playing = name;
                    } catch (_) {}
                    if (--pending === 0) this._setActive(playing ?? players[0]);
                });
        }
    }

    _setActive(name) {
        if (name === this._name && this._proxy) { this._onChange(); return; }
        this._teardownPlayer();
        this._name = name;
        if (name) this._attach(name);
        else this._onChange();
    }

    _attach(name) {
        Gio.DBusProxy.new_for_bus(
            Gio.BusType.SESSION, Gio.DBusProxyFlags.NONE, null,
            name, PLAYER_PATH, PLAYER_IFACE, null,
            (_src, res) => {
                if (this._destroyed || this._name !== name) return; // superseded
                try {
                    this._proxy = Gio.DBusProxy.new_for_bus_finish(res);
                    this._propsId = this._proxy.connect('g-properties-changed', () => this._onChange());
                } catch (e) {
                    console.error('[Raven] MPRIS attach:', e);
                    this._proxy = null;
                }
                this._onChange();
            });
    }

    _teardownPlayer() {
        if (this._proxy && this._propsId) try { this._proxy.disconnect(this._propsId); } catch (_) {}
        this._propsId = null;
        this._proxy   = null;
    }
}

function fmtTime(micro) {
    const s = Math.max(0, Math.floor(micro / 1e6));
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export class NowPlayingWidget extends BaseWidget {
    static get section() { return 'Now Playing'; }

    constructor(deps) {
        super(deps);
        this._timerId = null;
        this._media   = new MediaController(() => this._refresh());
        this.actor    = this._build();
        this._refresh();
    }

    onSidebarOpen() {
        this._refresh();
        if (!this._timerId) {
            this._timerId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
                this._tickPosition();
                return GLib.SOURCE_CONTINUE;
            });
        }
        this._tickPosition();
    }

    onSidebarClose() {
        if (this._timerId) { GLib.source_remove(this._timerId); this._timerId = null; }
    }

    destroy() {
        this.onSidebarClose();
        this._media.destroy();
        super.destroy();
    }

    // --- private ---

    _build() {
        const section = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-np-section',
        });

        this._emptyLabel = new St.Label({ text: 'Nothing playing', style_class: 'raven-np-empty' });
        section.add_child(this._emptyLabel);

        this._player = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
        });

        // main row: art + metadata
        const main = new St.BoxLayout({ style_class: 'raven-np-main', x_expand: true });
        this._art = new St.Bin({ style_class: 'raven-np-art' });
        this._artIcon = new St.Icon({ icon_name: 'audio-x-generic-symbolic', icon_size: 22, style_class: 'raven-np-art-icon' });
        this._art.set_child(this._artIcon);
        main.add_child(this._art);

        const meta = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            y_align:     Clutter.ActorAlign.CENTER,
            style_class: 'raven-np-meta',
        });
        this._titleLabel  = new St.Label({ text: '', style_class: 'raven-np-title' });
        this._artistLabel = new St.Label({ text: '', style_class: 'raven-np-artist' });
        this._titleLabel.clutter_text.set_ellipsize(3);
        this._artistLabel.clutter_text.set_ellipsize(3);
        meta.add_child(this._titleLabel);
        meta.add_child(this._artistLabel);

        // progress track (fill scaled horizontally by position/length)
        this._track = new St.BoxLayout({ x_expand: true, style_class: 'raven-np-track' });
        this._fill  = new St.Widget({ x_expand: true, y_expand: true, style_class: 'raven-np-fill' });
        this._fill.set_pivot_point(0, 0.5);
        this._fill.scale_x = 0;
        this._track.add_child(this._fill);
        meta.add_child(this._track);

        const times = new St.BoxLayout({ x_expand: true });
        this._posLabel = new St.Label({ text: '0:00', x_expand: true, style_class: 'raven-np-time' });
        this._lenLabel = new St.Label({ text: '0:00', style_class: 'raven-np-time' });
        times.add_child(this._posLabel);
        times.add_child(this._lenLabel);
        meta.add_child(times);

        main.add_child(meta);
        this._player.add_child(main);

        // controls
        const ctrl = new St.BoxLayout({ x_expand: true, style_class: 'raven-np-ctrl' });
        ctrl.add_child(new St.Widget({ x_expand: true }));
        this._prevBtn = this._iconButton('media-skip-backward-symbolic', 'raven-np-btn', () => this._media.prev());
        this._playBtn = this._iconButton('media-playback-start-symbolic', 'raven-np-btn raven-np-play', () => this._media.playPause());
        this._nextBtn = this._iconButton('media-skip-forward-symbolic', 'raven-np-btn', () => this._media.next());
        ctrl.add_child(this._prevBtn);
        ctrl.add_child(this._playBtn);
        ctrl.add_child(this._nextBtn);
        ctrl.add_child(new St.Widget({ x_expand: true }));
        this._player.add_child(ctrl);

        section.add_child(this._player);
        return section;
    }

    _iconButton(iconName, styleClass, onClick) {
        const btn = new St.Button({ style_class: styleClass, can_focus: true });
        btn.set_child(new St.Icon({ icon_name: iconName, icon_size: 18 }));
        btn.connect('clicked', onClick);
        return btn;
    }

    _refresh() {
        if (!this.actor) return;
        const has = this._media.hasPlayer;
        this._emptyLabel.visible = !has;
        this._player.visible     = has;
        if (!has) return;

        this._titleLabel.text  = this._media.title  || 'Unknown track';
        this._artistLabel.text = this._media.artist || '';
        this._artistLabel.visible = !!this._media.artist;

        // album art: only file:// is loaded directly; otherwise the gradient + note
        const url = this._media.artUrl;
        if (url && url.startsWith('file://')) {
            this._artIcon.gicon = new Gio.FileIcon({ file: Gio.File.new_for_uri(url) });
            this._artIcon.icon_size = 58;
        } else {
            this._artIcon.gicon = null;
            this._artIcon.icon_name = 'audio-x-generic-symbolic';
            this._artIcon.icon_size = 22;
        }

        this._playBtn.child.icon_name =
            this._media.playing ? 'media-playback-pause-symbolic' : 'media-playback-start-symbolic';

        const len = this._media.length;
        this._lenLabel.text = len > 0 ? fmtTime(len) : '';
        this._tickPosition();
    }

    _tickPosition() {
        if (!this._media.hasPlayer) return;
        const len = this._media.length;
        this._media.position(pos => {
            if (!this.actor) return;
            this._posLabel.text = fmtTime(pos);
            this._fill.scale_x = len > 0 ? Math.max(0, Math.min(1, pos / len)) : 0;
        });
    }
}
