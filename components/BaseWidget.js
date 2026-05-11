import { Component } from './Component.js';

export class BaseWidget extends Component {
    static get id() {
        if (this === BaseWidget) return null;
        let name = this.name;
        name = name.replace(/(?:Widget|Section)$/, '');
        return name.charAt(0).toLowerCase() + name.slice(1);
    }

    static isAvailable(/** @type {object} */ _deps) {
        return true;
    }

    constructor(/** @type {object} */ _deps) {
        super();
    }

    onSidebarOpen() {}

    onSidebarClose() {}
}