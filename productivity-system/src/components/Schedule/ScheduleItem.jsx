import { useState, useContext } from 'react';
import { Pencil, Trash2, Check, X, ChevronDown, ChevronUp, Plus, Circle, CheckCircle2 } from 'lucide-react';
import { DataContext } from "../../contexts/DataContext";
import styles from './Schedule.module.css';

export default function ScheduleItem({ item, dateKey }) {
  const { deleteScheduleItem, updateScheduleItem, toggleScheduleTask } = useContext(DataContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  const [editTitle, setEditTitle] = useState(item.title);
  const [editStart, setEditStart] = useState(item.startTime);
  const [editEnd, setEditEnd] = useState(item.endTime);

  // --- HANDLERS (Använder nu DataContext direkt) ---

  const handleSaveBlock = (e) => {
    e.stopPropagation();
    updateScheduleItem(dateKey, item.id, { 
      title: editTitle, 
      startTime: editStart, 
      endTime: editEnd 
    });
    setIsEditing(false);
  };

  const handleAddTask = (e) => {
    e.stopPropagation();
    if (!newTaskText.trim()) return;
    const newTasks = [...(item.tasks || []), { id: Date.now(), text: newTaskText, completed: false }];
    updateScheduleItem(dateKey, item.id, { tasks: newTasks });
    setNewTaskText("");
  };

  const handleToggle = (e, taskId) => {
    e.stopPropagation();
    toggleScheduleTask(dateKey, item.id, taskId);
  };

  const handleDeleteTask = (e, taskId) => {
    e.stopPropagation();
    const filteredTasks = item.tasks.filter(t => t.id !== taskId);
    updateScheduleItem(dateKey, item.id, { tasks: filteredTasks });
  };

  const handleUpdateTaskText = (taskId) => {
    const updatedTasks = item.tasks.map(t => 
      t.id === taskId ? { ...t, text: editTaskText } : t
    );
    updateScheduleItem(dateKey, item.id, { tasks: updatedTasks });
    setEditingTaskId(null);
  };

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`} onClick={() => !isEditing && setIsExpanded(!isExpanded)}>
      <div className={styles.accentBar} style={{ backgroundColor: item.color || '#0ed3ac' }} />
      
      <div className={styles.mainContent}>
        {isEditing ? (
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
          <div className={styles.viewRow}>
            <div className={styles.timeInfo}>
              <span className={styles.time}>{item.startTime} - {item.endTime}</span>
            </div>
            <span className={styles.title}>{item.title}</span>
            <div className={styles.actions}>
              <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}><Pencil size={18} /></button>
              <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); deleteScheduleItem(dateKey, item.id); }}><Trash2 size={18} /></button>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        )}
      </div>

      {isExpanded && !isEditing && (
        <div className={styles.taskSection} onClick={e => e.stopPropagation()}>
          <div className={styles.miniTodoList}>
            {item.tasks?.map(task => (
              <div key={task.id} className={styles.miniTask} onClick={(e) => handleToggle(e, task.id)}>
                <div className={styles.miniCheckWrapper}>
                  {task.completed 
                    ? <CheckCircle2 size={20} color={item.color || '#0ed3ac'} fill={`${item.color || '#0ed3ac'}33`} /> 
                    : <Circle size={20} color={item.color || '#0ed3ac'} />
                  }
                </div>
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
          <div className={styles.miniInputGroup}>
            <input 
              placeholder="Ny uppgift..." 
              value={newTaskText} 
              onChange={e => setNewTaskText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAddTask(e)} 
            />
            <button onClick={handleAddTask} style={{ backgroundColor: item.color || '#0ed3ac' }}>
              <Plus size={14} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}