import { projectList, todoList, addProject, addTodo, removeProject, removeTodo } from "./variables.js"
import { Todo, Project } from "./classes.js"

import formProj from "./components/form_proj.js"
import formTodo from "./components/form_todo.js"

const handleDom = () => {
    const toggleProjPopup = () => {
        let isHidden = formProj.style.display === "none";

        formProj.style.display = isHidden ? "block" : "none";
        
        if (!isHidden) formProj.reset();
    }

    const toggleTodoPopup = () => {
        let isHidden = formTodo.style.display === "none";

        formTodo.style.display = isHidden ? "block" : "none";

        if (!isHidden) formTodo.reset()
    }
    
    return {toggleProjPopup,toggleTodoPopup};
};

export default () => {
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
        handleDom().toggleProjPopup();
    };


    const deleteProj = (e) => {
        let index = projectList.indexOf(e.UID);
        projectList.splice(index, 1);
    };

    return { newProjSubmit, deleteProj }
})();

