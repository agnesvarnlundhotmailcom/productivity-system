import { useEffect, useState, useContext, useMemo } from "react";
import "./FlowTimer.css";
import { DataContext } from "../../contexts/DataContext";
import { RotateCcw } from "lucide-react";
import CurrentTaskView from "../Taskview/CurrentTaskView";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

export default function FlowTimer() {
  const { data, setData } = useContext(DataContext);
  const today = new Date().toLocaleDateString('sv-SE');

  const secondsWork = data.settings.secondsWork ?? 0;
  const secondsBreak = data.settings.secondsBreak ?? 0;

  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);

  const displaySeconds = mode === "work" ? secondsWork : secondsBreak;

  // --- BERÄKNA DAGENS FRAMSTEG ---
  const dailyProgress = useMemo(() => {
    const schedule = data[today]?.schedule || [];
    let totalTasks = 0;
    let completedTasks = 0;

    schedule.forEach(activity => {
      if (activity.tasks && activity.tasks.length > 0) {
        activity.tasks.forEach(task => {
          totalTasks++;
          if (task.completed) completedTasks++;
        });
      }
    });

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [data, today]);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          secondsWork:
            mode === "work"
              ? (prev.settings.secondsWork ?? 0) + 1
              : prev.settings.secondsWork ?? 0,
          secondsBreak:
            mode === "break"
              ? (prev.settings.secondsBreak ?? 0) + 1
              : prev.settings.secondsBreak ?? 0,
        }
      }));
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, mode, setData]);

  const startWork = () => {
    setMode("work");
    setIsRunning(true);
  };

  const startBreak = () => {
    if (mode === "work" && isRunning) {
      setData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          sessions: (prev.settings.sessions ?? 0) + 1
        }
      }));
    }
    setMode("break");
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const resetAll = () => {
    if (window.confirm("Vill du återställa all tid för idag?")) {
      setIsRunning(false);
      setMode("work");
      setData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          secondsWork: 0,
          secondsBreak: 0,
          sessions: 0,
        }
      }));
    }
  };

  return (
    <div className="ftWrap">
      <section className="ftCard">
        {/* Aktiviteten från schemat */}
        <CurrentTaskView />

        {/* DAGENS PROGRESS BAR */}
        <div className="dailyProgressContainer">
          <div className="progressLabel">
            <span>Dagens mål</span>
            <span>{dailyProgress}%</span>
          </div>
          <div className="progressBarBg">
            <div 
              className="progressBarFill" 
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
        </div>

        <div className="ftDial">
          <div className="ftRing" />
          <div className="ftTime">{formatMMSS(displaySeconds)}</div>
          <div className="ftModePill">
            {mode === "work" ? "Arbete" : "Paus"} {isRunning ? "• Pågår" : "• Pausad"}
          </div>
        </div>

        <div className="ftButtons">
          <button
            className={`ftBtn ftBtnWork ${mode === "work" ? "isSelected" : ""}`}
            onClick={isRunning && mode === "work" ? pause : startWork}
          >
            {isRunning && mode === "work" ? "Pausa arbete" : "Starta arbete"}
          </button>

          <button
            className={`ftBtn ftBtnBreak ${mode === "break" ? "isSelected" : ""}`}
            onClick={isRunning && mode === "break" ? pause : startBreak}
          >
            {isRunning && mode === "break" ? "Pausa paus" : "Ta paus"}
          </button>
        </div>

        <div className="ftMiniActions">
          <button className="ftResetBtn" onClick={resetAll}>
            <RotateCcw size={18} strokeWidth={2.5} />
            Återställ tid
          </button>
        </div>
      </section>
    </div>
  );
}