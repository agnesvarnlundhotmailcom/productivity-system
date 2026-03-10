import React, { useMemo } from 'react';
import './Statistics.css';
import { useSession } from "../../contexts/SessionContext"; 
import { useFocusMode } from "../../contexts/FocusModeContext";

/**
 * En underkomponent för att visa ett enskillt statistikkort i rutnätet.
 * @component
 * @param {Object} props
 * @param {string} props.title - Rubriken på kortet (t.ex. "Total arbetstid").
 * @param {string|number} props.value - Värdet som visas (t.ex. "45:00" eller "5").
 * @param {string} props.colorClass - CSS-klass för att styra färgtemat.
 */
const StatCard = ({ title, value, colorClass }) => (
  <div className="stat-card">
    <div className="stat-header">
      <span className="stat-label">{title}</span>
    </div>
    <div className={`stat-value ${colorClass}`}>{value}</div>
  </div>
);

/**
 * En hjälpfunktion som omvandlar sekunder till ett läsbart tidsformat (MM:SS).
 * @param {number} seconds - Totalt antal sekunder.
 * @returns {string} En sträng formaterad som "00:00".
 */
const formatMMSS = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Huvudkomponenten för statistikvyn.
 * Den beräknar dagens totala prestation genom att slå ihop avslutade sessioner med den tid som tickar i klockan just nu.
 * @component
 */
const Statistics = () => {
  // Hämtar historik över sparade pass
  const { sessions } = useSession(); 
  //Hämtar information om den pågående timern
  const { secondsElapsed, isRunning, activeMode } = useFocusMode();

  /**
   * Beräknar ett statistik-objekt.
   * useMemo används för att prestandaoptimera; vi räknar bara om när sessionerna uppdateras eller klockan tickar.
   * @type {Object}
   */
  const stats = useMemo(() => {
    // 1. Räkna ut tid från gamla, avslutade pass (Historik)
    const historyWork = sessions
      .filter(s => s.modeId !== 'break')
      .reduce((acc, s) => acc + s.duration, 0);
      
    const historyBreak = sessions
      .filter(s => s.modeId === 'break')
      .reduce((acc, s) => acc + s.duration, 0);

    // 2. Lägg till tid från den aktiva klockan ("Live-tid")
    let liveWork = historyWork;
    let liveBreak = historyBreak;

    if (isRunning) {
      if (activeMode.id === 'break') {
        liveBreak += secondsElapsed;
      } else {
        liveWork += secondsElapsed;
      }
    }

    const total = liveWork + liveBreak;
    
    return {
      work: liveWork,
      break: liveBreak,
      // Antal arbetspass: De i historiken + 1 om vi jobbar just nu
      sessionsCount: sessions.filter(s => s.modeId !== 'break').length + (isRunning && activeMode.id !== 'break' ? 1 : 0),
      // Räknar ut procentandelen arbete i förhållande till total tid
      ratio: total > 0 ? Math.round((liveWork / total) * 100) : 0
    };
  }, [sessions, secondsElapsed, isRunning, activeMode]);

  return (
    <div className="stats-box">
      <h2 className="stats-main-title">Dagens statistik</h2>
      <div className="stats-grid">
        <StatCard 
          title="Total arbetstid" 
          value={formatMMSS(stats.work)} 
          colorClass="green-theme" 
        />
        <StatCard 
          title="Total paustid" 
          value={formatMMSS(stats.break)} 
          colorClass="orange-theme" 
        />
        <StatCard 
          title="Sessioner" 
          value={stats.sessionsCount} 
          colorClass="default-theme" 
        />
        <StatCard 
          title="Arbetsratio" 
          value={`${stats.ratio}%`} 
          colorClass="green-theme" 
        />
      </div>
    </div>
  );
};

export default Statistics;