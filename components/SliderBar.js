import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { Component } from './Component.js';

const BAR_H      = 6;
const TRACK_H    = 22;
const RADIUS     = 3;
const FILL_COLOR = [0.424, 0.561, 1.0, 1.0]; // #6c8fff

// ─── Styles ───────────────────────────────────────────────────────────────────
export const CSS = `
.raven-slider-track {
    height: ${TRACK_H}px;
}
`;

// Custom Cairo-drawn slider. Props: { onChange(value: 0–1) }
// API: getValue(), setValue(v)
export class SliderBar extends Component {
    constructor({ onChange } = {}) {
        super();
        this._value    = 0;
        this._dragging = false;
        this._onChange = onChange ?? (() => {});
        this.actor     = this._build();
    }

    getValue() { return this._value; }

    setValue(v) {
        this._value = Math.max(0, Math.min(1, v));
        this.actor.queue_repaint();
    }

    // --- private ---

    _build() {
        const canvas = new St.DrawingArea({
            x_expand:    true,
            reactive:    true,
            style_class: 'raven-slider-track',
        });
        // Signals on own actor — not tracked; Clutter cleans up on actor destroy.
        canvas.connect('repaint',              area        => this._onRepaint(area));
        canvas.connect('button-press-event',   (_a, event) => this._onPress(event));
        canvas.connect('motion-event',         (_a, event) => this._onMotion(event));
        canvas.connect('button-release-event', ()          => {
            this._dragging = false;
            return Clutter.EVENT_STOP;
        });
        return canvas;
    }

    _onRepaint(area) {
        const cr         = area.get_context();
        const [w, h]     = area.get_surface_size();
        const barY       = (h - BAR_H) / 2;

        const rrect = (x, y, rw, rh) => {
            const rc = Math.min(RADIUS, rw / 2, rh / 2);
            cr.newPath();
            cr.arc(x + rc,      y + rc,      rc, Math.PI,       1.5 * Math.PI);
            cr.arc(x + rw - rc, y + rc,      rc, 1.5 * Math.PI, 2   * Math.PI);
            cr.arc(x + rw - rc, y + rh - rc, rc, 0,             0.5 * Math.PI);
            cr.arc(x + rc,      y + rh - rc, rc, 0.5 * Math.PI, Math.PI);
            cr.closePath();
        };

        // Track background
        cr.setSourceRGBA(1, 1, 1, 0.18);
        rrect(0, barY, w, BAR_H);
        cr.fill();

        // Filled portion
        const fillW = w * this._value;
        if (fillW > 0) {
            cr.setSourceRGBA(...FILL_COLOR);
            rrect(0, barY, fillW, BAR_H);
            cr.fill();
        }

        cr.$dispose();
    }

    _valueFromEvent(event) {
        const [evX]    = event.get_coords();
        const [trackW] = this.actor.get_transformed_size();
        const [trackX] = this.actor.get_transformed_position();
        return Math.max(0, Math.min(1, (evX - trackX) / trackW));
    }

    _onPress(event) {
        this._dragging = true;
        const val = this._valueFromEvent(event);
        this.setValue(val);
        this._onChange(val);
        return Clutter.EVENT_STOP;
    }

    _onMotion(event) {
        if (!this._dragging) return Clutter.EVENT_PROPAGATE;
        const val = this._valueFromEvent(event);
        this.setValue(val);
        this._onChange(val);
        return Clutter.EVENT_STOP;
    }
}
