import { useState, useEffect } from "react";
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

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};
