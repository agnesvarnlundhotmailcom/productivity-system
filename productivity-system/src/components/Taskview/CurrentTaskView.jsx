import { useContext, useMemo } from 'react';
import { DataContext } from "../../contexts/DataContext";
import { CheckCircle2, Circle, Play, Pause } from 'lucide-react';
import styles from './CurrentTask.module.css';

export default function CurrentTaskView({ onStartTimer, onPauseTimer, isRunning, timerMode }) {
  const { data, toggleScheduleTask } = useContext(DataContext);
  const today = new Date().toLocaleDateString('sv-SE');

  // 1. Hitta aktuell aktivitet baserat på nuvarande tid
  const taskToShow = useMemo(() => {
    const schedule = data[today]?.schedule || [];
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    return schedule
      .filter(item => {
        if (!item.startTime || !item.endTime) return false;
        const [eH, eM] = item.endTime.split(':').map(Number);
        return (eH * 60 + eM) > currentMin;
      })
      .sort((a, b) => {
        const [aH, aM] = a.startTime.split(':').map(Number);
        const [bH, bM] = b.startTime.split(':').map(Number);
        return (aH * 60 + aM) - (bH * 60 + bM);
      })[0];
  }, [data, today]);

  // 2. Beräkna framsteg (progress bar)
  const progress = useMemo(() => {
    if (!taskToShow) return 0;
    const [sH, sM] = taskToShow.startTime.split(':').map(Number);
    const [eH, eM] = taskToShow.endTime.split(':').map(Number);
    const totalSeconds = ((eH * 60 + eM) - (sH * 60 + sM)) * 60;
    
    if (totalSeconds <= 0) return 0;
    const workedSeconds = data.settings.secondsWork || 0;
    return Math.min(Math.round((workedSeconds / totalSeconds) * 100), 100);
  }, [data.settings.secondsWork, taskToShow]);

  if (!taskToShow) return null;

  const isWorking = isRunning && timerMode === 'work';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <button className={styles.playButton} onClick={isWorking ? onPauseTimer : onStartTimer}>
            {isWorking ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>
          <h2 className={styles.title}>{taskToShow.title}</h2>
        </div>
        <div className={styles.counter}>
          {taskToShow.startTime} - {taskToShow.endTime}
        </div>
      </div>

      <div className={styles.timeProgressBar}>
        <div 
          className={styles.timeBarFill} 
          style={{ 
            width: `${progress}%`, 
            backgroundColor: taskToShow.color || '#0ed3ac' 
          }} 
        />
      </div>

      <div className={styles.list}>
        {taskToShow.tasks?.map(task => (
          <div 
            key={task.id} 
            className={`${styles.item} ${task.completed ? styles.completedItem : ''}`} 
            onClick={() => toggleScheduleTask(today, task.id)}
          >
            <div className={styles.itemMain}>
              <div className={`${styles.checkIcon} ${task.completed ? styles.checked : ''}`}>
                {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </div>
              <span className={styles.itemText}>{task.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}