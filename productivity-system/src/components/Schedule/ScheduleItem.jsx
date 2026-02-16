import { useState } from 'react';
import { 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Circle, 
  CheckCircle2 
} from 'lucide-react';
import styles from './Schedule.module.css';

export default function ScheduleItem({ item, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  
  // States för redigering av specifika uppgifter inuti blocket
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  // States för redigering av själva schema-blocket
  const [editTitle, setEditTitle] = useState(item.title);
  const [editStart, setEditStart] = useState(item.startTime || item.time);
  const [editEnd, setEditEnd] = useState(item.endTime || "");

  // SPARAR ÄNDRINGAR FÖR SJÄLVA SCHEMA-BLOCKET
  const handleSave = (e) => {
    e.stopPropagation();
    onUpdate(item.id, { 
      title: editTitle, 
      startTime: editStart, 
      endTime: editEnd 
    });
    setIsEditing(false);
  };

  // LÄGGER TILL EN NY UPPGIFT I BLOCKET
  const addTask = (e) => {
    e.stopPropagation();
    if (!newTaskText.trim()) return;
    const newTask = { id: Date.now(), text: newTaskText, completed: false };
    onUpdate(item.id, {
      tasks: [...(item.tasks || []), newTask]
    });
    setNewTaskText("");
  };

  // MARKERAR EN UPPGIFT SOM KLAR/OKLAR
  const toggleTask = (e, taskId) => {
    e.stopPropagation();
    const updatedTasks = item.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdate(item.id, { tasks: updatedTasks });
  };

  // TAR BORT EN UPPGIFT UR BLOCKET
  const deleteTask = (e, taskId) => {
    e.stopPropagation();
    const updatedTasks = item.tasks.filter(t => t.id !== taskId);
    onUpdate(item.id, { tasks: updatedTasks });
  };

  // STARTAR REDIGERING AV EN UPPGIFT
  const startEditTask = (e, task) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setEditTaskText(task.text);
  };

  // SPARAR REDIGERAD UPPGIFT
  const saveEditTask = (e, taskId) => {
    e.stopPropagation();
    const updatedTasks = item.tasks.map(t => 
      t.id === taskId ? { ...t, text: editTaskText } : t
    );
    onUpdate(item.id, { tasks: updatedTasks });
    setEditingTaskId(null);
  };

  return (
    <div 
      className={`${styles.card} ${isExpanded ? styles.expanded : ''}`} 
      onClick={() => !isEditing && setIsExpanded(!isExpanded)}
    >
      <div className={styles.accentBar} style={{ backgroundColor: item.color }}></div>
      
      <div className={styles.mainContent}>
        {isEditing ? (
          <div className={styles.editRow} onClick={e => e.stopPropagation()}>
            <input type="time" value={editStart} onChange={e => setEditStart(e.target.value)} className={styles.editInput} />
            <input type="time" value={editEnd} onChange={e => setEditEnd(e.target.value)} className={styles.editInput} />
            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className={`${styles.editInput} ${styles.editInputTitle}`} />
            <div className={styles.actions}>
              <button onClick={handleSave} className={styles.iconBtn}><Check size={18} /></button>
              <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className={styles.iconBtn}><X size={18} /></button>
            </div>
          </div>
        ) : (
          <div className={styles.viewRow}>
            <div className={styles.timeInfo}>
              <span className={styles.time}>
                {item.startTime || item.time} {item.endTime ? `- ${item.endTime}` : ''}
              </span>
            </div>
            <span className={styles.title}>{item.title}</span>
            <div className={styles.actions}>
              <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
                <Pencil size={18} />
              </button>
              <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
                <Trash2 size={18} />
              </button>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        )}
      </div>

      {isExpanded && !isEditing && (
        <div className={styles.taskSection} onClick={e => e.stopPropagation()}>
          <div className={styles.miniTodoList}>
            {item.tasks?.map(task => (
              <div key={task.id} className={styles.miniTask} onClick={(e) => toggleTask(e, task.id)}>
                <div className={styles.miniCheckWrapper}>
                  {task.completed ? (
                    <CheckCircle2 size={20} color={item.color} fill={`${item.color}33`} />
                  ) : (
                    <Circle size={20} color={item.color} />
                  )}
                </div>

                {editingTaskId === task.id ? (
                  <input 
                    className={styles.miniEditInput}
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditTask(e, task.id)}
                    autoFocus
                  />
                ) : (
                  <span className={task.completed ? styles.taskDone : ''}>{task.text}</span>
                )}

                <div className={styles.miniActions}>
                  {editingTaskId === task.id ? (
                    <button onClick={(e) => saveEditTask(e, task.id)} className={styles.iconBtn}><Check size={14} /></button>
                  ) : (
                    <>
                      <button onClick={(e) => startEditTask(e, task)} className={styles.iconBtn}><Pencil size={14} /></button>
                      <button onClick={(e) => deleteTask(e, task.id)} className={styles.deleteBtn}><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.miniInputGroup}>
            <input 
              placeholder="Vad ska göras i detta block?" 
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask(e)}
            />
            <button onClick={addTask} style={{ backgroundColor: item.color }}>
              <Plus size={14} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
