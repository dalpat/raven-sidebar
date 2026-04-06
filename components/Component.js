// Base class for all Raven components.
//
// Provides:
//  - _connect(obj, signal, handler): tracks GObject signal for auto-disconnect
//  - destroy(): disconnects all tracked signals and destroys this.actor
//
// Usage:
//   class MyWidget extends Component {
//       constructor() {
//           super();
//           this.actor = this._build();
//       }
//   }

export class Component {
    constructor() {
        this._signals = []; // [{ obj, id }]
        this.actor = null;
    }

    // Track a signal on an external GObject. Automatically disconnected in destroy().
    // Do NOT use this for signals on actors you own — Clutter cleans those up when
    // the actor is destroyed.
    _connect(obj, signal, handler) {
        const id = obj.connect(signal, handler);
        this._signals.push({ obj, id });
        return id;
    }

    _disconnectAll() {
        for (const { obj, id } of this._signals)
            try { obj.disconnect(id); } catch (_) {}
        this._signals = [];
    }

    destroy() {
        this._disconnectAll();
        if (this.actor) {
            this.actor.destroy();
            this.actor = null;
        }
    }
}
