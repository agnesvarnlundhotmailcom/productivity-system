import React, { useContext, useState } from 'react';
import { DataContext } from "../../contexts/DataContext";
import { ListChecks, Check, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './DashboardSchedule.module.css';

export default function DashboardSchedule({ selectedDate }) {
  const { data, updateScheduleItem, toggleScheduleTask } = useContext(DataContext);
  const [expandedId, setExpandedId] = useState(null);
  const dateKey = new Date(selectedDate).toLocaleDateString('sv-SE');
  const activities = data[dateKey]?.schedule ?? [];

  const handleToggleBlock = (e, itemId, currentStatus) => {
    e.stopPropagation(); // Hindrar dropdown från att öppnas vid klick på stora cirkeln
    updateScheduleItem(dateKey, itemId, { completed: !currentStatus });
  };

  const handleToggleTask = (e, itemId, taskId) => {
    e.stopPropagation();
    // Denna anropar din existerande logik i DataContext så det uppdateras överallt
    toggleScheduleTask(dateKey, itemId, taskId);
  };

  const total = activities.length;
  const completed = activities.filter(item => item.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <ListChecks size={20} color="#0ed3ac" />
          <span style={{ marginLeft: '8px' }}>Dagens schema</span>
        </div>
        <span className={styles.counter}>{completed}/{total}</span>
      </div>

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
          const isDone = !!item.completed;
          const isExpanded = expandedId === item.id;
          const barColor = isDone ? '#cbd5e1' : (item.color || '#0ed3ac');

          return (
            <div key={item.id} className={styles.cardContainer}>
              <div 
                className={`${styles.card} ${isDone ? styles.rowDone : ''}`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className={styles.accentBar} style={{ backgroundColor: barColor }} />
                <div className={styles.cardContent}>
                  <div className={styles.left}>
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
                    {item.tasks?.length > 0 && (
                      <div className={styles.chevron}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && item.tasks?.length > 0 && (
                <div className={styles.taskDropdown}>
                  {item.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={styles.taskItem}
                      onClick={(e) => handleToggleTask(e, item.id, task.id)}
                    >
                      <div className={`${styles.miniCheck} ${task.completed ? styles.miniCheckActive : ''}`}>
                        {task.completed && <Check size={12} color="white" strokeWidth={3} />}
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