import React from "react";
import Calendar from "../components/Calendar/Calendar";
import DailySchedule from "../components/Schedule/DailySchedule";
import TodoWidget from "../components/ToDo/TodoWidget";

/**
 * Huvudsida för kalendervyn.
 * Sammanfogar kalendern med det dagliga schemat och att-göra-listan.
 * @component
 * @param {Object} props
 * @param {Date|string|number} props.selectedDate - Det aktuella valda datumet i appen.
 * @param {Funtion} props.setSelectedDate - Funktion för att uppdatera det valda datumet globalt.
 */
export default function CalendarPage({ selectedDate, setSelectedDate }) {

  // Ser till att vi alltid jobbar med ett riktigt Date-objekt.
  // Om selectedDate råkar vara en sträng eller siffra omvandlas den här för att undvika fel i underkomponenterna.
  const safeDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

  /**
   * Hanterar val av nytt datum i kalendern.
   * Ser till att det nya värdet sparas som ett Date-objekt i appens övergripande state.
   */
  const handleDateChange = (newVal) => {
    setSelectedDate(new Date(newVal));
  };

  return (
    <div className="calendar-page-content">

      {/* Kalenderväljaren placeras högst upp för enkelt åtkomst */}
      <div className="calendar-wrapper">
        <Calendar
          selectedTs={safeDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* En layout-grid som delar upp skärmen mellan schema och uppgifter */}
      <div className="grid-layout">

        {/* Vänster kolumn: Visar dagens planerade tider och aktiviteter */}
        <div className="schedule-wrapper">
          <DailySchedule selectedDate={safeDate} />
        </div>

        {/* Höger kolumn: En widget för att hantera dagens att-göra-lista */}
        <div className="todo-wrapper">
          <TodoWidget />
        </div>
      </div>

    </div>
  );
}