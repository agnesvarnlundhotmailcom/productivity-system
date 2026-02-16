import { useState, useContext } from "react";
import "./FlowTimer.css";
import { DataContext } from "../../contexts/DataContext";
import { RotateCcw, Coffee } from "lucide-react";
import CurrentTaskView from "../Taskview/CurrentTaskView";
import { useFlowTimer } from "../../hooks/useTimer";

// Hjälpfunktioner kan ligga utanför för att inte skräpa ner
const formatMMSS = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function FlowTimer() {
  const { data, setData } = useContext(DataContext);
  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);

  // Koppla på "hjärnan" - den tickar i bakgrunden
  useFlowTimer(isRunning, mode);

  const secondsWork = data.settings.secondsWork ?? 0;
  const secondsBreak = data.settings.secondsBreak ?? 0;
  const displaySeconds = mode === "work" ? secondsWork : secondsBreak;

  const startWork = () => { setMode("work"); setIsRunning(true); };
  
  const startBreak = () => {
    if (mode === "work" && isRunning) {
      setData(prev => ({ ...prev, settings: { ...prev.settings, sessions: (prev.settings.sessions ?? 0) + 1 } }));
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
        settings: { ...prev.settings, secondsWork: 0, secondsBreak: 0, sessions: 0 }
      }));
    }
  };

  return (
    <div className="ftWrap">
      <section className="ftCard">
        <CurrentTaskView 
          onStartTimer={startWork} 
<<<<<<< HEAD
          onPauseTimer={pause}
          onStartBreak={startBreak}
=======
          onPauseTimer={() => setIsRunning(false)}
>>>>>>> 425ea16 ( fixar custom hooks och rensa lite kod)
          isRunning={isRunning}
          timerMode={mode}
        />

        <div className="ftDial">
          <div className="ftRing" />
          <div className="ftTime">{formatMMSS(displaySeconds)}</div>
          <div className="ftModePill">
            {mode === "work" ? "Arbete" : "Paus"} {isRunning ? "• Pågår" : "• Pausad"}
          </div>
        </div>

<<<<<<< HEAD
        {/* Vi har tagit bort ftButtons helt för att göra plats åt den kombinerade raden under */}
=======
        <div className="ftButtons">
          <button
            className={`ftBtn ftBtnWork ${mode === "work" && isRunning ? "isSelected" : ""}`}
            onClick={isRunning && mode === "work" ? () => setIsRunning(false) : startWork}
          >
            {isRunning && mode === "work" ? "Pausa arbete" : "Starta arbete"}
          </button>
>>>>>>> 425ea16 ( fixar custom hooks och rensa lite kod)

        <div className="ftMiniActions" style={{ gap: '12px' }}>
          <button 
            className={`ftBtn ftBtnBreak ${mode === "break" && isRunning ? "isSelected" : ""}`}
<<<<<<< HEAD
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
=======
            onClick={isRunning && mode === "break" ? () => setIsRunning(false) : startBreak}
>>>>>>> 425ea16 ( fixar custom hooks och rensa lite kod)
          >
            <Coffee size={18} />
            {isRunning && mode === "break" ? "Stäng av paus" : "Ta paus"}
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