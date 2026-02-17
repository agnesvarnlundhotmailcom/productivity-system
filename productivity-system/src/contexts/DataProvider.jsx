import { useState, useEffect, useCallback } from "react";
import { DataContext } from "./DataContext";

const STORAGE_KEY = "boiler_app_data";

const defaultData = {
  tasks: [],
  routines: [],
  schedule: [],
  settings: {
    theme: "light",
    deepWork: false,
    secondsWork: 0,
    secondsBreak: 0,
    sessions: 0, 
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

  // Sparar till localStorage automatiskt när data ändras
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // HJÄLPFUNKTION: För att bocka av uppgifter inuti schemat (Centraliserad)
  const toggleScheduleTask = useCallback((dayKey, taskId) => {
    setData(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        schedule: prev[dayKey].schedule.map(item => ({
          ...item,
          tasks: item.tasks?.map(t => 
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ) || []
        }))
      }
    }));
  }, []);

  // HJÄLPFUNKTION: För att nollställa dagens siffror
  const resetStats = useCallback(() => {
    setData(prev => ({
      ...prev,
      settings: { 
        ...prev.settings, 
        secondsWork: 0, 
        secondsBreak: 0, 
        sessions: 0 
      }
    }));
  }, []);

  return (
    <DataContext.Provider value={{ 
      data, 
      setData, 
      toggleScheduleTask, 
      resetStats 
    }}>
      {children}
    </DataContext.Provider>
  );
};