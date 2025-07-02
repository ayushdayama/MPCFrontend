import { React, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Calendar, CalendarHeart, MessageCircle } from "lucide-react";
import DayMonthYearPicker from "./date-pickers/DayMonthYearPicker";
import { apiBase, apiFetch } from "../utils/api";
import { API_BASE_URL } from "../utils/constants";

function FeedbackView({ username }) {
  const [predictedDate, setPredictedDate] = useState("");
  const [actualDate, setActualDate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackResult, setFeedbackResult] = useState("");
  const [predictedCalendarOpen, setPredictedCalendarOpen] = useState(false);
  const [actualCalendarOpen, setActualCalendarOpen] = useState(false);

  const handleFeedback = async () => {
    if (!predictedDate || !actualDate) {
      setFeedbackResult("Please enter both predicted and actual dates.");
      return;
    }
    setFeedbackResult("Submitting...");
    try {
      const data = await apiFetch(`${apiBase}/feedback/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          predicted_date: predictedDate,
          actual_date: actualDate,
          comment: feedback,
        }),
      });
      if (data && data.message && data.message.toLowerCase().includes("feedback received")) {
        setFeedbackResult("Feedback submitted successfully.");
        setFeedback("");
        setPredictedDate("");
        setActualDate("");
      } else {
        setFeedbackResult("Failed to submit feedback.");
      }
      fetch(`${API_BASE_URL}/train/${username}`, {
        method: "POST",
      });
    } catch (e) {
      setFeedbackResult("Failed to submit feedback.");
    }
  };

  return (
    <div className="view card active">
      <h2>
        <MessageCircle color="#a259b5" size={22} style={{ marginRight: 6 }} />{" "}
        Share Feedback
      </h2>
      <label
        htmlFor="predicted_date"
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        <Calendar size={16} style={{ verticalAlign: "middle" }} />
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
            <DayMonthYearPicker
              selected={predictedDate ? new Date(predictedDate) : new Date()}
              onSelect={(date) => {
                setPredictedDate(format(date, "yyyy-MM-dd"));
                setPredictedCalendarOpen(false);
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <input
        type="date"
        id="predicted_date"
        value={predictedDate}
        onChange={(e) => setPredictedDate(e.target.value)}
        style={{ display: "none" }}
      />
      <label
        htmlFor="actual_date"
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        <Calendar size={16} style={{ verticalAlign: "middle" }} />
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
            <DayMonthYearPicker
              selected={actualDate ? new Date(actualDate) : new Date()}
              onSelect={(date) => {
                setActualDate(format(date, "yyyy-MM-dd"));
                setActualCalendarOpen(false);
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
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
      <button className="primary-btn" onClick={handleFeedback}>
        <MessageCircle size={16} style={{ marginRight: 4 }} /> Submit Feedback
      </button>
      <div className="feedback-result" id="feedbackResult">
        {feedbackResult}
      </div>
    </div>
  );
}

export default FeedbackView;
