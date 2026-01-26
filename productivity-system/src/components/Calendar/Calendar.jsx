import "./Calendar.css";
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

export default function Calendar() {
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
      <div className="screenInner">
        {/* Om du redan har FlowTime header/greeting i annan fil kan du ta bort detta block */}
        <header className="appHeader">
          <div className="logoBox" aria-hidden="true">
            <span className="logoBolt">⚡</span>
          </div>
          <div className="brandText">
            <h1 className="brandTitle">FlowTime</h1>
            <p className="brandTagline">Din produktivitetspartner</p>
          </div>
        </header>

        <section className="greeting">
          <p className="greetingText">God eftermiddag! Redo att optimera din dag?</p>
        </section>

        <div className="viewSwitch" role="tablist" aria-label="Växla vy">
          <button className="viewBtn isActive" role="tab" aria-selected="true" type="button">
            <span className="viewIcon" aria-hidden="true">🗓️</span>
          </button>
          <button className="viewBtn" role="tab" aria-selected="false" type="button">
            <span className="viewIcon" aria-hidden="true">⏱️</span>
          </button>
        </div>

        <div className="stack">
          {/* Kalenderkortet */}
          <section className="card">
            <div className="cardHeader">
              <div className="cardTitleWrap">
                <span className="miniIcon" aria-hidden="true">🗓️</span>
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

          {/* Schemakortet */}
          <section className="card">
            <div className="scheduleHeader">
              <div className="scheduleTitleWrap">
                <span className="miniIcon" aria-hidden="true">🕒</span>
                <h2 className="scheduleTitle">
                  Schema - {DOW_SV[mondayIndex(selectedDate)]} {selectedDate.getDate()}{" "}
                  {selectedDate.toLocaleString("sv-SE", { month: "long" })}
                </h2>
              </div>

              <button className="iconBtn" type="button" aria-label="Lägg till">
                +
              </button>
            </div>

            <div className="scheduleEmpty">Inget schemalagt för denna dag</div>
          </section>
        </div>
      </div>
    </main>
  );
}
