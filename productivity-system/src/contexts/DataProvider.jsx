import React, { useState, useEffect, useCallback } from "react";
import { DataContext } from "./DataContext";

const STORAGE_KEY = "boiler_app_data";

// defaultData deklareras HÖGST UPP så att den är tillgänglig för useState nedan
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
  // Exempel på hur strukturen ser ut för att undvika undefined-fel
  energyLogs: []
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Om det finns sparat data används det, annars defaultData
      return saved ? JSON.parse(saved) : defaultData;
    } catch (error) {
      console.error("Kunde inte ladda data från localStorage", error);
      return defaultData; 
    }
  });

  // Sparar automatiskt till localStorage varje gång 'data' ändras
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Funktion för att radera en kalenderhändelse
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

  const updateFocusSettings = useCallback((newSettings) => {
    setData(prev => ({
      ...prev,
      settings: { 
        ...prev.settings, 
        focusSettings: { ...prev.settings.focusSettings, ...newSettings } 
      }
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
      data, 
      setData, 
      updateScheduleItem, 
      toggleScheduleTask, 
      resetStats, 
      updateFocusSettings,
      deleteScheduleItem // Exporterad för användning i dina komponenter
    }}>
      {children}
    </DataContext.Provider>
  );
};