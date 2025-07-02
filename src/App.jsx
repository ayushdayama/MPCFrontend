import { React, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PredictionView from "./components/PredictionView";
import WelcomeInfo from "./components/WelcomeInfo";
import FeedbackView from "./components/FeedbackView";
import TrainView from "./components/TrainView";
import AddCycleDateView from "./components/AddCycleDateView";
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
  // Show welcome info tile only once per login
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem("cycleSenseWelcomeShown") !== "true";
  });

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
      setShowWelcome(true);
      localStorage.removeItem("cycleSenseWelcomeShown");

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
  const handleSignup = async (user, pass, customError, securityQuestion, securityAnswer) => {
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
        body: JSON.stringify({ username: user, password: pass, securityQuestion, securityAnswer }),
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
      setShowWelcome(true);
      localStorage.removeItem("cycleSenseWelcomeShown");
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
    setShowWelcome(false);
    localStorage.removeItem("cycleSenseWelcomeShown");
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

  // Show welcome info tile only once per login, hide on any navigation
  const handleNav = (v) => {
    if (showWelcome) {
      setShowWelcome(false);
      localStorage.setItem("cycleSenseWelcomeShown", "true");
    }
    setView(v);
  };

  return (
    <div className="container menstrual-theme">
      <Header onLogout={handleLogout} />
      {!showWelcome && <Navigation view={view} setView={handleNav} />}
      {showWelcome ? (
        <WelcomeInfo username={username} onClose={() => { setShowWelcome(false); localStorage.setItem("cycleSenseWelcomeShown", "true"); }} />
      ) : (
        <>
          {view === "main" && <PredictionView username={username} />}
          {view === "addcycle" && <AddCycleDateView username={username} />}
          {view === "feedback" && <FeedbackView username={username} />}
          {view === "train" && <TrainView username={username} />}
        </>
      )}
    </div>
  );
}

export default App;
