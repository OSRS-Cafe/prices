export class ItemDataHelper {
    static data;
    static async refresh_data() {
        const url = new URL("https://api-dev.osrs.cafe/ge/items");
        console.log("Calling ", url);
        this.data = await (await fetch(url)).json();
    }

    static get_item(item_id) {
        const int_id = parseInt(item_id.toString());
        const found = this.data.filter((item) => { return item.id === int_id })
        if(found.length === 0) return null;
        return found[0];
    }
}