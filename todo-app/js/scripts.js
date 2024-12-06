document.addEventListener("DOMContentLoaded", function () {
    // Selectors
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const clearAllTasksBtn = document.getElementById("clearAllTasksBtn");

    // Load tasks from LocalStorage when the document loads
    loadTasks();

    // Event Listener for Adding a Task
    addTaskBtn.addEventListener("click", function () {
        addTask();
    });

    // Event Listener for Enter Key Press (for accessibility)
    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    });

    // Event Listener for Task Modifications
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this task?")) {
                deleteTask(e.target);
            }
        } else if (e.target.classList.contains("complete-checkbox")) {
            toggleTaskCompletion(e.target);
        }
    });

    // Event Listener for Deleting All Tasks
    clearAllTasksBtn?.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete all tasks?")) {
            localStorage.removeItem("tasks");
            taskList.innerHTML = ""; // Clear all tasks from the DOM
        }
    });

    // Function to Add a Task
    function addTask() {
        const taskValue = taskInput.value.trim();
        if (taskValue !== "") {
            createTaskElement(taskValue);
            saveTaskToLocalStorage(taskValue, false);
            taskInput.value = ""; // Clear the input field
            taskInput.focus(); // Refocus the input field for quick entry
        } else {
            alert("Please enter a valid task.");
        }
    }

    // Function to Create a Task Element in the DOM
    function createTaskElement(taskName, completed = false) {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${completed ? "checked" : ""}>
            <span class="${completed ? "completed" : ""}">${taskName}</span>
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(li);
    }

    // Function to Load Tasks from LocalStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            createTaskElement(task.name, task.completed);
        });
    }

    // Function to Save a Task to LocalStorage
    function saveTaskToLocalStorage(taskName, completed) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ name: taskName, completed: completed });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to Delete a Task from the DOM and LocalStorage with Animation
    function deleteTask(deleteButton) {
        const taskElement = deleteButton.parentElement;
        taskElement.classList.add("removed"); // Add the 'removed' class to animate

        setTimeout(() => {
            const taskName = taskElement.querySelector("span").textContent;

            // Remove from DOM after the animation
            taskElement.remove();

            // Remove from LocalStorage
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks = tasks.filter(task => task.name !== taskName);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }, 300); // Delay to match the CSS animation
    }

    // Function to Toggle Task Completion in the DOM and LocalStorage
    function toggleTaskCompletion(checkbox) {
        const taskElement = checkbox.nextElementSibling;
        taskElement.classList.toggle("completed");

        // Update LocalStorage
        const taskName = taskElement.textContent;
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.map(task =>
            task.name === taskName ? { ...task, completed: checkbox.checked } : task
        );
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Optional: Load Quote of the Day (Extra Credit)
    fetch("https://api.quotable.io/random")
        .then(response => response.json())
        .then(data => {
            document.getElementById("quote").textContent = `"${data.content}" - ${data.author}`;
        })
        .catch(error => console.log("Error fetching the quote:", error));
});
