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

let taskData = {};

const TASK_COLUMNS = "task-columns"

// dragstart - A user starts to drag an element  It only fires exactly once when the user begins dragging the item, which is much better for performance.
// drag - This event fires repeatedly while the item is being dragged
tasks.forEach((task) => {
    task.addEventListener("dragstart", () => {
        draggedElement = task;
    })
})

function addDragEventsOnColumn(column) {
    // dragenter - A dragged element enters the drop target
    column.addEventListener("dragenter", (e) => {
        column.classList.add("hover-over")
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
        column.classList.remove("hover-over")
    })

    // dragover - A dragged element is over the drop target
    column.addEventListener("dragover", (e) => {
        e.preventDefault(); // Prevents the default behavior, which is to not allow dropping
    })

    // drop - A dragged element is dropped on the target
    column.addEventListener("drop", (e) => {
        e.preventDefault() // Prevents browser from opening the dragged file/link

        column.appendChild(draggedElement);
        column.classList.remove("hover-over");

        taskColumns.forEach((c) => {
            saveTasksToLocalStorage(c)
            countEachColumn(c);
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
    loadTasksFromLocalStorage(column);
    countEachColumn(column)
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

    const taskTitle = titleEl.value.trim();
    const taskDescription = descriptionEl.value.trim();

    if (!taskTitle || !taskDescription) {
        alert("Please fill out both title and description.");
        return;
    }

    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.draggable = true;
    newTask.addEventListener("dragstart", () => {
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
        saveTasksToLocalStorage(columnElement);
        countEachColumn(columnElement);
    })

    newTask.appendChild(deleteBtn)

    if (taskTitle && taskDescription) {
        todoColumn.appendChild(newTask);

        modal.classList.remove("active");

        titleEl.value = "";
        descriptionEl.value = "";

        saveTasksToLocalStorage(todoColumn);
        countEachColumn(todoColumn);
    }
});

deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const columnElement = e.target.parentElement.parentElement;
        e.target.parentElement.remove();
        saveTasksToLocalStorage(columnElement)
        countEachColumn(columnElement);
    })
});

function saveTasksToLocalStorage(column) {
    const tasks = column.querySelectorAll('.task'); // returns a NodeList(While a NodeList is "array-like" and has a .forEach() method, it lacks other Array prototype methods like .map(), .filter(), and .reduce())
    // use spread or Array.from to convert to Array

    taskData[column.id] = Array.from(tasks).map((t) => ({
        title: t.querySelector("h2").innerText,
        description: t.querySelector("p").innerText
    }))

    localStorage.setItem(TASK_COLUMNS, JSON.stringify(taskData))
}

function loadTasksFromLocalStorage(column) {
    const storedTaskData = localStorage.getItem(TASK_COLUMNS);

    if (storedTaskData) {
        try {
            taskData = JSON.parse(storedTaskData);

            if (taskData[column.id] !== undefined) {
                // Clear any existing default/rendered tasks in this column
                const existingTasks = column.querySelectorAll(".task");
                existingTasks.forEach(task => task.remove());

                const tasks = taskData[column.id] || [];

                tasks.forEach(taskObj => {
                    const newTask = document.createElement("div");
                    newTask.classList.add("task");
                    newTask.draggable = true;

                    // Add dragstart listener so loaded tasks can be dragged
                    newTask.addEventListener("dragstart", () => {
                        draggedElement = newTask;
                    });

                    newTask.innerHTML = `
                        <h2>${taskObj.title}</h2>
                        <p>${taskObj.description}</p>
                    `;

                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Delete";
                    deleteBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        const columnElement = e.target.parentElement.parentElement;
                        e.target.parentElement.remove();
                        saveTasksToLocalStorage(columnElement);
                        countEachColumn(columnElement);
                    });

                    newTask.appendChild(deleteBtn);
                    column.appendChild(newTask);
                });
            } else {
                // If this specific column is not yet in the stored taskData, save its current DOM tasks
                saveTasksToLocalStorage(column);
            }

        } catch (error) {
            console.error("Error loading tasks from localStorage:", error);
        }
    } else {
        // If localStorage is empty, save the default tasks currently in the DOM for this column
        saveTasksToLocalStorage(column);
    }
}




