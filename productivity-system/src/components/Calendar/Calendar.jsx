
import "./Calendar.css";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendar, sameDay } from "../../hooks/useCalendar";
import { useMemo } from "react";

/**
 * En kalenderkomponent som låter användaren välja datum.
 * Den kan visa antingen en hel månad eller bara den nuvarande veckan.
 * @component
 * @param {Object} props
 * @param {number} props.selectedTs
 * @param {Function} props.onDateChange
 */
export default function Calendar({ selectedTs, onDateChange }) {
  // Hooks: Hämta kalenderdata och helgdagar
  const {
    view, setView, currentDate, selectedDate,
    weekDays, monthCells, navigate, DOW_SV, holidays, loading, error
  } = useCalendar(selectedTs);

  /**
   * Skapa en lookup-map för helgdagar: "YYYY-MM-DD" => holiday-objekt
   * Gör det snabbt att slå upp om ett datum är en helgdag.
   */
  const holidayByDate = useMemo(() => {
    const map = new Map();
    holidays.forEach(h => map.set(h.date, h));
    return map;
  }, [holidays]);

  // Hantera laddning och fel
  let status = null;
  if (loading) status = <p>Laddar helgdagar…</p>;
  if (error) status = <p className="calendar-error">Fel: {error}</p>;

  // Skapa snygga texter för månad och år på svenska
  const monthLabel = currentDate.toLocaleString("sv-SE", { month: "long" });
  const yearLabel = currentDate.toLocaleString("sv-SE", { year: "numeric" });

  // Rendera kalendern
  return (
    <section className="calendar-card">
      {/* Visa laddningsindikator eller felmeddelande */}
      {status}
      {/* Kalenderhuvud med månad, år och navigering */}
      <header className="calendar-header">
        <div className="calendar-title-group">
          <CalendarIcon size={30} className="calendar-main-icon" />
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

      {/* Rendera veckovy eller månadsvy beroende på valt läge */}
      {view === "week" ? (
        <div className="week-grid">
          {weekDays.map((day) => {
            // Markera vald dag
            const isSelected = sameDay(day.date, selectedDate);
            const iso = day.date.toISOString().slice(0, 10); // YYYY-MM-DD
            const holiday = holidayByDate.get(iso);
            return (
              <button
                key={day.date.toISOString()}
                className={`day-pill week-pill${isSelected ? " is-selected" : ""}`}
                onClick={() => onDateChange(day.date.getTime())}
              >
                {/* Helgdag överst */}
                {holiday ? (
                  <div className="holiday-div">{holiday.localName}</div>
                ) : (
                  <div className="holiday-div" style={{ visibility: "hidden" }}>&nbsp;</div>
                )}
                <span className="day-name">{day.dow}</span>
                <span className="month-date">{day.dom}</span>
                {/* Visa en liten prick om dagen är vald */}
                {isSelected && <span className="active-dot" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="month-container">
          <div className="month-header">
            {/* Rendera veckodagsnamn */}
            {DOW_SV.map(d => <div key={d} className="month-dow-cell">{d}</div>)}
          </div>
          <div className="month-grid">
            {monthCells.map((d, idx) => {
              // Markera vald dag och helgdagar
              const isSelected = sameDay(d, selectedDate);
              const isOutside = d.getMonth() !== currentDate.getMonth();
              const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
              const holiday = holidayByDate.get(iso);
              return (
                <button
                  key={idx}
                  className={`month-cell${isOutside ? " is-outside" : ""}${isSelected ? " is-selected" : ""}${holiday ? " is-holiday" : ""}`}
                  onClick={() => onDateChange(d.getTime())}
                  title={holiday ? holiday.localName : undefined}
                >
                  {/* Visa namn på helgdag överst */}
                  {holiday ? (
                    <div className="holiday-div">{holiday.localName}</div>
                  ) : (
                    <div className="holiday-div" style={{ visibility: "hidden" }}>&nbsp;</div>
                  )}
                  <span className="month-date">{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}