import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { Component } from './Component.js';

const BAR_H      = 6;
const TRACK_H    = 22;
const RADIUS     = 3;
const THUMB_R    = 7;

// ─── Styles ───────────────────────────────────────────────────────────────────
// The Cairo paint can't read CSS colours directly. A hidden probe actor carries
// the system accent on a *standard* property (background-color), which the paint
// reads back as a resolved colour from its theme node. Track/thumb use the themed
// foreground. Nothing is hardcoded — see _build / _onRepaint.
export const CSS = `
.raven-slider-track {
    height: ${TRACK_H}px;
}
.raven-slider-accent {
    background-color: -st-accent-color;
}
`;

// Normalise a themed colour (Clutter.Color is 0–255, Cogl.Color is 0–1) to the
// 0–1 floats Cairo expects.
function toRGBA(c, alpha) {
    const scale = (c.red > 1 || c.green > 1 || c.blue > 1) ? 255 : 1;
    const a = alpha ?? (c.alpha > 1 ? c.alpha / 255 : c.alpha);
    return [c.red / scale, c.green / scale, c.blue / scale, a];
}

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
        // Hidden probe: carries the system accent so the Cairo paint can read a
        // resolved colour from a standard themed property (background-color).
        this._accentProbe = new St.Widget({
            style_class: 'raven-slider-accent',
            width: 0, height: 0,
        });
        canvas.add_child(this._accentProbe);
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

        // Colours from the system theme: accent for the fill, themed foreground
        // (faint) for the track, themed foreground (opaque) for the thumb.
        const fg   = area.get_theme_node().get_foreground_color();
        let accent = fg;
        try { accent = this._accentProbe.get_theme_node().get_background_color(); } catch (_) {}

        // Track background
        cr.setSourceRGBA(...toRGBA(fg, 0.22));
        rrect(0, barY, w, BAR_H);
        cr.fill();

        // Filled portion — system accent
        const fillW = w * this._value;
        if (fillW > 0) {
            cr.setSourceRGBA(...toRGBA(accent));
            rrect(0, barY, fillW, BAR_H);
            cr.fill();
        }

        // Thumb — themed foreground, reads on the fill and the track alike
        const thumbR = THUMB_R;
        const thumbX = Math.max(thumbR, Math.min(w - thumbR, fillW));
        cr.arc(thumbX, h / 2, thumbR, 0, 2 * Math.PI);
        cr.setSourceRGBA(...toRGBA(fg, 1));
        cr.fill();

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
