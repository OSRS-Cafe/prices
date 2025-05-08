class ItemCollection {
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
}

export class StorageManager {
    static #collections = [];

    static init() {
        let saved_data = localStorage.getItem("data");
        if(saved_data == null){
            const collections_temp = [];
            const collection = new ItemCollection();
            collections_temp.push(collection);
            saved_data = JSON.stringify(collections_temp);
            localStorage.setItem("data", saved_data);
        }
        this.#collections = JSON.parse(saved_data);
        console.log(this.#collections);
    }
}