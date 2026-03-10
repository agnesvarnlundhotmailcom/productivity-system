import React from "react";
import { useSession } from "../../contexts/SessionContext";
import { Activity } from "lucide-react";
import "./StatisticsOverTime.css";

/**
 * Den här komponenten ritar upp ett diagram som visar hur mycket man har jobbat och hur energin varit de senaste 7 dagarna.
 * @component
 */
const StatisticsOverTime = () => {
  const { sessions = [] } = useSession() || {};

  /**
   * Den här hjälpfunktionen fixar till datan så att den går att rita ut.
   * Den skapar en lista för de senaste 7 dagarna.
   * @returns {Array} En lista med veckodag, datum, minuter och energinivå
   */
  const getChartData = () => {
    const days = [];
    //Här skapar vi en lista med de senaste 7 datumen, bakåt från idag
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    return days.map(dateStr => {
      //Hitta alla arbetspass som gjordes just den här dagen
      const daySessions = sessions.filter(s => s.timestamp?.startsWith(dateStr));

      // Räkna ihop alla sekunder till en totalsumma
      const totalSec = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

      // Räkna ut ett medelvärde på energin (om det finns någon energi sparad)
      const energySessions = daySessions.filter(s => s.energyLevel !== undefined);
      const energyAvg = energySessions.length > 0
        ? (energySessions.reduce((sum, s) => sum + s.energyLevel, 0) / energySessions.length)
        : 0;

      const dateObj = new Date(dateStr);

      // Skicka tillbaka ett färdigt paket med info för diagrammet
      return {
        weekday: dateObj.toLocaleDateString('sv-SE', { weekday: 'short' }),
        dayNumber: dateObj.getDate(),
        minutes: Math.round(totalSec / 60), // Gör om sekunder till minuter
        energy: parseFloat(energyAvg.toFixed(1)) // Avrunda energin till en decimal
      };
    });
  };

  const data = getChartData();
  // Räkna ut hur hög den högsta stapeln ska vara (minst 60 minuter)
  const maxMinutes = Math.max(...data.map(d => d.minutes), 60);

  return (
    <div className="stats-card">
      {/* Här börjar själva utseendet på kortet */}
      <div className="stats-header">
        <div className="stats-icon-bg">
          <Activity size={20} color="#6dbf9e" strokeWidth={2.5} />
        </div>
        <h2>Energi & effektivitet (7 dagar)</h2>
      </div>

      <div className="stats-chart-area">
        {data.map((day, index) => {
          // Räkna ut hur många procent hög stapeln ska vara i diagrammet
          const workHeight = (day.minutes / maxMinutes) * 100;
          const energyHeight = (day.energy / 5) * 100;

          return (
            <div key={index} className="stats-day-column">
              <div className="stats-bars-wrapper">
                {/* Den blå stapeln för arbetstid*/}
                <div
                  className="bar bar-work"
                  style={{ height: `${workHeight}%` }}
                />
                {/*Den gröna stapeln för energinivå */}
                <div
                  className="bar bar-energy"
                  style={{ height: `${energyHeight}%` }}
                >
                  {day.energy > 0 && (
                    <span className="energy-bubble">{day.energy}</span>
                  )}
                </div>
              </div>
              {/* Texten under staplarna (dag och datum) */}
              <div className="stats-label-group">
                <span className="label-weekday">{day.weekday}</span>
                <span className="label-number">{day.dayNumber}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Förklaringen längst ner vad färgerna betyder*/}
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