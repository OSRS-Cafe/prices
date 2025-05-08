export class FocusHelper {
    static #focused = true;

    static start() {
        document.onfocus = () => { this.#focused = true; };
        document.onblur = () => { this.#focused = false; };
    }

    static is_focused = () => this.#focused;
}