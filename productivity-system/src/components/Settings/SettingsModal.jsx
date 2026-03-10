import React from "react";
import { X, Brain, Users, Coffee, Settings, Database, Trash2 } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext";
import "./SettingsModal.css";

/**
 * En modal för appens inställningar.
 * Här kan användaren ändra tider för fokuslägen och rensa all sparad data.
 * * @component
 * @param {Object} props
 * @param {boolean} props.open - Om modalen ska synas eller vara dold.
 * @param {Function} props.onClose - Funktionen som körs för att stänga modalen.
 */
export default function SettingsModal({ open, onClose }) {
  //Hämtar inställningar och funktioner för fokuslägen (t.ex. Deep Work, Möte)
  const { modes, updateModeDuration } = useFocusMode();

  // Om modalen inte ska vara öppen ritar vi inte ut någonting alls (null)
  if (!open) return null;

  /**
   * Hittar och hämtar standardtiden för ett specifikt läge.
   * * @param {string} id - Det unika. ID:t för läget (t.ex. 'deepWork)
   * @returns {number} Antalet minuter som är inställda som standard.
   */
  const getDuration = (id) => modes.find(m => m.id === id)?.defaultDuration || 0;

  /**
   * Rensar bort precis allt som sparats lokalt i webbläsaren.
   * Detta nollställer appen.
   */
  const clearAllData = () => {
    // En inbyggd webbläsar-ruta som tvingar användaren att bekräfta valet
    if (window.confirm("Är du säker på att du vill radera all sparad data? Detta kan inte ångras.")) {
      localStorage.clear(); // Tömmer webbläsarens lokala databas
      alert("All data har raderats.");
      window.location.reload(); // Laddar om sidan för att rensa appens minne
    }
  };

  return (
    /* Overlay: Den mörka bakgrunden. Klick här stänger modalen via props.onClose */
    <div className="modal-overlay" onClick={onClose}>

      {/* Själva modal-fönstret. stopPropagation hindrar klick här inne från att stänga modalen */}
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
          {/* Sektion: fokuslägen (sliders för tid) */}
          <div className="settings-section card">
            <div className="section-title">
              <Brain className="section-icon" size={20} />
              <h3>Fokuslägen</h3>
            </div>
            <p className="section-desc">Ändra måltiden för när klockan ska stanna automatiskt.</p>

            <div className="slider-group">
              {/* Deep Work slider */}
              <div className="slider-item">
                <div className="label-box"><Brain size={18} /> <span>Deep Work</span></div>
                <input
                  type="range" min="5" max="120" step="5"
                  value={getDuration('deepWork')}
                  /* Number() ser till att värdet sparas som en siffra och inte text */
                  onChange={(e) => updateModeDuration('deepWork', Number(e.target.value))}
                />
                <span className="value-display">{getDuration('deepWork')} min</span>
              </div>

              {/* Möte slider */}
              <div className="slider-item">
                <div className="label-box"><Users size={18} /> <span>Möte</span></div>
                <input
                  type="range" min="5" max="120" step="5"
                  value={getDuration('meeting')}
                  onChange={(e) => updateModeDuration('meeting', Number(e.target.value))}
                />
                <span className="value-display">{getDuration('meeting')} min</span>
              </div>

              {/* Paus slider */}
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