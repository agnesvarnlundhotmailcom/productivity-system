import React, { useState } from "react";
import { X, PartyPopper, Play, Moon, Coffee } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext";
import { useSession } from "../../contexts/SessionContext";
import "./EnergyModal.css";

/**
 * Den här rutan (modalen) dyker upp när ett arbetspass eller en pass är slut.
 * Den låter användaren välja sin energinivå och bestämma vad som ska hända härnäst.
 * * @component
 * @param {Object} props dokumentera props som komponenten tar emot:
 * @param {boolean} props.isOpen - Om rutan ska synas eller inte
 * @param {Function} props.onClose - Funktion som körs för att stänga rutan. 
 * @param {number} props.workedSeconds - Hur många sekunder som arbetspasset/pausen varade.
 */
export default function EnergyModal({ isOpen, onClose, workedSeconds }) {
  // Hämtar funktioner för att byta läge (t.ex. från jobb till paus)
  const { activeMode, setActiveMode } = useFocusMode(); 
  // Hämtar funktionen för att spara passet i historiken
  const { addSession } = useSession(); 
  
  // Håller koll på vilken gubbe/energi användaren har klickat på
  const [selectedEnergy, setSelectedEnergy] = useState(null);

  // Om rutan inte ska vara öppen, rita inte ut någonting alls
  if (!isOpen) return null;

  /**
   * Den här funktionen körs när man klickar på "Ta en paus" eller "Avsluta".
   * Den sparar all info och ser till att appen byter läge.
   * * @param {string} nextStep - Kan vara 'switch' (byt läge) eller ' finish' (stäng ner)
   */
  const handleAction = (nextStep) => {
    if (!selectedEnergy) return;

  // Spara passet i historiken med all info
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

  // Kollar om det var en paus som just avslutades, för att visa rätt text och ikon 
  const isBreakOver = activeMode.id === 'break';
  const minutes = Math.floor(workedSeconds / 60);
  const seconds = workedSeconds % 60;

  return (
    <div className="em-overlay">
      <div className="em-content">
        {/* Stäng-knappen i det övre högra hörnet */}
        <button className="em-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        {/* Header med ikon, titel och tid */}
        <div className="em-header">
          <div className="em-icon-circle">
            <PartyPopper size={32} color="#10b981" />
          </div>
          <h2>{isBreakOver ? "Pausen är klar!" : "Snyggt jobbat!"}</h2>
          <p>Tid: <strong>{minutes} min {seconds} sek</strong></p>
        </div>
        
        {/* Sektion för att välja energinivå */}
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