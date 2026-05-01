import React, { useState, useEffect } from "react";
import { CalendarDays, Heart, TrendingUp, Calendar, Sparkles } from "lucide-react";
import { apiBase, apiFetch } from "../utils/api";
import LoadingSpinner from "./common/LoadingSpinner";

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

  const calculateStats = () => {
    if (dates.length < 2) return null;
    const intervals = [];
    for (let i = 0; i < dates.length - 1; i++) {
      intervals.push(Math.round((new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24)));
    }
    const avg = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
    const min = Math.min(...intervals);
    const max = Math.max(...intervals);
    return { avg, min, max, total: dates.length };
  };

  const stats = calculateStats();

  if (loading) return (
    <div className="view card active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '240px' }}>
      <LoadingSpinner />
      <p style={{ marginTop: 16, color: '#e75480', fontSize: '1.05rem', fontWeight: 600 }}>Loading your cycle journey...</p>
      <p style={{ marginTop: 8, color: '#666', fontSize: '0.95rem' }}>Fetching your logged cycle dates and stats.</p>
    </div>
  );
  if (error) return <div className="view card active"><p>{error}</p></div>;

  return (
    <div className="view card active">
      <h2><CalendarDays color="#e75480" size={22} style={{ marginRight: 6 }} /> Your Cycle Journey</h2>
      <p>Track your menstrual history in this beautiful timeline.</p>
      {stats && (
        <div style={{
          background: 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <TrendingUp color="#9c27b0" size={20} />
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#9c27b0' }}>{stats.avg}</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Avg Cycle (days)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <Calendar color="#e75480" size={20} />
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e75480' }}>{stats.total}</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Total Dates</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles color="#ff9800" size={20} />
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff9800' }}>{stats.min}-{stats.max}</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Range (days)</div>
          </div>
        </div>
      )}
      {dates.length === 0 ? (
        <p>Start your journey by logging your first cycle date! 🌸</p>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '50px' }}>
          {/* Vertical timeline line */}
          <div style={{
            position: 'absolute',
            left: '25px',
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'linear-gradient(to bottom, #e75480, #a259b5)',
            borderRadius: '2px'
          }}></div>
          {dates.map((date, index) => {
            const isLeft = index % 2 === 0;
            const interval = index < dates.length - 1 ? Math.round((new Date(dates[index]) - new Date(dates[index + 1])) / (1000 * 60 * 60 * 24)) : null;
            const iconColor = interval ? (interval < 25 ? '#4caf50' : interval > 35 ? '#f44336' : '#e75480') : '#e75480';
            return (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                position: 'relative',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: '17px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: iconColor,
                  border: '3px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  zIndex: 1
                }}></div>
                {/* Content card */}
                <div style={{
                  marginLeft: isLeft ? '40px' : '0',
                  marginRight: isLeft ? '0' : '40px',
                  background: isLeft ? 'linear-gradient(135deg, #fff0f6 0%, #ffe3e3 100%)' : 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow: '0 4px 12px rgba(231, 84, 128, 0.15)',
                  border: `2px solid ${iconColor}`,
                  flex: 1,
                  maxWidth: '400px',
                  transform: isLeft ? 'translateX(0)' : 'translateX(0)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Heart color={iconColor} size={24} />
                    <div>
                      <strong style={{ color: iconColor, fontSize: '1.2rem' }}>{date}</strong>
                      {interval && (
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                          Cycle length: {interval} days
                          {interval < 25 && ' ⚡ Short'}
                          {interval > 35 && ' 🐌 Long'}
                          {interval >= 25 && interval <= 35 && ' ✨ Normal'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DateHistoryView;