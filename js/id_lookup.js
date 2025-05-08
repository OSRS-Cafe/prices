import { ItemDataHelper } from "./item_data_helper.js";

const search = document.getElementById("id-lookup-name");
const search_button = document.getElementById("id-lookup-button");
const loading_text = document.getElementById("id-lookup-loading");
const items = document.getElementById("items");

ItemDataHelper.refresh_data().then(() => {
    search.disabled = false;
    search_button.disabled = false;
    loading_text.remove();
});

search_button.onclick = () => {
    items.innerHTML = "";
    ItemDataHelper.data.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase())).forEach((item) => {
        const new_item = document.createElement("p");
        new_item.innerText = `${item.name} - ${item.id}`;
        items.appendChild(new_item);
    });
}