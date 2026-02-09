import { useState, useContext } from 'react';
import ScheduleItem from './ScheduleItem';
import styles from './Schedule.module.css';
import { Clock } from 'lucide-react'; 
import { DataContext } from "../../contexts/DataContext";

export default function DailySchedule({ selectedDate }) {
  const { data, setData } = useContext(DataContext);
  
  // Skapar en unik nyckel för varje datum: YYYY-MM-DD
  const dateKey = new Date(selectedDate).toLocaleDateString('sv-SE');
  
  // Hämtar data för just detta datum, annars tom lista
  const activities = data[dateKey]?.schedule ?? [];

  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState("");
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
      [dateKey]: {
        ...prev[dateKey],
        schedule: newList
      }
    }));
  };

  const handleAdd = () => {
    if (!newTime || !newTitle) return;
    const newItem = {
      id: Date.now(),
      time: newTime,
      title: newTitle,
      category: newCategory,
      color: getColorForCategory(newCategory)
    };
    const updatedList = [...activities, newItem].sort((a, b) => a.time.localeCompare(b.time));
    updateGlobalData(updatedList);
    setIsAdding(false);
    setNewTime("");
    setNewTitle("");
  };

  const handleDelete = (id) => {
    const updatedList = activities.filter(item => item.id !== id);
    updateGlobalData(updatedList);
  };

  const handleUpdate = (id, updatedData) => {
    const updatedList = activities.map(item =>
      item.id === id ? { ...item, ...updatedData, color: getColorForCategory(updatedData.category || item.category) } : item
    ).sort((a, b) => a.time.localeCompare(b.time));
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
            <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className={styles.input} />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={styles.select}>
              <option value="Arbete">Arbete</option>
              <option value="Paus">Paus</option>
              <option value="Möte">Möte</option>
              <option value="Personligt">Personligt</option>
            </select>
          </div>
          <input type="text" placeholder="Aktivitet..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className={styles.input} />
          <button onClick={handleAdd} className={styles.saveBtn}>Lägg till</button>
        </div>
      )}

      <div className={styles.list}>
        {activities.length === 0 && !isAdding && (
          <div className={styles.emptyState}>Inga aktiviteter för denna dag.</div>
        )}
        {activities.map((item) => (
          <ScheduleItem key={item.id} item={item} onDelete={handleDelete} onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  );
}