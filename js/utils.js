function $id(id) {
    return document.getElementById(id);
}

function $c_div({ parent }) {
    const element = document.createElement("div");
    if(parent) parent.appendChild(element);
    return element;
}

function $c_button({ text, onclick, parent }) {
    const element = document.createElement("button");
    if(text) element.innerText = text;
    if(onclick) element.onclick = onclick;
    if(parent) parent.appendChild(element);
    return element;
}

function $c_span({ text, parent }) {
    const element = document.createElement("span");
    if(text) element.innerText = text;
    if(parent) parent.appendChild(element);
    return element;
}

function $c_table_header({ text, child }) {
    const element = document.createElement("th");
    if(text) element.innerText = text;
    if(child) element.appendChild(child);
    return element;
}

function $c_table_data({ text, child }) {
    const element = document.createElement("td");
    if(text) element.innerText = text;
    if(child) element.appendChild(child);
    return element;
}

function $c_table({ rows, parent, align }) {
    const element = document.createElement("table");
    if(rows) {
        rows.forEach(row => {
            const row_element = document.createElement("tr");
            row.forEach((item) => { row_element.appendChild(item); });
            element.appendChild(row_element);
        })
    }
    if(parent) parent.appendChild(element);
    if(align) element.align = align;
    return element;
}