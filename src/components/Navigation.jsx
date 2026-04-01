import React from "react";
import { Calendar, CalendarHeart, Cpu, History } from "lucide-react";

function Navigation({ view, setView }) {
  return (
    <div className="nav">
      <button className={view === "main" ? "active" : ""} onClick={() => setView("main")}> <Calendar size={18} style={{ marginRight: 4 }} /> Prediction </button>
      <button className={view === "addcycle" ? "active" : ""} onClick={() => setView("addcycle")}> <CalendarHeart size={18} style={{ marginRight: 4 }} /> Add Cycle Date </button>
      <button className={view === "train" ? "active" : ""} onClick={() => setView("train")}> <Cpu size={18} style={{ marginRight: 4 }} /> Train Model </button>
      <button className={view === "history" ? "active" : ""} onClick={() => setView("history")}> <History size={18} style={{ marginRight: 4 }} /> History </button>
    </div>
  );
}

export default Navigation;
