import { ItemDataHelper } from "./item_data_helper.js";
import { StorageManager } from "./storage_manager.js";

export class TableHelper {
    constructor({ table_element }) {
        this.table_element = table_element;
    }

    create_table(table, set_item_func, refresh_table_func) {
        this.table_element.innerHTML = "";
        for(let y = 0; y < table.height; y++) {
            const row = document.createElement("tr");
            for(let x = 0; x < table.width; x++) {
                const cell = document.createElement('td');

                const item_id = table.items[y][x];
                if(item_id != null) {
                    this.add_item_to_cell(cell, item_id, x, y, set_item_func, refresh_table_func);
                } else {
                    const item_container = document.createElement("div");
                    item_container.style.width = "64px";
                    item_container.style.height = "96px";
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

                row.appendChild(cell);
            }
            this.table_element.appendChild(row);
        }
    }

    add_item_to_cell(cell, item_id, x, y, set_item_func, refresh_table_func) {
        const item_data = ItemDataHelper.get_item(item_id);
        if(item_data == null) {
            console.error("Item id not valid", item_id);
            set_item_func(x, y, null);
            refresh_table_func(); //TODO: This causes errors for some reason, has worked before. Now it duplicates the table. Check out why!
            return;
        }
        const item_container = document.createElement("div");
        item_container.style.zIndex = "50";
        item_container.style.cursor = "move";
        item_container.draggable = true;
        item_container.style.touchAction = "none";
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

        item_container.style.width = "64px";
        item_container.style.height = "96px";

        const item_name = document.createElement("p");
        item_name.style.margin = "0 auto";
        item_name.style.fontSize = "14px";
        item_name.textContent = item_data.name;
        item_name.style.userSelect = "none";
        item_container.appendChild(item_name);

        const item_icon = document.createElement("img");
        item_icon.src = `https://api-dev.osrs.cafe/ge/icon/${item_id}`;//"img/coins.webp";
        item_icon.draggable = false;
        item_icon.style.touchAction = "none";
        item_icon.style.userSelect = "none";
        item_icon.oncontextmenu = e => e.preventDefault()
        item_container.appendChild(item_icon);

        const item_price_high = document.createElement("p");
        item_price_high.style.margin = "0 auto";
        item_price_high.style.fontSize = "12px";
        item_price_high.innerText = `⬆️${item_data.high}`;
        item_price_high.style.userSelect = "none";
        item_container.appendChild(item_price_high);

        const item_price_low = document.createElement("p");
        item_price_low.style.margin = "0 auto";
        item_price_low.style.fontSize = "12px";
        item_price_low.innerText = `⬇️${item_data.low}`;
        item_price_low.style.userSelect = "none";
        item_container.appendChild(item_price_low);

        const item_delete_button = document.createElement("button");
        item_delete_button.innerText = "Delete";
        item_delete_button.style.display = "none";
        item_delete_button.onclick = () => {
            StorageManager.get_active_collection().add_item(x, y, null);
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