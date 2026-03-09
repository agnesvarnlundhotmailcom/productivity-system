import React from "react";
import { Brain, Users, Coffee, Settings2 } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext"; 
import "./FocusModes.css"; 

/**
 * Konfiguration för varje fokusläge.
 * 
 * Definierar ikonen, beskrivningen och andra egenskaper för
 * de tre huvudsakliga fokuslägen: djuparbete, möte och paus.
 * 
 * @type {Object<string, {icon: React.ReactElement, desc: string}>}
 * @property {React.ReactElement} icon - Lucide-React ikon för läget
 * @property {string} desc - Kort beskrivning av läget
 * 
 * @example
 * MODE_CONFIG.deepWork // { icon: <Brain />, desc: "Intensivt fokusarbete..." }
 */
const MODE_CONFIG = {
  deepWork: { icon: <Brain size={20} />, desc: "Intensivt fokusarbete utan avbrott" },
  meeting: { icon: <Users size={20} />, desc: "Samarbete och kommunikation" },
  break: { icon: <Coffee size={20} />, desc: "Vila och återhämtning" }
};

/**
 * Komponent som visar tillgängliga fokuslägen och låter användaren välja mellan dem.
 * 
 * Visar en lista med alla fokuslägen, där varje läge har:
 * - En ikon
 * - Namn och beskrivning
 * - Standardvaraktighet i minuter
 * 
 * Det aktiva läget markeras med en aktiv-klass och visas i sidfoten.
 * 
 * @component
 * @returns {React.ReactElement} En kort-komponent med fokuslänes-väljare
 * 
 * @example
 * <FocusModes />
 */
export default function FocusModes() {
  // Hämtar alla tillgängliga lägen, det aktiva läget och funktion för att byta läge
  const { modes, activeMode, setActiveMode } = useFocusMode();

  return (
    <div className="card focus-modes-card">
      {/* Header med ikon och titel */}
      <div className="focus-header">
        <Settings2 size={18} className="header-icon" />
        <h2>Fokusläge</h2>
      </div>
      
      {/* Lista med alla fokuslägen */}
      <div className="modes-list">
        {modes.map((mode) => {
          // Hämtar konfiguration för detta läge (ikon, beskrivning)
          const config = MODE_CONFIG[mode.id] || { icon: <Brain size={20} />, desc: "" };
          
          return (
            <button 
              key={mode.id} 
              className={`mode-item ${activeMode.id === mode.id ? "active" : ""}`}
              onClick={() => setActiveMode(mode.id)}
            >
              <div className="mode-icon-wrapper">
                {config.icon}
              </div>
              <div className="mode-text">
                <span className="mode-title">{mode.name}</span>
                <span className="mode-desc">{config.desc}</span>
              </div>
              <span className="mode-duration">{mode.defaultDuration} min</span>
            </button>
          );
        })}
      </div>

      {/* Footer som visar vilket läge som är aktivt */}
      <div className="active-footer">
        <span className="status-dot"></span>
        <p>Aktivt läge: <strong>{activeMode.name}</strong></p>
      </div>
    </div>
  );
}