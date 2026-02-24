import React from "react";
import { useSession } from "../../contexts/SessionContext";
import { Activity } from "lucide-react";
import "./StatisticsOverTime.css";

const StatisticsOverTime = () => {
  const { sessions = [] } = useSession() || {};

  const getChartData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    return days.map(dateStr => {
      const daySessions = sessions.filter(s => s.timestamp?.startsWith(dateStr));
      const totalSec = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const energySessions = daySessions.filter(s => s.energyLevel !== undefined);
      const energyAvg = energySessions.length > 0 
        ? (energySessions.reduce((sum, s) => sum + s.energyLevel, 0) / energySessions.length)
        : 0;

      const dateObj = new Date(dateStr);
      return {
        weekday: dateObj.toLocaleDateString('sv-SE', { weekday: 'short' }),
        dayNumber: dateObj.getDate(),
        minutes: Math.round(totalSec / 60),
        energy: parseFloat(energyAvg.toFixed(1))
      };
    });
  };

  const data = getChartData();
  const maxMinutes = Math.max(...data.map(d => d.minutes), 60);

  return (
    <div className="stats-card">
      <div className="stats-header">
        <div className="stats-icon-bg">
          <Activity size={20} color="#6dbf9e" strokeWidth={2.5} />
        </div>
        <h2>Energi & effektivitet (7 dagar)</h2>
      </div>

      <div className="stats-chart-area">
        {data.map((day, index) => {
          const workHeight = (day.minutes / maxMinutes) * 100;
          const energyHeight = (day.energy / 5) * 100; 
          
          return (
            <div key={index} className="stats-day-column">
              <div className="stats-bars-wrapper">
                <div 
                  className="bar bar-work" 
                  style={{ height: `${workHeight}%` }} 
                />
                <div 
                  className="bar bar-energy" 
                  style={{ height: `${energyHeight}%` }}
                >
                  {day.energy > 0 && (
                    <span className="energy-bubble">{day.energy}</span>
                  )}
                </div>
              </div>

              <div className="stats-label-group">
                <span className="label-weekday">{day.weekday}</span>
                <span className="label-number">{day.dayNumber}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stats-legend">
        <div className="legend-item">
          <div className="legend-dot work-color" />
          <span>Arbetstid</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot energy-color" />
          <span>Energinivå</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverTime;