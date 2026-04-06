import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { Component } from './Component.js';

const ELLIPSIZE_END = 3; // Pango.EllipsizeMode.END (Pango not imported to avoid crash)

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-notif-item {
    background-color: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 12px 14px;
    spacing: 12px;
}
.raven-notif-icon {
    color: rgba(255,255,255,0.7);
}
.raven-notif-icon-fallback {
    color: rgba(255,255,255,0.45);
}
.raven-notif-text-box {
    spacing: 3px;
}
.raven-notif-title {
    font-size: 10pt;
    font-weight: 600;
    color: #ffffff;
}
.raven-notif-body {
    font-size: 9pt;
    color: rgba(255,255,255,0.42);
    line-height: 1.4;
}
.raven-dismiss-btn {
    padding: 4px 6px;
    border-radius: 6px;
    background-color: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.28);
    transition-duration: 120ms;
}
.raven-dismiss-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
}
.raven-dismiss-icon {
    color: rgba(255,255,255,0.5);
}
`;

// Stateless single-notification row. Props: { notification }
// Dismiss button calls notification.destroy(), which signals the parent list.
export class NotificationItem extends Component {
    constructor({ notification }) {
        super();
        this._notification = notification;
        this.actor         = this._build();
    }

    // --- private ---

    _build() {
        const item = new St.BoxLayout({
            x_expand:    true,
            style_class: 'raven-notif-item',
        });

        // Icon
        const icon = this._notification.gicon
            ? new St.Icon({ gicon: this._notification.gicon, icon_size: 20,
                            style_class: 'raven-notif-icon' })
            : new St.Icon({ icon_name: 'dialog-information-symbolic', icon_size: 20,
                            style_class: 'raven-notif-icon-fallback' });
        item.add_child(icon);

        // Title + body
        const textBox = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            x_expand:    true,
            style_class: 'raven-notif-text-box',
        });
        textBox.add_child(new St.Label({
            text:        this._notification.title || 'Notification',
            x_expand:    true,
            style_class: 'raven-notif-title',
        }));
        if (this._notification.body) {
            const body = new St.Label({
                text:        this._notification.body,
                x_expand:    true,
                style_class: 'raven-notif-body',
            });
            body.clutter_text.set_line_wrap(true);
            body.clutter_text.set_ellipsize(ELLIPSIZE_END);
            textBox.add_child(body);
        }
        item.add_child(textBox);

        // Dismiss button — calls notification.destroy(), which fires 'destroy' signal
        // that NotificationList listens to for removal
        const dismiss = new St.Button({
            style_class: 'raven-dismiss-btn',
            child: new St.Icon({
                icon_name:   'window-close-symbolic',
                icon_size:   14,
                style_class: 'raven-dismiss-icon',
            }),
        });
        dismiss.connect('clicked', () => this._notification.destroy());
        item.add_child(dismiss);

        return item;
    }
}
