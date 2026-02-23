import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext";
import EnergyModal from "../Energy/EnergyModal";
import "./FlowTimer.css";

const formatMMSS = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// Denna inre komponent dör och föds på nytt varje gång du byter läge
// Det gör att alla states (tidsräknaren) nollställs automatiskt utan felmeddelanden.
function TimerCore({ activeMode }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showEnergyModal, setShowEnergyModal] = useState(false);

  const targetSeconds = (activeMode.defaultDuration || 0) * 60;

  const handleStop = useCallback(() => {
    setIsRunning(false);
    if (secondsElapsed > 0) {
      setShowEnergyModal(true);
    }
  }, [secondsElapsed]);

  const handleToggle = () => {
    if (secondsElapsed >= targetSeconds && targetSeconds > 0) {
      setSecondsElapsed(0);
    }
    setIsRunning(prev => !prev);
  };

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const nextValue = prev + 1;
          
          // Automatiskt stopp när målet nås (t.ex. 5 min)
          if (targetSeconds > 0 && nextValue >= targetSeconds) {
            // Vi stoppar timern och visar modalen i nästa tick för stabilitet
            setTimeout(() => {
              setIsRunning(false);
              setShowEnergyModal(true);
            }, 0);
            return targetSeconds;
          }
          return nextValue;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, targetSeconds]);

  return (
    <div className={`ft-card ${isRunning ? "is-active" : ""}`}>
      <div style={{textAlign: 'center', marginBottom: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
        {activeMode.name}
      </div>

      <div className="ft-display-area">
        <div className="ft-circle-outline">
          <span className="ft-timer-digits">{formatMMSS(secondsElapsed)}</span>
        </div>
      </div>

      <div className="ft-controls-wrapper">
        <div className="ft-btn-group">
          <button className={`ft-btn-base ${isRunning ? "ft-btn-pause" : "ft-btn-start"}`} onClick={handleToggle}>
            {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            <span>{isRunning ? "Pausa" : "Starta arbete"}</span>
          </button>

          <button className="ft-btn-base" style={{backgroundColor: 'var(--surface-3)', color: 'var(--text-primary)'}} onClick={handleStop}>
            <RotateCcw size={18} />
            <span>Avsluta</span>
          </button>
        </div>

        <button className="ft-reset-link" onClick={() => { setSecondsElapsed(0); setIsRunning(false); }}>
          <RotateCcw size={14} /> Nollställ klockan
        </button>
      </div>

      <EnergyModal 
        isOpen={showEnergyModal} 
        onClose={() => {
          setShowEnergyModal(false);
          setSecondsElapsed(0); 
        }} 
        workedSeconds={secondsElapsed} 
      />
    </div>
  );
}

// Huvudkomponent som lyssnar på Context
export default function FlowTimer() {
  const { activeMode } = useFocusMode();

  return (
    <div className="ft-container">
      {/* Genom att använda key={activeMode.id} nollställer React hela klockan automatiskt 
          så fort du byter läge i menyn. Detta tar bort behovet av useEffect-nollställning 
          och löser ESLint-felet permanent. */}
      <TimerCore key={activeMode.id} activeMode={activeMode} />
    </div>
  );
}