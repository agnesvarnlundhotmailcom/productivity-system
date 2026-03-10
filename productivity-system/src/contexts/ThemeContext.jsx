/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";

// Skapar kontexten för appens färgtema (ljus eller mörk)
const ThemeContext = createContext(null);

/**
 * En Provider som hanterar appens visuella tema.
 * Den ser till att rätt färger används och att valet sparas i webbläsaren.
 * @component
 */
export function ThemeProvider({ children }) {
  // Initierar temat genom att kolla om användaren valt något tidigare, annars används 'dark' som standard
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  /**
   * Varje gång temat ändras uppdaterar vi både webbläsarens minne (localStorage) och ett attribut på hela dokumentet (data-theme).
   * Detta gör att våra CSS-variabler automatiskt byter färger i hela appen. 
   */
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /**
   * En hjälpfunktion för att enkelt växla mellan ljust och mörkt läge.
   */
  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  /**
   * Paketerar ihop temadata och funktioner.
   * useMemo gör att vi inte skickar ut ny data i onödan och temat är detsamma.
   */
  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * En hook för att enkelt kunna läsa av eller ändra temat i vilken komponent som helst.
 * @returns {Object} Innehåller det nuvarande temat (theme) och funktionen toggleTheme.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme måste användas inom ThemeProvider");
  }
  return context;
}
