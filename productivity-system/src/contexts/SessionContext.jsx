import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SessionContext = createContext(undefined);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('flowtime-sessions');
      if (saved) {
        // Vi mappar om strängar till Date-objekt för att kunna använda datum-metoder senare
        return JSON.parse(saved).map(s => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime)
        }));
      }
    } catch (e) { 
      console.error('Laddningsfel:', e); 
    }
    return [];
  });

  // Uppdatera localStorage varje gång sessions-listan ändras
  useEffect(() => {
    localStorage.setItem('flowtime-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback((sessionData) => {
    const newSession = {
      ...sessionData,
      id: crypto.randomUUID(), // Skapar ett unikt ID för radering
      startTime: sessionData.startTime || new Date(),
      endTime: sessionData.endTime || new Date(),
    };
    setSessions(prev => [...prev, newSession]);
  }, []);

  // Vi skickar med setSessions så att vi kan radera direkt från logg-sidan
  return (
    <SessionContext.Provider value={{ sessions, addSession, setSessions }}>
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