import { useEffect, useCallback, useState } from "react";
import "./FlowTimer.css"; 
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext";
import { useSession } from "../../contexts/SessionContext"; 
import EnergyModal from "../Energy/EnergyModal";

const formatMMSS = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function FlowTimer() {
  const { 
    activeMode, 
    secondsElapsed, 
    setSecondsElapsed, 
    isRunning, 
    setIsRunning,
    setActiveModeId 
  } = useFocusMode();
  
  const { addSession } = useSession(); 
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const targetSeconds = (activeMode.defaultDuration || 0) * 60;

  // Stäng av timern och visa modalen
  const finishSession = useCallback(() => {
    setIsRunning(false);
    setShowEnergyModal(true);
  }, [setIsRunning]);

  // Effekt för att bevaka när tiden är ute
  useEffect(() => {
    if (isRunning && targetSeconds > 0 && secondsElapsed >= targetSeconds) {
      const timer = setTimeout(() => {
        finishSession();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [secondsElapsed, targetSeconds, isRunning, finishSession]);

  const handleQuickSwitch = () => {
    if (secondsElapsed > 0) {
      addSession({
        duration: secondsElapsed,
        modeId: activeMode.id
      });
    }
    const nextMode = activeMode.id === 'break' ? 'deepWork' : 'break';
    setActiveModeId(nextMode);
    setSecondsElapsed(0);
    setIsRunning(true);
  };

  const handleToggle = () => {
    if (!isRunning && targetSeconds > 0 && secondsElapsed >= targetSeconds) {
      setSecondsElapsed(0);
    }
    setIsRunning(prev => !prev);
  };

  const handleManualStop = () => {
    if (secondsElapsed > 0) {
      finishSession();
    } else {
      setIsRunning(false);
    }
  };

  const resetClock = () => {
    setSecondsElapsed(0);
    setIsRunning(false);
  };

  return (
    <div className="ft-container">
      <div className={`ft-card ${isRunning ? "is-active" : ""}`}>
        <div className="ft-mode-info">
          {activeMode.name} — {activeMode.defaultDuration} min
        </div>

        <div className="ft-display-area">
          <div className="ft-circle-outline">
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
              <span>{isRunning ? "Pausa" : "Starta"}</span>
            </button>

            <button className="ft-btn-base ft-btn-switch" onClick={handleQuickSwitch}>
              <Coffee size={18} />
              <span>{activeMode.id === 'break' ? "Jobba nu" : "Ta en paus"}</span>
            </button>

            <button className="ft-btn-base ft-btn-stop" onClick={handleManualStop}>
              <RotateCcw size={18} />
              <span>Avsluta</span>
            </button>
          </div>

          <button className="ft-reset-link" onClick={resetClock}>
            <RotateCcw size={14} /> Nollställ klockan
          </button>
        </div>

        <EnergyModal 
          isOpen={showEnergyModal} 
          onClose={() => { 
            setShowEnergyModal(false); 
            setSecondsElapsed(0); 
            setIsRunning(false);
          }} 
          workedSeconds={secondsElapsed} 
        />
      </div>
    </div>
  );
}