import { useState, useContext } from 'react';
import { Pencil, Trash2, Check, X, ChevronDown, ChevronUp, Plus, Circle, CheckCircle2 } from 'lucide-react';
import { DataContext } from "../../contexts/DataContext";
import styles from './Schedule.module.css';

/**
 * En komponent som visar ett enskillt pass i schemat.
 * Den kan växla mellan visningsläge och redigeringsläge, samt fällas ut för att hantera en lista med underuppgifter(tasks).
 * * @component
 * @param {Object} props
 * @param {Object} props.item - Innehåller passets data (id, title startTime, tasks, color).
 * @param {string} props.dateKey - Datumnyckeln som passet tillhör.
 */
export default function ScheduleItem({ item, dateKey }) {
  // Hämtar funktioner för att ändra datan i vårt globala arkiv
  const { deleteScheduleItem, updateScheduleItem, toggleScheduleTask } = useContext(DataContext);
  
  // States för att styra vad som visas i gränssnittet
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // States för att skapa eller ändra små underuppgifter (tasks)
  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  // States för att hålla i de tillfälliga ändringarna när man redigerar huvudpasset
  const [editTitle, setEditTitle] = useState(item.title);
  const [editStart, setEditStart] = useState(item.startTime);
  const [editEnd, setEditEnd] = useState(item.endTime);

  // En genväg till passets färg, eller en standardfärg om ingen valts
  const activeColor = item.color || '#0ed3ac';

  /**
   * Sparar ändringarna för passets rubrik och tider.
   * @param {Event} e - Klick-händelsen
   */
  const handleSaveBlock = (e) => {
    e.stopPropagation();
    updateScheduleItem(dateKey, item.id, { 
      title: editTitle, 
      startTime: editStart, 
      endTime: editEnd 
    });
    setIsEditing(false);
  };

  /**
   * Skapar en ny underuppgift (task) och lägger till den i passet.
   * @param {Event} e - Eventet (klick eller Enter-tryck).
   */
  const handleAddTask = (e) => {
    e.stopPropagation();
    if (!newTaskText.trim()) return;

    const newTasks = [...(item.tasks || []), { id: Date.now(), text: newTaskText, completed: false }];
    updateScheduleItem(dateKey, item.id, { tasks: newTasks });
    setNewTaskText("");
  };

  /**
   * Bockar av eller aktiverar en underuppgift
   */
  const handleToggle = (e, taskId) => {
    e.stopPropagation();
    toggleScheduleTask(dateKey, item.id, taskId);
  };

  /**
   * Tar bort en underuppgift helt.
   */
  const handleDeleteTask = (e, taskId) => {
    e.stopPropagation();
    const filteredTasks = item.tasks.filter(t => t.id !== taskId);
    updateScheduleItem(dateKey, item.id, { tasks: filteredTasks });
  };

  /**
   * Sparar den nya texten för en underuppgift eller en redigering.
   * @param {number} taskId - ID:t för uppgiften som ändras.
   */
  const handleUpdateTaskText = (taskId) => {
    const updatedTasks = item.tasks.map(t => 
      t.id === taskId ? { ...t, text: editTaskText } : t
    );
    updateScheduleItem(dateKey, item.id, { tasks: updatedTasks });
    setEditingTaskId(null);
  };

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`} onClick={() => !isEditing && setIsExpanded(!isExpanded)}>
      {/* Den färgade kanten till vänster som visar kategorin */}
      <div className={styles.accentBar} style={{ backgroundColor: activeColor }} />
      
      <div className={styles.mainContent}>
        {isEditing ? (
          /* Redigeringsläge: Här kan användaren ändra tid och namn */
          <div className={styles.editRow} onClick={e => e.stopPropagation()}>
            <input type="time" value={editStart} onChange={e => setEditStart(e.target.value)} className={styles.editInput} />
            <input type="time" value={editEnd} onChange={e => setEditEnd(e.target.value)} className={styles.editInput} />
            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className={`${styles.editInput} ${styles.editInputTitle}`} />
            <div className={styles.actions}>
              <button onClick={handleSaveBlock} className={styles.iconBtn}><Check size={18} /></button>
              <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className={styles.iconBtn}><X size={18} /></button>
            </div>
          </div>
        ) : (
          /* Visningsläge: Standardvyn för ett pass i listan */
          <div className={styles.viewRow}>
            <div className={styles.timeInfo}>
              <span className={styles.time}>{item.startTime} - {item.endTime}</span>
            </div>
            <span className={styles.title}>{item.title}</span>
            <div className={styles.actions}>
              <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}><Pencil size={18} /></button>
              <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); deleteScheduleItem(dateKey, item.id); }}><Trash2 size={18} /></button>
              {/* Pilen visar om passet är utfällt eller inte */}
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        )}
      </div>
      
      {/* Utfälld del: Visas bara om användaren klickat på passet (och inte redigerar) */}
      {isExpanded && !isEditing && (
        <div className={styles.taskSection} onClick={e => e.stopPropagation()}>
          <div className={styles.miniTodoList}>
            {item.tasks?.map(task => (
              <div key={task.id} className={styles.miniTask} onClick={(e) => handleToggle(e, task.id)}>
                <div className={styles.miniCheckWrapper}>
                  {task.completed 
                    ? <CheckCircle2 size={20} color={activeColor} fill={`${activeColor}33`} /> 
                    : <Circle size={20} color={activeColor} />
                  }
                </div>

                {/* Om vi just nu ändrar texten på denna underuppgift */}
                {editingTaskId === task.id ? (
                  <input 
                    className={styles.miniEditInput} 
                    value={editTaskText} 
                    autoFocus
                    onChange={e => setEditTaskText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUpdateTaskText(task.id)}
                    onBlur={() => setEditingTaskId(null)}
                  />
                ) : (
                  <span className={task.completed ? styles.taskDone : ''}>{task.text}</span>
                )}

                <div className={styles.miniActions}>
                  <button onClick={(e) => { e.stopPropagation(); setEditingTaskId(task.id); setEditTaskText(task.text); }} className={styles.iconBtn}><Pencil size={14} /></button>
                  <button onClick={(e) => handleDeleteTask(e, task.id)} className={styles.deleteBtn}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Sektion för att lägga till nya underuppgifter längst ner */}
          <div className={styles.miniInputGroup}>
            <input 
              placeholder="Ny uppgift..." 
              value={newTaskText} 
              onChange={e => setNewTaskText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAddTask(e)} 
            />
            <button onClick={handleAddTask} style={{ backgroundColor: activeColor }}>
              <Plus size={14} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}