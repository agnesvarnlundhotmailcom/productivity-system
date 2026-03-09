import React, { useMemo } from 'react';
import { Zap } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext'; 
import './EnergyCare.css';

/**
 * Komponenten EnergyCare visar en graf över användarens energinivåer baserat på de senaste sessionerna.
 * 
 * Visar de senaste 15 sessionner som en graf, med färger baserade på energinivån (grön för hög, gul för stabil, röd för låg).
 * 
 * @component
 * @returns {React.ReactElement} En kort component med energi-grafen och insikter baserat på senaste energinivån.
 * @example
 * <EnergyCare /> 
 */
const EnergyCare = () => {
  // Hämtar sessioner från kontexten
  const { sessions } = useSession();

/**
 * Omvandlar sessionerna till enegitrend data 
 * 
 * tar de senaste 15 sessioner och extraherar bara energinivån.
 * Memoized för att undvika omräkning på varje render.#10b981
 * 
 * @type {Array<{level:number}>} sessions - En array av session-objekt som innehåller energinivåer.
 */
  const energyTrend = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    //tar sista 15 sessioner och mappar dem till en {level}
    return sessions.slice(-15).map(session => ({
      level: Number(session.energyLevel || 3)
    }));
  }, [sessions]);

  /**
   * den senaste energinivån från trenden.
   * @type {number}
   */
  const latestLevel = energyTrend.length > 0 ? energyTrend[energyTrend.length - 1].level : 0;
   /** 
   * Returnerar en färg baserat på energinivån.
   * Grön för nivå 4-5, gul för nivå 3, röd för nivå 1-2.
   * @param {number} level - Energinnivån att utvärdera.
   * @returns {string} En hex-kod för färgen som representerar energinivån.
   */

  const getStatusColor = (level) => {
    if (level >= 4) return '#10b981';
    if (level === 3) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="energy-card">
      {/* Header med ikon och titel, samt en badge som visar senaste energinivån */}
      <div className="energy-card-header">
        <div className="header-title">
          <Zap size={20} className="zap-icon" />
          <h3>Energinivå över tid</h3>
        </div>
        <div className="energy-badge">
          {latestLevel > 0 ? `${latestLevel} / 5` : "Ingen data"}
        </div>
      </div>

    {/*Stapeldiagram som visar energitrenden över de senaste sessionerna. Färgerna ändras baserat på energinivån.*/}
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
            // Visar ett meddelande om ingen data finns
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