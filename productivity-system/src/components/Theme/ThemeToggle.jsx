import { useTheme } from "../../contexts/ThemeContext";
import './ThemeToggle.css';

export function ThemeToggle() {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      <div className="theme-toggle__thumb">
        {theme === "dark" ? "☀️" : "🌙"}
      </div>
    </div>
  );
}

