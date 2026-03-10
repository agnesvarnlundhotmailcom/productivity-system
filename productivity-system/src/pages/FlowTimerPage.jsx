import React from "react";
import FlowTimer from "../components/FlowTimer/FlowTimer";
import DashboardSchedule from "../components/Schedule/DashboardSchedule";
import FocusModes from "../components/focusMode/FocusModes";

/**
 * Huvudsida för Flow-timer (arbetsvyn).
 * Den här sidan samlar klockan, dagens schema och möjligheten att byta fokusläge på en och samma skärm.
 * @component
 */
export default function FlowTimerPage() {
  // Skapar en referens till dagens datum för att visa rätt schema si sidokolumnen
  const today = new Date();

  return (
    <div className="dashboard-container">
      {/* Huvudrutnät för sidan. Använder en 3-kolumners layout för att skapa en tydlig uppdelning på större skärmar. */}
      <div className="main-grid flow-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Vänster- och mittenkolumn (tar upp 2/3 av bredden). Här ligger de viktigaste funktionerna för själva arbetspasset. */}
        <div className="main-left-col" style={{ gridColumn: "span 2", display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Sektion för den interaktiva timern där man startar och pausar pass */}
          <section className="card timer-card-area">
            <FlowTimer />
          </section>
          
          {/* Sektion som visar dagens planerade aktiviteter under timern */}
          <section className="card schedule-card-area">
            <DashboardSchedule selectedDate={today} />
          </section>
        </div>

        {/* Högerkolumn (Sidomeny). Här kan användaren snabbt växla mellan olika fokuslägen (t.ex. Deep Work eller Paus). */}
        <div className="sidebar-right-col focus-mode-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <FocusModes />
        </div>
      </div>
    </div>
  );
}