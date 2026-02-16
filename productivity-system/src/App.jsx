import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Layout & Modaler
import Header from './components/Layout/Header';
import SettingsModal from "./components/Settings/SettingsModal";

// Sidor
import CalendarPage from "./pages/CalendarPage"; // Denna sköter nu Kalender + Schema + ToDo
import FlowTimerPage from "./pages/FlowTimerPage"; 
import UserLogin from "./components/UserLogin/userLogin";

// Widgets (om du vill ha dem på egna separata sidor också)
import TodoWidget from './components/ToDo/TodoWidget';

import './App.css';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Skapa datum-state här så att Kalender och Schema alltid är synkade
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="app-container">
      {/* Headern sköter navigeringen via <Link> */}
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="dashboard-container">
        <Routes>
           {/* STARTSIDAN - FLOWTIMER-SIDAN */}
          <Route path="/flow" element={<FlowTimerPage />} />

         {/** KALENDERSIDAN */}
          <Route 
            path="/" 
            element={<CalendarPage selectedDate={selectedDate} setSelectedDate={setSelectedDate} />} 
          />
    
          {/* LOGIN */}
          <Route path="/login" element={<UserLogin />} />
        </Routes>
      </main>

      {/* Inställningar */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default App;