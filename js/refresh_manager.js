import { ItemDataHelper } from "./item_data_helper.js";
import { FocusHelper } from "./focus_helper.js";

export class RefreshManager {
    static #refresh_time = 60;
    static #refresh_countdown = -1;
    static #countdown_label;
    static #refresh_button;
    static #table_refresh_func;
    static #refreshing = false;

    static #tick() {
        if(this.#refresh_countdown < 0) {
            this.#countdown_label.innerText = "Loading...";
            if(!this.#refreshing && FocusHelper.is_focused()) {
                this.#refreshing = true;
                ItemDataHelper.refresh_data().then(() => {
                    this.#table_refresh_func();
                    this.#refresh_countdown = this.#refresh_time;
                    this.#refresh_button.title = `Last refreshed: ${new Date().toString()}`;
                    this.#refreshing = false;
                });
            }
        } else {
            this.#countdown_label.innerText = `${this.#refresh_countdown}`;
            this.#refresh_countdown--;
        }
    }

    static #reset() {
        this.#refresh_countdown = -1;
        this.#tick();
    }

    static start({ countdown_label, refresh_button, table_refresh_func }) {
        console.log("[RefreshManager] init");
        this.#countdown_label = countdown_label;
        this.#refresh_button = refresh_button;
        this.#table_refresh_func = table_refresh_func;

        window.setInterval(() => { RefreshManager.#tick(); }, 1000);
        refresh_button.onclick = () => { RefreshManager.#reset(); };

        this.#reset();
    }
}