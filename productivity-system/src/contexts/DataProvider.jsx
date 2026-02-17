import { useState, useEffect, useCallback } from "react";
import { DataContext } from "./DataContext";

const STORAGE_KEY = "boiler_app_data";

const defaultData = {
  settings: {
    theme: "light",
    secondsWork: 0,
    secondsBreak: 0,
    sessions: 0, 
  }
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

  // --- HJÄLPFUNKTIONER FÖR SCHEMAT ---

  const addScheduleItem = useCallback((dayKey, newItem) => {
    setData(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        schedule: [...(prev[dayKey]?.schedule || []), { ...newItem, id: Date.now(), tasks: [] }]
      }
    }));
  }, []);

  const deleteScheduleItem = useCallback((dayKey, itemId) => {
    setData(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        schedule: prev[dayKey].schedule.filter(item => item.id !== itemId)
      }
    }));
  }, []);

  const updateScheduleItem = useCallback((dayKey, itemId, updates) => {
    setData(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        schedule: prev[dayKey].schedule.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      }
    }));
  }, []);

  // Central funktion för att bocka av/på en sub-task
  const toggleScheduleTask = useCallback((dayKey, itemId, taskId) => {
    setData(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        schedule: prev[dayKey].schedule.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            tasks: item.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
          };
        })
      }
    }));
  }, []);

  const resetStats = useCallback(() => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, secondsWork: 0, secondsBreak: 0, sessions: 0 }
    }));
  }, []);

  return (
    <DataContext.Provider value={{ 
      data, setData, addScheduleItem, deleteScheduleItem, updateScheduleItem, toggleScheduleTask, resetStats 
    }}>
      {children}
    </DataContext.Provider>
  );
};