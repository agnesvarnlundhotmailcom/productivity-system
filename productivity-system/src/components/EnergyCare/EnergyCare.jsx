import React, { useContext } from 'react';
import { Zap, Activity, Clock } from 'lucide-react';
import { DataContext } from "../../contexts/DataContext";
import './EnergyCare.css';

const EnergyCare = () => {
  const { data, addEnergyLog } = useContext(DataContext);
  const energyHistory = data?.energyLogs || [];
  const lastEntry = energyHistory.length > 0 ? energyHistory[energyHistory.length - 1] : null;
  const currentLevel = lastEntry ? lastEntry.level : 0;

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
        <Zap size={20} />
        <h3 className="card-title">Energinivå</h3>
      </div>
      <div className="emoji-selector-grid" style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
        {emojis.map((item) => (
          <button
            key={item.val}
            onClick={() => addEnergyLog(item.val)}
            className={`emoji-button ${currentLevel === item.val ? 'is-active' : ''}`}
            style={{ flex: 1, padding: '10px', border: currentLevel === item.val ? '2px solid var(--accent-primary)' : '1px solid transparent' }}
          >
            <span style={{ display: 'block', fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.val}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnergyCare;