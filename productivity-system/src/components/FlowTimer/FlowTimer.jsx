import { useEffect, useCallback, useState } from "react";
import "./FlowTimer.css"; 
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext";
import { useSession } from "../../contexts/SessionContext"; 
import EnergyModal from "../Energy/EnergyModal";

/**
 * Hjälpfunktion som gör om sektunder till läsbar tid (MM:SS)
 * @param {number} s - Antal sekunder som ska formateras.
 * @returns {string} Tid i formatet "05:30".
 * @example
 * formatMMSS(65) // Blir "01:05"
 */
const formatMMSS = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * Huvudkomponenten för timern.
 * Den håller koll på om klockan tickar, visar tiden och öppnar energirutan när tiden är ute.
 * @component
 */
export default function FlowTimer() {
  // Här hämtar vi allt vi behöver om nuvarande läge och tid från vår FocusContext
  const { 
    activeMode, 
    secondsElapsed, 
    setSecondsElapsed, 
    isRunning, 
    setIsRunning,
    setActiveModeId 
  } = useFocusMode();
  
  const { addSession } = useSession(); 
  // Håller koll på om vi ska visa den stora rutan för att välja energi
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  // Räknar ut hur många sekunder vi siktar på (t.ex 25 min * 60)
  const targetSeconds = (activeMode.defaultDuration || 0) * 60;

/**
 * Stoppar klockan och visar rutan där man loggar sin energi.
 */
  const finishSession = useCallback(() => {
    setIsRunning(false);
    setShowEnergyModal(true);
  }, [setIsRunning]);

  // En "effekt" som lyssnar hela tiden: Om tiden går över målet -> avsluta.
  useEffect(() => {
    if (isRunning && targetSeconds > 0 && secondsElapsed >= targetSeconds) {
      const timer = setTimeout(() => {
        finishSession();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [secondsElapsed, targetSeconds, isRunning, finishSession]);

  /**
   * Byter direkt mellan jobb och paus utan attv vänta på att tiden går ut.
   * Sparar det vi hunnit med hittills i historiken
   */
  const handleQuickSwitch = () => {
    if (secondsElapsed > 0) {
      addSession({
        duration: secondsElapsed,
        modeId: activeMode.id
      });
    }
    //Byt läge: Om vi pausar -> börja jobba, annars -> ta paus.
    const nextMode = activeMode.id === 'break' ? 'deepWork' : 'break';
    setActiveModeId(nextMode);
    setSecondsElapsed(0);
    setIsRunning(true);
  };

  /**
   * Startar eller pausar klockan.
   */
  const handleToggle = () => {
    // Om vi försöker starta en klocka som redan är "klar", börja om från noll
    if (!isRunning && targetSeconds > 0 && secondsElapsed >= targetSeconds) {
      setSecondsElapsed(0);
    }
    setIsRunning(prev => !prev);
  };

  /**
   * Stoppar timern manuellt. Om vi har hunnit jobba lite visas energirutan.
   */
  const handleManualStop = () => {
    if (secondsElapsed > 0) {
      finishSession();
    } else {
      setIsRunning(false);
    }
  };

  /**
   * Nollställer bara siffrorna på klockan utan att spara något.
   */
  const resetClock = () => {
    setSecondsElapsed(0);
    setIsRunning(false);
  };

  return (
    <div className="ft-container">
      {/* Om klockan tickar lägger vi till CSS-klassen 'is-active' för att t.ex göra kanten glödande */}
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

            {/* Snabbt byte till paus/jobb*/}
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

          <button className="ft-reset-link" onClick={resetClock}>
            <RotateCcw size={14} /> Nollställ klockan
          </button>
        </div>

        {/* Energirutan som bara visas när showEnergyModal är true  */}
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