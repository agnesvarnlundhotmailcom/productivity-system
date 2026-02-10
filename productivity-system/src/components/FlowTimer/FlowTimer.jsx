import { useEffect, useMemo, useState, useContext } from "react";
import "./FlowTimer.css";
import { DataContext } from "../../contexts/DataContext";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

export default function FlowTimer({
  appName = "FlowTime",
  tagline = "Din produktivitetspartner",
}) {
  const { data, setData } = useContext(DataContext);

  const secondsWork = data.settings.secondsWork ?? 0;
  const secondsBreak = data.settings.secondsBreak ?? 0;

  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);

  const displaySeconds = mode === "work" ? secondsWork : secondsBreak;

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

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "God morgon!";
    if (h >= 12) return "God eftermiddag!";
    return "God kväll!";
  }, []);

  const startWork = () => {
    setMode("work");
    setIsRunning(true);
  };

  const startBreak = () => {
    setMode("break");
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const resetAll = () => {
    setIsRunning(false);
    setMode("work");
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        secondsWork: 0,
        secondsBreak: 0,
      }
    }));
  };

  return (
    <div className="ftWrap">
      <header className="ftHeader">
        <div className="ftBrand">
          <div className="ftLogo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" fill="currentColor" />
            </svg>
          </div>
          <div className="ftBrandText">
            <div className="ftBrandName">{appName}</div>
            <div className="ftBrandTagline">{tagline}</div>
          </div>
        </div>

        <div className="ftGreeting">
          <div className="ftGreetingTitle">
            {greeting} Redo att optimera din dag?
          </div>
        </div>
      </header>

      <section className="ftCard">
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
          <button className="ftLinkBtn" onClick={resetAll}>
            Återställ
          </button>
        </div>
      </section>

      <section className="ftStats">
        <h3 className="ftStatsTitle">Dagens statistik</h3>

        <div className="ftStatsGrid">
          <div className="ftStatCard ftStatCardWork">
            <div className="ftStatLabel">Total arbetstid</div>
            <div className="ftStatValue">{formatMMSS(secondsWork)}</div>
          </div>

          <div className="ftStatCard ftStatCardBreak">
            <div className="ftStatLabel">Total paustid</div>
            <div className="ftStatValue">{formatMMSS(secondsBreak)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
