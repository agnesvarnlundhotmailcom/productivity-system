import React from "react";
import FlowTimer from "../components/FlowTimer/FlowTimer";
import DashboardSchedule from "../components/Schedule/DashboardSchedule";
import FocusModes from "../components/focusMode/FocusModes";

export default function FlowTimerPage() {
  const today = new Date();

  return (
    <div className="dashboard-container">
      {/* Behåll din original-styling här för desktop */}
      <div className="main-grid flow-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Kolumn 1 & 2: Timer och Schema */}
        <div className="main-left-col" style={{ gridColumn: "span 2", display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="card timer-card-area">
            <FlowTimer />
          </section>
          
          <section className="card schedule-card-area">
            <DashboardSchedule selectedDate={today} />
          </section>
        </div>

        {/* Kolumn 3: Sidomeny */}
        <div className="sidebar-right-col focus-mode-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <FocusModes />
        </div>
      </div>
    </div>
  );
}