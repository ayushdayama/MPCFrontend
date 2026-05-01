import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { format, parseISO, parse } from "date-fns";
import { Calendar, CalendarHeart, Sparkles, Heart, CalendarSearch } from "lucide-react";
import MonthYearPicker from "./date-pickers/MonthYearPicker";
import ResultDisplay from "./common/ResultDisplay";
import { apiBase, apiFetch } from "../utils/api";

function normalizeDate(input) {
  if (!input) return "";
  let d;
  try {
    d = parseISO(input);
    if (!isNaN(d.getTime())) return format(d, "dd-MMM-yyyy");
  } catch (e) {
    // swallow
  }
  try {
    d = parse(input, "dd-MMM-yyyy", new Date());
    if (!isNaN(d.getTime())) return format(d, "dd-MMM-yyyy");
  } catch (e) {
    // swallow
  }
  try {
    d = parse(input, "yyyy-MM-dd", new Date());
    if (!isNaN(d.getTime())) return format(d, "dd-MMM-yyyy");
  } catch (e) {
    // swallow
  }
  return input;
}

function PredictionView({ username }) {
  const [result, setResult] = useState("");
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [showFertilityDetails, setShowFertilityDetails] = useState(false);
  const [month, setMonthState] = useState("");
  const [monthResult, setMonthResult] = useState("");
  const [monthCalendarOpen, setMonthCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(month ? new Date(month + "-01") : new Date());

  const parseAnyDate = (value) => {
    if (!value) return null;
    let date = parseISO(value);
    if (!isNaN(date.getTime())) return date;
    date = parse(value, "dd-MMM-yyyy", new Date());
    if (!isNaN(date.getTime())) return date;
    date = parse(value, "yyyy-MM-dd", new Date());
    if (!isNaN(date.getTime())) return date;
    return null;
  };

  const getFertilityWindow = (dateString) => {
    const nextDate = parseAnyDate(dateString);
    if (!nextDate) return null;
    const peak = new Date(nextDate);
    peak.setDate(peak.getDate() - 14);
    const start = new Date(nextDate);
    start.setDate(start.getDate() - 16);
    const end = new Date(nextDate);
    end.setDate(end.getDate() - 12);
    return {
      start: format(start, "dd-MMM-yyyy"),
      peak: format(peak, "dd-MMM-yyyy"),
      end: format(end, "dd-MMM-yyyy"),
    };
  };

  const buildFertilitySummary = (prediction) => {
    if (!prediction?.top_dates?.length) return null;
    const window = getFertilityWindow(prediction.top_dates[0]);
    if (!window) return null;
    return window;
  };

  const fertilityWindow = buildFertilitySummary(currentPrediction);

  // Predict next cycle
  const handlePredict = async () => {
    setResult("Loading...");
    setCurrentPrediction(null);
    setShowFertilityDetails(false);
    try {
      const data = await apiFetch(`${apiBase}/predict/${username}`);
      setCurrentPrediction(data);
      let html = "";
      if (data.last_date) html += `<b>Last recorded cycle date:</b> ${data.last_date}<br>`;
      if (data.top_dates && data.top_dates.length > 0) {
        html += `<b>Most confident prediction:</b> ${data.top_dates[0]}<br>`;
        if (data.top_dates.length > 1) {
          html += `<span style='color:orange'><b>Other possible dates (less likely):</b><br>${data.top_dates.slice(1).join("<br>")}</span>`;
        }
      } else {
        html += "No prediction available.";
      }
      setResult(html);
    } catch (e) {
      setResult("Failed to fetch prediction.");
    }
  };

  // Predict for selected month
  const handlePredictMonth = async () => {
    if (!month) {
      setMonthResult("Please select a month.");
      return;
    }
    setMonthResult("Loading...");
    try {
      const data = await apiFetch(`${apiBase}/predict/${username}`);
      const lastDate = data.last_date;
      let html = "";
      if (lastDate) html += `<b>Last recorded cycle date:</b> ${lastDate}<br>`;
      if (data.top_dates && data.top_dates.length > 0) {
        // Parse lastDate in dd-MMM-yyyy format
        let lastDateObj = parse(lastDate, "dd-MMM-yyyy", new Date());
        if (isNaN(lastDateObj.getTime())) {
          lastDateObj = parseISO(lastDate);
        }
        const intervals = data.top_dates.map((d) => {
          const p = parseISO(d);
          const candidate = isNaN(p.getTime()) ? parse(d, "dd-MMM-yyyy", new Date()) : p;
          return (candidate - lastDateObj) / (1000 * 60 * 60 * 24);
        });
        let predictions = [[], [], []];
        for (let i = 0; i < 24; ++i) {
          for (let j = 0; j < intervals.length; ++j) {
            let next = new Date(lastDateObj.getTime() + intervals[j] * 24 * 60 * 60 * 1000 * (i + 1));
            const y = next.getFullYear();
            const m = (next.getMonth() + 1).toString().padStart(2, "0");
            if (`${y}-${m}` === month) {
              predictions[j].push(next);
            }
          }
        }
        predictions = predictions.map((group) => group.sort((a, b) => a - b));
        if (predictions[0].length) {
          html += `<b>Most confident prediction(s) for ${month}:</b><br>${predictions[0].map(d => normalizeDate(d.toISOString().slice(0,10))).join("<br>")}<br>`;
        }
        if (predictions[1].length || predictions[2].length) {
          html += `<span style='color:orange'><b>Other possible dates (less likely):</b><br>${[...predictions[1], ...predictions[2]].sort((a, b) => a - b).map(d => normalizeDate(d.toISOString().slice(0,10))).join("<br>")}</span>`;
        }
      } else {
        html += "No prediction available.";
      }
      setMonthResult(html);
    } catch (e) {
      setMonthResult("Failed to predict for month.");
    }
  };

  return (
    <div className="view card active">
      <h2><Heart color="#e75480" size={22} style={{ marginRight: 6 }} /> Menstrual Cycle Prediction</h2>
      <button className="primary-btn" onClick={handlePredict}>
        <Calendar size={16} style={{ marginRight: 4 }} /> Get Next Cycle Date
      </button>
      <ResultDisplay html={result} />
      {fertilityWindow && (
        <div style={{
          marginTop: 24,
          padding: '18px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(231,84,128,0.08), rgba(124,45,117,0.12))',
          border: '1px solid rgba(231,84,128,0.28)',
          color: '#4a1f4f',
          boxShadow: '0 20px 40px rgba(124,45,117,0.08)',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10, textAlign: 'center' }}>
                <CalendarHeart color="#e75480" size={20} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>Fertility Window</div>
                  <div style={{ fontSize: '0.9rem', color: '#7a1c67' }}>Interactive ovulation guidance based on your next predicted period.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 17, flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
                <div style={{ padding: '12px', borderRadius: '16px', background: '#fff5fb', border: '1px solid rgba(231,84,128,0.18)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a64b8f' }}>Window Start</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e75480' }}>{fertilityWindow.start}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '16px', background: '#fce7f3', border: '1px solid rgba(231,84,128,0.24)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a64b8f' }}>Ovulation Peak</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#9c27b0' }}>{fertilityWindow.peak}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '16px', background: '#fff0f6', border: '1px solid rgba(231,84,128,0.18)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a64b8f' }}>Window End</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ad1457' }}>{fertilityWindow.end}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2><CalendarSearch color="#e75480" size={22} style={{ marginRight: 6 }} /> Predict cycles for a month:</h2>
      <Popover.Root open={monthCalendarOpen} onOpenChange={setMonthCalendarOpen}>
        <Popover.Trigger asChild>
          <button type="button" className="primary-btn" style={{ minWidth: 180 }}>
            <CalendarHeart color="#e75480" size={16} style={{ marginRight: 4 }} />
            {month ? format(new Date(month + "-01"), "MMMM yyyy") : "Select Month"}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content sideOffset={8} className="popover-calendar">
            <MonthYearPicker
              selected={calendarDate}
              onSelect={(date) => {
                setMonthState(format(date, "yyyy-MM"));
                setCalendarDate(date);
                setMonthCalendarOpen(false);
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <input type="month" id="monthPicker" value={month} onChange={e => setMonthState(e.target.value)} style={{ display: "none" }} />
      <button className="secondary-btn" onClick={handlePredictMonth}>
        <Sparkles size={16} style={{ marginRight: 4 }} /> Predict for Month
      </button>
      <ResultDisplay html={monthResult} />
    </div>
  );
}

export default PredictionView;
