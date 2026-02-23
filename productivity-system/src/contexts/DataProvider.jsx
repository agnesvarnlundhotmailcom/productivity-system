import React, { useState, useEffect, useCallback } from "react";
import { DataContext } from "./DataContext";

const STORAGE_KEY = "boiler_app_data";

const defaultData = {
  settings: {
    theme: "light",
    secondsWork: 0,
    secondsBreak: 0,
    sessions: 0,
    activeTaskDuration: 0,
    isRunning: false,
    focusSettings: {
      deepWork: 90,
      meeting: 60,
      pause: 15
    }
  },
  energyLogs: []
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultData;
    } catch { 
      return defaultData; 
    }
  });

  // Spara automatiskt till localStorage när 'data' ändras
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

 
  const updateFocusSettings = useCallback((newSettings) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        focusSettings: { 
          ...prev.settings.focusSettings, 
          ...newSettings 
        }
      }
    }));
  }, []);

  const addEnergyLog = useCallback((level) => {
    const newEntry = {
      level,
      timestamp: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      energyLogs: [...(prev.energyLogs || []).slice(-14), newEntry]
    }));
  }, []);

  // Uppdaterar ett helt schemablock (t.ex. ändrar titel, färg eller markerar som klart)
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

  // NY: Togglar specifika 'Att göra'-punkter inuti ett schemablock
  const toggleScheduleTask = useCallback((dayKey, itemId, taskId) => {
    setData(prev => {
      const dayData = prev[dayKey] || {};
      const schedule = dayData.schedule || [];

      const updatedSchedule = schedule.map(item => {
        if (item.id === itemId) {
          const updatedTasks = (item.tasks || []).map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );
          return { ...item, tasks: updatedTasks };
        }
        return item;
      });

      return {
        ...prev,
        [dayKey]: {
          ...dayData,
          schedule: updatedSchedule
        }
      };
    });
  }, []);

  // Nollställer statistik (för t.ex. en ny dag)
  const resetStats = useCallback(() => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        secondsWork: 0,
        secondsBreak: 0,
        sessions: 0,
        activeTaskDuration: 0
      }
    }));
  }, []);

  return (
    <DataContext.Provider value={{
      data,
      setData,
      addEnergyLog,
      updateScheduleItem,
      resetStats,
      updateFocusSettings 
    }}>
      {children}
    </DataContext.Provider>
  );
};