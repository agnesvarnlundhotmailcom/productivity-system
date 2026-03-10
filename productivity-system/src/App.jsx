import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext";
import Header from "./components/Layout/Header";
import BottomNav from "./components/Layout/BottomNav";
import SettingsModal from "./components/Settings/SettingsModal";
import CalendarPage from "./pages/CalendarPage";
import FlowTimerPage from "./pages/FlowTimerPage";
import SessionLogsPage from "./pages/SessionLogsPage";
import StatisticsOverTimePage from "./pages/StatisticsOverTimePage";
import UserLoginPage from "./pages/UserLoginPage";
import "./App.css";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <SessionProvider>
      <div className="app-container">
        <Header onOpenSettings={() => setSettingsOpen(true)} />

        <main className="dashboard-container">
          <Routes>
            <Route path="/" element={<Navigate to="/flow" replace />} />
            <Route path="/flow" element={<FlowTimerPage />} />
            <Route path="/calendar" element={<CalendarPage selectedDate={selectedDate} setSelectedDate={setSelectedDate} />} />

            {/* 2. Historik-sidan som nu pratar med SessionContext */}
            <Route path="/history" element={<SessionLogsPage />} />

            <Route path="/stats" element={<StatisticsOverTimePage />} />
            <Route path="/login" element={<UserLoginPage />} />
          </Routes>
        </main>

        <BottomNav />
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </SessionProvider>
  );
}