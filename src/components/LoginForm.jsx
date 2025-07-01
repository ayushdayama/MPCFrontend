import ErrorMessage from "./common/ErrorMessage";
import { Clock } from "lucide-react";
import MPCLogo from "../assets/MPCLogo.png";

import React, { useState } from "react";

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
}) {
  const [showSignup, setShowSignup] = useState(false);
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupPass2, setSignupPass2] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupPass !== signupPass2) {
      onSignup(signupUser, signupPass, "Passwords do not match");
      return;
    }
    onSignup(signupUser, signupPass);
  };

  return (
    <div className="login-outer menstrual-theme">
      <form onSubmit={showSignup ? handleSignup : onLogin} className="login-card card">
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
          {showSignup ? (
            <>
              <label htmlFor="signupUser">Username</label>
              <input
                id="signupUser"
                type="text"
                value={signupUser}
                onChange={(e) => setSignupUser(e.target.value)}
                autoFocus
                required
                autoComplete="username"
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
                autoComplete="username"
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
            display: "flex",
            flexDirection: "row",
            gap: 12,
            width: "100%",
            marginTop: 0,
          }}
          className="login-btn-row"
        >
          <button
            className="primary-btn login-btn"
            type="submit"
            style={{ flex: 1 }}
            disabled={loading || signupLoading}
          >
            {showSignup ? "Sign Up" : "Login"}
          </button>
          <button
            type="button"
            className="secondary-btn"
            style={{ flex: 1 }}
            onClick={() => setShowSignup((v) => !v)}
            disabled={loading || signupLoading}
          >
            {showSignup ? "Back to Login" : "Create an account"}
          </button>
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
            <span>{showSignup ? "Signing up, please wait..." : "Logging in, please wait..."}</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
