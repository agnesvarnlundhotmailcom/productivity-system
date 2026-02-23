import React, { useContext } from "react";
import { X, Brain, Users, Coffee, Settings,Database, Trash2 } from "lucide-react";
import { DataContext } from "../../contexts/DataContext";
import "./SettingsModal.css";

export default function SettingsModal({ open, onClose }) {
  const { data, updateFocusSettings } = useContext(DataContext);
  
 
  const focusSettings = data.settings?.focusSettings || { deepWork: 90, meeting: 60, pause: 15 };

  if (!open) return null;

 
  const handleSliderChange = (key, value) => {
    updateFocusSettings({ [key]: Number(value) });
  };

  // Funktion för att rensa all data
  const clearAllData = () => {
    if (window.confirm("Är du säker på att du vill radera all sparad data? Detta kan inte ångras.")) {
      localStorage.clear();
      alert("All data har raderats.");
      window.location.reload(); 
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="header-title">
            <Settings className="header-icon" size={24} />
            <h2>Inställningar</h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <section className="modal-body">
          {/* TIMER-INSTÄLLNINGAR */}
          <div className="settings-section card">
            <div className="section-title">
              <Brain className="section-icon" size={20} />
              <h3>Fokuslägen</h3>
            </div>
            <p className="section-desc">Ändra standardtiden för de inbyggda fokuslägen.</p>
            
            <div className="slider-group">
              <div className="slider-item">
                <div className="label-box"><Brain size={18} /> <span>Deep Work</span></div>
                <input 
                  type="range" min="5" max="120" step="5"
                  value={focusSettings.deepWork} 
                  onChange={(e) => handleSliderChange('deepWork', e.target.value)}
                />
                <span className="value-display">{focusSettings.deepWork} min</span>
              </div>

              <div className="slider-item">
                <div className="label-box"><Users size={18} /> <span>Möte</span></div>
                <input 
                  type="range" min="5" max="120" step="5"
                  value={focusSettings.meeting} 
                  onChange={(e) => handleSliderChange('meeting', e.target.value)}
                />
                <span className="value-display">{focusSettings.meeting} min</span>
              </div>

              <div className="slider-item">
                <div className="label-box"><Coffee size={18} /> <span>Paus</span></div>
                <input 
                  type="range" min="1" max="60" step="1"
                  value={focusSettings.pause} 
                  onChange={(e) => handleSliderChange('pause', e.target.value)}
                />
                <span className="value-display">{focusSettings.pause} min</span>
              </div>
            </div>
          </div>

          {/* DATA-SEKTION (Radera allt) */}
          <div className="settings-section card danger-zone">
            <div className="section-title">
              <Database className="section-icon" size={20} />
              <h3>Data</h3>
            </div>
            <p className="section-desc">
              All data sparas lokalt i din webbläsare. Ingen data skickas till någon server.
            </p>
            <button className="btn-danger" onClick={clearAllData}>
              <Trash2 size={18} /> Radera all data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}