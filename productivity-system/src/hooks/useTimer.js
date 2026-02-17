// src/hooks/useTimer.js
import { useEffect, useContext } from 'react';
import { DataContext } from "../contexts/DataContext";

export function useFlowTimer(isRunning, mode) {
  const { setData } = useContext(DataContext);

  useEffect(() => {
   
    if (isRunning === false) {
      return;
    }

    const klocka = setInterval(() => {
      
      setData((prev) => {
       
        const nuvarandeJobbTid = prev.settings.secondsWork ?? 0;
        const nuvarandePausTid = prev.settings.secondsBreak ?? 0;
        const måltidFrånKalender = prev.settings.activeTaskDuration ?? 0;

       
        let nyJobbTid = nuvarandeJobbTid;
        let nyPausTid = nuvarandePausTid;
        let skaKlockanStanna = false;

    
        if (mode === "work") {
          nyJobbTid = nuvarandeJobbTid + 1;
          
          // Kolla om vi har nått målet från kalendern
          if (måltidFrånKalender > 0 && nyJobbTid >= måltidFrånKalender) {
            skaKlockanStanna = true;
          }
        } 
      
        else {
          nyPausTid = nuvarandePausTid + 1;
        }

        // Skicka tillbaka den uppdaterade datan till "data-banken"
        return {
          ...prev,
          settings: {
            ...prev.settings,
            secondsWork: nyJobbTid,
            secondsBreak: nyPausTid,
            isRunning: skaKlockanStanna ? false : prev.settings.isRunning
          }
        };
      });
    }, 1000);

    
    return () => clearInterval(klocka);

  }, [isRunning, mode, setData]);
}