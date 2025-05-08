import { StorageManager } from "./storage_manager.js";

export class FocusHelper {
    static #focused = true;

    static start() {
        window.onfocus = () => {
            StorageManager.load(true);
            this.#focused = true;
        };
        window.onblur = () => {
            StorageManager.save();
            this.#focused = false;
        };
    }

    static is_focused = () => this.#focused;
}