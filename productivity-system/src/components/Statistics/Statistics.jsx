import React, { useMemo } from 'react';
import { Clock, Coffee, RefreshCcw, BarChart2 } from 'lucide-react';
import './Statistics.css';
import { useSession } from "../../contexts/SessionContext"; 
import { useFocusMode } from "../../contexts/FocusModeContext";

const StatCard = ({ title, value, colorClass }) => (
  <div className="stat-card">
    <div className="stat-header">
      <span className="stat-label">{title}</span>
    </div>
    <div className={`stat-value ${colorClass}`}>{value}</div>
  </div>
);

const formatMMSS = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const Statistics = () => {
  const { sessions } = useSession(); 
  const { secondsElapsed, isRunning, activeMode } = useFocusMode();

  const stats = useMemo(() => {
    // 1. Beräkna tid från historik
    const historyWork = sessions.filter(s => s.modeId !== 'break').reduce((acc, s) => acc + s.duration, 0);
    const historyBreak = sessions.filter(s => s.modeId === 'break').reduce((acc, s) => acc + s.duration, 0);

    // 2. Addera realtidstiden
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
      sessions: sessions.filter(s => s.modeId !== 'break').length + (isRunning && activeMode.id !== 'break' ? 1 : 0),
      ratio: total > 0 ? Math.round((liveWork / total) * 100) : 0
    };
  }, [sessions, secondsElapsed, isRunning, activeMode]);

  return (
    <div className="stats-box">
      <h2 className="stats-main-title">Dagens statistik</h2>
      <div className="stats-grid">
        <StatCard title="Total arbetstid" value={formatMMSS(stats.work)} Icon={Clock} colorClass="green-theme" />
        <StatCard title="Total paustid" value={formatMMSS(stats.break)} Icon={Coffee} colorClass="orange-theme" />
        <StatCard title="Sessioner" value={stats.sessions} Icon={RefreshCcw} colorClass="default-theme" />
        <StatCard title="Arbetsratio" value={`${stats.ratio}%`} Icon={BarChart2} colorClass="green-theme" />
      </div>
    </div>
  );
};

export default Statistics;