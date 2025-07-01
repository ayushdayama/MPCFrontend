import React, { useState } from "react";
import { setMonth, setYear, getYear, getMonth, format } from "date-fns";
import { MousePointerClick } from "lucide-react";

function DayMonthYearPicker({ selected, onSelect }) {
  const thisYear = getYear(new Date());
  const years = Array.from({ length: 12 }, (_, i) => thisYear - 6 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const [tempDate, setTempDate] = useState(selected || new Date());
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth(getYear(tempDate), getMonth(tempDate)) }, (_, i) => i + 1);
  const handleYearChange = (e) => setTempDate(setYear(tempDate, Number(e.target.value)));
  const handleMonthChange = (e) => setTempDate(setMonth(tempDate, Number(e.target.value)));
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
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={getMonth(tempDate)} onChange={handleMonthChange}>
          {months.map((m) => (
            <option key={m} value={m}>{format(new Date(2000, m, 1), "MMMM")}</option>
          ))}
        </select>
        <select value={tempDate.getDate()} onChange={handleDayChange}>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <button className="primary-btn" style={{ width: "100%", marginTop: 8 }} onClick={() => onSelect(tempDate)}>
        <MousePointerClick size={16} style={{ marginRight: 4 }} />Select
      </button>
    </div>
  );
}

export default DayMonthYearPicker;
