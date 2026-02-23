// src/components/Calendar/Calendar.jsx
import "./Calendar.css";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendar, sameDay } from "../../hooks/useCalendar";

export default function Calendar({ selectedTs, onDateChange }) {
  const { 
    view, setView, currentDate, selectedDate, 
    weekDays, monthCells, navigate, DOW_SV 
  } = useCalendar(selectedTs);

  const yearLabel = currentDate.toLocaleString("sv-SE", { year: "numeric" });
  const monthLabel = currentDate.toLocaleString("sv-SE", { month: "long" });

  return (
    <main className="screen">
      <div className="stack">
        <section className="card">
          <div className="cardHeader">
            <div className="cardTitleWrap">
              <CalendarIcon size={32} color="#0ed3ac" />
              <div className="dateLabelGroup">
                <span className="monthLabel">{monthLabel}</span>
                <span className="yearLabel">{yearLabel}</span>
              </div>
            </div>
            
            <div className="cardActions">
              <button className="iconBtn" onClick={() => navigate("prev")}>
                <ChevronLeft size={20} />
              </button>
              <button className="pillBtn" onClick={() => onDateChange(Date.now())}>Idag</button>
              <button className="pillBtn" onClick={() => setView(v => v === "week" ? "month" : "week")}>
                {view === "week" ? "Månad" : "Vecka"}
              </button>
              <button className="iconBtn" onClick={() => navigate("next")}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {view === "week" ? (
            <div className="calendarRow">
              {weekDays.map((day) => {
                const isSelected = sameDay(day.date, selectedDate);
                return (
                  <div
                    key={day.date.toISOString()}
                    className={isSelected ? "dayPill isSelected" : "dayCell"}
                    onClick={() => onDateChange(day.date.getTime())}
                  >
                    <div className={isSelected ? "dow" : "dow isMuted"}>{day.dow}</div>
                    <div className="dom">{day.dom}</div>
                    {isSelected && <div className="dot" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="monthWrap">
              <div className="monthDowRow">
                {DOW_SV.map(d => <div key={d} className="monthDowCell">{d}</div>)}
              </div>
              <div className="monthGrid">
                {monthCells.map((d, idx) => {
                  const isSelected = sameDay(d, selectedDate);
                  const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                  return (
                    <div
                      key={idx}
                      className={`monthCell ${isCurrentMonth ? "" : "isOutside"} ${isSelected ? "isSelected" : ""}`}
                      onClick={() => onDateChange(d.getTime())}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}