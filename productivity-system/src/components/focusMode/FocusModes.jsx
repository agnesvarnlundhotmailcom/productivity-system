import React, { useState, useContext } from "react";
import { Brain, Users, Coffee, Settings2 } from "lucide-react";
import { DataContext } from "../../contexts/DataContext";
import "./FocusModes.css"; 

export default function FocusModes() {
  const { data } = useContext(DataContext);
  const focusSettings = data.settings?.focusSettings || { deepWork: 90, meeting: 60, pause: 15 };
  
  const [activeMode, setActiveMode] = useState("meeting");

  const modes = [
    { 
      id: "deep-work", 
      title: "Deep Work", 
      desc: "Intensivt fokusarbete utan avbrott", 
      time: `${focusSettings.deepWork} min`, 
      icon: <Brain size={20} /> 
    },
    { 
      id: "meeting", 
      title: "Möte", 
      desc: "Samarbete och kommunikation", 
      time: `${focusSettings.meeting} min`, 
      icon: <Users size={20} /> 
    },
    { 
      id: "break", 
      title: "Paus", 
      desc: "Vila och återhämtning", 
      time: `${focusSettings.pause} min`, 
      icon: <Coffee size={20} /> 
    },
  ];

  return (
    <div className="card focus-modes-card">
      <div className="focus-header">
        <Settings2 size={18} className="header-icon" />
        <h3>Fokusläge</h3>
      </div>
      
      <div className="modes-list">
        {modes.map((mode) => (
          <button 
            key={mode.id} 
            className={`mode-item ${activeMode === mode.id ? "active" : ""}`}
            onClick={() => setActiveMode(mode.id)}
          >
            <div className="mode-icon-wrapper">
              {mode.icon}
            </div>
            <div className="mode-text">
              <span className="mode-title">{mode.title}</span>
              <span className="mode-desc">{mode.desc}</span>
            </div>
            <span className="mode-duration">{mode.time}</span>
          </button>
        ))}
      </div>

      <div className="active-footer">
        <span className="status-dot"></span>
        <p>Aktivt läge: <strong>{modes.find(m => m.id === activeMode)?.title}</strong></p>
      </div>
    </div>
  );
}