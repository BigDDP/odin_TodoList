const content = document.getElementById("content");

const form = document.createElement("form");
form.style.display = "none";
form.method = "post";
form.action = "";

const fieldset = document.createElement("fieldset");

const label = document.createElement("label");
label.htmlFor = "title";
label.textContent = "Title";

const input = document.createElement("input");
input.type = "text";
input.name = "title";
input.id = "title";
input.required = true;

const button = document.createElement("button");
button.type = "submit";
button.textContent = "Create New Project";

fieldset.append(label, input);
form.append(fieldset, button);
content.appendChild(form);

export default form;