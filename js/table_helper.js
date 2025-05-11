import { ItemDataHelper } from "./item_data_helper.js";
import { StorageManager } from "./storage_manager.js";
import { APIEnvironment } from "./api_environment.js";

export class TableHelper {
    constructor({ table_element }) {
        this.table_element = table_element;
    }

    create_table(table, set_item_func, refresh_table_func) {
        this.remove_table();
        for(let y = 0; y < table.height; y++) {
            const row = document.createElement("tr");
            for(let x = 0; x < table.width; x++) {
                const cell = document.createElement('td');
                cell.classList.add("inv-cell");
                const item_id = table.get_item(x, y);
                if(item_id != null) {
                    this.#add_item_to_cell(cell, item_id, x, y, set_item_func, refresh_table_func);
                } else {
                    this.#add_empty_to_cell(cell, x, y, set_item_func, refresh_table_func);
                }
                row.appendChild(cell);
            }
            this.table_element.appendChild(row);
        }
    }

    #add_empty_to_cell(cell, x, y, set_item_func, refresh_table_func) {
        const item_container = document.createElement("div");
        item_container.classList.add("item-cell", "container");
        item_container.ondragover = e => e.preventDefault()
        item_container.ondrop = (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData("item"));
            set_item_func(data.x, data.y, null);
            set_item_func(x, y, data.item_id);
            refresh_table_func();
        }
        item_container.onclick = () => {
            const new_item_id = window.prompt("Enter item ID");
            if(new_item_id != null) {
                if(ItemDataHelper.get_item(new_item_id) == null) {
                    window.alert("Item not found");
                    return;
                }
                set_item_func(x, y, new_item_id);
                refresh_table_func();
            }
        }
        cell.appendChild(item_container);
    }

    #add_item_to_cell(cell, item_id, x, y, set_item_func, refresh_table_func) {
        const item_data = ItemDataHelper.get_item(item_id);
        if(item_data == null) {
            console.error("Item id not valid", item_id);
            set_item_func(x, y, null);
            refresh_table_func(); //TODO: This causes errors for some reason, has worked before. Now it duplicates the table. Check out why!
            return;
        }
        const item_container = document.createElement("div");
        item_container.classList.add("item-cell", "container", "item");
        item_container.draggable = true;
        item_container.ondrop = (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData("item"));
            set_item_func(data.x, data.y, item_id);
            set_item_func(x, y, data.item_id);
            refresh_table_func();
        }
        item_container.ondragstart = (e) => {
            e.dataTransfer.setData("item", JSON.stringify({
                x: x,
                y: y,
                item_id: item_id
            }));
        };

        item_container.ondragover = e => e.preventDefault()

        const item_name = document.createElement("p");
        item_name.classList.add("item-cell", "name");
        item_name.textContent = item_data.name;
        item_container.appendChild(item_name);

        const item_icon = document.createElement("img");
        item_icon.classList.add("item-cell", "icon");
        item_icon.src = new URL(`/ge/icon/${item_id}`, APIEnvironment).href;
        item_icon.draggable = false;
        item_icon.oncontextmenu = e => e.preventDefault()
        item_container.appendChild(item_icon);

        const price_format = new Intl.NumberFormat("de-DE");

        const item_price_high = document.createElement("p");
        item_price_high.classList.add("item-cell", "price", "high");
        item_price_high.innerText = `⬆️${price_format.format(item_data.high)}`;
        item_container.appendChild(item_price_high);

        const item_price_low = document.createElement("p");
        item_price_low.classList.add("item-cell", "price", "low");
        item_price_low.innerText = `⬇️${price_format.format(item_data.low)}`;
        item_container.appendChild(item_price_low);

        const item_delete_button = document.createElement("button");
        item_delete_button.innerText = "Delete";
        item_delete_button.style.display = "none";
        item_delete_button.onclick = () => {
            StorageManager.get_active_collection().set_item(x, y, null);
            refresh_table_func(); //This function handles saving inside app.js. TODO: This should probably be handled more clearly
        }
        item_container.appendChild(item_delete_button);

        const delete_trigger = () => {
            item_delete_button.style.display = "";
            setTimeout(() => {
                item_delete_button.style.display = "none";
            }, 3000);
        }

        item_container.ontouchstart = delete_trigger;
        item_container.onclick = delete_trigger;

        cell.appendChild(item_container);
    }

    remove_table() {
        this.table_element.innerHTML = "";
    }
}