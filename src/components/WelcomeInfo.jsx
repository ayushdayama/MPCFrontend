import React from "react";
import logo from "../assets/MPCLogo.png";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function WelcomeInfo({ username, onClose }) {
  return (
    <div
      className="welcome-info-card menstrual-theme card"
      style={{
        margin: "2rem auto",
        width: "90%",
        maxWidth: 700,
        padding: "2rem",
        borderRadius: 16,
        boxShadow: "0 2px 16px #fbb6ce55",
        background: "var(--color-bg, #fff)",
      }}
    >
      <img
        src={logo}
        alt="CycleSense Logo"
        style={{
          width: 80,
          height: 80,
          margin: "0 auto 18px",
          display: "block",
        }}
      />
      <h2
        style={{
          color: "#be185d",
          fontWeight: 700,
          fontSize: 30,
          marginBottom: 0
        }}
      >
        Hello,{" "}
        <span style={{ color: "#e11d48", marginLeft: 2 }}>
          {capitalize(username)}
        </span>
        !
      </h2>
      <p
        style={{
          fontWeight: 600,
          marginBottom: 20,
          color: "#be185d",
          fontSize: 18,
          letterSpacing: 0.2
        }}
      >
        WELCOME TO CYCLE SENSE
      </p>
      <div
        style={{
          width: "90%",
          background: "#fdf2f8",
          borderRadius: 12,
          border: "1px solid #fbb6ce",
          padding: "18px 18px",
          margin: "0 auto 12px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxShadow: "0 1px 8px #fbb6ce22",
          color: "#be185d",
          textAlign: "left",
          fontSize: 15,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #fbb6ce",
            padding: "10px 14px",
            boxShadow: "0 1px 4px #fbb6ce11",
            textAlign: "center"
          }}
        >
          <span style={{ color: '#e11d48', fontWeight: 600 }}>What?</span> Predict your next menstrual cycle date easily.
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #fbb6ce",
            padding: "10px 14px",
            boxShadow: "0 1px 4px #fbb6ce11",
            textAlign: "center"
          }}
        >
          <span style={{ color: '#be185d', fontWeight: 600 }}>How?</span> Start by adding your past cycle dates.
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #fbb6ce",
            padding: "10px 14px",
            boxShadow: "0 1px 4px #fbb6ce11",
            textAlign: "center"
          }}
        >
          <span style={{ color: '#e11d48', fontWeight: 600 }}>Where?</span> Use the menu to add dates, view predictions, or train the model.
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #fbb6ce",
            padding: "10px 14px",
            boxShadow: "0 1px 4px #fbb6ce11",
            textAlign: "center"
          }}
        >
          <span style={{ color: '#be185d', fontWeight: 600 }}>Tip:</span> For best results, at least 3-4 cycles dates are present or feel free to add them.
        </div>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "#e11d48",
          marginBottom: 0,
          marginTop: 8,
        }}
      >
        Your data is private and only used for predictions.
      </p>
      <button
        className="btn"
        style={{
          marginTop: 18,
          background: "#e11d48",
          color: "#fff",
          fontWeight: 600,
          borderRadius: 8,
          padding: "8px 24px",
          fontSize: 16,
        }}
        onClick={onClose}
      >
        Continue
      </button>
    </div>
  );
}

export default WelcomeInfo;
