class Todo {
    constructor(item) {
        this.title = item.title
        this.status = item.status ?? "STARTED"
        this.description = item.description
        this.dueDate = item.dueDate
        this.priority = item.priority
        this.notes = item.notes
        this.checklist = item.checklist
        this.project = item.project
        this.UID = item.UID ?? crypto.randomUUID()
    };
};

class Project {
  constructor(item) {
    if (Array.isArray(item)) {
      this.title = item[0];
      this.todo = item[1] ?? [];
      this.UID = crypto.randomUUID();
    } else {
      this.title = item.title;
      this.todo = item.todo ?? [];
      this.UID = item.UID ?? crypto.randomUUID();
    }
  }
}

export { Todo, Project }