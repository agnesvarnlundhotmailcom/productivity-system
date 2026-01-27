import Header from './components/Layout/Header';
import RoutineSection from './components/RoutineSection/RoutineSection';
import TodoWidget from './components/ToDo/TodoWidget';
import DailySchedule from './components/Schedule/DailySchedule';
import './App.css'; 

function App() {
  return (
    <div>
      <Header />
      
      <main className="dashboard-container">
        <h2>Välkommen till din fokus-app</h2>
        <p style={{marginBottom: '2rem'}}>Här är dina dagliga mål och rutiner.</p>
        
        {/* Här laddar vi in din nya komponent */}

        <div>
          <DailySchedule/>
          <TodoWidget/>
        </div>

        <RoutineSection />

      </main>
    </div>
  );
}

export default App;