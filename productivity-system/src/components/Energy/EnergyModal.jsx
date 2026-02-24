import React, { useState } from "react";
import { X, PartyPopper, Play, Moon } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext";
import { useSession } from "../../contexts/SessionContext";
import "./EnergyModal.css";

export default function EnergyModal({ isOpen, onClose, workedSeconds }) {
  const { activeMode, setActiveMode } = useFocusMode(); 
  const { addSession } = useSession(); 
  const [selectedEnergy, setSelectedEnergy] = useState(null);

  if (!isOpen) return null;

  const handleAction = (nextStep) => {
    if (!selectedEnergy) return;

    //Spara sessionen i historiken (med energinivån)
    addSession({
      duration: workedSeconds,
      modeId: activeMode.id,
      energyLevel: selectedEnergy,
      timestamp: new Date().toISOString()
    });

    // Om användaren vill fortsätta jobba (t.ex. efter en paus)
    if (nextStep === 'continue') {
      setActiveMode('deepWork'); 
    } 

    // Återställ och stäng
    setSelectedEnergy(null);
    onClose();
  };

  const energyLevels = [
    { id: 1, label: "Mycket låg", emoji: "😴" },
    { id: 2, label: "Låg", emoji: "😔" },
    { id: 3, label: "Neutral", emoji: "😐" },
    { id: 4, label: "Bra", emoji: "😊" },
    { id: 5, label: "Utmärkt", emoji: "🔥" },
  ];

  return (
    <div className="em-overlay">
      <div className="em-content">
        <button className="em-close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="em-header">
          <div className="em-icon-circle">
            <PartyPopper size={32} color="#10b981" />
          </div>
          <h2>{activeMode.id === 'break' ? "Pausen är slut!" : "Bra jobbat!"}</h2>
          <p>Tid loggad: <strong>{Math.floor(workedSeconds / 60)} min {workedSeconds % 60} sek</strong></p>
        </div>

        <div className="em-section">
          <p className="em-question">Hur känner du dig?</p>
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
        </div>

        <div className="em-action-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {/* Knapp för att gå tillbaka till arbete */}
          <button 
            className="em-btn-primary" 
            disabled={!selectedEnergy} 
            onClick={() => handleAction('continue')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Play size={18} fill="currentColor" /> Fortsätt arbeta
          </button>
          
          {/* Knapp för att avsluta dagen */}
          <button 
            className="em-btn-secondary" 
            disabled={!selectedEnergy} 
            onClick={() => handleAction('finish')}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
              background: 'transparent', border: '1px solid var(--surface-4)', 
              color: 'var(--text-secondary)', padding: '12px', borderRadius: '12px', cursor: 'pointer' 
            }}
          >
            <Moon size={18} fill="currentColor" /> Avsluta för dagen
          </button>
        </div>
      </div>
    </div>
  );
}