import initialiseProject from "./functions.js"
import { projectList, todoList, status, priority } from "./models/variables.js"
import { Todo, Project } from "./models/classes.js"

(() => {
    const defalutProject = new Project(["Default", []]);

    console.log("Default Project: ", defalutProject);
    projectList.push(defalutProject);

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
            project: defalutProject
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
            project: defalutProject
        }
    ];

    initialTodo.forEach(item => {
        const newTodoObj = new Todo(item);

        defalutProject.todo.push(newTodoObj);
        todoList.push(newTodoObj);
    });

    console.log("Initial Todo: ", todoList);
    console.log("Initial Project", defalutProject);
    console.log("Init Over ---");
})();

initialiseProject();