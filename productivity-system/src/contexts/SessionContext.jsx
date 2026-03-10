import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Skapar kontexten som ska innehålla historiken över alla genomförda pass
const SessionContext = createContext(undefined);

/**
 * En Provider som hanterar historiken av sparade sessioner (arbetspass och pauser).
 * @component
 */
export const SessionProvider = ({ children }) => {
  // Laddar in tidigare sparade sessioner från webbläsarens minne när appen startar
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('flowtime-sessions');
    // Om det finns sparad historik, gör om den från text till en lista, annars starta med en tom lista.
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * Varje gång en ny session läggs till eller tas bort, uppdaterar vi webbläsarens minne.
   * Detta gör att statistiken finns kvar även om man stänger ner fliken eller startar om datorn.
   */
  useEffect(() => {
    localStorage.setItem('flowtime-sessions', JSON.stringify(sessions));
  }, [sessions]);

  /**
   * Sparar ett nytt genomfört pass i listan.
   * Vi lägger automatiskt till ett unikt ID och en tidsstämpel för att kunna identifiera passet senare.
   * @param {Object} session - Objektet som innehåller informtion om passet
   */
  const addSession = useCallback((session) => {
    const newSession = {
      ...session,
      id: Date.now(), // Skapar ett unikt ID för att kunna radera senare
    };
    setSessions(prev => [...prev, newSession]);
  }, []);

  /**
   * Tar bort en specifik session från historiken.
   * Används om användaren vill rensa i sin statistik.
   * @param {number|string} id - Det unika ID:t för sessionen som ska raderas.
   */
  const removeSession = useCallback((id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, addSession, removeSession }}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * En egen hook för att enkelt komma åt sessions-historiken och funktioner för att spara/radera.
 * @returns {Object} Innehåller listan 'sessions' samt funktionerna 'addSession' och 'removeSession'.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
};