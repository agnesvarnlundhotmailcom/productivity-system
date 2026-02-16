import React, { useContext } from 'react';
import { Clock, Coffee, RefreshCcw, BarChart2 } from 'lucide-react';
import './Statistics.css';
import { DataContext } from "../../contexts/DataContext";

const StatCard = (props) => {
  const { title, value, Icon, colorClass } = props;

  return (
    <div className="stat-card">
      <div className="stat-header">
        <Icon size={16} className={`stat-icon ${colorClass}`} />
        <span className="stat-label">{title}</span>
      </div>
      <div className={`stat-value ${colorClass}`}>
        {value}
      </div>
    </div>
  );
};

const formatMMSS = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const Statistics = () => {
  const { data } = useContext(DataContext);

  // Hämta värden från context (med fallback till 0)
  const workSeconds = data.settings.secondsWork ?? 0;
  const breakSeconds = data.settings.secondsBreak ?? 0;
  const sessions = data.settings.sessions ?? 0; 

  // Beräkna Arbetsratio: (Arbetstid / Total tid) * 100
  const totalSeconds = workSeconds + breakSeconds;
  const ratio = totalSeconds > 0 
    ? Math.round((workSeconds / totalSeconds) * 100) 
    : 0;

  return (
    <div className="stats-box">
      <h2 className="stats-main-title">Dagens statistik</h2>

      <div className="stats-grid">
        <StatCard
          title="Total arbetstid"
          value={formatMMSS(workSeconds)}
          Icon={Clock}
          colorClass="green-theme"
        />

        <StatCard
          title="Total paustid"
          value={formatMMSS(breakSeconds)}
          Icon={Coffee}
          colorClass="orange-theme"
        />

        <StatCard
          title="Sessioner"
          value={sessions}
          Icon={RefreshCcw}
          colorClass="default-theme"
        />

        <StatCard
          title="Arbetsratio"
          value={`${ratio}%`}
          Icon={BarChart2}
          colorClass="green-theme"
        />
      </div>
    </div>
  );
};

export default Statistics;
