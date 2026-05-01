import React, { useState } from "react";
import { CalendarHeart, Laugh, Sparkles, HeartHandshake } from "lucide-react";
import { apiBase, apiFetch } from "../utils/api";

function AddCycleDateView({ username }) {
  const [date, setDate] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
        <span style={{ display: "flex", alignItems: "center", verticalAlign: "middle" }}>
          <Laugh color="#e75480" size={20} style={{ marginRight: 4, marginBottom: 2 }} />
          Happy to see you optimistic, but please select a date in the past or today.
        </span>
      );
      return;
    }
    setLoading(true);
    setResult("Logging your cycle date...");
    try {
      const res = await apiFetch(`${apiBase}/add-cycle-date/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (res && res.message && res.message.toLowerCase().includes("added")) {
        setResult("Cycle date logged successfully! 🌸");
        setDate("");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setResult("Failed to log cycle date.");
      }
    } catch (e) {
      setResult("Failed to log cycle date.");
    }
    setLoading(false);
  };

  return (
    <div className="view card active" style={{ position: 'relative' }}>
      {showConfetti && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle, #ffe3e3 0%, transparent 70%)',
          animation: 'fadeOut 3s ease-out',
          zIndex: 10
        }}>
          <Sparkles size={50} color="#e75480" style={{ position: 'absolute', top: '20%', left: '20%' }} />
          <HeartHandshake size={40} color="#a259b5" style={{ position: 'absolute', top: '30%', right: '25%' }} />
          <Sparkles size={30} color="#e75480" style={{ position: 'absolute', bottom: '25%', left: '30%' }} />
        </div>
      )}
      <h2 style={{ color: "#e75480", fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
        <CalendarHeart size={28} style={{ marginRight: 8, verticalAlign: "middle" }} />
        Log Your Cycle Date
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>
        Mark the start of your menstrual cycle. Tracking helps with predictions! 💖
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{
          background: 'linear-gradient(135deg, #fff0f6 0%, #ffe3e3 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 16px #e7548022',
          border: '1px solid #e75480',
          maxWidth: '300px',
          width: '100%'
        }}>
          <label htmlFor="cycle_date" style={{ display: 'block', textAlign: 'center', marginBottom: 10, fontWeight: 600, color: '#e75480' }}>
            Select Date
          </label>
          <input
            type="date"
            id="cycle_date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              borderRadius: 15,
              padding: "12px 16px",
              fontSize: 18,
              background: "#fff",
              color: "#e75480",
              border: "1px solid #e75480",
              outline: "none",
              boxShadow: "0 0 0 3px #f8bbd0",
              transition: "box-shadow 0.2s",
              fontWeight: 600,
              width: "100%",
              textAlign: 'center'
            }}
            disabled={loading}
          />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button
          className="primary-btn"
          style={{
            fontWeight: 600,
            background: "#e75480",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: 25,
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
          onClick={handleAddDate}
          disabled={loading}
        >
          {loading ? "Logging..." : "Log Cycle Date"} <HeartHandshake size={18} style={{ marginLeft: 6 }} />
        </button>
      </div>
      <div
        style={{
          textAlign: 'center',
          minHeight: 24,
          color: typeof result === "string" && result.includes("success") ? "#2e7d32" : "#e75480",
          fontWeight: 500,
          fontSize: 16
        }}
      >
        {result}
      </div>
    </div>
  );
}

export default AddCycleDateView;
