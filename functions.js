import { projectList, todoList, addProject, addTodo, removeProject, removeTodo } from "./models/variables.js"
import { Todo, Project } from "./models/classes.js"

import formProj from "./components/form_proj.js"
import formTodo, { refreshProjectOptions } from "./components/form_todo.js"
import buildTable, {generateRow} from "./components/table.js"
import buildSidebar, { appendSidebar, selectProject } from "./components/sidebar.js"

const handleDom = () => {
    const toggleProjPopup = () => {
        let isHidden = formProj.style.display === "none";

        formProj.style.display = isHidden ? "block" : "none";
        
        if (!isHidden) formProj.reset();
    }

    const toggleTodoPopup = (todo = null) => {
    const isHidden = formTodo.style.display === "none";

    if (isHidden) {
        refreshProjectOptions();
        formTodo.style.display = "block";

        if (!todo) {
            formTodo.reset();
            
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
            formTodo.reset();
        }
    };

    return { toggleProjPopup, toggleTodoPopup };
};

export default () => {
    buildSidebar(projectList)

    const newProjBtn = document.getElementById("new_project");
    const newTodoBtn = document.getElementById("new_todo");

    newProjBtn.addEventListener("click", () => {
        handleDom().toggleProjPopup();
    });

    formProj.addEventListener("submit", (e) => {
        handleEvent.newProjSubmit(e);
    });

    newTodoBtn.addEventListener("click", () => {
        handleDom().toggleTodoPopup();
    });

    formTodo.addEventListener("submit", (e) => {
        handleEvent.newTodoSubmit(e);
    });

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

        console.log("e", e);

        const fd = new FormData(e.target);

        console.log("fd", fd);

        const data = {
            title: fd.get("title").trim(),
            status: "PENDING",
            description: fd.get("description") ?? "",
            dueDate: fd.get("dueDate") ?? "",
            priority: fd.get("priority")  ?? "LOW",
            notes: fd.get("notes") ?? "",
            checklist: [],
            project: fd.get("project")
        };

        console.log("data", data)

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

        const project = projectList.find(p => p.UID === data.project);
        if (!project) {
        console.error("Project not found for UID:", data.project);
        return;
        }

        const newTodoObj = new Todo({
        ...data,
        project: project.UID
        });

        project.todo.push(newTodoObj);
        todoList.push(newTodoObj);

        persist();
        handleDom().toggleTodoPopup();   
        
        const table = document.querySelector(`table[data-uid="${project.UID}"]`);
        const tbody = table?.querySelector("tbody");
        if (tbody) generateRow(newTodoObj, tbody);
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