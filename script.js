const todoColumn = document.getElementById("todo");
const tasks = document.querySelectorAll(".task");
const taskColumns = document.querySelectorAll(".task-column");
const countEls = document.querySelectorAll(".right");

const toggleModalButton = document.getElementById("toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskBtn = document.getElementById("add-new-task");
const deleteBtns = document.querySelectorAll(".task button");

let draggedElement = null;

// drag - An element is being dragged
tasks.forEach((task) => {
    task.addEventListener("drag", () => {
        draggedElement = task;
    })
})

function addDragEventsOnColumn(column) {
    // dragenter - A dragged element enters the drop target
    column.addEventListener("dragenter", (e) => {
        e.target.classList.add("hover-over")
        // or column.classList.add(...)
    })

    // ❌ Arrow function — `this` is NOT the element
    // progress.addEventListener("dragenter", (e) => {
    //     this.classList.add("hover-over") // `this` = window (or undefined in strict mode)
    // })
    // ✅ Regular function — `this` IS the element
    // progress.addEventListener("dragenter", function(e) {
    //     this.classList.add("hover-over") // `this` = progress element
    // })

    // dragleave - A dragged element leaves the drop target
    column.addEventListener("dragleave", (e) => {
        e.target.classList.remove("hover-over")
    })

    // dragover - A dragged element is over the drop target
    column.addEventListener("dragover", (e) => {
        e.preventDefault(); // Prevents the default behavior, which is to not allow dropping
    })

    // drop - A dragged element is dropped on the target
    column.addEventListener("drop", (e) => {
        e.preventDefault() // Prevents browser from opening the dragged file/link

        e.target.appendChild(draggedElement);
        e.target.classList.remove("hover-over");

        taskColumns.forEach((column) => {
            countEachColumn(column);
        })
    })
};

function countEachColumn(column) {
    const countEl = column.querySelector(".right");
    const tasksEl = column.querySelectorAll(".task");

    countEl.textContent = tasksEl.length;
}

taskColumns.forEach((column) => {
    addDragEventsOnColumn(column);
    countEachColumn(column);
});

// Modal related logic
toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
})

modalBg.addEventListener("click", () => {
    modal.classList.remove("active")
})

addTaskBtn.addEventListener("click", () => {
    const titleEl = document.getElementById("title");
    const descriptionEl = document.getElementById("description");

    const taskTitle = titleEl.value;
    const taskDescription = descriptionEl.value;

    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.draggable = true;
    newTask.addEventListener("drag", () => {
        draggedElement = newTask;
    })

    newTask.innerHTML = `
        <h2>${taskTitle}</h2>
        <p>${taskDescription}</p>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const columnElement = e.target.parentElement.parentElement;
        e.target.parentElement.remove();
        countEachColumn(columnElement);
    })

    newTask.appendChild(deleteBtn)

    if (taskTitle && taskDescription) {
        todoColumn.appendChild(newTask);

        modal.classList.remove("active");

        titleEl.value = "";
        descriptionEl.value = "";

        countEachColumn(todoColumn);
    }
});

deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const columnElement = e.target.parentElement.parentElement;
        e.target.parentElement.remove();
        countEachColumn(columnElement);
    })
});






