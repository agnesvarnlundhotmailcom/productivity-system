import React from 'react';
import './Layout.css';

const Header = () => {
  return (
    <header className="header-container">
      {/* Vänster sida: Logga/Titel */}
      <div className="header-left">
        <span className="logo-icon">⚡</span> {/* En liten ikon, typ blixt */}
        <h1 className="app-title">NAMN PÅ APPEN</h1>
      </div>

      {/* Höger sida: Meny/Navigation */}
      <div className="header-right">
        <nav>
          <a href="#" className="nav-link active">Hem</a>
          <a href="#" className="nav-link">Statistik</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;