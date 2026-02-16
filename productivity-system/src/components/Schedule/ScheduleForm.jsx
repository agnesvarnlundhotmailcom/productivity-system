// src/components/Schedule/ScheduleForm.jsx
import React, { useState } from 'react';
import styles from './Schedule.module.css';

export default function ScheduleForm({ onSave }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Arbete");

  const handleSubmit = () => {
    if (!startTime || !endTime || !newTitle) return;
    onSave({
      startTime,
      endTime,
      title: newTitle,
      category: newCategory
    });
    // Rensa fälten
    setStartTime("");
    setEndTime("");
    setNewTitle("");
  };

  return (
    <div className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.timeInputGroup}>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={styles.input} />
          <span>till</span>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.input} />
        </div>
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={styles.select}>
          <option value="Arbete">Arbete</option>
          <option value="Paus">Paus</option>
          <option value="Möte">Möte</option>
          <option value="Personligt">Personligt</option>
        </select>
      </div>
      <input 
        type="text" 
        placeholder="Aktivitet..." 
        value={newTitle} 
        onChange={(e) => setNewTitle(e.target.value)} 
        className={styles.input} 
      />
      <button onClick={handleSubmit} className={styles.saveBtn}>Skapa block</button>
    </div>
  );
}