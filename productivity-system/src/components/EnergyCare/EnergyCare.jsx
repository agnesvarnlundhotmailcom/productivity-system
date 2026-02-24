import React, { useMemo } from 'react';
import { Zap, Activity } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext'; 
import './EnergyCare.css';

const EnergyCare = () => {
  const { sessions } = useSession();

  const energyTrend = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    return sessions.slice(-15).map(session => {
      const level = Number(session.energyLevel || 3);
      
      return {
        level: level,
        modeId: session.modeId,
        time: session.timestamp 
      };
    });
  }, [sessions]);

  const latestLevel = energyTrend.length > 0 ? energyTrend[energyTrend.length - 1].level : 0;

  const getStatusColor = (level) => {
    if (level >= 4) return '#10b981';
    if (level === 3) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="energy-card">
      <div className="energy-card-header">
        <div className="header-title">
          <Zap size={20} className="zap-icon" />
          <h3>Energinivå över tid</h3>
        </div>
        <div className="energy-badge">
          {latestLevel > 0 ? `${latestLevel} / 5` : "Ingen data"}
        </div>
      </div>

      <div className="chart-section">
        <div className="bar-chart-visual">
          {energyTrend.length > 0 ? (
            energyTrend.map((data, i) => (
              <div key={i} className="bar-wrapper">
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
            <div className="no-data-msg">Logga ett pass för att se grafen</div>
          )}
        </div>
        <div className="chart-x-axis">
          <span>Historik</span>
          <span>Nu</span>
        </div>
      </div>

      <div className="energy-footer-insight" style={{ borderLeftColor: getStatusColor(latestLevel) }}>
        <p>
          {latestLevel >= 4 ? "Hög fokusenergi loggad!" : 
           latestLevel === 3 ? "Din energi är stabil." : 
           latestLevel > 0 ? "Energinivån är låg." : "Välj en emoji efter nästa pass."}
        </p>
      </div>
    </div>
  );
};

export default EnergyCare;