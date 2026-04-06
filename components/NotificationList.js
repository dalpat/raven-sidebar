import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Component } from './Component.js';
import { NotificationItem } from './NotificationItem.js';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-notif-list {
    spacing: 4px;
}
.raven-notif-list-header {
    spacing: 8px;
    margin-bottom: 4px;
}
.raven-notif-count-label {
    font-size: 7.5pt;
    font-weight: bold;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1.5px;
}
.raven-notif-items {
    spacing: 4px;
}
.raven-notif-empty {
    font-size: 10pt;
    color: rgba(255,255,255,0.22);
    padding: 24px 0;
    text-align: center;
}
.raven-clear-btn {
    font-size: 8pt;
    color: rgba(255, 255, 255, 0.6);
    padding: 4px 10px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    transition-duration: 120ms;
}
.raven-clear-btn:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.16);
}
`;

// Live notification list. Connects to MessageTray signals and manages NotificationItem
// instances. Call refresh() to pick up any notifications that arrived while hidden.
export class NotificationList extends Component {
    constructor() {
        super();
        this._entries         = []; // [{ notification, item: NotificationItem, signalIds: [] }]
        this._sourceSignalIds = new Map(); // source → [signalId]
        this.actor            = this._build();
        this._connectTray();
    }

    // Re-scan all existing tray sources. Safe to call multiple times (deduped internally).
    refresh() {
        for (const source of Main.messageTray.getSources())
            for (const notif of source.notifications)
                this._add(notif);
    }

    destroy() {
        // Disconnect per-source signals (not tracked via _connect)
        for (const [source, ids] of this._sourceSignalIds)
            for (const id of ids) try { source.disconnect(id); } catch (_) {}
        this._sourceSignalIds.clear();

        // Disconnect per-notification signals and destroy items
        for (const entry of this._entries) {
            for (const id of entry.signalIds)
                try { entry.notification.disconnect(id); } catch (_) {}
            entry.item.destroy(); // also unparents item.actor from _list
        }
        this._entries = [];

        // super.destroy() disconnects messageTray signals (_connect) and destroys this.actor
        super.destroy();
    }

    // --- private ---

    _build() {
        const box = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-notif-list',
        });

        // Header row
        const headerBox = new St.BoxLayout({ style_class: 'raven-notif-list-header' });
        this._countLabel = new St.Label({
            text:        'NOTIFICATIONS',
            x_expand:    true,
            style_class: 'raven-notif-count-label',
        });
        headerBox.add_child(this._countLabel);

        this._clearBtn = new St.Button({
            label:       'Clear all',
            style_class: 'raven-clear-btn',
            visible:     false,
        });
        this._clearBtn.connect('clicked', () => this._clearAll());
        headerBox.add_child(this._clearBtn);
        box.add_child(headerBox);

        // Item list
        this._list = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-notif-items',
        });
        box.add_child(this._list);

        // Empty state
        this._emptyLabel = new St.Label({
            text:        'No notifications',
            style_class: 'raven-notif-empty',
        });
        box.add_child(this._emptyLabel);

        return box;
    }

    _connectTray() {
        // _connect() tracks these for auto-disconnect in super.destroy()
        this._connect(Main.messageTray, 'source-added',
            (_tray, source) => this._listenToSource(source));
        this._connect(Main.messageTray, 'source-removed',
            (_tray, source) => this._unlistenSource(source));

        for (const source of Main.messageTray.getSources())
            this._listenToSource(source);
    }

    _listenToSource(source) {
        if (this._sourceSignalIds.has(source)) return;
        const ids = [
            source.connect('notification-added',   (_s, n) => this._add(n)),
            source.connect('notification-removed', (_s, n) => this._remove(n)),
        ];
        for (const n of source.notifications) this._add(n);
        this._sourceSignalIds.set(source, ids);
    }

    _unlistenSource(source) {
        const ids = this._sourceSignalIds.get(source);
        if (!ids) return;
        for (const id of ids) try { source.disconnect(id); } catch (_) {}
        this._sourceSignalIds.delete(source);
    }

    _add(notification) {
        if (this._entries.find(e => e.notification === notification)) return;
        const item      = new NotificationItem({ notification });
        const signalIds = [
            notification.connect('destroy', () => this._remove(notification)),
        ];
        this._entries.push({ notification, item, signalIds });
        this._list.add_child(item.actor);
        this._updateUI();
    }

    _remove(notification) {
        const idx = this._entries.findIndex(e => e.notification === notification);
        if (idx < 0) return;
        const entry = this._entries[idx];
        for (const id of entry.signalIds)
            try { notification.disconnect(id); } catch (_) {}
        this._list.remove_child(entry.item.actor);
        entry.item.destroy();
        this._entries.splice(idx, 1);
        this._updateUI();
    }

    _clearAll() {
        for (const { notification } of [...this._entries])
            try { notification.destroy(); } catch (_) { this._remove(notification); }
    }

    _updateUI() {
        const count              = this._entries.length;
        this._emptyLabel.visible = count === 0;
        this._clearBtn.visible   = count > 0;
        this._countLabel.text    = count > 0 ? `NOTIFICATIONS  (${count})` : 'NOTIFICATIONS';
    }
}
