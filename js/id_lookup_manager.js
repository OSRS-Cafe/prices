import { ItemDataHelper } from "./item_data_helper.js";
import { StorageManager } from "./storage_manager.js";

export class IDLookupManager {
    static start({ button_toggle, button_search, name_input, root_container, results, refresh_table_func }) {
        button_toggle.onclick = () => {
            switch(root_container.style.display) {
                case "none": root_container.style.display = ""; break;
                case "": root_container.style.display = "none"; break;
            }
        }
        //TODO: Only enable button after loading data once?
        button_search.onclick = () => {
            const search_value = name_input.value.toLowerCase();
            const search_results = ItemDataHelper.data.filter(item => item.name.toLowerCase().includes(search_value));

            results.innerHTML = "";

            if(search_results.length === 0){
                results.innerText = "No items found.";
                return;
            }

            const rows = [];
            const headers = [ "Name", "ID", "" ].map(
                (string) => $c_table_header({ text: string })
            );
            rows.push(headers);

            search_results.forEach((item) => {
                const row = [
                    $c_table_data({ text: item.name }),
                    $c_table_data({ text: item.id }),
                    $c_table_data({ child: $c_button({
                        text: "Add",
                        onclick: () => {
                            const added = StorageManager.get_active_collection().push_item(item.id);
                            if(!added) window.alert("No space!");
                            refresh_table_func();
                        }
                    })})
                ];
                rows.push(row);
            });
            $c_table({ rows: rows, parent: results, align: "center" });
        }
    }
}