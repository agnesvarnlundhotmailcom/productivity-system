import React, { useState } from 'react';
import { useFocusMode } from '../../contexts/FocusModeContext';
import { useSession } from '../../contexts/SessionContext';
import './EnergyModal.css';

export default function EnergyModal({ isOpen, onClose, workedSeconds }) {
  const { addEnergyLog } = useContext(DataContext); 
  const { activeMode, setActiveMode } = useFocusMode(); 
  const { addSession } = useSession(); 
  const [selectedEnergy, setSelectedEnergy] = useState(null);

  if (!isOpen) return null;

  const handleLogAndSave = () => {
    if (selectedEnergy) {
      
      if (addEnergyLog) addEnergyLog(selectedEnergy);

    
      addSession({
        duration: workedSeconds,
        modeId: activeMode.id,
        energyLevel: selectedEnergy, // Energin sparas i samma objekt som tiden!
        timestamp: new Date().toISOString()
      });

      onClose();
      setSelectedEnergy(null);
    }

  const handleStartPause = () => {
    setActiveMode('break');
    onClose();
  };

  return (
    <div className="em-overlay">
      <div className="em-content">
        <button className="em-close-btn" onClick={onClose}><X size={20} /></button>
        <div className="em-header">
          <div className="em-icon-circle"><PartyPopper size={32} color="var(--accent-primary)" /></div>
          <h2>Bra jobbat!</h2>
          <p>Tid: <strong>{Math.floor(workedSeconds / 60)} min {workedSeconds % 60} sek</strong></p>
        </div>
        <div className="em-section">
          <div className="em-section-title"><Zap size={18} /><span>Hur känner du dig?</span></div>
          <div className="em-energy-grid">
            {energyLevels.map((level) => (
              <button
                key={level.id}
                className={`em-energy-option ${selectedEnergy === level.id ? "is-selected" : ""}`}
                onClick={() => setSelectedEnergy(level.id)}
              >
                <span className="em-emoji">{level.emoji}</span>
                <span className="em-label">{level.label}</span>
              </button>
            ))}
          </div>
          <button className="em-btn-primary" disabled={!selectedEnergy} onClick={handleLogAndSave}>
            Spara i historik
          </button>
        </div>
        <div className="em-recommendation-card">
          <p>Behöver du vila?</p>
          <button className="em-btn-pause" onClick={handleStartPause}><Coffee size={18} /> Starta paus</button>
        </div>
      </div>
    </div>
  );
}