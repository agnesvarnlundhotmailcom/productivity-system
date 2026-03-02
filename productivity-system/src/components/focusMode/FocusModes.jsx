import React from "react";
import { Brain, Users, Coffee, Settings2 } from "lucide-react";
import { useFocusMode } from "../../contexts/FocusModeContext"; 
import "./FocusModes.css"; 

export default function FocusModes() {
  // Vi hämtar allt vi behöver från FocusModeContext
  const { modes, activeMode, setActiveMode } = useFocusMode();

  const getIcon = (id) => {
    switch (id) {
      case 'deepWork': return <Brain size={20} />;
      case 'meeting': return <Users size={20} />;
      case 'break': return <Coffee size={20} />;
      default: return <Brain size={20} />;
    }
  };

  const getDesc = (id) => {
    switch (id) {
      case 'deepWork': return "Intensivt fokusarbete utan avbrott";
      case 'meeting': return "Samarbete och kommunikation";
      case 'break': return "Vila och återhämtning";
      default: return "";
    }
  };

  return (
    <div className="card focus-modes-card">
      <div className="focus-header">
        <Settings2 size={18} className="header-icon" />
        <h2>Fokusläge</h2>
      </div>
      
      <div className="modes-list">
        {modes.map((mode) => (
          <button 
            key={mode.id} 
            className={`mode-item ${activeMode.id === mode.id ? "active" : ""}`}
            onClick={() => setActiveMode(mode.id)}
          >
            <div className="mode-icon-wrapper">
              {getIcon(mode.id)}
            </div>
            <div className="mode-text">
              <span className="mode-title">{mode.name}</span>
              <span className="mode-desc">{getDesc(mode.id)}</span>
            </div>
            <span className="mode-duration">{mode.defaultDuration} min</span>
          </button>
        ))}
      </div>

      <div className="active-footer">
        <span className="status-dot"></span>
        <p>Aktivt läge: <strong>{activeMode.name}</strong></p>
      </div>
    </div>
  );
}