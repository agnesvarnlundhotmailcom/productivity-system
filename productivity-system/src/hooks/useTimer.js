// src/hooks/useTimer.js
import { useEffect, useContext } from 'react';
import { DataContext } from "../../contexts/DataContext";

export function useFlowTimer(isRunning, mode) {
  const { setData } = useContext(DataContext);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setData(prev => {
        const currentWork = prev.settings.secondsWork ?? 0;
        const newWork = mode === "work" ? currentWork + 1 : currentWork;
        
        // LOGIK FÖR LJUD: Spela ett ljud var 25:e minut (1500 sekunder)
        // Detta visar logik inuti en state-uppdatering.
        if (mode === "work" && newWork > 0 && newWork % 1500 === 0) {
          const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
          audio.play().catch(e => console.log("Ljudet kunde inte spelas: ", e));
        }

        return {
          ...prev,
          settings: {
            ...prev.settings,
            secondsWork: newWork,
            secondsBreak:
              mode === "break"
                ? (prev.settings.secondsBreak ?? 0) + 1
                : prev.settings.secondsBreak ?? 0,
          }
        };
      });
    }, 1000);

   
    return () => clearInterval(id);
  }, [isRunning, mode, setData]);
}