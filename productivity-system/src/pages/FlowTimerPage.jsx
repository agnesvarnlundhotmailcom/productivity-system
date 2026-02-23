import React from "react";
import FlowTimer from "../components/FlowTimer/FlowTimer";
import Statistics from "../components/Statistics/Statistics";
import FocusModes from "../components/focusMode/FocusModes";

export default function FlowTimerPage() {
  // Vi skickar med dagens datum som standard
  const today = new Date();

  return (
    <div className="dashboard-container">
      <div className="main-grid flow-page-grid">
        {/* Kolumn 1 & 2: Timer och Schema */}
        <div className="column main-left-col" style={{ gridColumn: "span 2" }}>
          <section className="card timer-card-area">
            <FlowTimer />
          </section>
          
          <section className="card schedule-card-area">
            <h3>Dagens schema</h3>
            {/* Din Schema-komponent här */}
          </section>
        </div>

        {/* Kolumn 3: Sidomeny */}
        <div className="column sidebar-right-col">
          <div className="focus-mode-wrapper">
             <FocusModes />
          </div>
          
          <section className="card">
            <h3>Energinivå</h3>
          </section>

          <Statistics />
        </div>
      </div>
    </div>
  );
}