import { projectList, todoList, addProject, addTodo, removeProject, removeTodo } from "./models/variables.js"
import { Todo, Project } from "./models/classes.js"

import formProj from "./components/form_proj.js"
import formTodo, { refreshProjectOptions, setTodoFormMode } from "./components/form_todo.js"
import buildTable, {generateRow} from "./components/table.js"
import buildSidebar, { appendSidebar } from "./components/sidebar.js"

const contentPopup = document.getElementById("content");
const closePopup = document.getElementById("close_popup");


const handleDom = () => {
    closePopup.addEventListener("click", () => {
        contentPopup.classList.remove("open");
        formProj.style.display = "none";
        formProj.reset();

        formTodo.style.display = "none";
        formTodo.reset();
    });

    const toggleProjPopup = () => {
        let isHidden = formProj.style.display === "none";
        
        if (isHidden) {
            contentPopup.classList.add("open");
            formProj.style.display = "flex";
        } else {
            contentPopup.classList.remove("open");
            formProj.style.display = "none";
            formProj.reset();
        }
    }

    const toggleTodoPopup = (todo = null) => {
        setTodoFormMode(todo);
        const isHidden = formTodo.style.display === "none";

        if (isHidden) {
            refreshProjectOptions();
            formTodo.style.display = "flex";
            contentPopup.classList.add("open");

            if (!todo) {
                formTodo.reset();
                setTodoFormMode(null);
                return;
            }

            formTodo.querySelector('[name="title"]').value = todo.title ?? "";
            formTodo.querySelector('[name="dueDate"]').value = todo.dueDate ?? "";
            formTodo.querySelector('[name="description"]').value = todo.description ?? "";
            formTodo.querySelector('[name="notes"]').value = todo.notes ?? "";
            formTodo.querySelector('[name="priority"]').value = todo.priority ?? "";

            const projValue =
            typeof todo.project === "string" ? todo.project : todo.project?.UID;

            formTodo.querySelector('[name="project"]').value = projValue ?? "";

            const widget = formTodo.querySelector('.checklist[data-name="checklist"]');
            const list = widget?.querySelector(".checklist-list");

            if (list) {
                list.innerHTML = "";

                todo.checklist?.forEach(({ job, status }) => {
                    const row = document.createElement("div");
                    row.className = "checklist-row";

                    const cb = document.createElement("input");
                    cb.type = "checkbox";
                    cb.checked = !!status;
                    cb.dataset.role = "done";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.placeholder = "Checklist item…";
                    input.value = job ?? "";
                    input.dataset.role = "text";

                    const idx = list.children.length;
                    input.name = `checklist[${idx}][text]`;
                    cb.name = `checklist[${idx}][done]`;
                    cb.value = cb.checked ? "1" : "0";
                    cb.onchange = () => cb.value = cb.checked ? "1" : "0";

                    const delBtn = document.createElement("button");
                    delBtn.type = "button";
                    delBtn.textContent = "Delete";
                    delBtn.addEventListener("click", () => row.remove());

                    row.append(cb, input, delBtn);
                    list.appendChild(row);
                });
                return;
            }

        } else {
            formTodo.style.display = "none";
            contentPopup.classList.remove("open");
            formTodo.reset();
        }
    };

        return { toggleProjPopup, toggleTodoPopup, wireTableRowOpen };
};

function wireTableRowOpen() {
        console.log("wireTableRow")
        const table = document.querySelector("table");
        if (!table) return;

        table.addEventListener("click", (e) => {
            console.log("TableCLick")

            console.log(e.target);

            const td = e.target.closest("tr");
            if (!td) return;

            console.log(td);

            const tr = td.closest("tr");
            if (!tr?.dataset?.uid) return;

            console.log(tr);

            const todoUID = tr.dataset.uid;
            const todo = todoList.find(t => t.UID === todoUID);
            if (!todo) return;

            formProj.style.display = "none";
            handleDom().toggleTodoPopup(todo);
        });
    }

