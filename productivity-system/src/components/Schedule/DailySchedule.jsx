import { useState } from 'react';
import { Clock } from 'lucide-react';
import { useSchedule } from '../../hooks/useSchedule';
import ScheduleForm from './ScheduleForm';
import ScheduleItem from './ScheduleItem'; // Din befintliga fil
import styles from './Schedule.module.css';

export default function DailySchedule({ selectedDate }) {
  const { activities, handleAdd, handleDelete, handleUpdate, dateKey } = useSchedule(selectedDate);
  const [isAdding, setIsAdding] = useState(false);

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

      {isAdding && (
        <ScheduleForm onSave={(data) => { handleAdd(data); setIsAdding(false); }} />
      )}

      <div className={styles.list}>
        {activities.map(item => (
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