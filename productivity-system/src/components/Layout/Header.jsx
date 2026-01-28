import React from "react";
import "./Layout.css";
import { Zap } from "lucide-react";
import { ThemeToggle } from "../Theme/ThemeToggle";

const Header = () => {
  return (
    <header className="header-container">
      {/* Vänster sida: Logga/Titel */}
      <div className="header-left">
        <span className="logo-icon">
          <Zap size={30} />
        </span>
        <h1 className="app-title">FlowTime</h1>
      </div>

      {/* Höger sida: Navigation + Theme */}
      <div className="header-right">
        <nav>
          <a href="#" className="nav-link active">Hem</a>
          <a href="#" className="nav-link">Tidsspårning</a>
        </nav>

        {/* 👇 Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
