import React, { useState, useEffect, useCallback } from "react";
import { DataContext } from "./DataContext";

const STORAGE_KEY = "boiler_app_data";

const defaultData = {
  settings: {
    theme: "light",
    secondsWork: 0,
    secondsBreak: 0,
    sessions: 0
  },
  energyLogs: [] 
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultData;
    } catch (error) {
      console.error("Kunde inte ladda data från localStorage", error);
      return defaultData; 
    }
  });

  // Sparar automatiskt till localStorage vid varje ändring
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  
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

  // Funktioner för schemaläggning
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