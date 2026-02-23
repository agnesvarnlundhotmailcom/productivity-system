import React, { useState } from 'react';
import { Zap, Activity } from 'lucide-react';
import './EnergyCare.jsx';

const EnergyCare = () => {
  // Vi startar med lite historik i grafen
  const [energyHistory, setEnergyHistory] = useState([]);
  
  // Den senaste valda nivån är det sista elementet i listan
  const currentLevel = energyHistory[energyHistory.length - 1];

  // Funktion som körs när man klickar på en emoji-knapp
  const handleSelectLevel = (newLevel) => {
    // Vi lägger till det nya värdet sist i arrayen
    // Vi behåller bara de senaste 15 värdena så att grafen inte blir för trång
    setEnergyHistory(prev => [...prev.slice(-14), newLevel]);
  };

  const getBarColor = (level) => {
    if (level >= 4) return 'var(--accent-primary)'; 
    if (level === 3) return 'var(--accent-warning)'; 
    return 'var(--accent-danger)'; 
  };

  const emojis = [
    { icon: '😴', val: 1 },
    { icon: '😔', val: 2 },
    { icon: '😐', val: 3 },
    { icon: '😊', val: 4 },
    { icon: '🔥', val: 5 }
  ];

  return (
    <div className="energy-card">
      <div className="card-header-row">
        <div className="header-left-side">
          <div className="zap-icon-wrapper">
            <Zap size={20} className="zap-icon" />
          </div>
          <h3 className="card-title">Energinivå</h3>
        </div>
      </div>

      {/* Visar den nivå man just klickat på */}
      <div className="level-status-box">
        <span className="status-label">Senaste nivå</span>
        <div className="status-value">
          <span className="current-emoji">{emojis.find(e => e.val === currentLevel)?.icon}</span>
          <strong>{currentLevel}/5</strong>
        </div>
      </div>

      {/* Knappar för att välja nivå */}
      <div className="emoji-selector-grid">
        {emojis.map((item) => (
          <button 
            key={item.val} 
            onClick={() => handleSelectLevel(item.val)}
            className={`emoji-button ${currentLevel === item.val ? 'is-active' : ''}`}
          >
            <span className="emoji-img">{item.icon}</span>
            <span className="emoji-num">{item.val}</span>
          </button>
        ))}
      </div>

      {/* Grafen som uppdateras live */}
      <div className="chart-wrapper">
        <div className="chart-info">
          <Activity size={12} />
          <span>Idag</span>
        </div>
        
        <div className="bar-chart-area">
          {energyHistory.map((level, i) => (
            <div 
              key={i} 
              className="chart-bar" 
              style={{ 
                height: `${(level / 5) * 100}%`, 
                backgroundColor: getBarColor(level) 
              }}
            />
          ))}
        </div>
        
        <div className="chart-labels">
          <span>Tidigare</span>
          <span className="chart-avg">Live Graf</span>
          <span>Nu</span>
        </div>
      </div>
    </div>
  );
};

export default EnergyCare;