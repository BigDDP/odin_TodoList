import { todoList, projectList, Project } from "./script.js"
import form from "./proj_popup_form.js"

const handleDom = () => {
    const toggleProjPopup = () => {
        let isHidden = form.style.display === "none";

        form.style.display = isHidden  ? "block" : "none";
        
        if (!isHidden) form.reset();
    }
    
    return {toggleProjPopup};
};

export default (() => {
    const newProjBtn = document.getElementById("new_project");

    newProjBtn.addEventListener("click", () => {
        
        handleDom().toggleProjPopup();
    });

    form.addEventListener("submit", (e) => {
        handleEvent.newProjSubmit(e);
    });

    return { newProjBtn };
})();


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

    };

    return { newProjSubmit, deleteProj }
})();

