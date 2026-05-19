const todo = document.getElementById("todo")
const progress = document.getElementById("progress")
const done = document.getElementById("done")

const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
    task.addEventListener("drag", () => {

    })
})

// dragenter - A dragged element enters the drop target
progress.addEventListener("dragenter", (e) => {
    e.target.classList.add("hover-over") 
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
progress.addEventListener("dragleave", (e) => {
    e.target.classList.remove("hover-over")
})

