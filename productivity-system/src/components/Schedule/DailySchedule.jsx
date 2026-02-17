import { useState, useContext } from 'react';
import ScheduleItem from './ScheduleItem';
import styles from './Schedule.module.css';
import { Clock } from 'lucide-react'; 
import { DataContext } from "../../contexts/DataContext";

export default function DailySchedule({ selectedDate }) {
  const { data, setData } = useContext(DataContext);
  const dateKey = new Date(selectedDate).toLocaleDateString('sv-SE');
  const activities = data[dateKey]?.schedule ?? [];

  const [isAdding, setIsAdding] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState(""); 
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Arbete");

  const displayDate = new Date(selectedDate).toLocaleDateString('sv-SE', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  // Uppdaterad med dina exakta färgvariabler
  const getColorForCategory = (cat) => {
    switch(cat) {
      case 'Arbete': return '#0ed3ac';    // --accent-primary
      case 'Rast': return '#f49e0c';      // --accent-warning (Du kallade den Paus i din kod, ändrat till Rast/Paus för att matcha)
      case 'Möte': return '#39bef8';      // --accent-blue
      case 'Personligt': return '#c083fc'; // --accent-purple
      default: return '#fb7185';          // --accent-danger
    }
  };

  const updateGlobalData = (newList) => {
    setData(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], schedule: newList }
    }));
  };

  const handleAdd = () => {
    if (!startTime || !endTime || !newTitle) return; 
    const newItem = {
      id: Date.now(),
      startTime,
      endTime, 
      title: newTitle,
      category: newCategory,
      color: getColorForCategory(newCategory),
      tasks: [] 
    };
    const updatedList = [...activities, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime));
    updateGlobalData(updatedList);
    setIsAdding(false);
    setStartTime("");
    setEndTime("");
    setNewTitle("");
  };

  const handleDelete = (id) => {
    updateGlobalData(activities.filter(item => item.id !== id));
  };

  const handleUpdate = (id, updatedData) => {
    const updatedList = activities.map(item =>
      item.id === id ? { ...item, ...updatedData } : item
    ).sort((a, b) => (a.startTime || a.time).localeCompare(b.startTime || b.time));
    updateGlobalData(updatedList);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Clock size={20} color="#0ed3ac" style={{ marginRight: '8px' }} />
          Schema - {displayDate}
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className={styles.addButton}>
          {isAdding ? '−' : '+'}
        </button>
      </div>

      {isAdding && (
        <div className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.timeInputGroup}>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={styles.input} title="Starttid" />
              <span>till</span>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.input} title="Sluttid" />
            </div>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={styles.select}>
              <option value="Arbete">Arbete</option>
              <option value="Rast">Rast</option>
              <option value="Möte">Möte</option>
              <option value="Personligt">Personligt</option>
            </select>
          </div>
          <input type="text" placeholder="Aktivitet..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className={styles.input} />
          <button onClick={handleAdd} className={styles.saveBtn}>Skapa block</button>
        </div>
      )}

      <div className={styles.list}>
        {activities.map((item) => (
          <ScheduleItem 
            key={item.id} 
            item={item} 
            onDelete={handleDelete} 
            onUpdate={handleUpdate}
            dateKey={dateKey}
          />
        ))}
      </div>
    </div>
  );
}