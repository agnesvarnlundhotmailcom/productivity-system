import { useState } from 'react';
import ScheduleItem from './ScheduleItem';
import styles from './Schedule.module.css';
import { 
  Clock
} from 'lucide-react';

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

  return (
    <div className={styles.container}>
      {/* Header med dynamiskt datum */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span style={{ marginRight: '8px' }}><Clock size={20}/></span> 
          Schema - {todayDate}
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className={styles.addButton}>
          {isAdding ? '−' : '+'}
        </button>
      </div>

      {/* Formulär */}
      {isAdding && (
        <div className={styles.form}>
          <div className={styles.formRow}>
            <input 
              type="time" 
              value={newTime} 
              onChange={(e) => setNewTime(e.target.value)} 
              className={`${styles.input} ${styles.inputTime}`}
              required
            />
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
          <input 
            type="text" 
            placeholder="Skriv din aktivitet..." 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            className={styles.input}
            autoFocus 
          />
          <button onClick={handleAdd} className={styles.saveBtn}>Lägg till</button>
        </div>
      )}

      {/* Listan */}
      <div className={styles.list}>
        {activities.length === 0 && !isAdding && (
          <div className={styles.emptyState}>
            Tryck på + för att lägga till dagens första aktivitet
          </div>
        )}

        {activities.map((item) => (
          <ScheduleItem 
            key={item.id}
            time={item.time}
            title={item.title}
            category={item.category}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
}