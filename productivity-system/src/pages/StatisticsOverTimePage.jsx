import React from "react";
import EnergyCare from "../components/EnergyCare/EnergyCare";

const StatisticsOverTime = () => {
  return (
    <div className="statistics-page" style={{ padding: '20px' }}>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Här renderas din energimätare som hämtar data från SessionContext */}
        <EnergyCare />
      </div>
      
      <div className="additional-stats" style={{ marginTop: '40px' }}>
        {/* Här kan du senare lägga in tabeller eller andra grafer */}
      </div>
    </div>
  );
};

export default StatisticsOverTime;