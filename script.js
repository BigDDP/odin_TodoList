import initialiseProject from "./projects.js"

let projectList = [];
let todoList = [];


class Todo {
    constructor(item) {
        this.title = item.title
        this.description = item.description
        this.dueDate = item.dueDate
        this.priority = item.priority
        this.notes = item.notes
        this.checklist = item.checklist
        this.project = item.project
        this.UID = crypto.randomUUID()
    };
};

class Project {
    constructor(item) {
        this.title = item[0]
        this.todo = item[1]
        this.UID = crypto.randomUUID()
    };
};

(() => {
    const defalutProject = new Project(["Default", []]);

    console.log("Default Project: ", defalutProject);
    projectList.push(defalutProject);
})();

(() => {
    const initialTodo = [
        {
            title: "Finish project report",
            description: "Complete the final draft and submit it",
            dueDate: "2026-02-15",
            priority: "High",
            notes: "Double-check formatting before submission",
            checklist: [
                { job: "Write conclusion", status: false },
                { job: "Review Grammer", status: false },
                { job: "Export to PDF", status: false }
            ],
            project: projectList[0]
        },
        {
            title: "Grocery shopping",
            description: "Buy items for the week",
            dueDate: "2026-02-10",
            priority: "Medium",
            notes: "Check for discounts",
            checklist: [
                { job: "Milk", status: false },
                { job: "Egg", status: false },
                { job: "Chocolate", status: false }
            ],
            project: projectList[0]
        }
    ] 

    initialTodo.forEach(item => {
        const newTodoObj = new Todo(item);

        projectList[0].todo.push(newTodoObj);
        todoList.push(newTodoObj);
    });

    console.log("Initial Todo: ", todoList);
    console.log("Initial Project", projectList);
})();

export { todoList, projectList, Todo, Project }