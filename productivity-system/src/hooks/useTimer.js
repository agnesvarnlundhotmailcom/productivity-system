// src/hooks/useTimer.js
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
        const goal = prev.settings.activeTaskDuration ?? 0;

        let nextWork = mode === "work" ? currentWork + 1 : currentWork;
        let nextBreak = mode === "break" ? currentBreak + 1 : currentBreak;
        let shouldStop = false;

        // Kontroll: Stoppa automatiskt om vi har ett mål och det har uppnåtts
        if (mode === "work" && goal > 0 && nextWork >= goal) {
          shouldStop = true;
        }

        return {
          ...prev,
          settings: {
            ...prev.settings,
            secondsWork: nextWork,
            secondsBreak: nextBreak,
            // Stänger av timern när målet är nått
            isRunning: shouldStop ? false : prev.settings.isRunning
          }
        };
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, mode, setData]);
}