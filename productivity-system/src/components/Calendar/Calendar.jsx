import "./Calendar.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Gör om JS getDay (sön=0..lör=6) till mån=0..sön=6
function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

const DOW_SV = ["mån", "tis", "ons", "tors", "fre", "lör", "sön"];
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function CalendarView() {
  const [currentTs, setCurrentTs] = useState(() => Date.now());
  const [selectedTs, setSelectedTs] = useState(() => Date.now());

  const currentDate = useMemo(() => new Date(currentTs), [currentTs]);
  const selectedDate = useMemo(
    () => (selectedTs == null ? null : new Date(selectedTs)),
    [selectedTs]
  );

  const weekDays = useMemo(() => {
    const base = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const startOffset = mondayIndex(base);
    const monday = new Date(base);
    monday.setDate(base.getDate() - startOffset);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { date: d, dow: DOW_SV[i], dom: d.getDate() };
    });
  }, [currentDate]);

  const monthLabel = currentDate.toLocaleString("sv-SE", {
    month: "long",
    year: "numeric",
  });

  function prevWeek() {
    setCurrentTs((ts) => ts - WEEK_MS);
    setSelectedTs(null);
  }

  function nextWeek() {
    setCurrentTs((ts) => ts + WEEK_MS);
    setSelectedTs(null);
  }

  function goToday() {
    const now = Date.now();
    setCurrentTs(now);
    setSelectedTs(now);
  }

  return (
    <main className="screen">
      <div className="stack">
        <section className="card">
          <div className="cardHeader">
            <div className="cardTitleWrap">
              <span style={{ marginRight: 8 }}>
                <CalendarIcon
                  size={20}
                  color="#0ed3ac"
                  style={{ filter: "drop-shadow(0 0 5px var(--accent-primary))" }}
                />
              </span>
              <h2 className="cardTitle">{monthLabel}</h2>
            </div>

            <div className="cardActions">
              <button className="iconBtn" onClick={prevWeek} aria-label="Föregående">
                ‹
              </button>
              <button className="pillBtn" onClick={goToday}>
                Idag
              </button>
              <button className="iconBtn" onClick={nextWeek} aria-label="Nästa">
                ›
              </button>
            </div>
          </div>

          <div className="calendarRow">
            {weekDays.map((day) => {
              const isSelected =
                selectedDate instanceof Date &&
                sameDay(day.date, selectedDate);

              return (
                <div
                  key={`${day.date.getFullYear()}-${pad2(
                    day.date.getMonth() + 1
                  )}-${pad2(day.dom)}`}
                  className={isSelected ? "dayPill isSelected" : "dayCell"}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTs(day.date.getTime())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedTs(day.date.getTime());
                    }
                  }}
                >
                  <div className={isSelected ? "dow" : "dow isMuted"}>
                    {day.dow}
                  </div>
                  <div className="dom">{day.dom}</div>
                  {isSelected && <div className="dot" />}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}