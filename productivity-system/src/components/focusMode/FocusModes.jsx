import React from "react";
import { Brain, Users, Coffee, Settings2 } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext"; 
import "./FocusModes.css"; 

const MODE_CONFIG = {
  deepWork: { icon: <Brain size={20} />, desc: "Intensivt fokusarbete utan avbrott" },
  meeting: { icon: <Users size={20} />, desc: "Samarbete och kommunikation" },
  break: { icon: <Coffee size={20} />, desc: "Vila och återhämtning" }
};

export default function FocusModes() {
  const { modes, activeMode, setActiveMode } = useFocusMode();

  return (
    <div className="card focus-modes-card">
      <div className="focus-header">
        <Settings2 size={18} className="header-icon" />
        <h2>Fokusläge</h2>
      </div>
      
      <div className="modes-list">
        {modes.map((mode) => {
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

      <div className="active-footer">
        <span className="status-dot"></span>
        <p>Aktivt läge: <strong>{activeMode.name}</strong></p>
      </div>
    </div>
  );
}