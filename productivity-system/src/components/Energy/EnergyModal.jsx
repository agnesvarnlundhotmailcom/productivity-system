import React, { useState } from 'react';
import { useFocusMode } from '../../contexts/FocusModeContext';
import { useSession } from '../../contexts/SessionContext';
import './EnergyModal.css';

export default function EnergyModal({ isOpen, onClose, workedSeconds }) {
  const [energy, setEnergy] = useState(3);
  const { setActiveMode } = useFocusMode(); // Hämta funktionen för att byta läge
  const { addSession } = useSession();

  if (!isOpen) return null;

  const handleSave = (shouldStartBreak = false) => {
    // 1. Spara passet till historiken
    addSession({
      duration: workedSeconds,
      energy: energy,
      timestamp: new Date().toISOString()
    });

    // 2. Om användaren valde "Ta paus", byt fokusläge automatiskt
    if (shouldStartBreak) {
      setActiveMode('break'); // Detta ID måste matcha id:t i dina FocusModes
    }

    // 3. Stäng modalen
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Hur var din energi?</h2>
        
        <div className="energy-selector">
          {[1, 2, 3, 4, 5].map((num) => (
            <button 
              key={num}
              className={`energy-btn ${energy === num ? 'active' : ''}`}
              onClick={() => setEnergy(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          {/* Knapp 1: Bara spara och gå till översikt */}
          <button onClick={() => handleSave(false)} className="btn-secondary">
            Spara & Avsluta
          </button>

          {/* Knapp 2: Spara och börja pausen direkt */}
          <button onClick={() => handleSave(true)} className="btn-primary">
            Ta paus nu
          </button>
        </div>
      </div>
    </div>
  );
}