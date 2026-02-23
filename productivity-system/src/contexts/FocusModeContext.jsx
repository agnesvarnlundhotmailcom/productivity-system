import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DEFAULT_FOCUS_MODES = [
  { id: 'deepWork', name: 'Deep Work', defaultDuration: 90, color: 'primary' },
  { id: 'meeting', name: 'Möte', defaultDuration: 60, color: 'accent' },
  { id: 'break', name: 'Paus', defaultDuration: 15, color: 'warning' },
];

const FocusModeContext = createContext(undefined);

export const FocusModeProvider = ({ children }) => {
  const [activeModeId, setActiveModeId] = useState(() => 
    localStorage.getItem('flowtime-active-mode') || 'deepWork'
  );

  const [durationOverrides, setDurationOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('flowtime-duration-overrides');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Använd useMemo för att räkna ut allModes. 
  const allModes = useMemo(() => DEFAULT_FOCUS_MODES.map(m => ({
    ...m,
    defaultDuration: durationOverrides[m.id] || m.defaultDuration
  })), [durationOverrides]);

  const activeMode = useMemo(() => 
    allModes.find(m => m.id === activeModeId) || allModes[0]
  , [allModes, activeModeId]);

  useEffect(() => {
    localStorage.setItem('flowtime-active-mode', activeModeId);
  }, [activeModeId]);

  // Vi skapar värdet med useMemo för att garantera stabila typer
  const value = useMemo(() => ({
    activeMode,
    setActiveMode: (id) => setActiveModeId(id),
    modes: allModes,
    updateModeDuration: (id, duration) => {
      setDurationOverrides(prev => {
        const next = { ...prev, [id]: duration };
        localStorage.setItem('flowtime-duration-overrides', JSON.stringify(next));
        return next;
      });
    },
  }), [activeMode, allModes]);

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFocusMode = () => {
    const context = useContext(FocusModeContext);
    if (!context) {
        throw new Error('useFocusMode must be used within FocusModeProvider');
    }
    return context;
};