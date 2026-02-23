import React from "react";
import FlowTimer from "../components/FlowTimer/FlowTimer";
import DashboardSchedule from "../components/Schedule/DashboardSchedule";
import Statistics from "../components/Statistics/Statistics";
import FocusModes from "../components/focusMode/FocusModes";

export default function FlowTimerPage() {
  const today = new Date(); // Skapar dagens datum

  return (
    <div className="dashboard-container">
      <div className="main-grid flow-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Kolumn 1 & 2: Timer och Schema */}
        <div className="main-left-col" style={{ gridColumn: "span 2", display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="card">
            <FlowTimer />
          </section>
          
          <section className="card">
            <DashboardSchedule selectedDate={today} /> {/* Skickar datumet här! */}
          </section>
        </div>

        {/* Kolumn 3: Sidomeny */}
        <div className="sidebar-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <FocusModes />
          <Statistics />
        </div>
      </div>
    </div>
  );
}