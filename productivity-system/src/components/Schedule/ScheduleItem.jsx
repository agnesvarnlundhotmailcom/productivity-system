import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import styles from './Schedule.module.css';

export default function ScheduleItem({ item, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editTime, setEditTime] = useState(item.time);

  const handleSave = () => {
    onUpdate(item.id, { title: editTitle, time: editTime });
    setIsEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.accentBar} style={{ backgroundColor: item.color }}></div>
      
      {isEditing ? (
        <div className={styles.editRow}>
          <input 
            type="time" 
            className={styles.editInput} 
            value={editTime} 
            onChange={(e) => setEditTime(e.target.value)} 
          />
          <input 
            type="text" 
            className={`${styles.editInput} ${styles.editInputTitle}`} 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)} 
          />
          <div className={styles.actions}>
            <button onClick={handleSave} className={styles.iconBtn}><Check size={18} /></button>
            <button onClick={() => setIsEditing(false)} className={styles.iconBtn}><X size={18} /></button>
          </div>
        </div>
      ) : (
        <>
          <span className={styles.time}>{item.time}</span>
          <span className={styles.title}>{item.title}</span>
          
          <div className={styles.actions}>
            <button 
              className={styles.iconBtn} 
              onClick={() => setIsEditing(true)}
              title="Redigera"
            >
              <Pencil size={18} />
            </button>
            <button 
              className={styles.deleteBtn} 
              onClick={() => onDelete(item.id)}
              title="Ta bort"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}