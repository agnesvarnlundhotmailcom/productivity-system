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
  // Exempeldata för att du ska se att schemat fungerar direkt
  "2026-02-23": {
    schedule: [
      { 
        id: "1", 
        title: "Fokuspass: Programmering", 
        startTime: "09:00", 
        category: "Arbete", 
        completed: false,
        tasks: [
          { id: "t1", text: "Fixa DataProvider", completed: true },
          { id: "t2", text: "Uppdatera Timer-design", completed: false }
        ] 
      }
    ]
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateFocusSettings = useCallback((newSettings) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, focusSettings: { ...prev.settings.focusSettings, ...newSettings } }
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
      data, setData, updateScheduleItem, toggleScheduleTask, resetStats, updateFocusSettings 
    }}>
      {children}
    </DataContext.Provider>
  );
};