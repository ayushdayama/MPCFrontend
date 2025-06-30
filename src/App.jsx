import { useState } from "react";
import {
  Calendar,
  CalendarHeart,
  MousePointerClick,
  Heart,
  ScanHeart,
  Brain,
  MessageCircle,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import "./App.css";
import * as Popover from "@radix-ui/react-popover";
import { format, setMonth, setYear, getYear, getMonth } from "date-fns";

const apiBase = "https://web-production-4106c.up.railway.app";

function App() {
  // Navigation state
  const [view, setView] = useState("main");
  // Prediction states
  const [result, setResult] = useState("");
  const [month, setMonthState] = useState("");
  const [monthResult, setMonthResult] = useState("");
  // Feedback states
  const [predictedDate, setPredictedDate] = useState("");
  const [actualDate, setActualDate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackResult, setFeedbackResult] = useState("");
  // Train state
  const [trainResult, setTrainResult] = useState("");
  // Helper for month picker
  const [monthCalendarOpen, setMonthCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(
    month ? new Date(month + "-01") : new Date()
  );
  // Feedback date pickers
  const [predictedCalendarOpen, setPredictedCalendarOpen] = useState(false);
  const [actualCalendarOpen, setActualCalendarOpen] = useState(false);

  // Navigation
  const showView = (v) => setView(v);

  // Predict next cycle
  const handlePredict = async () => {
    setResult("Loading...");
    try {
      const cycleRes = await fetch(`${apiBase}/cycle_data`);
      const cycleData = await cycleRes.json();
      const allDates = cycleData.dates;
      const lastDate = allDates.length ? allDates[allDates.length - 1] : null;
      const res = await fetch(`${apiBase}/predict`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      let html = "";
      if (lastDate) {
        html += `<b>Last recorded cycle date:</b> ${lastDate}<br>`;
      }
      if (data.top_dates && data.top_dates.length > 0) {
        html += `<b>Most confident prediction:</b> ${data.top_dates[0]}<br>`;
        if (data.top_dates.length > 1) {
          html += `<span style='color:orange'><b>Other possible dates (less likely):</b><br>${data.top_dates
            .slice(1)
            .join("<br>")}</span>`;
        }
      } else {
        html += "No prediction available.";
      }
      setResult(<span dangerouslySetInnerHTML={{ __html: html }} />);
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
      const cycleRes = await fetch(`${apiBase}/cycle_data`);
      const cycleData = await cycleRes.json();
      const allDates = cycleData.dates;
      const lastDate = allDates.length ? allDates[allDates.length - 1] : null;
      const res = await fetch(`${apiBase}/predict`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      let html = "";
      if (lastDate) {
        html += `<b>Last recorded cycle date:</b> ${lastDate}<br>`;
      }
      if (data.top_dates && data.top_dates.length > 0) {
        const lastDateObj = new Date(lastDate);
        const intervals = data.top_dates.map(
          (d) => (new Date(d) - lastDateObj) / (1000 * 60 * 60 * 24)
        );
        let predictions = [[], [], []];
        for (let i = 0; i < 24; ++i) {
          for (let j = 0; j < intervals.length; ++j) {
            let next = new Date(
              lastDateObj.getTime() +
                intervals[j] * 24 * 60 * 60 * 1000 * (i + 1)
            );
            const y = next.getFullYear();
            const m = (next.getMonth() + 1).toString().padStart(2, "0");
            if (`${y}-${m}` === month) {
              predictions[j].push(next.toISOString().slice(0, 10));
            }
          }
        }
        predictions = predictions.map((group) => group.sort());
        if (predictions[0].length) {
          html += `<b>Most confident prediction(s) for ${month}:</b><br>${predictions[0].join(
            "<br>"
          )}<br>`;
        }
        if (predictions[1].length || predictions[2].length) {
          html += `<span style='color:orange'><b>Other possible dates (less likely):</b><br>${[
            ...predictions[1],
            ...predictions[2],
          ]
            .sort()
            .join("<br>")}</span>`;
        }
      } else {
        html += "No prediction available.";
      }
      setMonthResult(<span dangerouslySetInnerHTML={{ __html: html }} />);
    } catch (e) {
      setMonthResult("Failed to predict for month.");
    }
  };

  // Feedback
  const handleFeedback = async () => {
    if (!predictedDate || !actualDate) {
      setFeedbackResult("Please enter both predicted and actual dates.");
      return;
    }
    setFeedbackResult("Submitting...");
    try {
      const res = await fetch(`${apiBase}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          predicted_date: predictedDate,
          actual_date: actualDate,
          comment: feedback,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setFeedbackResult(data.message);
      setFeedback("");
      setPredictedDate("");
      setActualDate("");
    } catch (e) {
      setFeedbackResult("Failed to submit feedback.");
    }
  };

  // Train
  const handleTrain = async () => {
    setTrainResult("Training model...");
    try {
      const res = await fetch(`${apiBase}/train`, { method: "POST" });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setTrainResult(data.message);
    } catch (e) {
      setTrainResult("Failed to train model.");
    }
  };

  // MonthYearCalendar component for Shadcn-style month/year selection
  function MonthYearCalendar({ selected, onSelect }) {
    const thisYear = getYear(new Date());
    const years = Array.from({ length: 12 }, (_, i) => thisYear - 6 + i);
    const months = Array.from({ length: 12 }, (_, i) => i);
    const [tempDate, setTempDate] = useState(selected);
    const handleYearChange = (e) => {
      setTempDate(setYear(tempDate, Number(e.target.value)));
    };
    const handleMonthChange = (e) => {
      setTempDate(setMonth(tempDate, Number(e.target.value)));
    };
    return (
      <div className="month-year-calendar">
        <div className="calendar-row">
          <select value={getYear(tempDate)} onChange={handleYearChange}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select value={getMonth(tempDate)} onChange={handleMonthChange}>
            {months.map((m) => (
              <option key={m} value={m}>
                {format(new Date(2000, m, 1), "MMMM")}
              </option>
            ))}
          </select>
        </div>
        <button
          className="primary-btn"
          style={{ width: "100%", marginTop: 8 }}
          onClick={() => onSelect(tempDate)}
        >
          <MousePointerClick size={16} style={{ marginRight: 4 }} />
          Select
        </button>
      </div>
    );
  }

  // DayMonthYearCalendar component for full date selection
  function DayMonthYearCalendar({ selected, onSelect }) {
    const thisYear = getYear(new Date());
    const years = Array.from({ length: 12 }, (_, i) => thisYear - 6 + i);
    const months = Array.from({ length: 12 }, (_, i) => i);
    const [tempDate, setTempDate] = useState(selected || new Date());
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const days = Array.from(
      { length: daysInMonth(getYear(tempDate), getMonth(tempDate)) },
      (_, i) => i + 1
    );
    const handleYearChange = (e) => {
      const newDate = setYear(tempDate, Number(e.target.value));
      setTempDate(newDate);
    };
    const handleMonthChange = (e) => {
      const newDate = setMonth(tempDate, Number(e.target.value));
      setTempDate(newDate);
    };
    const handleDayChange = (e) => {
      const newDate = new Date(tempDate);
      newDate.setDate(Number(e.target.value));
      setTempDate(newDate);
    };
    return (
      <div className="month-year-calendar">
        <div className="calendar-row">
          <select value={getYear(tempDate)} onChange={handleYearChange}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select value={getMonth(tempDate)} onChange={handleMonthChange}>
            {months.map((m) => (
              <option key={m} value={m}>
                {format(new Date(2000, m, 1), "MMMM")}
              </option>
            ))}
          </select>
          <select value={tempDate.getDate()} onChange={handleDayChange}>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <button
          className="primary-btn"
          style={{ width: "100%", marginTop: 8 }}
          onClick={() => onSelect(tempDate)}
        >
          <MousePointerClick size={16} style={{ marginRight: 4 }} />
          Select
        </button>
      </div>
    );
  }

  return (
    <div className="container menstrual-theme">
      <div className="theme-switcher">
        <Moon size={22} style={{ marginRight: 8 }} />
        <Sun size={22} />
      </div>
      <h1 className="title">
        <ScanHeart
          color="#e75480"
          size={38}
          style={{
            verticalAlign: "middle",
            marginRight: 10,
            marginBottom: 4,
          }}
        />
        Cycle Sense
      </h1>
      <div className="nav">
        <button
          className={view === "main" ? "active" : ""}
          onClick={() => showView("main")}
        >
          <Calendar size={18} style={{ marginRight: 4 }} /> Prediction
        </button>
        <button
          className={view === "feedback" ? "active" : ""}
          onClick={() => showView("feedback")}
        >
          <MessageCircle size={18} style={{ marginRight: 4 }} /> Feedback
        </button>
        <button
          className={view === "train" ? "active" : ""}
          onClick={() => showView("train")}
        >
          <Brain size={18} style={{ marginRight: 4 }} /> Train Model
        </button>
      </div>
      <div className={`view card${view === "main" ? " active" : ""}`}>
        <h2>
          <Heart color="#e75480" size={22} style={{ marginRight: 6 }} />{" "}
          Menstrual Cycle Prediction
        </h2>
        <button id="predictBtn" className="primary-btn" onClick={handlePredict}>
          <Calendar size={16} style={{ marginRight: 4 }} />
          Get Next Cycle Date
        </button>
        <div className="result" id="result">
          {result}
        </div>
        <h2 htmlFor="monthPicker">
          <Moon size={16} style={{ marginRight: 4 }} />
          Predict cycles for month:
        </h2>
        <Popover.Root
          open={monthCalendarOpen}
          onOpenChange={setMonthCalendarOpen}
        >
          <Popover.Trigger asChild>
            <button
              type="button"
              className="primary-btn"
              style={{ minWidth: 180 }}
            >
              <CalendarHeart size={16} style={{ marginRight: 4 }} />
              {month
                ? format(new Date(month + "-01"), "MMMM yyyy")
                : "Select Month"}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content sideOffset={8} className="popover-calendar">
              <MonthYearCalendar
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
        {/* Hide the old input, keep for accessibility */}
        <input
          type="month"
          id="monthPicker"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ display: "none" }}
        />
        <button
          id="predictMonthBtn"
          className="secondary-btn"
          onClick={handlePredictMonth}
        >
          <Sparkles size={16} style={{ marginRight: 4 }} />
          Predict for Month
        </button>
        <div className="result" id="monthResult">
          {monthResult}
        </div>
      </div>
      <div className={`view card${view === "feedback" ? " active" : ""}`}>
        <h2>
          <MessageCircle color="#a259b5" size={22} style={{ marginRight: 6 }} />{" "}
          Share Feedback
        </h2>
        <label htmlFor="predicted_date">
          <Calendar size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Predicted Date:
        </label>
        <Popover.Root
          open={predictedCalendarOpen}
          onOpenChange={setPredictedCalendarOpen}
        >
          <Popover.Trigger asChild>
            <button
              type="button"
              className="primary-btn"
              style={{ minWidth: 180 }}
            >
              <CalendarHeart size={16} style={{ marginRight: 4 }} />
              {predictedDate
                ? format(new Date(predictedDate), "PPP")
                : "Select Date"}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content sideOffset={8} className="popover-calendar">
              <DayMonthYearCalendar
                selected={predictedDate ? new Date(predictedDate) : new Date()}
                onSelect={(date) => {
                  setPredictedDate(format(date, "yyyy-MM-dd"));
                  setPredictedCalendarOpen(false);
                }}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {/* Hide the old input, keep for accessibility */}
        <input
          type="date"
          id="predicted_date"
          value={predictedDate}
          onChange={(e) => setPredictedDate(e.target.value)}
          style={{ display: "none" }}
        />
        <label htmlFor="actual_date">
          <Calendar size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Actual Date:
        </label>
        <Popover.Root
          open={actualCalendarOpen}
          onOpenChange={setActualCalendarOpen}
        >
          <Popover.Trigger asChild>
            <button
              type="button"
              className="primary-btn"
              style={{ minWidth: 180 }}
            >
              <CalendarHeart size={16} style={{ marginRight: 4 }} />
              {actualDate ? format(new Date(actualDate), "PPP") : "Select Date"}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content sideOffset={8} className="popover-calendar">
              <DayMonthYearCalendar
                selected={actualDate ? new Date(actualDate) : new Date()}
                onSelect={(date) => {
                  setActualDate(format(date, "yyyy-MM-dd"));
                  setActualCalendarOpen(false);
                }}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {/* Hide the old input, keep for accessibility */}
        <input
          type="date"
          id="actual_date"
          value={actualDate}
          onChange={(e) => setActualDate(e.target.value)}
          style={{ display: "none" }}
        />
        <label htmlFor="feedback">Comment (optional):</label>
        <textarea
          id="feedback"
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          id="feedbackBtn"
          className="primary-btn"
          onClick={handleFeedback}
        >
          <MessageCircle size={16} style={{ marginRight: 4 }} />
          Submit Feedback
        </button>
        <div className="feedback-result" id="feedbackResult">
          {feedbackResult}
        </div>
      </div>
      <div className={`view card${view === "train" ? " active" : ""}`}>
        <h2>
          <Brain color="#f67280" size={22} style={{ marginRight: 6 }} /> Train
          Model
        </h2>
        <button id="trainBtn" className="secondary-btn" onClick={handleTrain}>
          <Sparkles size={16} style={{ marginRight: 4 }} />
          Train Model
        </button>
        <div className="result" id="trainResult">
          {trainResult}
        </div>
      </div>
    </div>
  );
}

export default App;
