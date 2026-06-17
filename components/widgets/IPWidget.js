import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import { BaseWidget } from '../BaseWidget.js';

export const CSS = `
.raven-ip-section {
    background-color: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 8px;
}
.raven-ip-header {
    spacing: 10px;
}
.raven-ip-icon {
    color: rgba(255,255,255,0.7);
}
.raven-ip-label {
    font-size: 10pt;
    color: rgba(255,255,255,0.75);
}
.raven-ip-address {
    font-size: 9pt;
    color: rgba(255,255,255,0.9);
    font-family: monospace;
}
.raven-ip-iface {
    font-size: 8pt;
    color: rgba(255,255,255,0.35);
    min-width: 0;
}
.raven-ip-row {
    spacing: 12px;
}
`;

export class IPWidget extends BaseWidget {
    constructor(deps) {
        super(deps);
        this.actor = this._build();
    }

    onSidebarOpen() {
        this.refresh();
    }

    refresh() {
        const addrs = this._getAddresses();
        this._refreshList(addrs);
    }

    _getAddresses() {
        try {
            const [ok, stdout] = GLib.spawn_sync(
                null,
                ['ip', '-4', 'addr', 'show'],
                null,
                GLib.SpawnFlags.SEARCH_PATH,
                null,
            );
            if (!ok || !stdout) return [];

            const text = new TextDecoder().decode(stdout);
            const addrs = [];
            for (const line of text.split('\n')) {
                const m = line.trim().match(/^inet\s+(\d+\.\d+\.\d+\.\d+)/);
                if (!m) continue;
                const ip = m[1];
                if (ip.startsWith('127.')) continue;
                addrs.push(ip);
            }
            return addrs;
        } catch (e) {
            console.error('[Raven] IPWidget:', e);
            return [];
        }
    }

    _refreshList(addrs) {
        this._list.destroy_all_children();

        if (addrs.length === 0) {
            this._list.add_child(new St.Label({
                text:        'No network',
                style_class: 'raven-ip-address',
                opacity:     120,
            }));
            return;
        }

        for (const ip of addrs) {
            const row = new St.BoxLayout({
                x_expand:    true,
                style_class: 'raven-ip-row',
            });
            row.add_child(new St.Label({
                text:        ip,
                x_expand:    true,
                style_class: 'raven-ip-address',
            }));
            this._list.add_child(row);
        }
    }

    _build() {
        const section = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-ip-section',
        });

        const header = new St.BoxLayout({ style_class: 'raven-ip-header' });
        header.add_child(new St.Icon({
            icon_name:   'network-wired-symbolic',
            icon_size:   16,
            style_class: 'raven-ip-icon',
        }));
        header.add_child(new St.Label({
            text:        'Network',
            x_expand:    true,
            style_class: 'raven-ip-label',
        }));
        section.add_child(header);

        this._list = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
        });
        section.add_child(this._list);

        return section;
    }
}
