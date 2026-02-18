// src/hooks/useTimer.js
import { useEffect, useContext } from 'react';
import { DataContext } from "../contexts/DataContext";

export function useFlowTimer(isRunning, mode) {
  const { setData } = useContext(DataContext);

  useEffect(() => {
    if (!isRunning) return;

    const klocka = setInterval(() => {
      setData((prev) => {
        const settings = prev.settings || {};
        const nuvarandeJobbTid = settings.secondsWork ?? 0;
        const nuvarandePausTid = settings.secondsBreak ?? 0;
        const måltid = settings.activeTaskDuration ?? 0;

        let nyJobbTid = nuvarandeJobbTid;
        let nyPausTid = nuvarandePausTid;
        let skaStanna = false;

        if (mode === "work") {
          nyJobbTid += 1;
          if (måltid > 0 && nyJobbTid >= måltid) {
            skaStanna = true;
          }
        } else {
          nyPausTid += 1;
        }

        return {
          ...prev,
          settings: {
            ...settings,
            secondsWork: nyJobbTid,
            secondsBreak: nyPausTid,
            isRunning: skaStanna ? false : isRunning
          }
        };
      });
    }, 1000);

    return () => clearInterval(klocka);
  }, [isRunning, mode, setData]);
}