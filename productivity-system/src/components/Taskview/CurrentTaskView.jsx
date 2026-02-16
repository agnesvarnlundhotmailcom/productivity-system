import { useContext, useMemo } from 'react';
import { DataContext } from "../../contexts/DataContext";
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import styles from './CurrentTask.module.css';

export default function CurrentTaskView() {
  const { data, setData } = useContext(DataContext);
  const today = new Date().toLocaleDateString('sv-SE');

  const taskToShow = useMemo(() => {
    const schedule = data[today]?.schedule || [];
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    return schedule
      .filter(item => {
        if (!item.startTime || !item.endTime) return false;
        const [eH, eM] = item.endTime.split(':').map(Number);
        return (eH * 60 + eM) > currentTimeInMinutes;
      })
      .sort((a, b) => {
        const [aH, aM] = a.startTime.split(':').map(Number);
        const [bH, bM] = b.startTime.split(':').map(Number);
        return (aH * 60 + aM) - (bH * 60 + bM);
      })[0];
  }, [data, today]);

  const toggleTask = (taskId) => {
    if (!taskToShow) return;
    setData(prev => {
      const currentSchedule = prev[today]?.schedule || [];
      const updatedSchedule = currentSchedule.map(item => {
        if (item.id === taskToShow.id) {
          return {
            ...item,
            tasks: item.tasks.map(t => 
              t.id === taskId ? { ...t, completed: !t.completed } : t
            )
          };
        }
        return item;
      });
      return { ...prev, [today]: { ...prev[today], schedule: updatedSchedule } };
    });
  };

  if (!taskToShow) return null;

  const isOngoing = taskToShow.startTime.split(':')[0] * 60 + parseInt(taskToShow.startTime.split(':')[1]) <= new Date().getHours() * 60 + new Date().getMinutes();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.headerIcon}>
            <Clock size={18} />
          </div>
          <h2 className={styles.title}>
            {isOngoing ? "Just nu: " : "Kommande: "} {taskToShow.title}
          </h2>
        </div>
        <div className={styles.counter}>
            {taskToShow.startTime} - {taskToShow.endTime}
        </div>
      </div>

      <div className={styles.list}>
        {taskToShow.tasks?.map(task => (
          <div 
            key={task.id} 
            className={`${styles.item} ${task.completed ? styles.completedItem : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <div className={styles.itemMain}>
              <div className={`${styles.checkIcon} ${task.completed ? styles.checked : ''}`}>
                {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </div>
              <span className={styles.itemText}>{task.text}</span>
            </div>
          </div>
        ))}
        {(!taskToShow.tasks || taskToShow.tasks.length === 0) && (
            <div className={styles.emptyText}>Inga underuppgifter planerade</div>
        )}
      </div>
    </div>
  );
}