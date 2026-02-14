import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import CalendarPage from './pages/CalendarPage';
import UserLogin from './components/UserLogin/userLogin';

// 1. IMPORTERA DIN HEADER HÄR
// (Kontrollera sökvägen så den stämmer med ditt filnamn!)
import Header from './components/Layout/Header';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: '20px' }}>Laddar...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // 2. LÄGG TILL HEADERN HÄR INUTI PRIVATEROUTE
  return (
    <div className="app-layout">
      <Header />
      <main className="content-area">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Inloggningssidan visas oftast UTAN header */}
      <Route path="/login" element={<UserLogin />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <CalendarPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;