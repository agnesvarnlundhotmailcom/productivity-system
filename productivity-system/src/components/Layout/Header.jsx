import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";
import { Zap, Calendar, Timer, User, Settings, BarChart } from "lucide-react";
import { ThemeToggle } from "../Theme/ThemeToggle";

const Header = ({ onOpenSettings }) => {
  const location = useLocation();

  // Kollar om en länk är aktiv
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="header-container">
      {/* Vänster: Logo/Titel */}
      <div className="header-left">
        <span className="logo-icon"><Zap size={24} fill="currentColor" /></span>
        <h1 className="app-title">FlowTime</h1>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <Link to="/flow" className={isActive("/flow")}><Timer size={18} /><span>FlowTimer</span></Link>
        <Link to="/calendar" className={isActive("/calendar")}><Calendar size={18} /><span>Kalender</span></Link>
        <Link to="/energy" className={isActive("/energy")}><Zap size={18} /><span>Energi</span></Link>
        <Link to="/stats" className={isActive("/stats")}><BarChart size={18} /><span>Statistik</span></Link>
      </nav>

      {/* Höger: User, Settings, Theme */}
      <div className="header-right">
        <Link to="/login" className="nav-icon-link"><User size={20} /></Link>
        <button className="settings-btn" onClick={onOpenSettings}><Settings size={20} /></button>
        <div className="divider" />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
