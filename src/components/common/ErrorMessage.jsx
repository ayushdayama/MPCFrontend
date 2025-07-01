import React from "react";

function ErrorMessage({ message }) {
  if (!message) return null;
  return <div style={{ color: "#e75480", marginBottom: 12 }}>{message}</div>;
}

export default ErrorMessage;
