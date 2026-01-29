import { useEffect, useMemo, useState } from "react";
import "./FlowTimer.css";

// Hjälpfunktion: Pure function - ingen sidoeffekt, samma indata ger samma utdata
// pad2 = "padding 2" - lägger till nolla framför ensiffer nummer
function pad2(n) {
  return String(n).padStart(2, "0");
}

// formatMMSS = konverterar sekunder till MM:SS format
// Pure function = enkelt att testa, ingen slumpmässighet eller externa beroenden
function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

export default function FlowTimer({
  appName = "FlowTime",
  tagline = "Din produktivitetspartner",
}) {
  // ===== STATE MANAGEMENT =====
  // React-koncept: useState Hook - skapar reaktiv state för komponenten
  // State = data som komponenten lagrar och kan uppdatera
  // Varje setState kaller render igen med nya värden
  const [secondsWork, setSecondsWork] = useState(0);
  const [secondsBreak, setSecondsBreak] = useState(0);

  // mode = vilken läge timern är i ("work" eller "break")
  // Varför: Bestämmer vilken timer som tickar och visas i displayen
  const [mode, setMode] = useState("work");

  // isRunning = boolsk state för att kontrollera om intervallen är aktiv
  // Varför: Avgör om timern tickar eller är pausad
  const [isRunning, setIsRunning] = useState(false);

  // ===== DERIVED STATE =====
  // Avledt värde från state - beräknas varje render, sparas inte separat
  // Varför: Undviker duplicering och håller en enda "sanningskälla"
  const displaySeconds = mode === "work" ? secondsWork : secondsBreak;

  // ===== SIDE EFFECTS =====
  // React-koncept: useEffect Hook - hanterar sidoeffekter (interval, API-anrop, etc)
  // Varför: Vi vill starta/stoppa en interval timer när isRunning eller mode ändras
  useEffect(() => {
    // Early return - om timern inte körs, gör ingenting
    if (!isRunning) return;

    // Setara upp en interval som tickar varje sekund (1000ms)
    // setInterval = utför funktion upprepade gånger
    const id = setInterval(() => {
      if (mode === "work") {
        // Funktionell uppdatering (prev) - använder föregående värde för att undvika race conditions
        setSecondsWork((prev) => prev + 1);
      } else {
        setSecondsBreak((prev) => prev + 1);
      }
    }, 1000);

    // ===== CLEANUP FUNCTION =====
    // React-koncept: Cleanup/Unmount - körs innan nästa effect eller vid unmount
    // Varför: Stoppar intervallen för att undvika minnesläckor och dubbelkörning
    // Utan cleanup skulle vi ha flera intervaller som tickar samtidigt
    return () => clearInterval(id);
  }, [isRunning, mode]); // Dependency array - effect körs om dessa ändras

  // ===== MEMOIZATION =====
  // React-koncept: useMemo Hook - memoization av beräknad värde
  // Varför: greeting ändras aldrig under sessionen (enbart beräknat en gång)
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 10) return "God morgon!";
    if (h < 18) return "God eftermiddag!";
    return "God kväll!";
  }, []); // Tom array = körs endast en gång vid mount

  // ===== EVENT HANDLERS =====
  // Små funktioner som uppdaterar state när användaren klickar
  const startWork = () => {
    setMode("work");
    setIsRunning(true);
  };

  const startBreak = () => {
    setMode("break");
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  // resetAll = återställer alla timers och state till initiala värden
  const resetAll = () => {
    setIsRunning(false);
    setSecondsWork(0);
    setSecondsBreak(0);
    setMode("work");
  };

  // ===== RENDER =====
  // React-koncept: JSX - deklarativ syntax för att bygga UI med JavaScript
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
          {/* Använder derived state (displaySeconds) formaterad med formatMMSS */}
          <div className="ftTime">{formatMMSS(displaySeconds)}</div>

          {/* React-koncept: Conditional rendering - visar olika text baserat på state */}
          {/* Ternary operator (? :) = om/då/annars logik direkt i JSX */}
          <div className="ftModePill">
            {mode === "work" ? "Arbete" : "Paus"} {isRunning ? "• Pågår" : "• Pausad"}
          </div>
        </div>

        <div className="ftButtons">
          {/* React-koncept: Conditional className - CSS-klasser baserat på state */}
          {/* isSelected läggs till om mode === "work" */}
          {/* React-koncept: Event handler - onClick kör funktion när användaren klickar */}
          {/* Ternary - om timern körs och mode är work, pausa; annars starta */}
          <button
            className={`ftBtn ftBtnWork ${mode === "work" ? "isSelected" : ""}`}
            type="button"
            onClick={isRunning && mode === "work" ? pause : startWork}
          >
            <span className="ftBtnIcon" aria-hidden="true">▶</span>
            {/* Conditional rendering - visa olika buttontext baserat på isRunning */}
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

        {/* React-koncept: List rendering - visar samma struktur för olika data */}
        <div className="ftStatsGrid">
          {/* Statskort för arbetstid - formaterar secondsWork med formatMMSS */}
          <div className="ftStatCard ftStatCardWork">
            <div className="ftStatLabel">
              <span className="ftDot ftDotWork" />
              Total arbetstid
            </div>
            <div className="ftStatValue">{formatMMSS(secondsWork)}</div>
          </div>

          {/* Statskort för paustid - samma struktur, annat data (secondsBreak) */}
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
