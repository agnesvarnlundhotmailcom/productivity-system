import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";
import { History, Calendar, Timer, User, Settings, BarChart, Zap, Menu, X } from "lucide-react";
import { ThemeToggle } from "../Theme/ThemeToggle";

/**
 * Header med navigering och snabbknappar
 * @param {Object} props
 * @param {() => void} props.onOpenSetting -Öppnar inställningspanelen
 */

const Header = ({ onOpenSettings }) => {
  //Styr om mobilmenyn är öppen eller stängd
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //Hämtar aktuell route för att kunna markera aktiv länk
  const location = useLocation();

  /** Returnerar aktiv klass för nuvarande route. */
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  //Växlar mobilmenyn mellan öppen/stängd
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header-container">
      {/* VÄNSTER: Hamburgare och Logo */}
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleMenu} aria-label="Meny">
          {/* Visar X när menyn är öppen, annars hamburgerikonen */}
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      {/* Appens visuella logotyp och titel */}
        <span className="logo-icon">
          <Zap size={24} fill="currentColor" />
        </span>
        <h1 className="app-title">FlowTime</h1>
      </div>

      {/* MITTEN: Navigation (Desktop) / Dropdown (Mobil) */}
      <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
        {/* Varje länk klick stänger mobilmenyn för bättre UX */}
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

      {/* HÖGER: Snabbåtgärder (profil, inställningar, tema) */}
      <div className="header-right">
        <Link to="/login" className="nav-icon-link" aria-label="inlogning"><User size={20} /></Link>
        <button className="settings-btn" aria-label="Inställningar" onClick={onOpenSettings}>
          <Settings size={20} />
        </button>
        <div className="divider" />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;