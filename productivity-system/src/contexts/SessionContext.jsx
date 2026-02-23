import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SessionContext = createContext(undefined);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('flowtime-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('flowtime-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback((session) => {
    const newSession = {
      ...session,
      id: Date.now(), // Skapar ett unikt ID för att kunna radera senare
    };
    setSessions(prev => [...prev, newSession]);
  }, []);

  const removeSession = useCallback((id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, addSession, removeSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
};