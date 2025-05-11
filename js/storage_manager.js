export class ItemCollection {
    name;
    width;
    height;
    items;

    constructor(name = "New Collection", width = 4, height = 7) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.items = [];
        for(let y = 0; y < height; y++) {
            const current = []
            for(let x = 0; x < width; x++) {
                current[x] = null;
            }
            this.items[y] = current;
        }
    }

    set_item(x, y, item_id) {
        this.items[y][x] = item_id;
    }

    get_item(x, y) {
        return this.items[y][x];
    }

    iterate_items(action) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                const result = action({
                    x: x,
                    y: y,
                    item_id: this.get_item(x, y)
                })
                if(result === true) return;
            }
        }
    }

    push_item(item_id) {
        let added = false;
        this.iterate_items((data) => {
            if(data.item_id == null) {
                this.set_item(data.x, data.y, item_id);
                added = true;
                return true; //This breaks out of the loop of iterate_items
            }
        });
        return added;
    }

    static from_json(json) {
        const new_collection = new ItemCollection(json.name, json.width, json.height);
        new_collection.items = json.items;
        return new_collection;
    }
}

export class StorageManager {
    static #collections = [];
    static active_index = 0;

    static #collection_dropdown;
    static #collection_edit;
    static #collection_remove;
    static #collection_add;
    static #state_change_func

    static init({
        collection_dropdown,
        collection_edit,
        collection_remove,
        collection_add,
        collection_add_custom,
        state_change_func
    }) {
        this.#collection_dropdown = collection_dropdown;
        this.#collection_edit = collection_edit;
        this.#collection_remove = collection_remove;
        this.#collection_add = collection_add;
        this.#state_change_func = state_change_func;

        this.#collection_dropdown.onchange = (e) => {
            this.active_index = this.#collection_dropdown.value;
            state_change_func();
        }

        this.#collection_remove.onclick = () => {
            this.#collections.splice(this.active_index, 1);
            this.active_index--;
            this.active_index = Math.max(this.active_index, 0);
            this.refresh_ui();
            state_change_func();
        };

        this.#collection_add.onclick = () => {
            this.active_index = this.#collections.push(new ItemCollection()) - 1;
            this.refresh_ui();
            state_change_func();
        };

        collection_add_custom.onclick = () => {
            const name = window.prompt("Name", "New Collection") ?? "New Collection";
            const width = parseInt(window.prompt("Width", "4"));
            const height = parseInt(window.prompt("Height", "7"));
            if(isNaN(width) || isNaN(height)) {
                window.alert("Bad width or height!");
                return;
            }

            this.active_index = this.#collections.push(new ItemCollection(name, width, height)) - 1;
            this.refresh_ui();
            state_change_func();
        };

        this.#collection_edit.onclick = () => {
            this.#collections[this.active_index].name = window.prompt("Enter collection name") ?? "Collection";
            this.refresh_ui();
        };

        let saved_data = localStorage.getItem("collections");
        if(saved_data == null){
            const collections_temp = [];
            const collection = new ItemCollection();
            collections_temp.push(collection);
            saved_data = JSON.stringify(collections_temp);
            localStorage.setItem("collections", saved_data);
        }
        this.load();
    }

    static is_empty = () => this.#collections.length === 0;

    static save() {
        localStorage.setItem("collections", JSON.stringify(this.#collections));
    }

    static load(refresh = false) {
        this.#collections = JSON.parse(localStorage.getItem("collections")).map(json_collection => ItemCollection.from_json(json_collection));
        //TODO: This is done so that we can call this while we may not have the data yet needed for refreshing, eg item data
        //There should be a more clean solution to calling these while the data may not be there yet...
        //This is a hack!
        if(refresh) {
            this.refresh_ui();
            this.#state_change_func();
        }
    }

    static get_active_collection() {
        return this.#collections[this.active_index];
    }

    static refresh_ui() {
        const coll = this.#collections;
        this.#collection_edit.disabled = coll.length === 0;
        this.#collection_dropdown.disabled = coll.length === 0;
        this.#collection_remove.disabled = coll.length === 0;
        this.#collection_dropdown.innerHTML = "";
        coll.forEach((collection, i) => {
            const new_item = document.createElement("option");
            new_item.value = i;
            new_item.innerText = collection.name;
            this.#collection_dropdown.appendChild(new_item);
        })
        this.#collection_dropdown.value = this.active_index;
        this.save(); //TODO: Not the most optimal location
    }
}