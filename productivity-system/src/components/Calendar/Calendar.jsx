import "./Calendar.css";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendar, sameDay } from "../../hooks/useCalendar";

export default function Calendar({ selectedTs, onDateChange }) {
  const { 
    view, setView, currentDate, selectedDate, 
    weekDays, monthCells, navigate, DOW_SV 
  } = useCalendar(selectedTs);

  const monthLabel = currentDate.toLocaleString("sv-SE", { month: "long" });
  const yearLabel = currentDate.toLocaleString("sv-SE", { year: "numeric" });

  return (
    <section className="calendar-card">
      <header className="calendar-header">
        <div className="calendar-title-group">
          <CalendarIcon size={32} className="calendar-main-icon" />
          <div className="calendar-labels">
            <span className="label-month">{monthLabel}</span>
            <span className="label-year">{yearLabel}</span>
          </div>
        </div>
        
        <div className="calendar-actions">
          <button className="icon-btn" onClick={() => navigate("prev")}>
            <ChevronLeft size={20} />
          </button>
          
          <button className="pill-btn" onClick={() => onDateChange(Date.now())}>
            Idag
          </button>
          
          <button className="pill-btn" onClick={() => setView(v => v === "week" ? "month" : "week")}>
            {view === "week" ? "Månad" : "Vecka"}
          </button>
          
          <button className="icon-btn" onClick={() => navigate("next")}>
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      {view === "week" ? (
        <div className="week-grid">
          {weekDays.map((day) => {
            const isSelected = sameDay(day.date, selectedDate);
            return (
              <button
                key={day.date.toISOString()}
                className={`day-pill ${isSelected ? "is-selected" : ""}`}
                onClick={() => onDateChange(day.date.getTime())}
              >
                <span className="day-name">{day.dow}</span>
                <span className="day-number">{day.dom}</span>
                {isSelected && <span className="active-dot" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="month-container">
          <div className="month-header">
            {DOW_SV.map(d => <div key={d} className="month-dow-cell">{d}</div>)}
          </div>
          <div className="month-grid">
            {monthCells.map((d, idx) => {
              const isSelected = sameDay(d, selectedDate);
              const isOutside = d.getMonth() !== currentDate.getMonth();
              return (
                <button
                  key={idx}
                  className={`month-cell ${isOutside ? "is-outside" : ""} ${isSelected ? "is-selected" : ""}`}
                  onClick={() => onDateChange(d.getTime())}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}