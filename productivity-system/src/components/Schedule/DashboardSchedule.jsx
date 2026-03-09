import React, { useContext, useState } from 'react';
import { DataContext } from "../../contexts/DataContext";
import { ListChecks, Check, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './DashboardSchedule.module.css';

/**
 * En komponent som visar en sammanfattning av dagens schema på dashboarden.
 * Den räknar ut framsteg i procent och låter användaren bocka av uppgifter.
 * @component
 * @param {Object} props
 * @param {string|Date} props.selectedDate - Datumet som ska visas (t.ex. från en kalender).
 */
export default function DashboardSchedule({ selectedDate }) {
  // Hämtar data och funktioner för att uppdatera schemat från vårt huvudarkiv
  const { data, updateScheduleItem, toggleScheduleTask } = useContext(DataContext);

  // Håller koll på vilket schema-block som just nu är utfällt (för att se småuppgifter)
  const [expandedId, setExpandedId] = useState(null);

  // Skapar en söknyckel för datumet, t.ex. "2024-05-22"
  const dateKey = new Date(selectedDate).toLocaleDateString('sv-SE');

  // Hämtar listan med aktiviteter för dagen, eller en tom lista om inget finns sparat
  const activities = data[dateKey]?.schedule ?? [];

/**
 * Markerar ett helt tidsblock som "klart".
 * * @param {Event} e - Själva klick-händelsen.
 * @param {number|string} itemId - ID för det block som ska ändras.
 * @param {boolean} currentStatus - Om blocket är avbockat just nu
 */
  const handleToggleBlock = (e, itemId, currentStatus) => {
    // Stoppar klicket från att "bubbla upp", så vi inte fäller ut raden av misstag
    e.stopPropagation();
    updateScheduleItem(dateKey, itemId, { completed: !currentStatus });
  };

  /**
   * Markerar en liten deluppgift (task) inuti ett block som klar.
   * * @param {Event} e - Själva klick-händelsen
   * @param {number|string} itemId - ID för huvudblocket.
   * @param {number|string} task-Id - ID för den specifika deluppgiften.
   */
  const handleToggleTask = (e, itemId, taskId) => {
    e.stopPropagation();
    toggleScheduleTask(dateKey, itemId, taskId);
  };

  // Räknar ut statistik för mätaren (Progress bar)
  const total = activities.length;
  const completed = activities.filter(item => item.completed).length;
  /** 
   * @type {number} Räknar ut procentandelen avklarade uppgifter (0 till 100).
   */
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={styles.mainWrapper}>
      {/* Rubrik och räknare (t.ex. 2/5 klara) */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <ListChecks size={20} color="#0ed3ac" />
          <span style={{ marginLeft: '8px' }}>Dagens schema</span>
        </div>
        <span className={styles.counter}>{completed}/{total}</span>
      </div>

      {/* Progress-sektionen: Visar mätaren och procenten */}
      <div className={styles.progressSection}>
        <div className={styles.progressLabel}>
          <span>Framsteg</span>
          <span className={styles.percent}>{progress}%</span>
        </div>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.list}>
        {activities.map((item) => {
          // Hjälpvariabler för att göra koden nedanför lättare att läsa
          const isDone = !!item.completed;
          const isExpanded = expandedId === item.id;
          const barColor = isDone ? '#cbd5e1' : (item.color || '#0ed3ac');

          return (
            <div key={item.id} className={styles.cardContainer}>
              {/* Själva kortet för ett tidspass */}
              <div 
                className={`${styles.card} ${isDone ? styles.rowDone : ''}`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                {/* Den lilla färgade kanten till vänster */}
                <div className={styles.accentBar} style={{ backgroundColor: barColor }} />
                <div className={styles.cardContent}>
                  <div className={styles.left}>
                    {/* Cirkeln man klickar i för att bocka av hela passet */}
                    <div 
                      className={`${styles.statusCircle} ${isDone ? styles.circleDone : ''}`}
                      style={{ borderColor: isDone ? '#94a3b8' : barColor }}
                      onClick={(e) => handleToggleBlock(e, item.id, isDone)}
                    >
                      {isDone && <Check size={12} color="white" strokeWidth={4} />}
                    </div>
                    <span className={styles.time}>{item.startTime}</span>
                    <span className={styles.title}>{item.title}</span>
                  </div>
                  <div className={styles.rightSide}>
                    <span className={styles.categoryTag}>{isDone ? 'Klar' : item.category}</span>
                    {/* Visa en pil om det finns smågrupper inuti blocket */}
                    {item.tasks?.length > 0 && (
                      <div className={styles.chevron}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Om man klickat på kortet och det finns underuppgifter: visa dem här */}
              {isExpanded && item.tasks?.length > 0 && (
                <div className={styles.taskDropdown}>
                  {item.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={styles.taskItem}
                      onClick={(e) => handleToggleTask(e, item.id, task.id)}
                    >
                      <div className={`${styles.miniCheck} ${task.completed ? styles.miniCheckActive : ''}`}>
                        {task.completed && <Check size={10} color="white" strokeWidth={4} />}
                      </div>
                      <span className={`${styles.taskText} ${task.completed ? styles.taskCompletedText : ''}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}