import React from "react";
import FlowTimer from "../components/FlowTimer/FlowTimer";
import EnergyCare from "../components/EnergyCare/EnergyCare";

export default function FlowTimerPage() {
  return (
    <div className="flow-page-container">
      {/* Sektion 1: Timern */}
      <section className="timer-section">
        <FlowTimer />
      </section>

      {/* Sektion 2: Energy Care */}
      <section className="energy-section" style={{ marginTop: '40px' }}>
        <EnergyCare />
      </section>
    </div>
  );
}