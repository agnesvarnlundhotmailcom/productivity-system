import { useEffect, useContext } from 'react';
import { DataContext } from "../contexts/DataContext";

/**
 * Hook för att hantera en flow/pomodoro-timer som uppdaterar arbets- och paustid.
 *
 * @param {boolean} isRunning - Anger om timern är aktiv eller pausad.
 * @param {string} mode - Timerläget: "work" för arbetstid eller "break" för paustid.
 *
 * @description
 * Uppdaterar DataContext med ökad tid baserat på läget. När arbetstiden når måltiden (activeTaskDuration),
 * stoppas timern automatiskt. Timern uppdateras varje sekund när den är aktiv.
 *
 * @example
 * function TimerComponent() {
 *   const { settings } = useData();
 *   const [isRunning, setIsRunning] = useState(false);
 *   const [mode, setMode] = useState("work");
 *
 *   useFlowTimer(isRunning, mode);
 *
 *   return (
 *     <div>
 *       <p>Arbetstid: {settings.secondsWork}s</p>
 *       <p>Paustid: {settings.secondsBreak}s</p>
 *     </div>
 *   );
 * }
 */
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