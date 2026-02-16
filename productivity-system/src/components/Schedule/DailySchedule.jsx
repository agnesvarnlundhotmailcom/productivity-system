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
  const [endTime, setEndTime] = useState(""); // NYTT: Stopptid
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Arbete");

  const displayDate = new Date(selectedDate).toLocaleDateString('sv-SE', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  const getColorForCategory = (cat) => {
    switch(cat) {
      case 'Arbete': return '#39bef8';
      case 'Paus': return '#f49e0c';
      case 'Möte': return '#c093fc';
      default: return '#fb7185';
    }
  };

  const updateGlobalData = (newList) => {
    setData(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], schedule: newList }
    }));
  };

  const handleAdd = () => {
    if (!startTime || !endTime || !newTitle) return; // Kräver båda tiderna
    const newItem = {
      id: Date.now(),
      startTime,
      endTime, // Sparar stopptid
      title: newTitle,
      category: newCategory,
      color: getColorForCategory(newCategory),
      tasks: [] // Varje aktivitet får en egen lista med tasks!
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
              <option value="Paus">Paus</option>
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
            dateKey={dateKey} // Skickas med för att kunna uppdatera tasks inuti
          />
        ))}
      </div>
    </div>
  );
}
