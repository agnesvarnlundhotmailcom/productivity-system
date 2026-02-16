import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css"; 
import { Zap, Calendar, CheckSquare, Timer, User, Settings } from "lucide-react";
import { ThemeToggle } from "../Theme/ThemeToggle";

const Header = ({ onOpenSettings }) => {
  const location = useLocation();

  // Funktion för att kolla om länken är aktiv
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="header-container">
      {/* Vänster sida: Logga/Titel */}
      <div className="header-left">
        <span className="logo-icon">
          <Zap size={24} fill="currentColor" />
        </span>
        <h1 className="app-title">FlowTime</h1>
      </div>

      {/* Mitten/Höger: Navigation */}
      <nav className="header-nav">
        <Link to="/flow" className={isActive("/flow")}>
          <Timer size={18} />
          <span>FlowTimer</span>
        </Link>
        <Link to="/" className={isActive("/")}>
          <Calendar size={18} />
          <span>Kalender</span>
        </Link>
      </nav>

      {/* Höger sida: Actions + Theme */}
      <div className="header-right">
        <Link to="/login" className="nav-icon-link">
          <User size={20} />
        </Link>
        
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