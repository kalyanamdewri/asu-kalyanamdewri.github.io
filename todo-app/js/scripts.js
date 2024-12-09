document.addEventListener("DOMContentLoaded", function () {
    // Selectors
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const taskDate = document.getElementById("taskDate");
    const dynamicHeading = document.getElementById("dynamic-heading");
    const quoteSection = document.getElementById("quote");
    const liveTimeElement = document.getElementById("live-time");
    const locationWeatherElement = document.getElementById("location-weather");

    // Load tasks and initialize features
    loadTasks();
    fetchQuoteOfTheDay();
    startLiveTime();
    getLocationAndWeather();

    // Initialize with today's date
    const today = new Date().toISOString().split("T")[0];
    taskDate.value = today;
    updateHeading(today);
    loadTasksForDate(today);

    // Event Listener for Date Change
    taskDate.addEventListener("change", function () {
        const selectedDate = taskDate.value;
        updateHeading(selectedDate);
        loadTasksForDate(selectedDate);
    });

    // Event Listener for Adding a Task
    addTaskBtn.addEventListener("click", addTask);

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

    // Function to Update the Heading
    function updateHeading(date) {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        dynamicHeading.textContent = `Programme for ${formattedDate} of Mr. Kalyanam Priyam Dewri`;
    }

    // Function to Add a Task
    function addTask() {
        const taskValue = taskInput.value.trim();
        const selectedDate = taskDate.value;

        if (taskValue) {
            const emoji = assignEmoji(taskValue);
            createTaskElement(taskValue, emoji);
            saveTaskForDate(selectedDate, taskValue, false);
            taskInput.value = "";
            taskInput.focus();
        } else {
            alert("Please enter a valid task.");
        }
    }

    // Function to Assign an Emoji Based on Task Description
    function assignEmoji(taskDescription) {
        const lowerCaseDescription = taskDescription.toLowerCase();
        if (lowerCaseDescription.includes("workout") || lowerCaseDescription.includes("gym")) return "🏋️‍♂️";
        if (lowerCaseDescription.includes("cook") || lowerCaseDescription.includes("food")) return "🍽️";
        if (lowerCaseDescription.includes("study") || lowerCaseDescription.includes("read")) return "📚";
        if (lowerCaseDescription.includes("work") || lowerCaseDescription.includes("meeting")) return "💼";
        if (lowerCaseDescription.includes("garden") || lowerCaseDescription.includes("plant")) return "🌱";
        if (lowerCaseDescription.includes("shopping") || lowerCaseDescription.includes("buy")) return "🛍️";
        if (lowerCaseDescription.includes("clean") || lowerCaseDescription.includes("house")) return "🧹";
        return "📝";
    }

    // Function to Create a Task Element in the DOM
    function createTaskElement(taskName, emoji, completed = false) {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${completed ? "checked" : ""}>
            <span class="${completed ? "completed" : ""}">${emoji} ${taskName}</span>
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(li);
    }

    // Function to Save a Task for a Specific Date
    function saveTaskForDate(date, taskName, completed) {
        const key = `tasks-${date}`;
        let tasks = JSON.parse(localStorage.getItem(key)) || [];
        tasks.push({ name: taskName, completed });
        localStorage.setItem(key, JSON.stringify(tasks));
    }

    // Function to Load Tasks for a Specific Date
    function loadTasksForDate(date) {
        const key = `tasks-${date}`;
        const tasks = JSON.parse(localStorage.getItem(key)) || [];
        taskList.innerHTML = "";
        tasks.forEach(task => {
            const emoji = assignEmoji(task.name);
            createTaskElement(task.name, emoji, task.completed);
        });
    }

    // Function to Start the Live Time
    function startLiveTime() {
        function updateTime() {
            const now = new Date();
            liveTimeElement.textContent = now.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Function to Get User Location and Weather Information
    function getLocationAndWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            locationWeatherElement.textContent = "Geolocation is not supported by this browser.";
        }
    }

    function successCallback(position) {
        const { latitude: lat, longitude: lon } = position.coords;
        const apiKey = "1c38c1a13bf9a4fb07ffbde830cb33a5";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const { temp: temperature } = data.main;
                const { description: weatherDescription } = data.weather[0];
                locationWeatherElement.textContent = `${Math.round(temperature)}°C - ${weatherDescription}`;
            })
            .catch(() => {
                locationWeatherElement.textContent = "Weather information unavailable.";
            });
    }

    function errorCallback() {
        locationWeatherElement.textContent = "Unable to access location.";
    }

    // Function to Fetch Quote of the Day
    function fetchQuoteOfTheDay() {
        const url = "https://api.theysaidso.com/qod";
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const { quote, author } = data.contents.quotes[0];
                quoteSection.textContent = `"${quote}" - ${author}`;
            })
            .catch(() => {
                quoteSection.textContent = "Unable to fetch the quote of the day.";
            });
    }

    // Function to Delete a Task
    function deleteTask(deleteButton) {
        const taskElement = deleteButton.parentElement;
        const taskName = taskElement.querySelector("span").textContent.trim();
        const date = taskDate.value;

        taskElement.remove();
        const key = `tasks-${date}`;
        let tasks = JSON.parse(localStorage.getItem(key)) || [];
        tasks = tasks.filter(task => task.name !== taskName);
        localStorage.setItem(key, JSON.stringify(tasks));
    }

    // Function to Toggle Task Completion
    function toggleTaskCompletion(checkbox) {
        const taskElement = checkbox.nextElementSibling;
        const taskName = taskElement.textContent.trim();
        const date = taskDate.value;

        taskElement.classList.toggle("completed");
        const key = `tasks-${date}`;
        let tasks = JSON.parse(localStorage.getItem(key)) || [];
        tasks = tasks.map(task => 
            task.name === taskName ? { ...task, completed: checkbox.checked } : task
        );
        localStorage.setItem(key, JSON.stringify(tasks));
    }
});
