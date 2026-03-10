import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

/**
 * Standardinställningar för de olika typerna av pass (fokuslägen).
 * Varje läge har ett unikt ID, ett namn, en standardlängd och ett färgtema.
 */
const DEFAULT_FOCUS_MODES = [
  { id: 'deepWork', name: 'Deep Work', defaultDuration: 90, color: 'primary' },
  { id: 'meeting', name: 'Möte', defaultDuration: 60, color: 'accent' },
  { id: 'break', name: 'Paus', defaultDuration: 15, color: 'warning' },
];

// Skapar kontexten för att hålla koll på klockan och det aktiva läget
const FocusModeContext = createContext(undefined);

/**
 * En Provider som hanterar klockans logik och vilket fokusläge som är aktivt just nu.
 * Den ser till att timern tickar och att vi kommer ihåg våra inställningar även om vi laddar om sidan.
 * @component
 */
export const FocusModeProvider = ({ children }) => {
  // Läser in vilket läge vi använde senast från webbläsarens minne
  const [activeModeId, setActiveModeId] = useState(() => localStorage.getItem('flowtime-active-mode') || 'deepWork');

  // Håller koll på hur många sekunder som har gått i det nuvarande passet
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Styr om klockan tickar eller är pausad
  const [isRunning, setIsRunning] = useState(false);

  // Hämtar personliga inställningar för tidslängder om användaren har ändrat dem
  const [durationOverrides, setDurationOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('flowtime-duration-overrides');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  /**
   * Skapar en uppdaterad lista med alla lägen därvi väger in användarens egna tidsinställningar.
   */
  const allModes = useMemo(() => DEFAULT_FOCUS_MODES.map(m => ({
    ...m,
    defaultDuration: durationOverrides[m.id] || m.defaultDuration
  })), [durationOverrides]);

  /**
   * Hittar det fullständiga objektet för det läge som är valt just nu (t.ex. namn och färg).
   */
  const activeMode = useMemo(() => allModes.find(m => m.id === activeModeId) || allModes[0], [allModes, activeModeId]);

  /**
   * Själva klockmotorn. Om 'isRunning' är sant startar vi en timer som ökar 'secondsElaped' med 1 varje sekund.
   */
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    // Rensar timern när vi pausar eller lämnar komponenten för att unvika minnesläckor
    return () => clearInterval(interval);
  }, [isRunning]);

  /**
   * Byter fokusläge, nollställer klockan och sparar valet i webbläsaren.
   * @param {string} id - ID på det läge som ska aktiveras.
   */
  const handleSetActiveMode = (id) => {
    setActiveModeId(id);
    setSecondsElapsed(0);
    setIsRunning(false);
    localStorage.setItem('flowtime-active-mode', id);
  };

  /**
   * Samlar alla värden och funktioner som resten av appen behöver komma åt.
   * Använder useMemo så att komponenter inte laddas om i onödan om inget ändrats.
   */
  const value = useMemo(() => ({
    activeMode,
    setActiveMode: handleSetActiveMode,
    setActiveModeId,
    modes: allModes,
    secondsElapsed,
    setSecondsElapsed,
    isRunning,
    setIsRunning,
    /**
     * Uppdaterar och sparar en ny standarditd för ett specifikt läge.
     */
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

/**
 * En egen "hook" för att enkelt hämta fokus-datan i vilken komponent som helst.
 * @returns {Object} Allt som rör timern och dess lägen.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useFocusMode = () => {
    const context = useContext(FocusModeContext);
    if (!context) throw new Error('useFocusMode must be used within FocusModeProvider');
    return context;
};