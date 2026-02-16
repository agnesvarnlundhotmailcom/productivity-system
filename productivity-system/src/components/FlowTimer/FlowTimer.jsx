import { useState, useContext } from "react";
import "./FlowTimer.css";
import { DataContext } from "../../contexts/DataContext";
import { RotateCcw, Coffee, Target } from "lucide-react";
import CurrentTaskView from "../Taskview/CurrentTaskView";
import { useFlowTimer } from "../../hooks/useTimer";

const formatMMSS = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function FlowTimer() {
  const { data, setData } = useContext(DataContext);
  
  // Vi läser isRunning och mode från Context om vi vill att den ska köras i bakgrunden,
  // men här behåller vi lokala states för enkelhetens skull.
  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);

  // Aktivera motorn
  useFlowTimer(isRunning, mode);

  const secondsWork = data.settings.secondsWork ?? 0;
  const secondsBreak = data.settings.secondsBreak ?? 0;
  const taskGoal = data.settings.activeTaskDuration ?? 0;

  // LOGIK: Om vi har ett mål från kalendern -> visa nedräkning. Annars -> uppräkning.
  const timeToShow = (mode === "work" && taskGoal > 0) 
    ? Math.max(0, taskGoal - secondsWork) 
    : (mode === "work" ? secondsWork : secondsBreak);

  const startWork = () => { setMode("work"); setIsRunning(true); };
  const pause = () => setIsRunning(false);
  
  const startBreak = () => {
    if (mode === "work" && isRunning) {
      setData(prev => ({ 
        ...prev, 
        settings: { ...prev.settings, sessions: (prev.settings.sessions ?? 0) + 1 } 
      }));
    }
    setMode("break");
    setIsRunning(true);
  };

  const resetAll = () => {
    if (window.confirm("Vill du återställa all tid för idag?")) {
      setIsRunning(false);
      setMode("work");
      setData(prev => ({
        ...prev,
        settings: { 
          ...prev.settings, 
          secondsWork: 0, 
          secondsBreak: 0, 
          sessions: 0,
          activeTaskDuration: 0 
        }
      }));
    }
  };

  return (
    <div className="ftWrap">
      <section className="ftCard">
        <CurrentTaskView 
          onStartTimer={startWork} 
          onPauseTimer={pause}
          onStartBreak={startBreak}
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
          
          {/* Visar målet tydligt om det finns en kalenderhändelse */}
          {taskGoal > 0 && mode === "work" && (
            <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.6, fontWeight: 'bold' }}>
              MÅL: {Math.floor(taskGoal / 60)} MIN
            </div>
          )}
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
            {isRunning && mode === "break" ? "Stoppa paus" : "Ta paus"}
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