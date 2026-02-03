import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import "./ThemeToggle.css";

export function ThemeToggle() {
  const { toggleTheme, theme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Växla tema"
    >
      <span className="theme-toggle__thumb">
        {theme === "dark" ? (
          <Moon size={14} />
        ) : (
          <Sun size={14} />
        )}
      </span>
    </button>
  );
}
