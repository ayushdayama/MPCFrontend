import React, { useState } from "react";
import { CalendarHeart, Laugh } from "lucide-react";
import { apiBase, apiFetch } from "../utils/api";

function AddCycleDateView({ username }) {
  const [date, setDate] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddDate = async () => {
    if (!date) {
      setResult("Please select a date.");
      return;
    }
    // Prevent future dates
    const today = new Date();
    const selected = new Date(date);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    if (selected > today) {
      setResult(
        <span style={{ display: "ruby", alignItems: "center", verticalAlign: "middle" }}>
          <Laugh color="#e75480" size={20} style={{ marginRight: 4, marginBottom: 2 }} />
          Happy to see you optimistic, but please select a date in the past or today.
        </span>
      );
      return;
    }
    setLoading(true);
    setResult("Submitting...");
    try {
      const res = await apiFetch(`${apiBase}/add-cycle-date/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (res && res.message && res.message.toLowerCase().includes("added")) {
        setResult("Cycle date added successfully.");
        setDate("");
      } else {
        setResult("Failed to add cycle date.");
      }
    } catch (e) {
      setResult("Failed to add cycle date.");
    }
    setLoading(false);
  };

  return (
    <div className="view card active">
      <h2 style={{ color: "#e75480", fontWeight: 700, marginBottom: 30 }}>
        <CalendarHeart
          size={22}
          style={{ marginRight: 6, verticalAlign: "middle" }}
        />
        Add New Cycle Date
      </h2>
      <input
        type="date"
        id="cycle_date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          borderRadius: 20,
          padding: "8px 12px",
          fontSize: 16,
          background: "#fff0f6",
          color: "#e75480",
          border: "1px solid #e75480",
          outline: "none",
          boxShadow: "0 0 0 2px #f8bbd0",
          transition: "box-shadow 0.2s",
          fontWeight: 600,
          marginBottom: 16,
          width: "100%",
        }}
        disabled={loading}
      />
      <button
        className="primary-btn"
        style={{
          width: "100%",
          fontWeight: 600,
          background: "#e75480",
          color: "#fff",
          border: "none",
          marginTop: 0,
          borderRadius: 20,
        }}
        onClick={handleAddDate}
        disabled={loading}
      >
        Add Cycle Date
      </button>
      <div
        style={{
          marginTop: 16,
          minHeight: 24,
          color: typeof result === "string" && result.includes("success") ? "#2e7d32" : "#e75480",
          fontWeight: 500,
        }}
      >
        {result}
      </div>
    </div>
  );
}

export default AddCycleDateView;
