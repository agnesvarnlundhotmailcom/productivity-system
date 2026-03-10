import React, { useState, useEffect, useCallback } from "react";
import { DataContext } from "./DataContext";

// Nyckeln som används för att spara och hitta vår data i webbläsarens minne
const STORAGE_KEY = "boiler_app_data";

// Standardvärden som används om det är första gången appen startas
const defaultData = {
  settings: {
    theme: "light",
    secondsWork: 0,
    secondsBreak: 0,
    sessions: 0
  },
  energyLogs: [] 
};

/**
 * Provider-komponent som omsluter hela appen.
 * Den sköter allt som har med lagring och uppdatering av användarens data att göra.
 * @component
 */
export const DataProvider = ({ children }) => {
  // Initierar state genom att försöka läsa från localStorage
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Om det finns sparad data, omvandla den från text till objekt, annars använd standardvärden
      return saved ? JSON.parse(saved) : defaultData;
    } catch (error) {
      console.error("Kunde inte ladda data från localStorage", error);
      return defaultData; 
    }
  });

  /**
   * En "Side Effekt" som ser till att varje gång 'data' ändras i appen, sparas den senaste versionen ner till webbläsarens minne (localStorage).
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  /**
   * Sparar en ny mätning av energinivå med nuvarande tidpunkt.
   * @param {number} level - Energinivån.
   */
  const addEnergyLog = useCallback((level) => {
    setData(prev => ({
      ...prev,
      energyLogs: [
        ...(prev.energyLogs || []),
        { 
          id: Date.now(), 
          level: level, 
          timestamp: new Date().toISOString() 
        }
      ]
    }));
  }, []);

  /**
   * Tar bort ett specifikt pass eller händelse från schemat för en viss dag.
   * @param {string} dataKey - Datumet det gäller.
   * @param {number|string} itemId - Unikt ID för saken som ska bort.
   */
  const deleteScheduleItem = useCallback((dayKey, itemId) => {
    setData(prev => {
      const dayData = prev[dayKey];
      if (!dayData || !dayData.schedule) return prev;

      return {
        ...prev,
        [dayKey]: {
          ...dayData,
          schedule: dayData.schedule.filter(item => item.id !== itemId)
        }
      };
    });
  }, []);

  /**
   * Uppdaterar information i ett befintligt schema-objekt.
   */
  const updateScheduleItem = useCallback((dayKey, itemId, updates) => {
    setData(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        schedule: (prev[dayKey]?.schedule || []).map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        )
      }
    }));
  }, []);

  /**
   * Växlar status (klar/inte klar) på en specifik under-uppgift i schemat.
   */
  const toggleScheduleTask = useCallback((dayKey, itemId, taskId) => {
    setData(prev => {
      const dayData = prev[dayKey] || { schedule: [] };
      const updatedSchedule = dayData.schedule.map(item => {
        if (item.id === itemId) {
          const updatedTasks = (item.tasks || []).map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );
          return { ...item, tasks: updatedTasks };
        }
        return item;
      });
      return { ...prev, [dayKey]: { ...dayData, schedule: updatedSchedule } };
    });
  }, []);

  /**
   * Nollställer statistik över arbetstid och sessioner 
   */
  const resetStats = useCallback(() => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, secondsWork: 0, secondsBreak: 0, sessions: 0 }
    }));
  }, []);

  return (
    <DataContext.Provider value={{
      data, 
      setData, 
      addEnergyLog, 
      updateScheduleItem, 
      toggleScheduleTask, 
      resetStats, 
      deleteScheduleItem
    }}>
      {children}
    </DataContext.Provider>
  );
};