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

export default function Calender() {
  const [currentDate, setCurrentDate] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1); // månadsvy
  });

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const monthLabel = currentDate.toLocaleString("sv-SE", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function goToday() {
    const t = new Date();
    setSelectedDate(t);
    setCurrentDate(new Date(t.getFullYear(), t.getMonth(), 1));
  }

  // Veckorad runt selectedDate (mån..sön)
  const weekDays = useMemo(() => {
    const base = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    const startOffset = mondayIndex(base); // hur långt från måndag
    const monday = new Date(base);
    monday.setDate(base.getDate() - startOffset);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        date: d,
        dow: DOW_SV[i],
        dom: d.getDate(),
      };
    });
  }, [selectedDate]);

  return (
    <main className="screen">
        <div className="stack">
          {/* Kalenderkortet */}
          <section className="card">
            <div className="cardHeader">
              <div className="cardTitleWrap">
                <span style={{ marginRight: '8px' }}>
                <Calendar size={20} color="#0ed3ac" />
                </span>     
                <h2 className="cardTitle">{monthLabel}</h2>
              </div>

              <div className="cardActions">
                <button className="iconBtn" type="button" aria-label="Föregående" onClick={prevMonth}>
                  ‹
                </button>

                <button className="pillBtn" type="button" onClick={goToday}>
                  Idag
                </button>

                <button className="iconBtn" type="button" aria-label="Nästa" onClick={nextMonth}>
                  ›
                </button>
              </div>
            </div>

            <div className="calendarRow">
              {weekDays.map((day) => {
                const isSelected = sameDay(day.date, selectedDate);

                return (
                  <div
                    key={`${day.date.getFullYear()}-${pad2(day.date.getMonth() + 1)}-${pad2(day.dom)}`}
                    className={isSelected ? "dayPill isSelected" : "dayCell"}
                    onClick={() => setSelectedDate(day.date)}
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
          </section>
        </div>
    </main>
  );
}
