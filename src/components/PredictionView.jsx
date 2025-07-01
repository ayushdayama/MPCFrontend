import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Calendar, CalendarHeart, Sparkles, Heart, CalendarSearch } from "lucide-react";
import MonthYearPicker from "./date-pickers/MonthYearPicker";
import ResultDisplay from "./common/ResultDisplay";
import { apiBase, apiFetch } from "../utils/api";

function PredictionView({ username }) {
  const [result, setResult] = useState("");
  const [month, setMonthState] = useState("");
  const [monthResult, setMonthResult] = useState("");
  const [monthCalendarOpen, setMonthCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(month ? new Date(month + "-01") : new Date());

  // Predict next cycle
  const handlePredict = async () => {
    setResult("Loading...");
    try {
      const cycleData = await apiFetch(`${apiBase}/cycle_data/${username}`);
      const allDates = cycleData.dates;
      const lastDate = allDates.length ? allDates[allDates.length - 1] : null;
      const data = await apiFetch(`${apiBase}/predict/${username}`);
      let html = "";
      if (lastDate) html += `<b>Last recorded cycle date:</b> ${lastDate}<br>`;
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
      const cycleData = await apiFetch(`${apiBase}/cycle_data/${username}`);
      const allDates = cycleData.dates;
      const lastDate = allDates.length ? allDates[allDates.length - 1] : null;
      const data = await apiFetch(`${apiBase}/predict/${username}`);
      let html = "";
      if (lastDate) html += `<b>Last recorded cycle date:</b> ${lastDate}<br>`;
      if (data.top_dates && data.top_dates.length > 0) {
        const lastDateObj = new Date(lastDate);
        const intervals = data.top_dates.map((d) => (new Date(d) - lastDateObj) / (1000 * 60 * 60 * 24));
        let predictions = [[], [], []];
        for (let i = 0; i < 24; ++i) {
          for (let j = 0; j < intervals.length; ++j) {
            let next = new Date(lastDateObj.getTime() + intervals[j] * 24 * 60 * 60 * 1000 * (i + 1));
            const y = next.getFullYear();
            const m = (next.getMonth() + 1).toString().padStart(2, "0");
            if (`${y}-${m}` === month) {
              predictions[j].push(next.toISOString().slice(0, 10));
            }
          }
        }
        predictions = predictions.map((group) => group.sort());
        if (predictions[0].length) {
          html += `<b>Most confident prediction(s) for ${month}:</b><br>${predictions[0].join("<br>")}<br>`;
        }
        if (predictions[1].length || predictions[2].length) {
          html += `<span style='color:orange'><b>Other possible dates (less likely):</b><br>${[...predictions[1], ...predictions[2]].sort().join("<br>")}</span>`;
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
