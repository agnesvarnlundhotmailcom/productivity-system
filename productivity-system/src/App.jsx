import React, { useState } from 'react';
import UserLogin from "./components/UserLogin/userLogin";
import Header from './components/Layout/Header';
import Calendar from "./components/Calendar/Calendar";
import RoutineSection from './components/RoutineSection/RoutineSection';
import TodoWidget from './components/ToDo/TodoWidget';
import DailySchedule from './components/Schedule/DailySchedule';
import './App.css';

function App() {
  // Gemensamt tillstånd för valt datum (timestamp)
// Istället för useState(Date.now())
const [selectedTs, setSelectedTs] = useState(() => Date.now());

  return (
    <div>
      <UserLogin />
      <Header />

      <main className="dashboard-container">
        <p>Här är dina dagliga mål och rutiner.</p>

        <div className="calendar-wrapper">
          {/* Vi skickar ner datumet och funktionen att ändra det */}
          <Calendar selectedTs={selectedTs} onDateChange={setSelectedTs} />
        </div>

        <div className="grid-layout">
          <div className="schedule-wrapper">
            {/* Vi skickar det valda datumet till schemat */}
            <DailySchedule selectedDate={selectedTs} />
          </div>

          <div className="todo-wrapper">
            {/* Vi skickar det valda datumet till to-do listan */}
            <TodoWidget selectedDate={selectedTs} />
          </div>
        </div>

        <RoutineSection />
      </main>
    </div>
  );
}

export default App;