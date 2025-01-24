import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../redux/taskSlice";
import('axios').then((axios) => {
  axios.get('https://api.openweathermap.org/data/2.5/weather?q=city&appid=YOUR_API_KEY')
    .then(response => console.log(response))
    .catch(error => console.error(error));
});


import {Calendar} from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TaskList.css"; // Add CSS file for styling

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [city, setCity] = useState("");
  const [doneTasks, setDoneTasks] = useState([]);
  const [favoriteTasks, setFavoriteTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [taskDates, setTaskDates] = useState({});

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=141ba8e019db53598c81ff71d0597024`
      );
      setWeather(response.data);
      setWeatherError("");
    } catch (error) {
      setWeatherError("Failed to fetch weather data. Please check the city name and try again.");
    }
  };

  const handleWeatherFetch = () => {
    if (city.trim()) {
      fetchWeather();
    } else {
      setWeatherError("Please enter a city name.");
    }
  };

  const markAsDone = (index) => {
    setDoneTasks((prev) => [...prev, index]);
  };

  const toggleFavorite = (index) => {
    setFavoriteTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const setTaskDate = (index, type, selectedDate) => {
    setTaskDates((prev) => ({
      ...prev,
      [index]: { ...prev[index], [type]: selectedDate },
    }));
  };

  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="dashboard-container">
      <div className="menu-button-container">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        {menuOpen && (
          <div className="menu-content">
            <button
              className={activeTab === "calendar" ? "menu-tab active" : "menu-tab"}
              onClick={() => setActiveTab("calendar")}
            >
              Calendar
            </button>
            <button
              className={activeTab === "favorites" ? "menu-tab active" : "menu-tab"}
              onClick={() => setActiveTab("favorites")}
            >
              Favorite Tasks
            </button>
            <button
              className={activeTab === "weather" ? "menu-tab active" : "menu-tab"}
              onClick={() => setActiveTab("weather")}
            >
              Check Weather
            </button>
          </div>
        )}
      </div>

      {activeTab === "calendar" && (
        <div className="calendar-container">
          <Calendar value={date} onChange={setDate} />
          <p className="selected-date">Selected Date: {date.toDateString()}</p>
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="dashboard-favorite-tasks">
          <h3>Favorite Tasks</h3>
          <ul className="favorite-tasks">
            {favoriteTasks.map((index) => (
              <li key={index} className="favorite-task-item">
                {tasks[index]?.text} - {tasks[index]?.priority}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "weather" && (
        <div className="weather-section">
          <div className="weather-input-container">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="weather-input"
            />
            <button onClick={handleWeatherFetch} className="weather-button">
              Get Weather
            </button>
          </div>
          {weatherError && <p className="error-message">{weatherError}</p>}
          {weather && (
            <div className="weather-info">
              <h3>Weather in {weather.name}</h3>
              <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
              <p>Condition: {weather.weather[0].description}</p>
              {weather.weather[0].main.toLowerCase() === "rain" ? (
                <p className="outdoor-warning">It's rainy. Consider indoor activities.</p>
              ) : (
                <p className="outdoor-ok">Weather looks good for outdoor activities!</p>
              )}
            </div>
          )}
        </div>
      )}

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task, index) => (
            <tr
              key={index}
              className={`task-row ${doneTasks.includes(index) ? "done" : ""}`}
            >
              <td className="task-text">{task.text}</td>
              <td className="task-item-priority">{task.priority}</td>
              <td>
                <input
                  type="date"
                  value={taskDates[index]?.startDate || ""}
                  onChange={(e) => setTaskDate(index, "startDate", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={taskDates[index]?.endDate || ""}
                  onChange={(e) => setTaskDate(index, "endDate", e.target.value)}
                />
              </td>
              <td>
                <button
                  className="done-task-button"
                  onClick={() => markAsDone(index)}
                  disabled={doneTasks.includes(index)}
                >
                  {doneTasks.includes(index) ? "Done" : "Mark as Done"}
                </button>
                <button
                  className={`favorite-task-button ${favoriteTasks.includes(index) ? "favorited" : ""}`}
                  onClick={() => toggleFavorite(index)}
                >
                  {favoriteTasks.includes(index) ? "Unfavorite" : "Favorite"}
                </button>
                <button
                  className="delete-task-button"
                  onClick={() => dispatch(deleteTask(index))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;