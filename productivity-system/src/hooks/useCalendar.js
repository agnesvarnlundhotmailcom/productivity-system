import { useState } from "react";

/**
 * Veckodag-namn på svenska.
 * @type {string[]}
 */
const DOW_SV = ["mån", "tis", "ons", "tors", "fre", "lör", "sön"];

/**
 * Beräknar indexet för veckodag där måndag = 0.
 * 
 * @param {Date} date - Datumet att beräkna index för
 * @returns {number} Index 0-6 där 0 = måndag, 6 = söndag
 */
const mondayIndex = (date) => (date.getDay() + 6) % 7;

/**
 * Kontrollerar om två datum är samma dag.
 * 
 * @param {Date} a - Första datumet
 * @param {Date} b - Andra datumet
 * @returns {boolean} True om datumen är samma dag (ignorerar tid)
 */
export const sameDay = (a, b) => 
  a.getFullYear() === b.getFullYear() && 
  a.getMonth() === b.getMonth() && 
  a.getDate() === b.getDate();

/**
 * Custom hook för kalender-logik.
 * 
 * Hanterar navigering mellan veckor/månader och beräknar
 * vilka dagar som ska visas i kalendern.
 * 
 * @param {number} selectedTs - Timestamp för valt datum (millisekunder)
 * @returns {Object} Kalender-data och funktioner
 * @returns {string} returns.view - Nuvarande vy ("week" eller "month")
 * @returns {Function} returns.setView - Funktion för att ändra vy
 * @returns {Date} returns.currentDate - Aktuellt visat datum
 * @returns {Date} returns.selectedDate - Det valda datumet
 * @returns {Array<Object>} returns.weekDays - Veckonas dagar
 * @returns {number} returns.weekDays[].date - Datumet
 * @returns {string} returns.weekDays[].dow - Veckodags-namn (tex "mån")
 * @returns {number} returns.weekDays[].dom - Dag i månaden
 * @returns {Array<Date>} returns.monthCells - Alla 42 celler i månads-vyn (6 veckor × 7 dagar)
 * @returns {Function} returns.navigate - Navigerings-funktion för att gå till nästa/föregående vecka/månad
 * @returns {Array<string>} returns.DOW_SV - Veckodags-namn på svenska
 * 
 * @example
 * const { view, setView, weekDays, navigate } = useCalendar(Date.now());
 */
export function useCalendar(selectedTs) {
  // States för att hålla koll på vyn
  const [currentTs, setCurrentTs] = useState(new Date());
  const [view, setView] = useState("week");

  const currentDate = new Date(currentTs);
  const selectedDate = new Date(selectedTs);

  // Beräknar veckans dagar (mån-sön)
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

  // Beräknar alla 42 celler för månads-vy (6 veckor)
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

  /**
   * Navigerar till nästa/föregående vecka eller månad.
   * 
   * @param {string} direction - "next" eller "prev"
   */
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