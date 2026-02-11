let projectList = [];
let todoList = [];

function addProject(project) {
  projectList.push(project);
}

function addTodo(todo) {
  todoList.push(todo);
}


function updateChecklistStatus(todo, checklistJob, status) {
  const item = todo.checklist?.find(j => j.job === checklistJob);
  if (!item) return;
  item.status = status;
}

function updateTodoStatus(todoUID, status) {
  const todo = todoList.find(t => t.UID === todoUID);
  if (!todo) return;
  todo.status = status;
}

function editTodo(todoUID) {
  console.log("EditTodo")
}

function removeProject(projectUID) {
  const index = projectList.findIndex(p => p.UID === projectUID);
  if (index === -1) return;

  for (let i = todoList.length - 1; i >= 0; i--) {
    const t = todoList[i];
    const projUID = typeof t.project === "string" ? t.project : t.project?.UID;
    if (projUID === projectUID) todoList.splice(i, 1);
  }

  projectList.splice(index, 1);
}

function removeTodo(todoUID) {
  if (!todoUID) return;

  const todoIndex = todoList.findIndex(t => t.UID === todoUID);
  if (todoIndex === -1) return;

  const todo = todoList[todoIndex];

  const projUID = typeof todo.project === "string" ? todo.project : todo.project?.UID;

  const project = projectList.find(p => p.UID === projUID);

  if (project?.todo) {
    const projIndex = project.todo.findIndex(t => t.UID === todoUID);
    if (projIndex !== -1) project.todo.splice(projIndex, 1);
  }

  todoList.splice(todoIndex, 1);

  console.log(todoList, projectList);
}


let priority = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "IMMEDIATE"
]

let status = [
  "PENDING",
  "STARTED",
  "CANCELLED",
  "DROPPED",
  "COMPLETED"
]

export { 
  projectList, todoList, 
  priority, status, 
  addProject, removeProject,
  addTodo, updateTodoStatus, updateChecklistStatus, editTodo, removeTodo
}