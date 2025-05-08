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
        for(let y = 0; y < width; y++) {
            const current = []
            for(let x = 0; x < height; x++) {
                current[x] = null;
            }
            this.items[y] = current;
        }
    }

    add_item(x, y, item_id) {
        this.items[y][x] = item_id;
    }

    to_json() {
        return JSON.stringify(this);
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

    static init({
        collection_dropdown,
        collection_edit,
        collection_remove,
        collection_add,
        state_change_func
    }) {
        this.#collection_dropdown = collection_dropdown;
        this.#collection_edit = collection_edit;
        this.#collection_remove = collection_remove;
        this.#collection_add = collection_add;

        this.#collection_dropdown.onchange = (e) => {
            this.active_index = this.#collection_dropdown.value;
            state_change_func();
        }

        this.#collection_remove.onclick = () => {
            this.#collections.splice(this.active_index, 1);
            this.active_index = 0; //TODO: Would be nicer to not go to 0, but n - 1 :,)
            this.refresh_ui();
        };

        this.#collection_add.onclick = () => {
            this.#collections.push(new ItemCollection());
            this.refresh_ui();
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
        this.#collections = JSON.parse(saved_data).map(json_collection => ItemCollection.from_json(json_collection));
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
    }
}