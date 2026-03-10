import React from "react";
import StatisticsOverTime from "../components/Analys/StatisticsOverTime"; 
import { BarChart } from "lucide-react"; 
import "../components/Analys/StatisticsOverTime.css";
import Statistics from "../components/Statistics/Statistics";

/**
 * Sida för analys och historik.
 * Sammanställer både dagens direkta prestationer och trender över en längre tidsperiod.
 * @component
 */
const StatisticsOverTimePage = () => {
  return (
    <div className="statistics-page">
      <div className="stats-page-container">

        {/* Visar sammanfattning av dagens aktivitet (t.ex total arbetstid idag) */}
        <Statistics />

        {/* Visar grafer och trender som sträcker sig över flera dagar eller veckor */}
        <StatisticsOverTime />
      </div>
    </div>
  );
};

export default StatisticsOverTimePage;