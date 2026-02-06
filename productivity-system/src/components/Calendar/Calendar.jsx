import "./Calendar.css";
import { Calendar } from "lucide-react";
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

export default function Calender() {
  // Veckans "ankare" i ms (number) — robust och lätt att flytta
  const [currentTs, setCurrentTs] = useState(() => Date.now());

  //vi gör en toggle så att vi kan byta vy mellan vecka och månad
  const [view, setView] = useState("week"); // "week" | "month"

  // Vald dag i ms (number) eller null
  // Vid start: markera idag
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


  const monthLabel = currentDate.toLocaleString("sv-SE", {
    month: "long",
    year: "numeric",
  });

function prev() {
  if (view === "week") {
    setCurrentTs((ts) => ts - WEEK_MS);
  } else {
    setCurrentTs((ts) => {
      const d = new Date(ts);
      d.setMonth(d.getMonth() - 1);
      return d.getTime();
    });
  }
  setSelectedTs(null);
}

function next() {
  if (view === "week") {
    setCurrentTs((ts) => ts + WEEK_MS);
  } else {
    setCurrentTs((ts) => {
      const d = new Date(ts);
      d.setMonth(d.getMonth() + 1);
      return d.getTime();
    });
  }
  setSelectedTs(null);
}

  function goToday() {
    const now = Date.now();
    setCurrentTs(now);    // visar veckan för idag
    setSelectedTs(now);   // markerar idag
  }

  return (
    <main className="screen">
      <div className="stack">
        <section className="card">
          <div className="cardHeader">
            <div className="cardTitleWrap">
              <span style={{ marginRight: "8px" }}>
                <Calendar size={20} color="#0ed3ac" />
              </span>
              <h2 className="cardTitle">{monthLabel}</h2>
            </div>

            <div className="cardActions">
              <button
                className="iconBtn"
                type="button"
                aria-label="Föregående vecka"
                onClick={prev}
              >
                ‹
              </button>

             <button
                className="pillBtn"
                type= "button"
                onClick={() => setView(v =>(v ==="week"? "month" : "week"))}
            >
                {view === "week" ? "Månad" : "Vecka"}
            </button>

              <button className="pillBtn" type="button" onClick={goToday}>
                Idag
              </button>

              <button
                className="iconBtn"
                type="button"
                aria-label="Nästa vecka"
                onClick={next}
              >
                ›
              </button>
            </div>
          </div>

{view === "week" ? (
  <div className="calendarRow">
    {weekDays.map((day) => {
      const isSelected =
        selectedDate instanceof Date && sameDay(day.date, selectedDate);

      return (
        <div
          key={`${day.date.getFullYear()}-${pad2(day.date.getMonth() + 1)}-${pad2(day.dom)}`}
          className={isSelected ? "dayPill isSelected" : "dayCell"}
          onClick={() => setSelectedTs(day.date.getTime())}
          role="button"
          tabIndex={0}
        >
          <div className={isSelected ? "dow" : "dow isMuted"}>{day.dow}</div>
          <div className="dom">{day.dom}</div>
          {isSelected && <div className="dot" aria-hidden="true" />}
        </div>
      );
    })}
  </div>
) : (
  <div className="monthWrap">
    <div className="monthDowRow">
      {DOW_SV.map((d) => (
        <div key={d} className="monthDowCell">{d}</div>
      ))}
    </div>

    <div className="monthGrid">
      {monthCells.map((d, idx) => {
        const isSelected =
          selectedDate instanceof Date && sameDay(d, selectedDate);

        const isCurrentMonth = d.getMonth() === currentDate.getMonth();

        return (
          <div
            key={idx}
            className={[
              "monthCell",
              isCurrentMonth ? "" : "isOutside",
              isSelected ? "isSelected" : "",
            ].join(" ")}
            onClick={() => setSelectedTs(d.getTime())}
            role="button"
            tabIndex={0}
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