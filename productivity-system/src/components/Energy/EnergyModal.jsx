import React, { useState } from "react";
import { X, PartyPopper, Play, Moon, Coffee } from "lucide-react";
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

    // Spara sessionen i historiken
    addSession({
      duration: workedSeconds,
      modeId: activeMode.id,
      energyLevel: selectedEnergy,
      timestamp: new Date().toISOString()
    });

    // Logik för nästa steg (växla läge eller avsluta)
    if (nextStep === 'switch') {
      const nextMode = activeMode.id === 'break' ? 'deepWork' : 'break';
      setActiveMode(nextMode);
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

  const isBreakOver = activeMode.id === 'break';
  const minutes = Math.floor(workedSeconds / 60);
  const seconds = workedSeconds % 60;

  return (
    <div className="em-overlay">
      <div className="em-content">
        <button className="em-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="em-header">
          <div className="em-icon-circle">
            <PartyPopper size={32} color="#10b981" />
          </div>
          <h2>{isBreakOver ? "Pausen är klar!" : "Snyggt jobbat!"}</h2>
          <p>Tid: <strong>{minutes} min {seconds} sek</strong></p>
        </div>

        <div className="em-section">
          <p className="em-question">Hur är energinivån?</p>
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

        <div className="em-action-group">
          {/* Huvudknapp: Växlar mellan jobb/paus */}
          <button 
            className="em-btn-primary" 
            disabled={!selectedEnergy} 
            onClick={() => handleAction('switch')}
          >
            {isBreakOver ? <Play size={18} fill="currentColor" /> : <Coffee size={18} />}
            {isBreakOver ? "Fortsätt jobba" : "Ta en paus nu"}
          </button>
          
          {/* Sekundär knapp: Avslutar passet helt */}
          <button 
            className="em-btn-secondary" 
            disabled={!selectedEnergy} 
            onClick={() => handleAction('finish')}
          >
            <Moon size={18} fill="currentColor" /> Avsluta för dagen
          </button>
        </div>
      </div>
    </div>
  );
}