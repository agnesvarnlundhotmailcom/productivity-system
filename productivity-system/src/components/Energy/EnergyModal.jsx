import React, { useState, useContext } from "react";
import { X, PartyPopper, Coffee, Zap } from "lucide-react";
import { DataContext } from "../../contexts/DataContext";
import { useFocusMode } from "../../contexts/FocusModeContext";
import { useSession } from "../../contexts/SessionContext";
import "./EnergyModal.css";

export default function EnergyModal({ isOpen, onClose, workedSeconds }) {
  const { addEnergyLog } = useContext(DataContext); 
  const { activeMode, setActiveMode } = useFocusMode(); 
  const { addSession } = useSession();
  const [selectedEnergy, setSelectedEnergy] = useState(null);

  if (!isOpen) return null;

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogAndSave = () => {
    if (selectedEnergy) {
      addEnergyLog(selectedEnergy);

      // SKAPA HISTORIK: Spara hela sessionen inklusive energin till diagrammet
      addSession({
        startTime: new Date(Date.now() - workedSeconds * 1000),
        endTime: new Date(),
        duration: workedSeconds,
        focusMode: activeMode.id,
        energyLevel: selectedEnergy // Nu finns energin med i historiken!
      });

     
      onClose();
      // Återställ valet för nästa gång
      setSelectedEnergy(null);
    }
  };

  const handleStartPause = () => {
    // Om användaren klickar på "Starta paus" byter vi läge i FocusModeContext
    setActiveMode('break');
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
        {/* Stäng-knapp */}
        <button className="em-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header med arbetad tid */}
        <div className="em-header">
          <div className="em-icon-circle">
            <PartyPopper size={32} color="var(--accent-primary)" />
          </div>
          <h2>Bra jobbat!</h2>
          <p>
            Du arbetade i <strong>{formatTime(workedSeconds)}</strong>
          </p>
        </div>

        {/* Energival-sektion */}
        <div className="em-section">
          <div className="em-section-title">
            <Zap size={18} />
            <span>Hur känner du dig nu?</span>
          </div>
          <div className="em-energy-grid">
            {energyLevels.map((level) => (
              <button
                key={level.id}
                className={`em-energy-option ${
                  selectedEnergy === level.id ? "is-selected" : ""
                }`}
                onClick={() => setSelectedEnergy(level.id)}
              >
                <span className="em-emoji">{level.emoji}</span>
                <span className="em-label">{level.label}</span>
              </button>
            ))}
          </div>

          <button
            className="em-btn-primary"
            disabled={!selectedEnergy}
            onClick={handleLogAndSave}
          >
            Spara arbetspass & energi
          </button>
        </div>

        {/* Rekommendations-sektion */}
        <div className="em-recommendation-card">
          <p>Behöver du en återhämtning?</p>
          <button className="em-btn-pause" onClick={handleStartPause}>
            <Coffee size={18} /> Starta paus
          </button>
        </div>
      </div>
    </div>
  );
}