import { useEffect, useMemo, useState } from "react";
import "./FlowTimer.css";

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
  // v2: state
  const [secondsWork, setSecondsWork] = useState(0);
  const [secondsBreak, setSecondsBreak] = useState(0);

  // "mode": work | break
  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);

  // Här är det som visas i stora klockan:
  const displaySeconds = mode === "work" ? secondsWork : secondsBreak;

  // v2: useEffect (tick + cleanup)
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      if (mode === "work") {
        setSecondsWork((prev) => prev + 1);
      } else {
        setSecondsBreak((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, mode]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 10) return "God morgon!";
    if (h < 18) return "God eftermiddag!";
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
    setSecondsWork(0);
    setSecondsBreak(0);
    setMode("work");
  };

  return (
    <div className="ftWrap">
      <header className="ftHeader">
        <div className="ftBrand">
          <div className="ftLogo" aria-hidden="true">
            {/* enkel “blixt” */}
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z"
                fill="currentColor"
              />
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

        <div className="ftTopIcons">
          <button className="ftIconBtn" type="button" aria-label="Kalender">
            {/* kalenderikon */}
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm12 6H5v12h14V8z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            className={`ftIconBtn ftIconBtnActive`}
            type="button"
            aria-label="Timer"
          >
            {/* timerikon */}
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M9 2h6v2H9V2zm3 4a10 10 0 1 0 10 10A10 10 0 0 0 12 6zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8zm1-13h-2v6l5 3 1-1.7-4-2.3V11z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </header>

      <section className="ftCard">
        <div className="ftDial">
          <div className="ftRing" aria-hidden="true" />
          <div className="ftTime">{formatMMSS(displaySeconds)}</div>
          <div className="ftModePill">
            {mode === "work" ? "Arbete" : "Paus"} {isRunning ? "• Pågår" : "• Pausad"}
          </div>
        </div>

        <div className="ftButtons">
          <button
            className={`ftBtn ftBtnWork ${mode === "work" ? "isSelected" : ""}`}
            type="button"
            onClick={isRunning && mode === "work" ? pause : startWork}
          >
            <span className="ftBtnIcon" aria-hidden="true">▶</span>
            {isRunning && mode === "work" ? "Pausa arbete" : "Starta arbete"}
          </button>

          <button
            className={`ftBtn ftBtnBreak ${mode === "break" ? "isSelected" : ""}`}
            type="button"
            onClick={isRunning && mode === "break" ? pause : startBreak}
          >
            <span className="ftBtnIcon" aria-hidden="true">▶</span>
            {isRunning && mode === "break" ? "Pausa paus" : "Ta paus"}
          </button>
        </div>

        <div className="ftMiniActions">
          <button className="ftLinkBtn" type="button" onClick={resetAll}>
            Återställ
          </button>
        </div>
      </section>

      <section className="ftStats">
        <h3 className="ftStatsTitle">Dagens statistik</h3>

        <div className="ftStatsGrid">
          <div className="ftStatCard ftStatCardWork">
            <div className="ftStatLabel">
              <span className="ftDot ftDotWork" />
              Total arbetstid
            </div>
            <div className="ftStatValue">{formatMMSS(secondsWork)}</div>
          </div>

          <div className="ftStatCard ftStatCardBreak">
            <div className="ftStatLabel">
              <span className="ftDot ftDotBreak" />
              Total paustid
            </div>
            <div className="ftStatValue">{formatMMSS(secondsBreak)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
