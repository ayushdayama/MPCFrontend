import { React, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PredictionView from "./components/PredictionView";
import TrainModelView from "./components/TrainModelView";
import DateHistoryView from "./components/DateHistoryView";
import WelcomeInfo from "./components/WelcomeInfo";
import AddCycleDateView from "./components/AddCycleDateView";
import { API_BASE_URL } from "./utils/constants";

function App() {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("cycleSenseToken") || ""
  );
  const [username, setUsername] = useState(() => (
    localStorage.getItem("cycleSenseToken")
      ? localStorage.getItem("cycleSenseUser") || ""
      : ""
  ));
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
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setLoginError(data.detail || "Invalid username or password");
        return;
      }
      setAuthToken(data.access_token);
      localStorage.setItem("cycleSenseToken", data.access_token);
      setUsername(data.username);
      localStorage.setItem("cycleSenseUser", data.username);
      setLoginUser("");
      setLoginPass("");
      setLoginError("");
      setShowWelcome(true);
      localStorage.removeItem("cycleSenseWelcomeShown");
    } catch {
      setLoading(false);
      setLoginError("Login failed. Please try again.");
    }
  };

  // Signup logic
  const handleSignup = async (
    user,
    pass,
    customError,
    securityQuestion,
    securityAnswer
  ) => {
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
        body: JSON.stringify({
          username: user,
          password: pass,
          securityQuestion,
          securityAnswer,
        }),
      });
      const data = await res.json();
      setSignupLoading(false);
      if (!res.ok) {
        setSignupError(data.detail || "Sign up failed");
        return;
      }
      // Auto-login after signup
      setAuthToken(data.access_token);
      localStorage.setItem("cycleSenseToken", data.access_token);
      setUsername(data.username);
      localStorage.setItem("cycleSenseUser", data.username);
      setLoginUser("");
      setLoginPass("");
      setLoginError("");
      setSignupError("");
      setShowWelcome(true);
      localStorage.removeItem("cycleSenseWelcomeShown");
    } catch {
      setSignupLoading(false);
      setSignupError("Sign up failed. Please try again.");
    }
  };

  // Logout logic
  const handleLogout = () => {
    setAuthToken("");
    setUsername("");
    localStorage.removeItem("cycleSenseUser");
    localStorage.removeItem("cycleSenseToken");
    setShowWelcome(false);
    localStorage.removeItem("cycleSenseWelcomeShown");
  };

  if (!username || !authToken) {
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
        <WelcomeInfo
          username={username}
          onClose={() => {
            setShowWelcome(false);
            localStorage.setItem("cycleSenseWelcomeShown", "true");
          }}
        />
      ) : (
        <>
          {view === "main" && <PredictionView username={username} />}
          {view === "addcycle" && <AddCycleDateView username={username} />}
          {view === "train" && <TrainModelView />}
          {view === "history" && <DateHistoryView username={username} />}
        </>
      )}
    </div>
  );
}

export default App;
