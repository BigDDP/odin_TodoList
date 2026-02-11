import { projectList } from "../models/variables.js";
import buildTable from "./table.js";

const sidebarContainer = document.querySelector(".sidebar_projects");

let projectSelected;
let buttonsArr = [];

export default function buildSidebar(projectListArg) {
  projectListArg.forEach(project => {
    appendSidebar(project.UID);
  });
}

function appendSidebar(projectUID) {
  const newProj = projectList.find(p => p.UID === projectUID);
  if (!newProj) return;

  const btn = document.createElement("button");
  btn.className = "project_btn";
  btn.textContent = newProj.title;
  btn.value = projectUID;

  buttonsArr.push(btn);

  if (!projectSelected) {
    selectProject(projectUID);
  }

  btn.addEventListener("click", (e) => {
    if (e.target.value === projectSelected?.UID) return console.log("already selected");
    selectProject(e.target.value);
  });

  sidebarContainer.appendChild(btn);
}

function selectProject(projectUID) {
  projectSelected = projectList.find(p => p.UID === projectUID);
  if (!projectSelected) return;

  buttonsArr.forEach(btn => {
    btn.style.backgroundColor = (btn.value === projectUID) ? "yellow" : "white";
  });

  buildTable(projectUID);
}

export { appendSidebar, selectProject, projectSelected };