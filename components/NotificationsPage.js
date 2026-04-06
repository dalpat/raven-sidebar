import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { Component } from './Component.js';
import { NotificationList } from './NotificationList.js';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-notifs-content {
    padding: 16px;
    spacing: 8px;
}
`;

// Notifications tab: scroll view wrapping a live NotificationList.
export class NotificationsPage extends Component {
    constructor() {
        super();
        this._list = new NotificationList();
        this.actor = this._build();
    }

    // Call when this tab becomes visible to pick up missed notifications.
    onVisible() {
        this._list.refresh();
    }

    destroy() {
        this._list.destroy();
        super.destroy();
    }

    // --- private ---

    _build() {
        const scroll = new St.ScrollView({
            hscrollbar_policy:  St.PolicyType.NEVER,
            vscrollbar_policy:  St.PolicyType.AUTOMATIC,
            overlay_scrollbars: true,
            x_expand:           true,
            y_expand:           true,
        });

        const content = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-notifs-content',
        });
        content.add_child(this._list.actor);
        scroll.add_child(content);
        return scroll;
    }
}
