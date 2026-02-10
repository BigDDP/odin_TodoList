
const formStructure = [
  ["fieldset1", [{ type: "input", value: "title" }, { type: "date", value: "dueDate" }]],
  ["fieldset2", [{ type: "dropdown", value: "project" }, { type: "dropdown", value: "priority" }]],
  ["fieldset3", [{ type: "textarea", value: "description" }]],
  ["fieldset4", [{ type: "textarea", value: "notes" }]],
  ["fieldset5", [{ type: "checklist", value: "checklist" }]]
];

let checklist = [];

function createChecklistWidget(name) {
  const wrapper = document.createElement("div");
  wrapper.className = "checklist";
  wrapper.dataset.name = name;

  const list = document.createElement("div");
  list.className = "checklist-list";

  const controls = document.createElement("div");
  controls.className = "checklist-controls";

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.textContent = "Add item";

  function addItem(text = "", checked = false) {
    const row = document.createElement("div");
    row.className = "checklist-row";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = checked;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Checklist item…";
    input.value = text;

    input.dataset.role = "text";
    cb.dataset.role = "done";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      row.remove();
      renumber();
    });

    row.appendChild(cb);
    row.appendChild(input);
    row.appendChild(delBtn);
    list.appendChild(row);

    renumber();
  }

  function renumber() {
    const rows = list.querySelectorAll(".checklist-row");
    rows.forEach((row, idx) => {
      const textInput = row.querySelector('input[data-role="text"]');
      const doneInput = row.querySelector('input[data-role="done"]');

      textInput.name = `${name}[${idx}][text]`;
      doneInput.name = `${name}[${idx}][done]`;
      doneInput.value = doneInput.checked ? "1" : "0";

      doneInput.addEventListener("change", () => {
        doneInput.value = doneInput.checked ? "1" : "0";
      });
    });
  }

  addBtn.addEventListener("click", () => addItem());

  controls.appendChild(addBtn);
  wrapper.appendChild(list);
  wrapper.appendChild(controls);

  addItem();

  return wrapper;
}

const content = document.getElementById("content");

const form = document.createElement("form");
form.style.display = "none";
form.method = "post";
form.action = "";

for (let i = 0; i < formStructure.length; i++) {
  const [fieldsetName, fields] = formStructure[i];

  const fieldset = document.createElement("fieldset");
  fieldset.name = fieldsetName;

  for (let j = 0; j < fields.length; j++) {
    const field = fields[j];

    const label = document.createElement("label");
    label.textContent = field.value;
    label.htmlFor = field.value;

    let node;

    switch (field.type) {
      case "input": {
        node = document.createElement("input");
        node.type = "text";
        node.name = field.value;
        node.id = field.value;
        break;
      }
      case "date": {
        node = document.createElement("input");
        node.type = "date";
        node.name = field.value;
        node.id = field.value;
        break;
      }
      case "dropdown": {
        node = document.createElement("select");
        node.name = field.value;
        node.id = field.value;
        node.appendChild(new Option("Select…", ""));
        break;
      }
      case "textarea": {
        node = document.createElement("textarea");
        node.name = field.value;
        node.id = field.value;
        break;
      }
      case "checklist": {
        // label + widget
        node = createChecklistWidget(field.value);
        break;
      }
      default:
        continue;
    }

    fieldset.appendChild(label);
    fieldset.appendChild(node);
  }

  form.appendChild(fieldset);
}

content.appendChild(form);

export default form;