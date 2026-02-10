let projectList = [];
let todoList = [];

function addProject(project) {
  projectList.push(project);
}

function addTodo(todo) {
  todoList.push(todo);
}

function removeProject(projectUID) {
  const index = projectList.findIndex(p => p.UID === projectUID);
  if (index !== -1) projectList.splice(index, 1);
}

function removeTodo(todoUID) {
  const index = todoList.findIndex(t => t.UID === todoUID);
  if (index !== -1) todoList.splice(index, 1);
}

export { projectList, todoList, addProject, addTodo, removeProject, removeTodo }