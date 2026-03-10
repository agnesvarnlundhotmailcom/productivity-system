import { useContext, useMemo } from 'react';
import { DataContext } from "../../contexts/DataContext";
import { CheckCircle2, Circle, Play, Pause } from 'lucide-react';
import styles from './CurrentTask.module.css';

/**
 * Visar den aktivitet som pågår just nu baserat på schemat och klockan.
 * Innehåller en progress bar och en checklista för deluppgifter.
 * @component
 * @param {Object} props
 * @param {Function} props.onStartTimer - Funktion för att starta timern.
 * @param {Function} props.OnPauseTimer - Funktion för att stoppa timern.
 * @param {boolean} props.isRunning - Om timern tickar just nu.
 * @param {string} props.timerMode - Vilket läge timern är i (t.ex. 'work' eller 'break')
 */
export default function CurrentTaskView({ onStartTimer, onPauseTimer, isRunning, timerMode }) {
  const { data, toggleScheduleTask } = useContext(DataContext);

  // Skapar en sträng för dagens datum
  const today = new Date().toLocaleDateString('sv-SE');

  /**
   * Hittar nästa eller pågående aktiviet från schemat.
   * Filtrerar bort allt som redan har slutat och sorterar på starttid.
   * @type {Object|undefined}
   */
  const taskToShow = useMemo(() => {
    const schedule = data[today]?.schedule || [];
    const now = new Date();
    // Omvandlar nuvarande tid till totala minuter för enkelt jämförelse
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

  /**
   * Räknar ut hur många procent av passet som har gått.
   * @returns {number} Värde mellan 0 och 100.
   */
  const progress = useMemo(() => {
    if (!taskToShow) return 0;

    // Omvandlar start och slut till sekunder
    const [sH, sM] = taskToShow.startTime.split(':').map(Number);
    const [eH, eM] = taskToShow.endTime.split(':').map(Number);
    
    const totalMinutes = (eH * 60 + eM) - (sH * 60 + sM);
    const totalSeconds = totalMinutes * 60;
    
    if (totalSeconds <= 0) return 0;

    // Hämtar hur mycket vi faktiskt har jobbat från inställningar/data
    const workedSeconds = data.settings.secondsWork || 0;
    return Math.min(Math.round((workedSeconds / totalSeconds) * 100), 100);
  }, [data.settings.secondsWork, taskToShow]);

  // Kontrollvariabel för att veta om vi ska visa Play eller Pause
  if (!taskToShow) return null;

  const isWorking = isRunning && timerMode === 'work';
  const activeColor = taskToShow.color || '#0ed3ac';

  return (
    <div className={styles.container}>
      {/* Header: Visar titel och kontrollknapp */}
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

      {/* Progress bar: Visar visuellt hur långt man kommit i passet */}
      <div className={styles.timeProgressBar}>
        <div 
          className={styles.timeBarFill} 
          style={{ 
            width: `${progress}%`, 
            backgroundColor: activeColor 
          }} 
        />
      </div>

      {/* Checklista: Deluppgifterna för det aktuella passet */}
      <div className={styles.list}>
        {taskToShow.tasks?.map(task => (
          <div 
            key={task.id} 
            className={`${styles.item} ${task.completed ? styles.completedItem : ''}`} 
            onClick={() => toggleScheduleTask(today, taskToShow.id, task.id)}
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