import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import "./ThemeToggle.css";

/**
 * En knapp som växlar mellan ljust och mörkt tema i appen.
 * Använder ThemeContext för att läsa och uppdatera det globala temat.
 * @component
 */
export function ThemeToggle() {
  // Hämtar funktionen för att byta tema och det nuvarande temat (light/dark)
  const { toggleTheme, theme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Växla tema"
    >
      <span className="theme-toggle__thumb">
        {/* Visar måne om det är mörkt tema, annars en sol */}
        {theme === "dark" ? (
          <Moon size={14} />
        ) : (
          <Sun size={14} />
        )}
      </span>
    </button>
  );
}
