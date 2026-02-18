import { useState, useEffect, useCallback } from "react";
import { DataContext } from "./DataContext";

const STORAGE_KEY = "boiler_app_data";

const defaultData = {
  settings: {
    theme: "light",
    secondsWork: 0,
    secondsBreak: 0,
    sessions: 0,
    activeTaskDuration: 0, // Tillagd för att matcha useTimer
    isRunning: false
  },
  energyLogs: []
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultData;
    } catch { return defaultData; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

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
      resetStats
    }}>
      {children}
    </DataContext.Provider>
  );
};