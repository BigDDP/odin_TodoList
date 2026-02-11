import { projectList, status, updateTodoStatus, updateChecklistStatus, editTodo, removeTodo } from "../models/variables.js";

export default function projectSelect(projUID) {
    let projectSelected = !projUID ? projectList[0] : projectList.find(p => p.UID === projUID);

    console.log("tablePage Init", projectSelected)

    generateTable(projectSelected);
    
    return;
};

function generateTable( proj ) {
    const header = document.getElementById("p_title");
    const table = document.querySelector("table");

    header.textContent = proj.title;

    const colgroup = document.createElement("colgroup");

    for (let i = 0; i < 5; i++) {
        let col = document.createElement("col");
        colgroup.appendChild(col);
    }

    table.appendChild(colgroup);

    const thead = document.createElement("thead");

    const headRow = document.createElement("tr");

    let headers = ["", "General", "Checklist", "Notes"]
    headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headRow.appendChild(th);
    });

    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");

    table.append(thead, tbody);

    const allTodos = proj.todo;

    allTodos.forEach(todo => {
        generateRow(todo);
  });
};

export function generateRow(todo) {
    const tbody = document.querySelector("tbody")

    const tr = document.createElement("tr");
    tr.dataset.uid = todo.UID;

    // ---- TD 1: Priority
    const tdPriority = document.createElement("td");
    tdPriority.textContent = todo.priority ?? "";
    tr.appendChild(tdPriority);

    // ---- TD 2: General (Title - DueDate + project select + description)
    const tdGeneral = document.createElement("td");

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
            updateChecklistStatus(todo, item.job, e.target.checked)
            row.style.textDecoration = e.target.checked ? "line-through" : "none";
        })

        checklistWrap.appendChild(row);
    });

    tdChecklist.appendChild(checklistWrap);
    tr.appendChild(tdChecklist);

    // ---- TD 4: Notes
    const tdNotes = document.createElement("td");
    tdNotes.textContent = todo.notes ?? "";
    tr.appendChild(tdNotes);

    // ---- TD 5: delete btn
    const tdBtn = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.id = "tr_deletebtn";
    deleteBtn.value = `${todo.UID}`;
    deleteBtn.addEventListener("click", (e) => {
        removeTodo(e.target.value);
        e.target.closest("tr").remove();
    });

    tdBtn.appendChild(deleteBtn);
    tr.appendChild(tdBtn);        

    [tdPriority, tdGeneral, tdNotes].forEach(cell => cell.addEventListener("click", () => editTodo(todo)));

    tbody.appendChild(tr);
}