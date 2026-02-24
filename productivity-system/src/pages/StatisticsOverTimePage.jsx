import React from "react";
import StatisticsOverTime from "../components/Analys/StatisticsOverTime"; 
import { BarChart } from "lucide-react"; 
import "../components/Analys/StatisticsOverTime.css";
import Statistics from "../components/Statistics/Statistics";

const StatisticsOverTimePage = () => {
  return (
    <div className="statistics-page">
      <div className="stats-page-container">
        <Statistics />
        <StatisticsOverTime />
      </div>
    </div>
  );
};

export default StatisticsOverTimePage;