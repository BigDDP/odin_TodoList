import { projectList, status, updateTodoStatus, updateChecklistStatus, removeTodo } from "../models/variables.js";

export default function projectSelect(projUID) {
  const proj = projectList.find(p => p.UID === projUID);
  if (!proj) return;

  generateTable(proj, projUID);
}

function generateTable(proj, projUID) {
  const header = document.getElementById("p_title");
  const table = document.querySelector("table");

  table.innerHTML = "";
  table.dataset.uid = proj.UID;

  header.textContent = proj.title;

  const colgroup = document.createElement("colgroup");
  for (let i = 0; i < 5; i++) {
    const col = document.createElement("col");
    col.id = `col${1}`;
    colgroup.appendChild(col);
    
  };
  table.appendChild(colgroup);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["", "General", "Checklist", "Notes", ""].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  const tbody = document.createElement("tbody");
  table.append(thead, tbody);

  (proj.todo ?? []).forEach(todo => {
    generateRow(todo, projUID, tbody);
  });
};

export function generateRow(todo, currentProjUID, tbody) {
    const todoProjUID = typeof todo.project === "string" ? todo.project : todo.project?.UID;
    if (todoProjUID !== currentProjUID) return;

    if (!tbody) tbody = document.querySelector("table tbody");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.dataset.uid = todo.UID;

    // ---- TD 1: Priority
    const tdPriority = document.createElement("td");
    tdPriority.textContent = todo.priority ?? "";
    tdPriority.classList.add("row_click");
    tr.appendChild(tdPriority);

    // ---- TD 2: General (Title - DueDate + project select + description)
    const tdGeneral = document.createElement("td");
    tdGeneral.classList.add("row_click");

    const span = document.createElement("span");
    span.style.display = "flex";
    span.style.gap = "8px";
    span.style.alignItems = "center";

    const titleText = document.createElement("span");
    titleText.textContent = `${todo.title ?? ""} - ${todo.dueDate ?? ""}`;
    span.appendChild(titleText);

    const select = document.createElement("select");
    status.forEach(s => {
        const opt = new Option(s, s);
        select.appendChild(opt);
    });

    select.value = todo.status;
    select.addEventListener("click", (e) => e.stopPropagation());

    select.addEventListener("change", (e) => {
    e.stopPropagation();
    updateTodoStatus(todo.UID, e.target.value)
    });

    span.appendChild(select);
    tdGeneral.appendChild(span);

    const desc = document.createElement("p");
    desc.textContent = todo.description ?? "";
    tdGeneral.appendChild(desc);

    tr.appendChild(tdGeneral);

    // ---- TD 3: Checklist
    const tdChecklist = document.createElement("td");
    const checklistWrap = document.createElement("div");
    checklistWrap.className = "tb_checklist"

    tdChecklist.append(checklistWrap);

    (todo.checklist ?? []).forEach(item => {
        const row = document.createElement("div");
        row.className = "checklist-row";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = item.status;

        row.textContent = item.job

        row.prepend(cb);
        
        cb.addEventListener("click", (e) => {
          e.stopPropagation();  
          updateChecklistStatus(todo, item.job, e.target.checked)
          row.style.textDecoration = e.target.checked ? "line-through" : "none";
        })

        checklistWrap.appendChild(row);
    });

    tdChecklist.appendChild(checklistWrap);
    tr.appendChild(tdChecklist);

    // ---- TD 4: Notes
    const tdNotes = document.createElement("td");
    tdNotes.classList.add("row_click");
    tdNotes.textContent = todo.notes ?? "";
    tr.appendChild(tdNotes);

    // ---- TD 5: delete btn
    const tdBtn = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.id = "tr_deletebtn";
    deleteBtn.value = `${todo.UID}`;
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeTodo(e.target.value);
        e.target.closest("tr").remove();
    });

    tdBtn.appendChild(deleteBtn);
    tr.appendChild(tdBtn);        

    tbody.appendChild(tr);
}

