import React, { useState, useEffect } from "react";
import { CalendarDays, Heart } from "lucide-react";
import { apiBase, apiFetch } from "../utils/api";

function DateHistoryView({ username }) {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`${apiBase}/cycle_data/${username}`);
        // Sort descending (newest first)
        const sorted = data.dates.sort((a, b) => new Date(b) - new Date(a));
        setDates(sorted);
      } catch (err) {
        setError("Failed to load dates.");
      }
      setLoading(false);
    };
    fetchDates();
  }, [username]);

  if (loading) return <div className="view card active"><p>Loading dates...</p></div>;
  if (error) return <div className="view card active"><p>{error}</p></div>;

  return (
    <div className="view card active">
      <h2><CalendarDays color="#e75480" size={22} style={{ marginRight: 6 }} /> Cycle Date History</h2>
      <p>Your recorded menstrual cycle dates, from most recent to oldest.</p>
      {dates.length === 0 ? (
        <p>No dates recorded yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dates.map((date, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #fff0f6 0%, #ffe3e3 100%)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px #e7548022',
              border: '1px solid #e75480',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Heart color="#e75480" size={20} />
              <div>
                <strong style={{ color: '#e75480', fontSize: '1.1rem' }}>{date}</strong>
                {index < dates.length - 1 && (
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                    {Math.round((new Date(dates[index]) - new Date(dates[index + 1])) / (1000 * 60 * 60 * 24))} days since last
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DateHistoryView;