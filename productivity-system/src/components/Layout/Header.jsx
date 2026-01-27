import React from 'react';
import './Layout.css';
import { Zap } from 'lucide-react';

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

      {/* Höger sida: Meny/Navigation */}
      <div className="header-right">
        <nav>
          <a href="#" className="nav-link active">Hem</a>
          <a href="#" className="nav-link">Tidsspårning</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;