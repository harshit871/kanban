const tasks = document.querySelectorAll(".task");
const taskColumns = document.querySelectorAll(".task-column");

let draggedElement = null;

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
    })
};

taskColumns.forEach((column) => addDragEventsOnColumn(column));




