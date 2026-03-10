import React from "react";
import { X, Brain, Users, Coffee, Settings, Database, Trash2 } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext";
import "./SettingsModal.css";

export default function SettingsModal({ open, onClose }) {
  //Hämtar fokuslägen och funktion fr att uppdatera standardtiden för varje läge.
  const { modes, updateModeDuration } = useFocusMode();
  //Rendera inget om modalen inte är öppen
  if (!open) return null;

  //Hämtar standardtid (minuter) för ett visst läge-id.
  const getDuration = (id) => modes.find(m => m.id === id)?.defaultDuration || 0;

  // Rensar all data från localStorage efter bekräftelse (Fabriksåterställning)
  const clearAllData = () => {
    if (window.confirm("Är du säker på att du vill radera all sparad data? Detta kan inte ångras.")) {
      localStorage.clear();
      alert("All data har raderats.");
      window.location.reload();
    }
  };

  return (
    //Klick på overlay stänger modalen
    <div className="modal-overlay" onClick={onClose}>
      {/* Stoppar klick inuti modalen från att bubbla till overlay */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="header-title">
            <Settings className="header-icon" size={24} />
            <h2>Inställningar</h2>
          </div>
          {/* Stäng-knapp */}
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <section className="modal-body">
          {/* Sektion: justera standardtider för fokuslägen */}
          <div className="settings-section card">
            <div className="section-title">
              <Brain className="section-icon" size={20} />
              <h3>Fokuslägen</h3>
            </div>
            <p className="section-desc">Ändra måltiden för när klockan ska stanna automatiskt.</p>

            <div className="slider-group">
              {/* Deep Work Slider - ID: deepWork */}
              <div className="slider-item">
                <div className="label-box"><Brain size={18} /> <span>Deep Work</span></div>
                <input
                  type="range" min="5" max="120" step="5"
                  value={getDuration('deepWork')}
                  onChange={(e) => updateModeDuration('deepWork', Number(e.target.value))}
                />
                <span className="value-display">{getDuration('deepWork')} min</span>
              </div>

              {/* Möte Slider - ID: meeting */}
              <div className="slider-item">
                <div className="label-box"><Users size={18} /> <span>Möte</span></div>
                <input
                  type="range" min="5" max="120" step="5"
                  value={getDuration('meeting')}
                  onChange={(e) => updateModeDuration('meeting', Number(e.target.value))}
                />
                <span className="value-display">{getDuration('meeting')} min</span>
              </div>

              {/* Paus Slider - ID: break */}
              <div className="slider-item">
                <div className="label-box"><Coffee size={18} /> <span>Paus</span></div>
                <input
                  type="range" min="1" max="60" step="1"
                  value={getDuration('break')}
                  onChange={(e) => updateModeDuration('break', Number(e.target.value))}
                />
                <span className="value-display">{getDuration('break')} min</span>
              </div>
            </div>
          </div>

          {/* Sektion: Datahantering */}
          <div className="settings-section card danger-zone">
            <div className="section-title">
              <Database className="section-icon" size={20} />
              <h3>Data</h3>
            </div>
            <p className="section-desc">
              All data sparas lokalt i din webbläsare. Ingen data skickas till någon server.
            </p>
            {/* Fabriksåterställning */}
            <button className="btn-danger" onClick={clearAllData}>
              <Trash2 size={18} /> Radera all data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}