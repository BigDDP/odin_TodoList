class Todo {
    constructor(item) {
        this.title = item.title
        this.status = item.status
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

export { Todo, Project }