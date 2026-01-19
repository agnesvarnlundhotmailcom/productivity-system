import './index.css';

// Vi skapar enkla "platshållare" för att se att layouten funkar först
const ColumnLeft = () => (
  <div className="column">
    <div className="card" style={{ height: '200px' }}>Kalender</div>
    <div className="card" style={{ height: '300px' }}>Schema</div>
  </div>
);

const ColumnMiddle = () => (
  <div className="column">
    <div className="card" style={{ height: '400px' }}>
      <h1>00:00</h1>
      <button className="btn-primary">Starta arbete</button>
    </div>
    <div className="card">Statistik</div>
  </div>
);

const ColumnRight = () => (
  <div className="column">
    <div className="card">Städrutiner</div>
    <div className="card">Hälsorutiner</div>
  </div>
);

function App() {
  return (
    <div className="dashboard-container">
      {/* Header / Top bar */}
      <header style={{ padding: '20px', marginBottom: '20px' }}>
        <h2>FlowTime</h2>
        <p style={{ color: 'var(--text-muted)' }}>God eftermiddag! Redo att optimera?</p>
      </header>

      {/* Main Grid Layout */}
      <main className="main-grid">
        <ColumnLeft />
        <ColumnMiddle />
        <ColumnRight />
      </main>
    </div>
  );
}

export default App;