export default () => {
    buildSidebar(projectList)

    const newProjBtn = document.getElementById("new_project");
    const newTodoBtn = document.getElementById("new_todo");

    newProjBtn.addEventListener("click", () => {
        formTodo.style.display = "none";
        handleDom().toggleProjPopup();
    });

    formProj.addEventListener("submit", (e) => {
        handleEvent.newProjSubmit(e);
    });

    newTodoBtn.addEventListener("click", () => {
        formProj.style.display = "none";
        handleDom().toggleTodoPopup();
    });

    formTodo.addEventListener("submit", (e) => {
        handleEvent.newTodoSubmit(e);
    });

    wireTableRowOpen();

    return { newProjBtn };
};

const handleEvent = (() => {
    const newProjSubmit = (e) => {
        e.preventDefault();

        const fd = new FormData(e.target);
        const mapProj = [fd.get("title"), []];
        const newProjObj = new Project(mapProj);

        projectList.push(newProjObj);
        console.log("New Project: ", projectList);

        persist();
        handleDom().toggleProjPopup();
        appendSidebar(newProjObj.UID);
    };

    const newTodoSubmit = (e) => {
        e.preventDefault();

        const fd = new FormData(e.target);

        const data = {
            title: (fd.get("title") ?? "").trim(),
            description: fd.get("description") ?? "",
            dueDate: fd.get("dueDate") ?? "",
            priority: fd.get("priority") ?? "LOW",
            notes: fd.get("notes") ?? "",
            checklist: [],
            project: fd.get("project"), 
        };

        // Build checklist from FormData
        for (const [key, value] of fd.entries()) {
            const m = key.match(/^checklist\[(\d+)\]\[(text|done)\]$/);
            if (!m) continue;

            const idx = Number(m[1]);
            const field = m[2];

            if (!data.checklist[idx]) data.checklist[idx] = { job: "", status: false };

            if (field === "text") data.checklist[idx].job = String(value).trim();
            if (field === "done") data.checklist[idx].status = value === "1";
        }
        data.checklist = data.checklist.filter(i => i.job);

        const editUid = e.target.dataset.editUid; 

        // -------- EDIT existing todo --------
        if (editUid) {
            const todo = todoList.find(t => t.UID === editUid);
            if (!todo) return;

            const oldProjectUID = typeof todo.project === "string" ? todo.project : todo.project?.UID;
            const newProjectUID = data.project;

            // update fields (keep UID)
            todo.title = data.title;
            todo.description = data.description;
            todo.dueDate = data.dueDate;
            todo.priority = data.priority;
            todo.notes = data.notes;
            todo.checklist = data.checklist;
            todo.project = newProjectUID;

            // If project changed, move todo between project.todo arrays
            if (oldProjectUID !== newProjectUID) {
                const oldProj = projectList.find(p => p.UID === oldProjectUID);
                const newProj = projectList.find(p => p.UID === newProjectUID);

                if (oldProj?.todo) oldProj.todo = oldProj.todo.filter(t => t.UID !== todo.UID);
                if (newProj?.todo) newProj.todo.push(todo);
            }

            persist();
            handleDom().toggleTodoPopup();

            // refresh table UI
            const table = document.querySelector("table");
            const currentTableProjUID = table?.dataset?.uid;

            // If still viewing same project, update row; else remove it from current table
            const tr = document.querySelector(`tr[data-uid="${todo.UID}"]`);
            if (tr) tr.remove();

            const tbody = table?.querySelector("tbody");
            if (tbody && currentTableProjUID === todo.project) {
                generateRow(todo, currentTableProjUID, tbody);
            }

            // clear edit mode
            delete e.target.dataset.editUid;
            return;
        }

        // -------- CREATE new todo --------
        const project = projectList.find(p => p.UID === data.project);
        if (!project) return;

        const newTodoObj = new Todo({ ...data, status: "PENDING", project: project.UID });

        project.todo.push(newTodoObj);
        todoList.push(newTodoObj);

        persist();
        handleDom().toggleTodoPopup();

        const table = document.querySelector(`table[data-uid="${project.UID}"]`);
        const tbody = table?.querySelector("tbody");
        if (tbody) generateRow(newTodoObj, project.UID, tbody);
    };

    const deleteProj = (e) => {
        removeProject(e.UID);
    };

    const deleteTodo = (e) => {
        removeTodo(e.UID);
    };

    return { newProjSubmit, newTodoSubmit, deleteProj, deleteTodo}
})();

function persist() {
  localStorage.setItem("projectList", JSON.stringify(projectList));
  localStorage.setItem("todoList", JSON.stringify(todoList));
}