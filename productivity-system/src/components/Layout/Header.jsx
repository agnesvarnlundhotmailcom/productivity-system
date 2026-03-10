import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";
import { History, Calendar, Timer, User, Settings, BarChart, Zap } from "lucide-react";
import { ThemeToggle } from "../Theme/ThemeToggle";

/**
 * Header med navigering och snabbknappar
 * @param {Object} props
 * @param {() => void} props.onOpenSetting -Öppnar inställningspanelen
 */

const Header = ({ onOpenSettings }) => {
  //Hämtar aktuell route för att kunna markera aktiv länk
  const location = useLocation();

  /** Returnerar aktiv klass för nuvarande route. */
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="header-container">
      {/* VÄNSTER: Logo */}
      <div className="header-left">
        <span className="logo-icon">
          <Zap size={24} fill="currentColor" />
        </span>
        <h1 className="app-title">FlowTime</h1>
      </div>

      {/* MITTEN: Navigation (Desktop only) */}
      <nav className="header-nav">
        <Link to="/flow" className={isActive("/flow")}>
          <Timer size={18} />
          <span>FlowTimer</span>
        </Link>
        <Link to="/calendar" className={isActive("/calendar")}>
          <Calendar size={18} />
          <span>Kalender</span>
        </Link>
        <Link to="/history" className={isActive("/history")}>
          <History size={18} />
          <span>Historik</span>
        </Link>
        <Link to="/stats" className={isActive("/stats")}>
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