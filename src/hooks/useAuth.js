import { useState } from "react";

export function useAuth() {
  const [username, setUsername] = useState("");

  const login = (user) => {
    setUsername(user);
  };

  const logout = () => {
    setUsername("");
  };

  return { username, login, logout };
}
