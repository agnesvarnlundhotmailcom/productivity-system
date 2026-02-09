import { useState } from 'react';
import ScheduleItem from './ScheduleItem';
import styles from './Schedule.module.css';
import { Clock } from 'lucide-react'; 

export default function DailySchedule() {
  const [activities, setActivities] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // State för formuläret
  const [newTime, setNewTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Arbete");

  // Hämta dagens datum automatiskt
  const todayDate = new Date().toLocaleDateString('sv-SE', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  // Funktion för färgkodning
  const getColorForCategory = (cat) => {
    switch(cat) {
      case 'Arbete': return '#39bef8'; // Blå
      case 'Paus': return '#f49e0c';   // Orange
      case 'Möte': return '#c093fc';   // Lila
      default: return '#fb7185';       // Rosa (Personligt)
    }
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

    // Lägg till och sortera listan
    const updatedList = [...activities, newItem].sort((a, b) => 
      a.time.localeCompare(b.time)
    );

    setActivities(updatedList);
    setIsAdding(false);
    setNewTime("");
    setNewTitle("");
  };

const handleDelete = (id) => {
    setActivities(activities.filter(item => item.id !== id));
  };

  const handleUpdate = (id, updatedData) => {
    const updatedList = activities.map(item => 
      item.id === id ? { ...item, ...updatedData, color: getColorForCategory(updatedData.category || item.category) } : item
    ).sort((a, b) => a.time.localeCompare(b.time));
    
    setActivities(updatedList);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span style={{ marginRight: '8px' }}><Clock size={20} color="#0ed3ac" /></span>
          Schema - {todayDate}
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
        {activities.map((item) => (
          <ScheduleItem 
            key={item.id}
            item={item} 
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}