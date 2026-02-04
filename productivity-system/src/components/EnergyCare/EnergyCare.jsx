import React from 'react';
// HÄMTNING: Vi hämtar ikoner (Blixt, Klocka, Kaffe) från biblioteket Lucide.
import { Zap, Clock, Coffee } from 'lucide-react';
import './EnergyCare.css';

const EnergyCare = () => {
  // DIN INSTÄLLNING: Detta är siffran som styr hela kortet.
  // Ändrar 52 här, så ändras både texten och mätaren automatiskt.
  const energyLevel = 52;

  return (
    <section className="card energy-card">
      {/* 1. TOPPEN: Visar vad kortet handlar om (Ikon + Namn) */}
      <div className="card-header">
        <div className="header-left">
          {/* Cirkeln bakom blixt-ikonen */}
          <div className="icon-bg">
            <Zap size={18} fill="currentColor" />
          </div>
          <h3>Energinivå</h3>
        </div>
        {/* En liten text-etikett uppe i hörnet */}
        <span className="status-text">STABIL</span>
      </div>

      {/* 2. MITTEN: Den stora siffran och själva mätaren */}
      <div className="energy-main">
        {/* Här skriver vi ut siffran vi valde högst upp (energyLevel) */}
        <h1 className="energy-percent">{energyLevel}%</h1>
        
        {/* Mätarens bakgrund (den gråa skåran) */}
        <div className="progress-bar-bg">
          {/* Denna del är "fyllningen". 
              Vi använder style för att säga: "Bredden på färgen ska vara exakt så många procent som energinivån". */}
          <div 
            className="progress-fill" 
            style={{ width: `${energyLevel}%` }} 
          />
        </div>
      </div>

      {/* 3. BOTTEN: Två rutor med extra tips och tider */}
      <div className="energy-footer">
        
        {/* Första boxen: Nästa energitopp */}
        <div className="info-box">
          <p><Clock size={14} /> NÄSTA PEAK</p>
          <span>15:00</span>
        </div>

        {/* Andra boxen: Ett smart råd */}
        <div className="info-box">
          <p><Coffee size={14} /> REKOMMENDATION</p>
          <span>Bra för fokus</span>
        </div>

      </div>
    </section>
  );
};

export default EnergyCare;