import { useContext, useMemo, } from 'react';
import { DataContext } from "../../contexts/DataContext";
import { CheckCircle2, Circle, Play, Pause } from 'lucide-react';
import styles from './CurrentTask.module.css';

export default function CurrentTaskView({ onStartTimer, onPauseTimer, isRunning, timerMode }) {
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

  // Beräkna total tid för aktiviteten i sekunder
  const totalActivitySeconds = useMemo(() => {
    if (!taskToShow) return 0;
    const [sH, sM] = taskToShow.startTime.split(':').map(Number);
    const [eH, eM] = taskToShow.endTime.split(':').map(Number);
    return ((eH * 60 + eM) - (sH * 60 + sM)) * 60;
  }, [taskToShow]);

  // Progress baseras nu på faktiskt arbetad tid (från data.settings)
  const progress = useMemo(() => {
    if (totalActivitySeconds === 0) return 0;
    // Vi kollar hur många sekunder användaren har arbetat idag totalt
    // (Alternativt kan man nollställa sekunder per aktivitet, men här kör vi på dagens arbete)
    const workedSeconds = data.settings.secondsWork || 0;
    const p = Math.min((workedSeconds / totalActivitySeconds) * 100, 100);
    return Math.round(p);
  }, [data.settings.secondsWork, totalActivitySeconds]);

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <button 
            className={styles.playButton} 
            onClick={isRunning && timerMode === 'work' ? onPauseTimer : onStartTimer}
          >
            {/* Byter ikon baserat på status */}
            {isRunning && timerMode === 'work' ? (
              <Pause size={14} fill="currentColor" />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
          </button>
          <h2 className={styles.title}>{taskToShow.title}</h2>
        </div>
        <div className={styles.counter}>{taskToShow.startTime} - {taskToShow.endTime}</div>
      </div>

      <div className={styles.timeProgressBar}>
        <div 
          className={styles.timeBarFill} 
          style={{ 
            width: `${progress}%`,
            backgroundColor: taskToShow.color || 'var(--accent-primary)' 
          }} 
        />
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
      </div>
    </div>
  );
}