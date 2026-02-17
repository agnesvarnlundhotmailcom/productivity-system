import { useState, useContext } from "react";
import "./FlowTimer.css";
import { DataContext } from "../../contexts/DataContext";
import { RotateCcw, Coffee, Target } from "lucide-react";
import CurrentTaskView from "../Taskview/CurrentTaskView";
import { useFlowTimer } from "../../hooks/useTimer";

const formatMMSS = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function FlowTimer() {
  const { data, resetStats } = useContext(DataContext); // Lade till resetStats här
  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);

  // Startar klockans interna logik (setInterval)
  useFlowTimer(isRunning, mode);

  // Hämtar tider direkt från context
  const secondsWork = data.settings.secondsWork ?? 0;
  const secondsBreak = data.settings.secondsBreak ?? 0;
  
  // Förenklad logik: Visa sekunder baserat på läge (Arbete/Paus)
  const timeToShow = mode === "work" ? secondsWork : secondsBreak;

  const startWork = () => {
    setMode("work");
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);
  
  const startBreak = () => {
    setMode("break");
    setIsRunning(true);
  };

  // Använder nu den centrala resetStats-funktionen istället för manuell setData
  const resetAll = () => {
    if (window.confirm("Vill du återställa all tid för idag?")) {
      setIsRunning(false);
      setMode("work");
      resetStats(); 
    }
  };

  return (
    <div className="ftWrap">
      <section className="ftCard">
        <CurrentTaskView 
          onStartTimer={startWork} 
          onPauseTimer={pause}
          isRunning={isRunning}
          timerMode={mode}
        />

        <div className="ftDial">
          <div className="ftRing" />
          <div className="ftTime">{formatMMSS(timeToShow)}</div>
          <div className="ftModePill">
            {mode === "work" ? <Target size={14} /> : <Coffee size={14} />}
            <span>
              {mode === "work" ? "Arbete" : "Paus"} {isRunning ? "• Pågår" : "• Pausad"}
            </span>
          </div>
        </div>

        <div className="ftMiniActions" style={{ gap: '12px', display: 'flex', marginTop: '20px' }}>
          <button 
            className={`ftBtn ftBtnBreak ${mode === "break" && isRunning ? "isSelected" : ""}`}
            onClick={isRunning && mode === "break" ? pause : startBreak}
            style={{ 
                padding: '12px 24px', 
                fontSize: '13px', 
                margin: 0, 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
          >
            <Coffee size={18} />
            {isRunning && mode === "break" ? "Stoppa paus" : "PAUSA"}
          </button>

          <button className="ftResetBtn" onClick={resetAll} style={{ flex: 1, margin: 0 }}>
            <RotateCcw size={18} strokeWidth={2.5} />
            Återställ
          </button>
        </div>
      </section>
    </div>
  );
}