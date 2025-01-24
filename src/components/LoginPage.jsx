import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import "./LoginPage.css"; // Add CSS file for styling

const LoginPage = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const handleLogin = () => {
    const userExists = users.find(
      (user) => user.email === email && user.password === password
    );

    if (userExists) {
      dispatch(login());
      setError("");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleSignUp = () => {
    if (users.find((user) => user.email === email)) {
      setError("User already exists");
    } else if (email && password) {
      const updatedUsers = [...users, { email, password }];
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setError("Sign-up successful! Please log in.");
      setIsSignUp(false);
    } else {
      setError("Please fill out all fields");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">{isSignUp ? "Sign Up" : "Login"}</h2>
      <input
        className="login-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      {isSignUp ? (
        <button className="login-button" onClick={handleSignUp}>Sign Up</button>
      ) : (
        <button className="login-button" onClick={handleLogin}>Login</button>
      )}
      {error && <p className="error-message">{error}</p>}
      <p className="toggle-message">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button className="toggle-button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;