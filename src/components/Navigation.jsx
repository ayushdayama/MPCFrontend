import React from "react";
import { Calendar, MessageCircle, Brain } from "lucide-react";

function Navigation({ view, setView }) {
  return (
    <div className="nav">
      <button className={view === "main" ? "active" : ""} onClick={() => setView("main")}> <Calendar size={18} style={{ marginRight: 4 }} /> Prediction </button>
      <button className={view === "feedback" ? "active" : ""} onClick={() => setView("feedback")}> <MessageCircle size={18} style={{ marginRight: 4 }} /> Feedback </button>
      <button className={view === "train" ? "active" : ""} onClick={() => setView("train")}> <Brain size={18} style={{ marginRight: 4 }} /> Train Model </button>
    </div>
  );
}

export default Navigation;
