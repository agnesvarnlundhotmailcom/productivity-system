import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Layout/Header";
import SettingsModal from "./components/Settings/SettingsModal";

import CalendarPage from "./pages/CalendarPage";
import FlowTimerPage from "./pages/FlowTimerPage";
import EnergyCarePage from "./pages/EnergyCarePage";
import StatisticsOverTimePage from "./pages/StatisticsOverTimePage";
import UserLogin from "./components/UserLogin/userLogin";

import "./App.css";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="app-container">
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="dashboard-container">
        <Routes>
          <Route path="/" element={<Navigate to="/flow" replace />} />
          <Route path="/flow" element={<FlowTimerPage />} />
          <Route path="/calendar" element={<CalendarPage selectedDate={selectedDate} setSelectedDate={setSelectedDate} />} />
          <Route path="/energy" element={<EnergyCarePage />} />
          <Route path="/stats" element={<StatisticsOverTimePage />} />
          <Route path="/login" element={<UserLogin />} />
        </Routes>
      </main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
