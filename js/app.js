import { StorageManager } from "./storage_manager.js";
import { TableHelper } from "./table_helper.js";
import { RefreshManager } from "./refresh_manager.js";
import { FocusHelper } from "./focus_helper.js";

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

StorageManager.init({
    collection_dropdown: document.getElementById("collection-dropdown"),
    collection_edit: document.getElementById("collection-edit"),
    collection_remove: document.getElementById("collection-remove"),
    collection_add: document.getElementById("collection-add"),
    state_change_func: () => { console.log("State changed, holy moly!"); }
});
StorageManager.refresh_ui();

RefreshManager.start({
    countdown_label: document.getElementById("refresh-countdown"),
    refresh_button: document.getElementById("refresh-countdown-button"),
    table_refresh_func: refresh_table_func
});

FocusHelper.start();

document.getElementById("id-lookup-button").onclick = () => {
    window.open('/idlookup.html','idlookup','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
};
