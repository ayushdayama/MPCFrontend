import { React, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PredictionView from "./components/PredictionView";
import FeedbackView from "./components/FeedbackView";
import TrainView from "./components/TrainView";
import { API_BASE_URL } from "./utils/constants";

function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem("cycleSenseUser") || ""
  );
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [view, setView] = useState("main");
  const [loading, setLoading] = useState(false);
  // Sign up state
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      setLoading(false);
      if (!res.ok) {
        const err = await res.json();
        setLoginError(err.detail || "Invalid username or password");
        return;
      }
      setUsername(loginUser);
      localStorage.setItem("cycleSenseUser", loginUser);
      setLoginUser("");
      setLoginPass("");
      setLoginError("");

      // Trigger train endpoint after successful login
      fetch(`${API_BASE_URL}/train/${loginUser}`, {
        method: "POST",
      });
    } catch (e) {
      setLoading(false);
      setLoginError("Login failed. Please try again.");
    }
  };

  // Signup logic
  const handleSignup = async (user, pass, customError) => {
    setSignupError("");
    if (customError) {
      setSignupError(customError);
      return;
    }
    setSignupLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      setSignupLoading(false);
      if (!res.ok) {
        const err = await res.json();
        setSignupError(err.detail || "Sign up failed");
        return;
      }
      // Auto-login after signup
      setUsername(user);
      localStorage.setItem("cycleSenseUser", user);
      setLoginUser("");
      setLoginPass("");
      setLoginError("");
      setSignupError("");
      // Optionally, trigger train endpoint
      fetch(`${API_BASE_URL}/train/${user}`, {
        method: "POST",
      });
    } catch (e) {
      setSignupLoading(false);
      setSignupError("Sign up failed. Please try again.");
    }
  };

  // Logout logic
  const handleLogout = () => {
    setUsername("");
    localStorage.removeItem("cycleSenseUser");
  };

  if (!username) {
    return (
      <LoginForm
        loginUser={loginUser}
        setLoginUser={setLoginUser}
        loginPass={loginPass}
        setLoginPass={setLoginPass}
        loginError={loginError}
        onLogin={handleLogin}
        loading={loading}
        onSignup={handleSignup}
        signupError={signupError}
        signupLoading={signupLoading}
      />
    );
  }

  return (
    <div className="container menstrual-theme">
      <Header onLogout={handleLogout} />
      <Navigation view={view} setView={setView} />
      {view === "main" && <PredictionView username={username} />}
      {view === "feedback" && <FeedbackView username={username} />}
      {view === "train" && <TrainView username={username} />}
    </div>
  );
}

export default App;
