import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from './components/Layout/Header';
import UserLogin from "./components/UserLogin/userLogin";
import Calendar from "./components/Calendar/Calendar";
import RoutineSection from './components/RoutineSection/RoutineSection';
import TodoWidget from './components/ToDo/TodoWidget';
import DailySchedule from './components/Schedule/DailySchedule';
import FlowTimerPage from "./pages/FlowTimerPage"; 
import SettingsModal from "./components/Settings/SettingsModal";

import './App.css';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="app-container">
      {/* 1. Header ligger alltid kvar på toppen */}
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      {/* 2. Här byter vi ut innehållet beroende på vilken länk vi klickat på */}
      <main className="dashboard-container">
        <Routes>
          {/* DIN STARTSIDA (Hem / Kalender) */}
          <Route path="/" element={
            <>
              <p>Välkommen! Här är dina dagliga mål och rutiner.</p>
              <div className="calendar-wrapper">
                <Calendar />
              </div>
              <div className="grid-layout">
                <div className="schedule-wrapper">
                  <DailySchedule />
                </div>
                <div className="todo-wrapper">
                  <TodoWidget />
                </div>
              </div>
              <RoutineSection />
            </>
          } />

          {/* DINA ANDRA SIDOR */}
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/flow" element={<FlowTimerPage />} />
          <Route path="/login" element={<UserLogin />} />
        </Routes>
      </main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default App;