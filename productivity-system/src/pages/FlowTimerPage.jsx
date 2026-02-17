import React from "react";
import FlowTimer from "../components/FlowTimer/FlowTimer";
import EnergyCare from "../components/EnergyCare/EnergyCare";
import Statistics from "../components/Statistics/Statistics";

export default function FlowTimerPage() {
  return (
    <div className="flow-page-container">
      {/* Sektion 1: Timern */}
      <section className="timer-section">
        <FlowTimer />
      </section>

      {/* Sektion 2: Statistics */}
      <section className="statistics-section" style={{ marginTop: '40px' }}>
        <Statistics />
      </section>

    </div>
  );
}