import React from 'react';
import { Clock, Coffee, RefreshCcw, BarChart2 } from 'lucide-react';
import './Statistics.css';

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

const Statistics = () => {
  return (
    <div className="stats-box">
      <h2 className="stats-main-title">Dagens statistik</h2>
      
      <div className="stats-grid">
        <StatCard 
          title="Total arbetstid" 
          value="00:00" 
          Icon={Clock}
          colorClass="green-theme"
        />
        <StatCard 
          title="Total paustid" 
          value="00:00" 
          Icon={Coffee}
          colorClass="orange-theme"
        />
        <StatCard 
          title="Sessioner" 
          value="0" 
          Icon={RefreshCcw}
          colorClass="default-theme"
        />
        <StatCard 
          title="Arbetsratio" 
          value="0%" 
          Icon={BarChart2}
          colorClass="green-theme"
        />
      </div>
    </div>
  );
};

export default Statistics;