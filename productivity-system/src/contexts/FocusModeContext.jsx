import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DEFAULT_FOCUS_MODES = [
  { id: 'deepWork', name: 'Deep Work', defaultDuration: 90, color: 'primary' },
  { id: 'meeting', name: 'Möte', defaultDuration: 60, color: 'accent' },
  { id: 'break', name: 'Paus', defaultDuration: 15, color: 'warning' },
];

const FocusModeContext = createContext(undefined);

export const FocusModeProvider = ({ children }) => {
  const [activeModeId, setActiveModeId] = useState(() => localStorage.getItem('flowtime-active-mode') || 'deepWork');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [durationOverrides, setDurationOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('flowtime-duration-overrides');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const allModes = useMemo(() => DEFAULT_FOCUS_MODES.map(m => ({
    ...m,
    defaultDuration: durationOverrides[m.id] || m.defaultDuration
  })), [durationOverrides]);

  const activeMode = useMemo(() => allModes.find(m => m.id === activeModeId) || allModes[0], [allModes, activeModeId]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSetActiveMode = (id) => {
    setActiveModeId(id);
    setSecondsElapsed(0);
    setIsRunning(false);
    localStorage.setItem('flowtime-active-mode', id);
  };

  const value = useMemo(() => ({
    activeMode,
    setActiveMode: handleSetActiveMode,
    modes: allModes,
    secondsElapsed,
    setSecondsElapsed,
    isRunning,
    setIsRunning,
    updateModeDuration: (id, duration) => {
      setDurationOverrides(prev => {
        const next = { ...prev, [id]: duration };
        localStorage.setItem('flowtime-duration-overrides', JSON.stringify(next));
        return next;
      });
    },
  }), [activeMode, allModes, secondsElapsed, isRunning]);

  return <FocusModeContext.Provider value={value}>{children}</FocusModeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFocusMode = () => {
    const context = useContext(FocusModeContext);
    if (!context) throw new Error('useFocusMode must be used within FocusModeProvider');
    return context;
};