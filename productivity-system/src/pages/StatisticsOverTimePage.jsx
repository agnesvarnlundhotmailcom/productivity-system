import React from "react";
import StatisticsOverTime from "../components/Analys/StatisticsOverTime"; 
import { BarChart } from "lucide-react"; 
import "../components/Analys/StatisticsOverTime.css";

const StatisticsOverTimePage = () => {
  return (
    <div className="statistics-page">
      <div className="stats-page-container">
        <StatisticsOverTime />

      </div>
    </div>
  );
};

export default StatisticsOverTimePage;