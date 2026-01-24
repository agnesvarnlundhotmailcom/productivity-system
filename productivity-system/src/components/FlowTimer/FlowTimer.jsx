//Import av React och nödvändiga hooks
import React, { useState, useEffect, useMemo } from "react";
import "./FlowTimer.css";

// Huvudkomponenten för FlowTimer
export default function FlowTimer() {
  // State-variabler för att hantera tid, paus och flödestillstånd
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isInFlow, setIsInFlow] = useState(false);

  // Effekt-hook för att hantera timer-logiken
  useEffect(() => {
    let interval = null;
    if (!isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      } , 1000);
    } else if (isPaused && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPaused, time]);

  // Memoizerad beräkning av formaterad tid
  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [time]);

  // Funktioner för att hantera knapptryckningar
  const handleStartPause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTime(0);
    setIsPaused(true);
    setIsInFlow(false);
  };

  const handleToggleFlow = () => {
    setIsInFlow(!isInFlow);
  };

  // Rendera komponenten
  return (
    <div className="flow-timer">
      <h1>Flow Timer</h1>
      <div className={`timer-display ${isInFlow ? "in-flow" : ""}`}>
        {formattedTime}
      </div>
      <div className="controls">
        <button onClick={handleStartPause}>
          {isPaused ? "Start" : "Pause"}
        </button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleToggleFlow}>
          {isInFlow ? "Exit Flow" : "Enter Flow"}
        </button>
      </div>
    </div>
  );
}     