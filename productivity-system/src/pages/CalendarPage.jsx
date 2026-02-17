import React from "react";
import Calendar from "../components/Calendar/Calendar";
import DailySchedule from "../components/Schedule/DailySchedule";
import TodoWidget from "../components/ToDo/TodoWidget";

export default function CalendarPage({ selectedDate, setSelectedDate }) {
  // 1. Säkerställ att vi har ett giltigt Date-objekt för visning
  const safeDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

  // 2. Hantera klick från kalendern (omvandla timestamp till Date-objekt)
  const handleDateChange = (newVal) => {
    setSelectedDate(new Date(newVal));
  };

  return (
    <div className="calendar-page-content">

      {/* Kalendern överst */}
      <div className="calendar-wrapper">
        <Calendar
          selectedTs={safeDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Schema och To-Do i en grid */}
      <div className="grid-layout">
        <div className="schedule-wrapper">
          <DailySchedule selectedDate={safeDate} />
        </div>

        <div className="todo-wrapper">
          <TodoWidget />
        </div>
      </div>

    </div>
  );
}