import { StorageManager } from "./storage_manager.js";
import { TableHelper } from "./table_helper.js";
import { RefreshManager } from "./refresh_manager.js";

const table_helper = new TableHelper({
    table_element: document.getElementById("inv")
})

const dev_table_data = {
    width: 4,
    height: 7,
    items: []
}
for(let y = 0; y < dev_table_data.height; y++) {
    const current = []
    for(let x = 0; x < dev_table_data.width; x++) {
        current[x] = null;
    }
    dev_table_data.items[y] = current;
}
dev_table_data.items[0][0] = 1965;
dev_table_data.items[2][2] = 1521;


function set_item_func(x, y, item) {
    dev_table_data.items[y][x] = item;
}

function refresh_table_func() {
    table_helper.create_table(dev_table_data, set_item_func, refresh_table_func);
}

StorageManager.init();
RefreshManager.start({
    countdown_label: document.getElementById("refresh-countdown"),
    refresh_button: document.getElementById("refresh-countdown-button"),
    table_refresh_func: refresh_table_func
});
