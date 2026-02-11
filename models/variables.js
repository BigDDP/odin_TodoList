let projectList = [];
let todoList = [];

function addProject(project) {
  projectList.push(project);
}

function addTodo(todo) {
  todoList.push(todo);
}

function updateChecklistStatus (todo, checklistJob, status) {
  let item = (todo.checklist).find(j => j.job === checklistJob);

  item.status = status;

  console.log(todo)
}

function updateTodoStatus(todoUID, status) {
  let todo = todoList.find(t => t.UID === todoUID);
  todo.status = status;
};

function editTodo(todoUID) {
  console.log("EditTodo")
}

function removeProject(projectUID) {
  const index = projectList.findIndex(p => p.UID === projectUID);
  if (index !== -1) projectList.splice(index, 1);
}

function removeTodo(todoUID) {
  if (!todoUID) return;

  let todo = todoList.find(t => t.UID === todoUID);
  let proj = todo.project.todo;

  const projIndex = proj.findIndex(t => t.UID === todoUID);
  const index = todoList.findIndex(t => t.UID === todoUID);

  if (projIndex !== -1) proj.splice(index, 1);
  if (index !== -1) todoList.splice(index, 1);

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