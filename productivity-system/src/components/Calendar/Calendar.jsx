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

<<<<<<< HEAD
export default function Calender() {
  // Veckans "ankare" i ms (number) — robust och lätt att flytta
  const [currentTs, setCurrentTs] = useState(() => Date.now());

  // Vald dag i ms (number) eller null
  // Vid start: markera idag
  const [selectedTs, setSelectedTs] = useState(() => Date.now());

  const currentDate = useMemo(() => new Date(currentTs), [currentTs]);
  const selectedDate = useMemo(
    () => (selectedTs == null ? null : new Date(selectedTs)),
    [selectedTs]
  );

=======
export default function CalendarView() {
  const [currentTs, setCurrentTs] = useState(() => Date.now());
  const [selectedTs, setSelectedTs] = useState(() => Date.now());

  const currentDate = useMemo(() => new Date(currentTs), [currentTs]);
  const selectedDate = useMemo(
    () => (selectedTs == null ? null : new Date(selectedTs)),
    [selectedTs]
  );

>>>>>>> cf0c6f30ac7248a1d99cf2750c54ee4501a48d86
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
<<<<<<< HEAD
    setSelectedTs(null); // bläddring => ingen markering
=======
    setSelectedTs(null);
>>>>>>> cf0c6f30ac7248a1d99cf2750c54ee4501a48d86
  }

  function nextWeek() {
    setCurrentTs((ts) => ts + WEEK_MS);
<<<<<<< HEAD
    setSelectedTs(null); // bläddring => ingen markering
=======
    setSelectedTs(null);
>>>>>>> cf0c6f30ac7248a1d99cf2750c54ee4501a48d86
  }

  function goToday() {
    const now = Date.now();
<<<<<<< HEAD
    setCurrentTs(now);    // visar veckan för idag
    setSelectedTs(now);   // markerar idag
=======
    setCurrentTs(now);
    setSelectedTs(now);
>>>>>>> cf0c6f30ac7248a1d99cf2750c54ee4501a48d86
  }

  return (
    <main className="screen">
      <div className="stack">
        <section className="card">
          <div className="cardHeader">
            <div className="cardTitleWrap">
<<<<<<< HEAD
              <span style={{ marginRight: "8px" }}>
                <Calendar size={20} color="#0ed3ac" />
=======
              <span style={{ marginRight: 8 }}>
                <CalendarIcon
                  size={20}
                  color="#0ed3ac"
                  style={{ filter: "drop-shadow(0 0 5px var(--accent-primary))" }}
                />
>>>>>>> cf0c6f30ac7248a1d99cf2750c54ee4501a48d86
              </span>
              <h2 className="cardTitle">{monthLabel}</h2>
            </div>

            <div className="cardActions">
<<<<<<< HEAD
              <button
                className="iconBtn"
                type="button"
                aria-label="Föregående vecka"
                onClick={prevWeek}
              >
                ‹
              </button>

              <button className="pillBtn" type="button" onClick={goToday}>
                Idag
              </button>

              <button
                className="iconBtn"
                type="button"
                aria-label="Nästa vecka"
                onClick={nextWeek}
              >
                ›
              </button>
            </div>
          </div>

          <div className="calendarRow">
            {weekDays.map((day) => {
              const isSelected =
                selectedDate instanceof Date && sameDay(day.date, selectedDate);
=======
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
>>>>>>> cf0c6f30ac7248a1d99cf2750c54ee4501a48d86

              return (
                <div
                  key={`${day.date.getFullYear()}-${pad2(
                    day.date.getMonth() + 1
                  )}-${pad2(day.dom)}`}
                  className={isSelected ? "dayPill isSelected" : "dayCell"}
<<<<<<< HEAD
                  onClick={() => setSelectedTs(day.date.getTime())}
                  role="button"
                  tabIndex={0}
=======
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTs(day.date.getTime())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedTs(day.date.getTime());
                    }
                  }}
>>>>>>> cf0c6f30ac7248a1d99cf2750c54ee4501a48d86
                >
                  <div className={isSelected ? "dow" : "dow isMuted"}>
                    {day.dow}
                  </div>
                  <div className="dom">{day.dom}</div>
<<<<<<< HEAD
                  {isSelected && <div className="dot" aria-hidden="true" />}
=======
                  {isSelected && <div className="dot" />}
>>>>>>> cf0c6f30ac7248a1d99cf2750c54ee4501a48d86
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}