import { useState } from "react";

export function useAuth() {
  const [username, setUsername] = useState(() => localStorage.getItem("cycleSenseUser") || "");

  const login = (user) => {
    setUsername(user);
    localStorage.setItem("cycleSenseUser", user);
  };

  const logout = () => {
    setUsername("");
    localStorage.removeItem("cycleSenseUser");
  };

  return { username, login, logout };
}
