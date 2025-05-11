import { StorageManager } from "./storage_manager.js";
import { TableHelper } from "./table_helper.js";
import { RefreshManager } from "./refresh_manager.js";
import { FocusHelper } from "./focus_helper.js";
import { IDLookupManager } from "./id_lookup_manager.js";

//Enforce HTTPS (https://stackoverflow.com/a/4723302)
if (location.host !== "127.0.0.1" && location.protocol !== 'https:' && location.protocol !== 'file:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

const table_helper = new TableHelper({
    table_element: $id("inv")
})

function set_item_func(x, y, item) {
    StorageManager.get_active_collection().set_item(x, y, item);
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
    collection_dropdown: $id("collection-dropdown"),
    collection_edit: $id("collection-edit"),
    collection_remove: $id("collection-remove"),
    collection_add: $id("collection-add"),
    collection_add_custom: $id("collection-add-custom"),
    state_change_func: () => { refresh_table_func(); }
});
StorageManager.refresh_ui();

RefreshManager.start({
    countdown_label: $id("refresh-countdown"),
    refresh_button: $id("refresh-countdown-button"),
    table_refresh_func: refresh_table_func
});

FocusHelper.start();

IDLookupManager.start({
    button_toggle: $id("id-lookup-button-toggle"),
    button_search: $id("id-lookup-button-search"),
    name_input: $id("id-lookup-name-search"),
    root_container: $id("id-lookup-root"),
    results: $id("id-lookup-results"),
    refresh_table_func: refresh_table_func
});
