import { useState } from "react";

// Hjälpfunktioner som behövs för att räkna ut dagar
const DOW_SV = ["mån", "tis", "ons", "tors", "fre", "lör", "sön"];
const mondayIndex = (date) => (date.getDay() + 6) % 7;

export const sameDay = (a, b) => 
  a.getFullYear() === b.getFullYear() && 
  a.getMonth() === b.getMonth() && 
  a.getDate() === b.getDate();

export function useCalendar(selectedTs) {
  // States för att hålla koll på vyn
  const [currentTs, setCurrentTs] = useState(Date.now());
  const [view, setView] = useState("week");

  const currentDate = new Date(currentTs);
  const selectedDate = new Date(selectedTs);


  const base = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const startOffset = mondayIndex(base);
  const monday = new Date(base);
  monday.setDate(base.getDate() - startOffset);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDays.push({ 
      date: d, 
      dow: DOW_SV[i], 
      dom: d.getDate() 
    });
  }

  const monthCells = [];
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();
  const first = new Date(y, m, 1);
  const offset = mondayIndex(first);
  const start = new Date(y, m, 1 - offset);

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    monthCells.push(d);
  }

 
  const navigate = (direction) => {
    const d = new Date(currentTs);
    if (view === "week") {
      
      d.setDate(d.getDate() + (direction === "next" ? 7 : -7));
    } else {
      
      d.setMonth(d.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentTs(d.getTime());
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