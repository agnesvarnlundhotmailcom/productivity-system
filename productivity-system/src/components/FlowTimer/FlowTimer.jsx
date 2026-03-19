import "./FlowTimer.css"; 
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import EnergyModal from "../Energy/EnergyModal";
import { useFlowTimerLogic } from "../../hooks/useTimer";

/**
 * Formaterar sekunder till strängformatet MM:SS.
 * @param {number} s - Sekunder att formatera.
 * @returns {string} Formaterad tid (t.ex. "05:00").
 */
const formatMMSS = (s) => 
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * FlowTimer - En visuell timer-komponent som låter användaren hantera fokussessioner.
 * Använder `useFlowTimerLogic` för att separera affärslogik från rendering.
 * * @component
 */

export default function FlowTimer() {
  const {
    activeMode,
    secondsElapsed,
    isRunning,
    showEnergyModal,
    handleToggle,
    handleQuickSwitch,
    handleManualStop,
    resetClock,
    closeEnergyModal
  } = useFlowTimerLogic();

  return (
    <div className="ft-container">
      {/* Container får klassen 'is-active' när timern körs för visuella effekter i CSS */}
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
            {/* Start/Paus-knapp */}
            <button 
              className={`ft-btn-base ${isRunning ? "ft-btn-pause" : "ft-btn-start"}`} 
              onClick={handleToggle}
            >
              {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              <span>{isRunning ? "Pausa" : "Starta"}</span>
            </button>

            {/* Knapp för att snabbt växla mellan lägen */}
            <button className="ft-btn-base ft-btn-switch" onClick={handleQuickSwitch}>
              <Coffee size={18} />
              <span>{activeMode.id === 'break' ? "Jobba nu" : "Ta en paus"}</span>
            </button>

            {/* Stopp-knapp */}
            <button className="ft-btn-base ft-btn-stop" onClick={handleManualStop}>
              <RotateCcw size={18} />
              <span>Avsluta</span>
            </button>
          </div>

          {/* Liten länk för att nollställa utan att spara session */}
          <button className="ft-reset-link" onClick={resetClock}>
            <RotateCcw size={14} /> Nollställ klockan
          </button>
        </div>

        {/* Modal för att logga energinivå efter avslutad session */}
        <EnergyModal 
          isOpen={showEnergyModal} 
          onClose={closeEnergyModal} 
          workedSeconds={secondsElapsed} 
        />
      </div>
    </div>
  );
}