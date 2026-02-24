import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";
import { History, Calendar, Timer, User, Settings, BarChart, Zap, Menu, X } from "lucide-react";
import { ThemeToggle } from "../Theme/ThemeToggle";

const Header = ({ onOpenSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header-container">
      {/* VÄNSTER: Hamburgare och Logo */}
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleMenu} aria-label="Meny">
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        
        <span className="logo-icon">
          <Zap size={24} fill="currentColor" />
        </span>
        <h1 className="app-title">FlowTime</h1>
      </div>

      {/* MITTEN: Navigation (Desktop) / Dropdown (Mobil) */}
      <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
        <Link to="/flow" className={isActive("/flow")} onClick={() => setIsMenuOpen(false)}>
          <Timer size={18} />
          <span>FlowTimer</span>
        </Link>
        <Link to="/calendar" className={isActive("/calendar")} onClick={() => setIsMenuOpen(false)}>
          <Calendar size={18} />
          <span>Kalender</span>
        </Link>
        <Link to="/history" className={isActive("/history")} onClick={() => setIsMenuOpen(false)}>
          <History size={18} />
          <span>Historik</span>
        </Link>
        <Link to="/stats" className={isActive("/stats")} onClick={() => setIsMenuOpen(false)}>
          <BarChart size={18} />
          <span>Statistik</span>
        </Link>
      </nav>

      {/* HÖGER: User, Settings, Theme */}
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