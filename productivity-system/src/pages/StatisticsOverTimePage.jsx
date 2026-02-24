import React from "react";
import StatisticsOverTime from "../components/Analys/StatisticsOverTime"; 
import { BarChart } from "lucide-react"; 
import "../components/Analys/StatisticsOverTime.css";

const StatisticsOverTimePage = () => {
  return (
    <div className="statistics-page">
      <div className="stats-page-container">
        
        {/* Rubrik med ikon */}
        <div className="stats-page-header-row">
          <BarChart size={28} color="#6dbf9e" strokeWidth={2.5} />
          <h1 className="stats-page-title">Din Statistik</h1>
        </div>

        <StatisticsOverTime />

      </div>
    </div>
  );
};

export default StatisticsOverTimePage;