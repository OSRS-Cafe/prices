import { StorageManager } from "./storage_manager.js";
import { TableHelper } from "./table_helper.js";
import { RefreshManager } from "./refresh_manager.js";
import { FocusHelper } from "./focus_helper.js";

//Enforce HTTPS (https://stackoverflow.com/a/4723302)
if (location.host !== "127.0.0.1" && location.protocol !== 'https:' && location.protocol !== 'file:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

const table_helper = new TableHelper({
    table_element: document.getElementById("inv")
})

function set_item_func(x, y, item) {
    StorageManager.get_active_collection().add_item(x, y, item);
}

function refresh_table_func() {
    if(!StorageManager.is_empty()) {
        table_helper.create_table(StorageManager.get_active_collection(), set_item_func, refresh_table_func);
    } else {
        table_helper.remove_table();
    }
    StorageManager.save(); //TODO: Not the most optimal location
}

StorageManager.init({
    collection_dropdown: document.getElementById("collection-dropdown"),
    collection_edit: document.getElementById("collection-edit"),
    collection_remove: document.getElementById("collection-remove"),
    collection_add: document.getElementById("collection-add"),
    collection_add_custom: document.getElementById("collection-add-custom"),
    state_change_func: () => { refresh_table_func(); }
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
