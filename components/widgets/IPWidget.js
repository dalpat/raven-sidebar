import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { BaseWidget } from '../BaseWidget.js';

export const CSS = `
.raven-ip-section {
    background-color: st-transparentize(-st-accent-color, 0.93);
    border-radius: 12px;
    padding: 14px 16px;
    spacing: 8px;
}
.raven-ip-header {
    spacing: 10px;
}
.raven-ip-label {
    font-size: 10pt;
}
.raven-ip-address {
    font-size: 9pt;
    font-family: monospace;
}
.raven-ip-iface {
    font-size: 8pt;
    min-width: 0;
}
.raven-ip-row {
    spacing: 12px;
}
`;

// Network addresses, read from the shared NetworkService (NetworkManager) rather
// than spawning `ip` — no blocking subprocess on the compositor thread.
export class IPWidget extends BaseWidget {
    static get section() { return 'Network'; }

    constructor(deps) {
        super(deps);
        this._net = deps?.net ?? null;
        this.actor = this._build();
        if (this._net) this._unsub = this._net.onChange(() => this.refresh());
        this.refresh();
    }

    onSidebarOpen() {
        this.refresh();
    }

    refresh() {
        if (!this.actor) return;
        this._refreshList(this._net?.addresses ?? []);
    }

    destroy() {
        try { this._unsub?.(); } catch (_) {}
        super.destroy();
    }

    // --- private ---

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
