import ErrorMessage from "./common/ErrorMessage";
import { Clock } from "lucide-react";
import MPCLogo from "../assets/MPCLogo.png";

import { API_BASE_URL } from "../utils/constants";
import React, { useState } from "react";

const SECURITY_QUESTIONS = [
  "What is your favorite color?",
  "What is your dream travel destination?",
  "What is the name of your favorite teacher?",
  "What is the last name of your favorite historical figure?",
  "What is your favorite food?",
];

function LoginForm({
  loginUser,
  setLoginUser,
  loginPass,
  setLoginPass,
  loginError,
  onLogin,
  loading,
  onSignup,
  signupError,
  signupLoading,
  onForgotPassword,
  forgotPasswordState,
  onResetPassword,
}) {
  const [showSignup, setShowSignup] = useState(false);
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupPass2, setSignupPass2] = useState("");
  const [signupQuestion, setSignupQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [signupAnswer, setSignupAnswer] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUser, setForgotUser] = useState("");
  const [forgotQuestion, setForgotQuestion] = useState("");
  const [forgotAnswer, setForgotAnswer] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotStep, setForgotStep] = useState(0); // 0: enter user, 1: answer q, 2: done
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupPass !== signupPass2) {
      onSignup(signupUser, signupPass, "Passwords do not match");
      return;
    }
    if (!signupAnswer.trim()) {
      onSignup(
        signupUser,
        signupPass,
        "Please provide an answer to your security question."
      );
      return;
    }
    onSignup(signupUser, signupPass, null, signupQuestion, signupAnswer);
  };

  // Forgot password logic
  const handleForgotStart = async (e) => {
    if (!forgotUser.trim()) {
      setForgotError("Please enter a username");
      return;
    }
    if (e && e.preventDefault) e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/security-question/${forgotUser}`
      );
      if (!res.ok) {
        setForgotError("User not found");
        setForgotLoading(false);
        return;
      }
      const data = await res.json();
      setForgotQuestion(data.securityQuestion);
      setForgotStep(1);
    } catch {
      setForgotError("Could not fetch security question");
    }
    setForgotLoading(false);
  };

  const handleForgotReset = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: forgotUser,
          securityAnswer: forgotAnswer,
          newPassword: forgotNewPass,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setForgotError(err.detail || "Reset failed");
        setForgotLoading(false);
        return;
      }
      setForgotStep(2);
    } catch {
      setForgotError("Reset failed");
    }
    setForgotLoading(false);
  };

  return (
    <div className="login-outer menstrual-theme">
      <form
        onSubmit={showSignup ? handleSignup : onLogin}
        className="login-card card"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            margin: "32px 0 18px 0",
          }}
        >
          <img
            src={MPCLogo}
            alt="Cycle Sense Logo"
            className="login-logo"
            style={{
              width: 80,
              height: 80,
              objectFit: "contain",
              display: "block",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#a259b5",
                fontSize: "1.3rem",
                fontWeight: 500,
                letterSpacing: 1,
              }}
            >
              {"Welcome to"}
            </span>
            <span
              style={{
                color: "#e75480",
                fontSize: "2.1rem",
                fontWeight: 700,
                letterSpacing: 1,
                lineHeight: 1.1,
              }}
            >
              {"Cycle Sense"}
            </span>
          </div>
        </div>
        <div className="login-fields">
          {showForgot ? (
            <>
              {forgotStep === 0 && (
                <div style={{ width: "100%" }}>
                  <input
                    id="forgotUser"
                    type="text"
                    value={forgotUser}
                    onChange={(e) => setForgotUser(e.target.value)}
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={forgotLoading}
                    placeholder="Enter your username"
                    style={{ borderRadius: "20px", width: "100%" }}
                  />
                  <button
                    type="button"
                    className="primary-btn"
                    style={{ width: "100%", marginTop: 12 }}
                    disabled={forgotLoading}
                    onClick={handleForgotStart}
                  >
                    Next
                  </button>
                  {forgotError && <ErrorMessage message={forgotError} />}
                </div>
              )}
              {forgotStep === 1 && (
                <div style={{ width: "100%" }}>
                  <label style={{ display: "block" }}>{forgotQuestion}</label>
                  <input
                    type="text"
                    value={forgotAnswer}
                    onChange={(e) => setForgotAnswer(e.target.value)}
                    required
                    disabled={forgotLoading}
                    style={{
                      width: "100%",
                      borderRadius: 20,
                      padding: 8,
                      fontSize: 16,
                      boxSizing: "border-box",
                    }}
                  />
                  <label
                    htmlFor="forgotNewPass"
                    style={{ display: "block", marginTop: 20 }}
                  >
                    New Password
                  </label>
                  <input
                    id="forgotNewPass"
                    type="password"
                    value={forgotNewPass}
                    onChange={(e) => setForgotNewPass(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={forgotLoading}
                    style={{
                      width: "100%",
                      borderRadius: 20,
                      marginBottom: 20,
                      padding: 8,
                      fontSize: 16,
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    className="primary-btn"
                    style={{ width: "100%", marginTop: 20, marginBottom: 4 }}
                    disabled={forgotLoading}
                    onClick={handleForgotReset}
                  >
                    Reset Password
                  </button>
                  {forgotError && <ErrorMessage message={forgotError} />}
                </div>
              )}
              {forgotStep === 2 && (
                <div style={{ width: "100%" }}>
                  <div style={{ color: "#2e7d32", marginBottom: 12 }}>
                    Password reset successfully! You can now log in.
                  </div>
                  <button
                    className="primary-btn"
                    style={{ width: "100%" }}
                    onClick={() => {
                      setShowForgot(false);
                      setForgotStep(0);
                      setForgotUser("");
                      setForgotQuestion("");
                      setForgotAnswer("");
                      setForgotNewPass("");
                      setForgotError("");
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </>
          ) : showSignup ? (
            <>
              <label htmlFor="signupUser">Username</label>
              <input
                id="signupUser"
                type="text"
                value={signupUser}
                onChange={(e) => setSignupUser(e.target.value)}
                autoFocus
                required
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                disabled={signupLoading}
              />
              <label htmlFor="signupPass">Password</label>
              <input
                id="signupPass"
                type="password"
                value={signupPass}
                onChange={(e) => setSignupPass(e.target.value)}
                required
                autoComplete="new-password"
                disabled={signupLoading}
              />
              <label htmlFor="signupPass2">Confirm Password</label>
              <input
                id="signupPass2"
                type="password"
                value={signupPass2}
                onChange={(e) => setSignupPass2(e.target.value)}
                required
                autoComplete="new-password"
                disabled={signupLoading}
              />
              <label htmlFor="signupQuestion">Security Question</label>
              <select
                id="signupQuestion"
                value={signupQuestion}
                onChange={(e) => setSignupQuestion(e.target.value)}
                disabled={signupLoading}
                style={{
                  marginBottom: 8,
                  borderRadius: 20,
                  padding: '8px 12px',
                  fontSize: 16,
                  background: '#fff0f6',
                  color: '#e75480',
                  border: '1px solid #e75480',
                  outline: 'none',
                  boxShadow: '0 0 0 2px #f8bbd0',
                  transition: 'box-shadow 0.2s',
                  fontWeight: 600,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  cursor: signupLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
              <label htmlFor="signupAnswer">Your Answer</label>
              <input
                id="signupAnswer"
                type="text"
                value={signupAnswer}
                onChange={(e) => setSignupAnswer(e.target.value)}
                required
                disabled={signupLoading}
              />
              {signupError && <ErrorMessage message={signupError} />}
            </>
          ) : (
            <>
              <label htmlFor="loginUser">Username</label>
              <input
                id="loginUser"
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                autoFocus
                required
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                disabled={loading}
              />
              <label htmlFor="loginPass">Password</label>
              <input
                id="loginPass"
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              {loginError && <ErrorMessage message={loginError} />}
            </>
          )}
        </div>
        <div
          style={{
            display: "contents",
            width: "100%",
          }}
        >
          {/* If forgot password, show only Back to login button */}
          {showForgot ? (
            forgotStep !== 2 ? (
              <button
                type="button"
                className="secondary-btn"
                style={{ width: "100%", fontWeight: 600, marginTop: 0 }}
                onClick={() => {
                  setShowForgot(false);
                  setForgotStep(0);
                  setForgotUser("");
                  setForgotQuestion("");
                  setForgotAnswer("");
                  setForgotNewPass("");
                  setForgotError("");
                }}
                disabled={loading || signupLoading || forgotLoading}
              >
                Back to Login
              </button>
            ) : null
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
                className="login-btn-row"
              >
                <button
                  className="primary-btn login-btn"
                  type="submit"
                  style={{ flex: 1 }}
                  disabled={loading || signupLoading || forgotLoading}
                >
                  {showSignup ? "Sign Up" : "Login"}
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowSignup((v) => !v);
                    setShowForgot(false);
                  }}
                  disabled={loading || signupLoading || forgotLoading}
                >
                  {showSignup ? "Back to Login" : "Create an account"}
                </button>
              </div>
              {/* Forgot Password Button */}
              {!showSignup && !showForgot && (
                <button
                  type="button"
                  className="primary-btn login-btn"
                  style={{
                    width: "100%",
                    fontWeight: 600,
                    background: "#e75480",
                    color: "#fff",
                    border: "none",
                    marginTop: 0,
                  }}
                  onClick={() => {
                    setShowForgot(true);
                    setShowSignup(false);
                    setForgotUser("");
                    setForgotQuestion("");
                    setForgotAnswer("");
                    setForgotNewPass("");
                    setForgotError("");
                    setForgotStep(0);
                  }}
                  disabled={loading || signupLoading}
                >
                  Forgot Password?
                </button>
              )}
            </>
          )}
        </div>
        {(loading || signupLoading) && (
          <div
            className="login-loading-msg"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Clock color="#e75480" size={28} />
            <span>
              {showSignup
                ? "Signing up, please wait..."
                : "Logging in, please wait..."}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
