import "./Calendar.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function mondayIndex(date) { return (date.getDay() + 6) % 7; }

const DOW_SV = ["mån", "tis", "ons", "tors", "fre", "lör", "sön"];
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function Calendar({ selectedTs, onDateChange }) {
  const [currentTs, setCurrentTs] = useState(() => Date.now());
  const [view, setView] = useState("week");

  const currentDate = useMemo(() => new Date(currentTs), [currentTs]);
  const selectedDate = useMemo(() => new Date(selectedTs), [selectedTs]);

  const weekDays = useMemo(() => {
    const base = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startOffset = mondayIndex(base);
    const monday = new Date(base);
    monday.setDate(base.getDate() - startOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { date: d, dow: DOW_SV[i], dom: d.getDate() };
    });
  }, [currentDate]);

  const monthCells = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const first = new Date(y, m, 1);
    const offset = mondayIndex(first);
    const start = new Date(y, m, 1 - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const yearLabel = currentDate.toLocaleString("sv-SE", { year: "numeric" });
  const monthLabel = currentDate.toLocaleString("sv-SE", { month: "long" });

  function prev() {
    if (view === "week") setCurrentTs(ts => ts - WEEK_MS);
    else setCurrentTs(ts => {
      const d = new Date(ts);
      d.setMonth(d.getMonth() - 1);
      return d.getTime();
    });
  }

  function next() {
    if (view === "week") setCurrentTs(ts => ts + WEEK_MS);
    else setCurrentTs(ts => {
      const d = new Date(ts);
      d.setMonth(d.getMonth() + 1);
      return d.getTime();
    });
  }

  return (
    <main className="screen">
      <div className="stack">
        <section className="card">
          <div className="cardHeader">
            <div className="cardTitleWrap">
              <h2 className="cardTitleYear">
                <CalendarIcon size={35} color="#0ed3ac" />
                {" " + yearLabel}
              </h2>
              <h2 className="cardTitle">{monthLabel}</h2>
            </div>
            <div className="cardActions">
              <button className="iconBtn" onClick={prev}>‹</button>
              <button className="pillBtn" onClick={() => onDateChange(Date.now())}>Idag</button>
              <button className="pillBtn" onClick={() => setView(v => v === "week" ? "month" : "week")}>
                {view === "week" ? "Månad" : "Vecka"}
              </button>
              <button className="iconBtn" onClick={next}>›</button>
            </div>
          </div>

          {view === "week" ? (
            <div className="calendarRow">
              {weekDays.map((day) => {
                const isSelected = sameDay(day.date, selectedDate);
                return (
                  <div
                    key={day.dom}
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