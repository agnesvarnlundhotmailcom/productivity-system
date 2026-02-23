import { useState, useEffect, useCallback } from "react";
import "./FlowTimer.css"; 
import { Play, Pause, RotateCcw } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext";
import { useSession } from "../../contexts/SessionContext";
import EnergyModal from "../Energy/EnergyModal";

const formatMMSS = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function FlowTimer() {
  const { activeMode } = useFocusMode();
  const { addSession } = useSession();
  
  // Vi börjar alltid på 0 sekunder
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [prevActiveModeId, setPrevActiveModeId] = useState(activeMode.id);


  // så nollställer vi klockan och stoppar den.
  if (activeMode.id !== prevActiveModeId) {
    setPrevActiveModeId(activeMode.id);
    setSecondsElapsed(0);
    setIsRunning(false);
  }

  const handleStop = useCallback(() => {
    if (secondsElapsed > 0) {
      // Sparar tiden du faktiskt kört till historiken
      addSession({
        startTime: new Date(Date.now() - secondsElapsed * 1000),
        endTime: new Date(),
        duration: secondsElapsed,
        focusMode: activeMode.id
      });
      
      setShowEnergyModal(true);
    }
    setIsRunning(false);
  }, [secondsElapsed, activeMode.id, addSession]);

  const handleToggle = () => {
    setIsRunning(prev => !prev);
  };

  const resetClock = () => {
    setSecondsElapsed(0);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1); // RÄKNAR UPPÅT
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="ft-container">
      <div className={`ft-card ${isRunning ? "is-active" : ""}`}>
        {/* Visar vilket läge du kör (t.ex. Deep Work) */}
        <div style={{textAlign: 'center', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
          {activeMode.name}
        </div>

        <div className="ft-display-area">
          <div className="ft-circle-outline">
            {/* Visar sekunder som räknas upp */}
            <span className="ft-timer-digits">{formatMMSS(secondsElapsed)}</span>
          </div>
        </div>

        <div className="ft-controls-wrapper">
          <div className="ft-btn-group">
            <button 
              className={`ft-btn-base ${isRunning ? "ft-btn-pause" : "ft-btn-start"}`}
              onClick={handleToggle}
            >
              {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              <span>{isRunning ? "Pausa" : "Starta arbete"}</span>
            </button>

            <button 
              className="ft-btn-base" 
              style={{backgroundColor: 'var(--surface-3)', color: 'var(--text-primary)'}}
              onClick={handleStop}
            >
              <RotateCcw size={18} />
              <span>Avsluta</span>
            </button>
          </div>

          <button className="ft-reset-link" onClick={resetClock}>
            <RotateCcw size={14} />
            Nollställ klockan
          </button>
        </div>

        <EnergyModal 
          isOpen={showEnergyModal} 
          onClose={() => {
            setShowEnergyModal(false);
            setSecondsElapsed(0); // Nollställ när modalen stängs
          }} 
          workedSeconds={secondsElapsed} 
        />
      </div>
    </div>
  );
}