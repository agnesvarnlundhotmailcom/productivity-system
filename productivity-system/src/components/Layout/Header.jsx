import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";
import { Zap, Calendar, Timer, CheckSquare, User, Settings } from "lucide-react";
import { ThemeToggle } from "../Theme/ThemeToggle";

const Header = ({ onOpenSettings }) => {
  const location = useLocation();

  // Funktion som returnerar CSS-klass för aktiv länk
  // Den används för att markera vilken sida användaren är på
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="header-container">
      {/* Vänster sida: Logo och App-titel */}
      <div className="header-left">
        {/* Ikon/logotyp */}
        <span className="logo-icon"><Zap size={24} fill="currentColor" /></span>
        {/* Apptitel */}
        <h1 className="app-title">FlowTime</h1>
      </div>

      {/* Navigation: Länkar till olika sidor */}
      <nav className="header-nav">
        {/* FlowTimer-sidan */}
        <Link to="/flow" className={isActive("/flow")}><Timer size={18} /><span>FlowTimer</span></Link>
        {/* Kalender-sidan */}
        <Link to="/calendar" className={isActive("/calendar")}><Calendar size={18} /><span>Kalender</span></Link>
        {/* Energi-sidan */}
        <Link to="/energy" className={isActive("/energy")}><Zap size={18} /><span>Energi</span></Link>
        {/* Statistik-sidan */}
        <Link to="/stats" className={isActive("/stats")}><CheckSquare size={18} /><span>Statistik</span></Link>
      </nav>

      {/* Höger sida: Användarikoner, inställningar och temaväxling */}
      <div className="header-right">
        {/* Länk till login/användarsida */}
        <Link to="/login" className="nav-icon-link"><User size={20} /></Link>
        {/* Inställningar-knapp som öppnar modal */}
        <button className="settings-btn" onClick={onOpenSettings}><Settings size={20} /></button>
        {/* Visuell divider mellan knappar och temaväxling */}
        <div className="divider" />
        {/* Temaväxling mellan ljus/mörkt läge */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
