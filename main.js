import initialiseProject from "./functions.js"
import { projectList, todoList, status, priority } from "./models/variables.js"
import { Todo, Project } from "./models/classes.js"

(() => {
    let storageAvailable = storageFunctions().checkAvailable("localStorage");
    console.log("Storage Available: ", storageAvailable);

  if (storageAvailable) {
    const storedProjects = localStorage.getItem("projectList");
    const storedTodos = localStorage.getItem("todoList");

    if (!storedProjects || !storedTodos) {
      defaultSetup();
    } else {
        const storedProjects = localStorage.getItem("projectList");
        const storedTodos = localStorage.getItem("todoList");

        const projectsRaw = JSON.parse(storedProjects);
        const todosRaw = JSON.parse(storedTodos);

        projectList.length = 0;
        todoList.length = 0;

        projectList.push(...projectsRaw.map(p => new Project(p)));
        todoList.push(...todosRaw.map(t => new Todo(t)));

        projectList.forEach(p => (p.todo = []));
        todoList.forEach(t => {
        const proj = projectList.find(p => p.UID === t.project);
        if (proj) proj.todo.push(t);
        });
    }
  } else {
    defaultSetup();
  };

    console.log("Initial Todo: ", todoList);
    console.log("Initial Project", projectList);
    console.log("Init Over ---");

    initialiseProject();
})();


function storageFunctions() {
        const checkAvailable = (type) => {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
            );
        }
    }
    return {checkAvailable}
}

function defaultSetup() {
    const defaultProject = new Project(["Default", []]);

    projectList.length = 0;
    todoList.length = 0;
    projectList.push(defaultProject);

    const initialTodo = [
        {
            title: "Finish project report",
            description: "Complete the final draft and submit it",
            dueDate: "2026-02-15",
            priority: priority[2],
            notes: "Double-check formatting before submission",
            status: status[4],
            checklist: [
                { job: "Write conclusion", status: false },
                { job: "Review Grammer", status: false },
                { job: "Export to PDF", status: false }
            ],
            project: defaultProject.UID
        },
        {
            title: "Grocery shopping",
            description: "Buy items for the week",
            dueDate: "2026-02-10",
            priority: priority[1],
            notes: "Check for discounts",
            status: status[1],
            checklist: [
                { job: "Milk", status: false },
                { job: "Egg", status: false },
                { job: "Chocolate", status: false }
            ],
            project: defaultProject.UID
        }
    ];

    initialTodo.forEach(item => {
    const todo = new Todo({ ...item, project: defaultProject.UID });
    defaultProject.todo.push(todo);
    todoList.push(todo);
  });

  localStorage.setItem("projectList", JSON.stringify(projectList));
  localStorage.setItem("todoList", JSON.stringify(todoList));
};