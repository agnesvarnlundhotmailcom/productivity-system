import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";
// Importera History-ikonen istället för Zap om du vill ha klock-pilen
import { History, Calendar, Timer, User, Settings, BarChart, Zap } from "lucide-react";
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
        <Link to="/flow" className={isActive("/flow")}>
          <Timer size={18} />
          <span>FlowTimer</span>
        </Link>
        <Link to="/calendar" className={isActive("/calendar")}>
          <Calendar size={18} />
          <span>Kalender</span>
        </Link>
        
        {/* UPPDATERAD: Ändrad från /energy till /history */}
        <Link to="/history" className={isActive("/history")}>
          <History size={18} />
          <span>Historik</span>
        </Link>

        <Link to="/stats" className={isActive("/stats")}>
          <BarChart size={18} />
          <span>Statistik</span>
        </Link>
      </nav>

      {/* Höger: User, Settings, Theme */}
      <div className="header-right">
        <Link to="/login" className="nav-icon-link"><User size={20} /></Link>
        <button className="settings-btn" onClick={onOpenSettings}>
          <Settings size={20} />
        </button>
        <div className="divider" />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;