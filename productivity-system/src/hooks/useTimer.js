import { useState, useEffect, useCallback, useRef } from "react";
import { useFocusMode } from "../contexts/FocusModeContext";
import { useSession } from "../contexts/SessionContext";

/**
 * @typedef {Object} FlowTimerLogic
 * @property {Object} activeMode - Det nuvarande läget (t.ex. deepWork eller break).
 * @property {number} secondsElapsed - Antal sekunder som har gått i nuvarande session.
 * @property {boolean} isRunning - Om timern tickar eller är pausad.
 * @property {boolean} showEnergyModal - Om energimodalen ska visas.
 * @property {Function} handleToggle - Startar eller pausar timern.
 * @property {Function} handleQuickSwitch - Byter läge direkt och sparar nuvarande framsteg.
 * @property {Function} handleManualStop - Avbryter sessionen och öppnar loggning om tid finns.
 * @property {Function} resetClock - Nollställer klockan utan att spara.
 * @property {Function} closeEnergyModal - Stänger modalen och återställer timern.
 */

/**
 * Custom hook som hanterar all logik för FlowTimer, inklusive tidsberäkning,
 * flik-synkronisering och interaktion med kontexter.
 * * @returns {FlowTimerLogic} Objekt som innehåller state och handlers för timern.
 */
export const useFlowTimerLogic = () => {
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
  const backgroundTimeRef = useRef(null);
  const targetSeconds = (activeMode.defaultDuration || 0) * 60;

  /**
   * Hanterar synkronisering av tid när användaren lämnar/återvänder till fliken.
   * Räknar ut differensen mellan utstämpling och återkomst.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        backgroundTimeRef.current = Date.now();
      } else if (document.visibilityState === "visible" && isRunning && backgroundTimeRef.current) {
        const spentAway = Math.floor((Date.now() - backgroundTimeRef.current) / 1000);
        if (spentAway > 0) {
          setSecondsElapsed(prev => prev + spentAway);
        }
        backgroundTimeRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning, setSecondsElapsed]);

  /**
   * Avslutar sessionen genom att stoppa klockan och visa energimodalen.
   */
  const finishSession = useCallback(() => {
    setIsRunning(false);
    setShowEnergyModal(true);
  }, [setIsRunning]);

  /**
   * Lyssnar på om timern har nått sitt tidsmål och triggar avslutning.
   */
  useEffect(() => {
    if (isRunning && targetSeconds > 0 && secondsElapsed >= targetSeconds) {
      const timer = setTimeout(finishSession, 0);
      return () => clearTimeout(timer);
    }
  }, [secondsElapsed, targetSeconds, isRunning, finishSession]);

  /**
   * Växlar mellan start/paus. Om sessionen redan är klar startas den om.
   */
  const handleToggle = () => {
    if (!isRunning && targetSeconds > 0 && secondsElapsed >= targetSeconds) {
      setSecondsElapsed(0);
    }
    setIsRunning(prev => !prev);
  };

  /**
   * Byter omedelbart mellan jobb och paus, sparar den tid som gått till historiken.
   */
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

  /**
   * Stoppar timern manuellt. Om tid finns loggad öppnas modalen för utvärdering.
   */
  const handleManualStop = () => {
    if (secondsElapsed > 0) {
      finishSession();
    } else {
      setIsRunning(false);
    }
  };

  /**
   * Nollställer timern och pausar klockan utan att spara sessionen.
   */
  const resetClock = () => {
    setSecondsElapsed(0);
    setIsRunning(false);
  };

  /**
   * Stänger energimodalen och nollställer timern inför nästa runda.
   */
  const closeEnergyModal = () => {
    setShowEnergyModal(false);
    setSecondsElapsed(0);
    setIsRunning(false);
  };

  return {
    activeMode,
    secondsElapsed,
    isRunning,
    showEnergyModal,
    handleToggle,
    handleQuickSwitch,
    handleManualStop,
    resetClock,
    closeEnergyModal
  };
};