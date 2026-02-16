import { useEffect, useContext } from 'react';
import { DataContext } from "../contexts/DataContext";

export function useFlowTimer(isRunning, mode) {
  const { setData } = useContext(DataContext);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setData(prev => {
        const currentWork = prev.settings.secondsWork ?? 0;
        const currentBreak = prev.settings.secondsBreak ?? 0;
        
        // Målet hämtas från kalenderhändelsen (t.ex. 1800 sekunder för 30 min)
        const goal = prev.settings.activeTaskDuration ?? 0;

        let nextWork = mode === "work" ? currentWork + 1 : currentWork;
        let nextBreak = mode === "break" ? currentBreak + 1 : currentBreak;
        let shouldStop = false;

        // Kontrollera om arbetstiden har nått målet från kalendern
        if (mode === "work" && goal > 0 && nextWork >= goal) {
          // Spela ljud
          new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
            .play()
            .catch(() => {});
          
          shouldStop = true; // Flagga för att stoppa
        }

        return {
          ...prev,
          settings: {
            ...prev.settings,
            secondsWork: nextWork,
            secondsBreak: nextBreak,
            // Om shouldStop är true sätts isRunning till false (stoppar useEffect)
            isRunning: shouldStop ? false : prev.settings.isRunning 
          }
        };
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, mode, setData]);
}