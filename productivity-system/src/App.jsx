import Header from './components/Layout/Header';

function App() {
  return (
    <div>
      <Header />
      
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Välkommen till din fokus-app</h2>
        <p>Här ska vi bygga kalender...</p>
      </main>
    </div>
  );
}

export default App;