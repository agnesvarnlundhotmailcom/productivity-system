import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SessionContext = createContext(undefined);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('flowtime-sessions');
      if (saved) {
        return JSON.parse(saved).map(s => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime)
        }));
      }
    } catch (e) { console.error('Laddningsfel:', e); }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('flowtime-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback((sessionData) => {
    const newSession = {
      ...sessionData,
      id: crypto.randomUUID(),
    };
    setSessions(prev => [...prev, newSession]);
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, addSession }}>
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