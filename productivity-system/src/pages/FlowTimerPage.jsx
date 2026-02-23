import React from "react";
import FlowTimer from "../components/FlowTimer/FlowTimer";
import EnergyCare from "../components/EnergyCare/EnergyCare";
import Statistics from "../components/Statistics/Statistics";
import DashboardSchedule from "../components/Schedule/DashboardSchedule";

export default function FlowTimerPage() {
  // Vi skickar med dagens datum som standard
  const today = new Date();

  return (
    <div className="flow-page-container">
      {/* Sektion 1: Fokusområdet med Timer och det förenklade schemat */}
      <section className="timer-section">
        <FlowTimer />
        
        <DashboardSchedule selectedDate={today} />
      </section>

      {/* Sektion 2: Statistics */}
      <section className="statistics-section" style={{ marginTop: '40px' }}>
        <Statistics />
      </section>
    </div>
  );
}