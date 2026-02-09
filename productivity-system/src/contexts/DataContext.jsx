import { createContext, useState, useEffect } from 'react';

// Denna används av useContext i dina komponenter
export const DataContext = createContext(); 

export const DataProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('boiler_tasks');
    // Om det finns sparat -> parsa JSON. Om inte -> tom lista [].
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('boiler_tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <DataContext.Provider value={{ tasks, setTasks }}>
      {children}
    </DataContext.Provider>
  );
};