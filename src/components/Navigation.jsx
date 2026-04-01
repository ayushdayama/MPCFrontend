import React from "react";
import { Calendar, CalendarHeart } from "lucide-react";

function Navigation({ view, setView }) {
  return (
    <div className="nav">
      <button className={view === "main" ? "active" : ""} onClick={() => setView("main")}> <Calendar size={18} style={{ marginRight: 4 }} /> Prediction </button>
      <button className={view === "addcycle" ? "active" : ""} onClick={() => setView("addcycle")}> <CalendarHeart size={18} style={{ marginRight: 4 }} /> Add Cycle Date </button>
    </div>
  );
}

export default Navigation;
