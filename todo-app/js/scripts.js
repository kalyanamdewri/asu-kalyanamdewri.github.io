document.addEventListener("DOMContentLoaded", function () {
    // Selectors
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const taskDate = document.getElementById("taskDate");
    const dynamicHeading = document.getElementById("dynamic-heading");
    const userNameInput = document.getElementById("userName");
    const saveNameBtn = document.getElementById("saveNameBtn");
    const quoteSection = document.getElementById("quote");
    const liveTimeElement = document.getElementById("live-time");
    const locationWeatherElement = document.getElementById("location-weather");


  // Load the saved user name or use a default
    const savedUserName = localStorage.getItem("userName") || "Mr. Kalyanam Priyam Dewri";
    userNameInput.value = savedUserName; // Pre-fill the input field
    updateHeading(taskDate.value, savedUserName);

    // Event Listener for Saving User Name
    saveNameBtn.addEventListener("click", function () {
        const userName = userNameInput.value.trim();
        if (userName) {
            localStorage.setItem("userName", userName);
            updateHeading(taskDate.value, userName); // Update heading with new name
        } else {
            alert("Please enter a valid name.");
        }
    });

    // Load tasks, quote, time, and weather on page load
    loadTasksForDate(new Date().toISOString().split("T")[0]);
    fetchQuoteOfTheDay();
    startLiveTime();
    getLocationAndWeather();

    // Initialize date picker with today's date
    const today = new Date().toISOString().split("T")[0];
    taskDate.value = today;
    updateHeading(today);

    // Event Listener for Date Change
    taskDate.addEventListener("change", function () {
        updateHeading(taskDate.value, savedUserName);
        const selectedDate = taskDate.value;
        updateHeading(selectedDate);
        loadTasksForDate(selectedDate);
    });

    // Event Listener for Adding a Task
    addTaskBtn.addEventListener("click", addTask);

    // Event Listener for Enter Key Press
    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    });

    // Event Listener for Task List Actions
    taskList.addEventListener("click", function (e) {
        const selectedDate = taskDate.value;
        if (e.target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this task?")) {
                deleteTask(e.target, selectedDate);
            }
        } else if (e.target.classList.contains("complete-checkbox")) {
            toggleTaskCompletion(e.target, selectedDate);
        }
    });

    // Function to Update the Dynamic Heading
    function updateHeading(date, userName) {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        dynamicHeading.textContent = `Programme for ${formattedDate} of ${userName}`;
    }
});

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

    // Function to Assign an Emoji
    function assignEmoji(taskDescription) {
        const lowerCaseDescription = taskDescription.toLowerCase();
        if (lowerCaseDescription.includes("workout") || lowerCaseDescription.includes("gym")) return "🏋️‍♂️";
        if (lowerCaseDescription.includes("cook") || lowerCaseDescription.includes("meal")) return "🍽️";
        if (lowerCaseDescription.includes("study") || lowerCaseDescription.includes("read")) return "📚";
        if (lowerCaseDescription.includes("work") || lowerCaseDescription.includes("office")) return "💼";
        if (lowerCaseDescription.includes("garden") || lowerCaseDescription.includes("plant")) return "🌱";
        if (lowerCaseDescription.includes("shopping") || lowerCaseDescription.includes("buy")) return "🛍️";
        if (lowerCaseDescription.includes("clean") || lowerCaseDescription.includes("house")) return "🧹";
        return "📝";
    }

    // Function to Create a Task Element
    function createTaskElement(taskName, emoji, completed = false) {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${completed ? "checked" : ""}>
            <span class="${completed ? "completed" : ""}">${emoji} ${taskName}</span>
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(li);
    }

    // Function to Save Task for a Specific Date
    function saveTaskForDate(date, taskName, completed) {
        const key = `tasks-${date}`;
        const tasks = JSON.parse(localStorage.getItem(key)) || [];
        tasks.push({ name: taskName, completed });
        localStorage.setItem(key, JSON.stringify(tasks));
    }

    // Function to Load Tasks for a Specific Date
    function loadTasksForDate(date) {
        const key = `tasks-${date}`;
        const tasks = JSON.parse(localStorage.getItem(key)) || [];
        taskList.innerHTML = "";
        tasks.forEach(task => createTaskElement(task.name, assignEmoji(task.name), task.completed));
    }

    // Function to Delete a Task
    function deleteTask(deleteButton) {
    const taskElement = deleteButton.parentElement;
    const taskName = taskElement.querySelector("span").textContent.trim();
    
    taskElement.remove(); // Remove the task element from the DOM

    const key = `tasks-${selectedDate}`;
    let tasks = JSON.parse(localStorage.getItem(key)) || [];
    tasks = tasks.filter(task => task.name !== taskName); // Filter out the deleted task
    localStorage.setItem(key, JSON.stringify(tasks)); // Save the updated tasks back to localStorage
}


    // Function to Toggle Task Completion
    function toggleTaskCompletion(checkbox) {
        const taskElement = checkbox.nextElementSibling;
        taskElement.classList.toggle("completed");

        const taskName = taskElement.textContent.trim();
        const date = taskDate.value;

        const key = `tasks-${date}`;
        const tasks = JSON.parse(localStorage.getItem(key)) || [];
        const updatedTasks = tasks.map(task =>
            task.name === taskName ? { ...task, completed: checkbox.checked } : task
        );
        localStorage.setItem(key, JSON.stringify(updatedTasks));
    }

    // Function to Fetch Quote of the Day
    function fetchQuoteOfTheDay() {
        const url = "https://api.theysaidso.com/qod";
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const quote = data.contents.quotes[0]?.quote;
                const author = data.contents.quotes[0]?.author;
                quoteSection.textContent = quote ? `"${quote}" - ${author}` : "Could not fetch the quote of the day.";
            })
            .catch(() => {
                quoteSection.textContent = "Could not fetch the quote of the day.";
            });
    }

    // Function to Start Live Time
    function startLiveTime() {
        function updateTime() {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
            const formattedDate = now.toLocaleDateString("en-US");
            const formattedDay = now.toLocaleDateString("en-US", { weekday: "long" });
            liveTimeElement.textContent = `${formattedDay}, ${formattedDate}, ${formattedTime}`;
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Function to Fetch Weather Information
    function getLocationAndWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude: lat, longitude: lon } = position.coords;
                    const apiKey = "1c38c1a13bf9a4fb07ffbde830cb33a5";
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            const temperature = Math.round(data.main.temp);
                            const weatherDescription = data.weather[0].description;
                            const weatherIcon = temperature < 15 ? "images/cold-icon.png" : "images/sunny-icon.png";
                            locationWeatherElement.innerHTML = `Weather: ${temperature}°C, ${weatherDescription}
                                <img src="${weatherIcon}" alt="Weather icon" class="weather-icon">`;
                        })
                        .catch(() => {
                            locationWeatherElement.textContent = "Unable to fetch weather data.";
                        });
                },
                () => {
                    locationWeatherElement.textContent = "Currently 66° ☀️ · Mostly clear Tempe, AZ, United States";
                }
            );
        } else {
            locationWeatherElement.textContent = "Geolocation is not supported by this browser.";
        }
    }
});

