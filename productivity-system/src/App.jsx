import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import FlowTimerPage from "./pages/FlowTimerPage";
import TodoPage from "./pages/TodoPage";
import CalendarPage from "./pages/CalendarPage";
import LoginPage from "./pages/LoginPage";
import SettingsModal from "./components/Settings/SettingsModal";
import "./App.css";

function App() {
  const [selectedTs, setSelectedTs] = useState(() => Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div>
      <header className="app-header">
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={<CalendarPage selectedDate={selectedTs} setSelectedDate={setSelectedTs} />}
          />
          <Route
            path="/calendar"
            element={<CalendarPage selectedDate={selectedTs} setSelectedDate={setSelectedTs} />}
          />
          <Route path="/flow" element={<FlowTimerPage />} />
          <Route path="/todo" element={<TodoPage selectedDate={selectedTs} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

        <nav className= "navBar">
          <Link to="/">Hem</Link>{" | "}
          <Link to="/calendar">Kalender</Link>{" | "}
          <Link to="/todo">To‑Do</Link>{" | "}
          <Link to="/flow">FlowTimer</Link>{" | "}
          <Link to="/login">Log in</Link>
          <button type="button" onClick={() => setSettingsOpen(true)}>
            Inställningar
          </button>{" | "}
        </nav>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default App;