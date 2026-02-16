// src/hooks/useCalendar.js
import { useMemo, useState } from "react";

const DOW_SV = ["mån", "tis", "ons", "tors", "fre", "lör", "sön"];
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Hjälpfunktioner som inte behöver ligga i komponenten
export const sameDay = (a, b) => 
  a.getFullYear() === b.getFullYear() && 
  a.getMonth() === b.getMonth() && 
  a.getDate() === b.getDate();

const mondayIndex = (date) => (date.getDay() + 6) % 7;

export function useCalendar(selectedTs) {
  const [currentTs, setCurrentTs] = useState(() => Date.now());
  const [view, setView] = useState("week");

  const currentDate = useMemo(() => new Date(currentTs), [currentTs]);
  const selectedDate = useMemo(() => new Date(selectedTs), [selectedTs]);

  // Logik för veckovyn
  const weekDays = useMemo(() => {
    const base = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startOffset = mondayIndex(base);
    const monday = new Date(base);
    monday.setDate(base.getDate() - startOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { date: d, dow: DOW_SV[i], dom: d.getDate() };
    });
  }, [currentDate]);

  // Logik för månadsvyn
  const monthCells = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const first = new Date(y, m, 1);
    const offset = mondayIndex(first);
    const start = new Date(y, m, 1 - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  // Funktion för att bläddra
  const navigate = (direction) => {
    if (view === "week") {
      setCurrentTs(ts => ts + (direction === "next" ? WEEK_MS : -WEEK_MS));
    } else {
      setCurrentTs(ts => {
        const d = new Date(ts);
        d.setMonth(d.getMonth() + (direction === "next" ? 1 : -1));
        return d.getTime();
      });
    }
  };

  return {
    view,
    setView,
    currentDate,
    selectedDate,
    weekDays,
    monthCells,
    navigate,
    DOW_SV
  };
}