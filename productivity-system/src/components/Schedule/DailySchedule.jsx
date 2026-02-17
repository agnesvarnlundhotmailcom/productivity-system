import { useState, useContext } from 'react';
import { Clock } from 'lucide-react';
import { DataContext } from "../../contexts/DataContext"; // Hämta er "kanal"
import ScheduleForm from './ScheduleForm';
import ScheduleItem from './ScheduleItem';
import styles from './Schedule.module.css';

export default function DailySchedule({ selectedDate }) {
  // 1. Koppla upp oss mot vår gemensamma datakälla
  const { data, addScheduleItem } = useContext(DataContext);
  
  const [isAdding, setIsAdding] = useState(false);

  // 2. Skapa den unika nyckeln för det valda datumet (t.ex. "2024-05-20")
  const dateKey = new Date(selectedDate).toLocaleDateString('sv-SE');

  // 3. Hämta aktiviteterna för just det här datumet från vår data
  const activities = data[dateKey]?.schedule || [];

  const displayDate = new Date(selectedDate).toLocaleDateString('sv-SE', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

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

      {/* Om isAdding är sant, visa formuläret */}
      {isAdding && (
        <ScheduleForm onSave={(formData) => { 
          addScheduleItem(dateKey, formData); 
          setIsAdding(false); 
        }} />
      )}

      <div className={styles.list}>
        {/* Vi mappar ut våra aktiviteter och skickar med dateKey så att Item vet vilken dag den tillhör */}
        {activities.map(item => (
          <ScheduleItem 
            key={item.id} 
            item={item} 
            dateKey={dateKey} 
          />
        ))}
      </div>
    </div>
  );
}