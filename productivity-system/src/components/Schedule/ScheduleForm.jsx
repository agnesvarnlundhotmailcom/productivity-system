import React, { useState } from 'react';
import styles from './Schedule.module.css';

/**
 * Ett formulär för att skapa nya tidsblock i schemat.
 * Håll koll på tider, titel och kategori medan användaren skriver.
 * @component
 * @param {Object} props
 * @param {Function} props.onSave - Funktionen som körs när man klickar på "Skapa block".
 */
export default function ScheduleForm({ onSave }) {
  // Lokala states för att spara det som skrivs i formulärfälten
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Arbete");

  /**
   * Kontrollerar att allt är ifyllt och skickar sedan datan vidare.
   * Nollställer även alla fält efter att man sparat.
   */
  const handleSubmit = () => {
    // Avbryt om användaren glömt fylla i tid eller titel
    if (!startTime || !endTime || !newTitle) return;

    //Paketerar ihop datan och skickar den till onSave-funktionen
    onSave({
      startTime,
      endTime,
      title: newTitle,
      category: newCategory
    });

    // Rensa alla fält så att formuläret är redo för nästa inmatning
    setStartTime("");
    setEndTime("");
    setNewTitle("");
  };

  return (
    <div className={styles.form}>
      <div className={styles.formRow}>
        {/* Grupp för tidsval: Från och till */}
        <div className={styles.timeInputGroup}>
            <input 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            className={styles.input} 
            />
            <span>till</span>
            <input 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            className={styles.input} 
            />
        </div>

        {/* Droplist för att välja kategori */}
        <select 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)} 
          className={styles.select}
          >

          <option value="Arbete">Arbete</option>
          <option value="Paus">Paus</option>
          <option value="Möte">Möte</option>
          <option value="Personligt">Personligt</option>
        </select>
      </div>

      {/* Textfält för namnet på aktiviteten */}
      <input 
        type="text" 
        placeholder="Aktivitet..." 
        value={newTitle} 
        onChange={(e) => setNewTitle(e.target.value)} 
        className={styles.input} 
      />

      {/* Knapp som triggar handleSubmit-funktionen */}
      <button onClick={handleSubmit} className={styles.saveBtn}>Skapa block</button>
    </div>
  );
}