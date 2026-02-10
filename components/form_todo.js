import { projectList, priority } from "../models/variables.js";

const formStructure = [
  ["fieldset1", [{ type: "input", value: "title" }, { type: "date", value: "dueDate" }]],
  ["fieldset2", [{ type: "dropdown", value: "project" }, { type: "dropdown", value: "priority" }]],
  ["fieldset3", [{ type: "textarea", value: "description" }]],
  ["fieldset4", [{ type: "textarea", value: "notes" }]],
  ["fieldset5", [{ type: "checklist", value: "checklist" }]]
];

const content = document.getElementById("content");

const form = document.createElement("form");
form.style.display = "none";
form.method = "post";
form.action = "";

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
    cb.dataset.role = "done";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Checklist item…";
    input.value = text;
    input.dataset.role = "text";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      row.remove();
      renumber();
    });

    row.append(cb, input, delBtn);
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

      doneInput.onchange = () => {
        doneInput.value = doneInput.checked ? "1" : "0";
      };
    });
  }

  addBtn.addEventListener("click", () => addItem());

  controls.appendChild(addBtn);
  wrapper.append(list, controls);

  addItem();
  return wrapper;
}

function fillSelect(selectEl, items, { valueKey = null, labelKey = null } = {}) {
  while (selectEl.options.length > 1) selectEl.remove(1);

  items.forEach(item => {
    const value = valueKey ? item[valueKey] : item;
    const label = labelKey ? item[labelKey] : item;
    selectEl.appendChild(new Option(label, value));
  });
}

(function buildAndAppend() {
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
        case "input":
          node = document.createElement("input");
          node.type = "text";
          node.name = field.value;
          node.id = field.value;
          break;

        case "date":
          node = document.createElement("input");
          node.type = "date";
          node.name = field.value;
          node.id = field.value;
          break;

        case "dropdown":
          node = document.createElement("select");
          node.name = field.value;
          node.id = field.value;
          node.appendChild(new Option("Select…", ""));

          if (field.value === "priority") {
            fillSelect(node, priority);
          }

          if (field.value === "project") {
            fillSelect(node, projectList, { valueKey: "UID", labelKey: "title" });
          }
          break;

        case "textarea":
          node = document.createElement("textarea");
          node.name = field.value;
          node.id = field.value;
          break;

        case "checklist":
          node = createChecklistWidget(field.value);
          break;
      }

      fieldset.append(label, node);
    }

    form.appendChild(fieldset);
  }

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.id = "submitTodo";
  submitBtn.textContent = "Submit Item";
  form.appendChild(submitBtn);
  
  content.appendChild(form);

  
})();

function refreshProjectOptions() {
  const select = form.querySelector('select[name="project"]');
  if (!select) return;

  fillSelect(select, projectList, { valueKey: "UID", labelKey: "title" });
}

export default form;
export { refreshProjectOptions };