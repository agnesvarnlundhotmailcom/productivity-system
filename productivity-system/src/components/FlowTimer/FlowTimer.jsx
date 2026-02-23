import { useState, useContext } from "react";
import "./FlowTimer.css"; 
import { DataContext } from "../../contexts/DataContext";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useFlowTimer } from "../../hooks/useTimer";

const formatMMSS = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function FlowTimer() {
  const { data, resetStats } = useContext(DataContext);
  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);

  useFlowTimer(isRunning, mode);

  const secondsWork = data.settings.secondsWork ?? 0;
  const secondsBreak = data.settings.secondsBreak ?? 0;
  const timeToShow = mode === "work" ? secondsWork : secondsBreak;

  // Funktion för att hantera klick på Starta/Paus-knapparna
  const handleModeClick = (targetMode) => {
    if (mode === targetMode) {
      // Om vi redan är i läget, toggla mellan start/stopp
      setIsRunning(!isRunning);
    } else {
      // Om vi byter läge, byt och starta direkt
      setMode(targetMode);
      setIsRunning(true);
    }
  };

  const resetAll = () => {
    if (window.confirm("Vill du återställa all tid för idag?")) {
      setIsRunning(false);
      setMode("work");
      resetStats(); 
    }
  };

  return (
    <div className="ft-container">
      <div className="ft-card">
        
        <div className="ft-display-area">
          <div className="ft-circle-outline">
            <span className="ft-timer-digits">{formatMMSS(timeToShow)}</span>
          </div>
        </div>

        <div className="ft-controls-wrapper">
          <div className="ft-btn-group">
            <button 
              className={`ft-btn-base ft-btn-start ${isRunning && mode === "work" ? "is-running" : ""}`}
              onClick={() => handleModeClick("work")}
            >
              {isRunning && mode === "work" ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              <span>{isRunning && mode === "work" ? "Pausa arbete" : "Starta arbete"}</span>
            </button>

            <button 
              className={`ft-btn-base ft-btn-pause ${isRunning && mode === "break" ? "is-running" : ""}`}
              onClick={() => handleModeClick("break")}
            >
              {isRunning && mode === "break" ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              <span>{isRunning && mode === "break" ? "Pausa paus" : "Paus"}</span>
            </button>
          </div>

          {/* Återställningsknapp*/}
          <button className="ft-reset-link" onClick={resetAll}>
            <RotateCcw size={14} />
            Återställ dagens framsteg
          </button>
        </div>

      </div>
    </div>
  );
}