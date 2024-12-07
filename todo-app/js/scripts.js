document.addEventListener("DOMContentLoaded", function () {
    // Selectors
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const quoteSection = document.getElementById("quote");
    const liveTimeElement = document.getElementById("live-time");
    const locationWeatherElement = document.getElementById("location-weather");

    // Load tasks from LocalStorage when the document loads
    loadTasks();

    // Fetch the quote of the day
    fetchQuoteOfTheDay();

    // Initialize live time and weather
    startLiveTime();
    getLocationAndWeather();

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

    // Function to Add a Task
    function addTask() {
        const taskValue = taskInput.value.trim();
        if (taskValue !== "") {
            const emoji = assignEmoji(taskValue);
            createTaskElement(taskValue, emoji);
            saveTaskToLocalStorage(taskValue, false);
            taskInput.value = ""; // Clear the input field
            taskInput.focus(); // Refocus the input field for quick entry
        } else {
            alert("Please enter a valid task.");
        }
    }

    // Function to Assign an Emoji Based on Task Description
    function assignEmoji(taskDescription) {
        const lowerCaseDescription = taskDescription.toLowerCase();
        if (lowerCaseDescription.includes("workout") || lowerCaseDescription.includes("gym")) {
            return "🏋️‍♂️";
        } else if (lowerCaseDescription.includes("cook") || lowerCaseDescription.includes("food") || lowerCaseDescription.includes("meal")) {
            return "🍽️";
        } else if (lowerCaseDescription.includes("study") || lowerCaseDescription.includes("learn") || lowerCaseDescription.includes("read")) {
            return "📚";
        } else if (lowerCaseDescription.includes("work") || lowerCaseDescription.includes("office") || lowerCaseDescription.includes("meeting")) {
            return "💼";
        } else if (lowerCaseDescription.includes("garden") || lowerCaseDescription.includes("plant")) {
            return "🌱";
        } else if (lowerCaseDescription.includes("shopping") || lowerCaseDescription.includes("buy")) {
            return "🛍️";
        } else if (lowerCaseDescription.includes("clean") || lowerCaseDescription.includes("house")) {
            return "🧹";
        } else {
            return "📝"; // Default emoji for general tasks
        }
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

    // Function to Load Tasks from LocalStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const emoji = assignEmoji(task.name); // Reassign emoji when loading from storage
            createTaskElement(task.name, emoji, task.completed);
        });
    }

    // Function to Start the Live Time
    function startLiveTime() {
        function updateTime() {
            const now = new Date();
            const day = now.toLocaleDateString('en-US', { weekday: 'long' });
            const date = now.toLocaleDateString('en-US');
            const time = now.toLocaleTimeString('en-US', { hour12: false });
            liveTimeElement.textContent = `${day}, ${date}, ${time}`;
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
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Fetch weather using OpenWeatherMap API
        const apiKey = "1c38c1a13bf9a4fb07ffbde830cb33a5"; // Replace with your actual OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temperature = data.main.temp;
                const weatherDescription = data.weather[0].description;

                // Determine which icon to use based on temperature
                let weatherIcon = "images/sunny-icon.png"; // Default sunny icon
                if (temperature < 15) {
                    weatherIcon = "images/cold-icon.png"; // Use cold icon if temperature is below 15°C
                }

                // Update weather information
                locationWeatherElement.innerHTML = `Weather: ${Math.round(temperature)}°C, ${weatherDescription}
                    <img src="${weatherIcon}" alt="weather icon" class="weather-icon">`;
            })
            .catch(error => {
                locationWeatherElement.textContent = "Unable to fetch weather data.";
                console.error("Error fetching weather data:", error);
            });
    }

    function errorCallback(error) {
        locationWeatherElement.textContent = "Unable to retrieve your location.";
        console.error("Error getting location:", error);
    }

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

    // Function to Fetch Quote of the Day using They Said So API
    function fetchQuoteOfTheDay() {
        const url = "https://api.theysaidso.com/qod";
        fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-api-key": "t4yvDyRB5Eb0aO0vwhZZfgSqsDTbiPnpNP1dzWas53f0b604"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch the quote of the day");
            }
            return response.json();
        })
        .then(data => {
            if (data.success.total > 0) {
                const quote = data.contents.quotes[0].quote;
                const author = data.contents.quotes[0].author;
                quoteSection.textContent = `"${quote}" - ${author}`;
            } else {
                quoteSection.textContent = "Could not fetch the quote of the day. Please try again later.";
            }
        })
        .catch(error => {
            console.error("Error fetching quote:", error);
            quoteSection.textContent = "Could not fetch the quote of the day. Please try again later.";
        });
    }
});