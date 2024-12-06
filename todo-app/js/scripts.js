document.addEventListener("DOMContentLoaded", function () {
    // Selectors
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

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
            deleteTask(e.target);
        } else if (e.target.classList.contains("complete-checkbox")) {
            toggleTaskCompletion(e.target);
        }
    });

    // Function to Add a Task
    function addTask() {
        const taskValue = taskInput.value.trim();
        if (taskValue !== "") {
            createTaskElement(taskValue);
            saveTaskToLocalStorage(taskValue, false);
            taskInput.value = ""; // Clear the input field
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

    // Function to Delete a Task from the DOM and LocalStorage
    function deleteTask(deleteButton) {
        const taskElement = deleteButton.parentElement;
        const taskName = taskElement.querySelector("span").textContent;

        // Remove from DOM
        taskElement.remove();

        // Remove from LocalStorage
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.name !== taskName);
        localStorage.setItem("tasks", JSON.stringify(tasks));
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

    // (Extra Credit)
    fetch("https://api.quotable.io/random")
        .then(response => response.json())
        .then(data => {
            document.getElementById("quote").textContent = `"${data.content}" - ${data.author}`;
        })
        .catch(error => console.log("Error fetching the quote:", error));
});
