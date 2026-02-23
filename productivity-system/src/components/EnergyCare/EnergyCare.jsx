import React, { useMemo } from 'react';
import { Zap, Activity } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';
import './EnergyCare.css';

const EnergyCare = () => {
  const { sessions } = useSession();

  const energyTrend = useMemo(() => {
    let history = [];
    let lastLevel = 3;

    sessions.slice(-15).forEach(session => {
      const isBreak = session.modeId === 'break' || session.name === 'Paus' || session.modeName === 'Paus';
      const newLevel = isBreak ? Math.min(5, lastLevel + 1) : Math.max(1, lastLevel - 0.5);
      lastLevel = newLevel;

      history.push({
        level: newLevel,
        modeName: session.modeName || session.name || 'Session',
        time: new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    return history;
  }, [sessions]);

  const latestLevel = energyTrend.length > 0 ? energyTrend[energyTrend.length - 1].level : 3;

  const getStatusColor = (level) => {
    if (level >= 4) return '#10b981'; 
    if (level >= 2.5) return '#f59e0b'; 
    return '#ef4444'; 
  };

  return (
    <div className="energy-card">
      <div className="energy-card-header">
        <div className="header-title">
          <Zap size={20} className="zap-icon" />
          <h3>Beräknad Energi</h3>
        </div>
        <div className="energy-badge">
          {latestLevel.toFixed(1)} / 5
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-meta">
          <Activity size={14} />
          <span>Fokus-trend</span>
        </div>
        <div className="bar-chart-visual">
          {energyTrend.length > 0 ? (
            energyTrend.map((data, i) => (
              <div key={i} className="bar-wrapper" title={`${data.modeName}: ${data.level.toFixed(1)}`}>
                <div 
                  className="bar-fill" 
                  style={{ 
                    height: `${(data.level / 5) * 100}%`, 
                    backgroundColor: getStatusColor(data.level) 
                  }} 
                />
              </div>
            ))
          ) : (
            <div className="no-data-msg">Ingen data tillgänglig</div>
          )}
        </div>
        <div className="chart-x-axis">
          <span>Historik</span>
          <span>Nu</span>
        </div>
      </div>

      <div className="energy-footer-insight" style={{ borderLeftColor: getStatusColor(latestLevel) }}>
        <p>
          {latestLevel < 2.5 
            ? "Energinivån är låg. Kanske dags för en paus?" 
            : "Du ser ut att ha bra fokusenergi just nu!"}
        </p>
      </div>
    </div>
  );
};

export default EnergyCare;