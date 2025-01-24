import React from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Weather from "./components/Weather";
import LoginPage from "./components/LoginPage";
import { useSelector } from "react-redux";
import "./App.css"; // Add CSS file for styling

const App = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className="app-container">
    <h1 className="app-title" style={{ color: 'white' }}>Advanced To-Do Application</h1>

      {!isLoggedIn ? (
        <LoginPage />
      ) : (
        <div className="todo-container">
          <TaskInput />
          <TaskList />
          <Weather />
        </div>
      )}
    </div>
  );
};

export default App;