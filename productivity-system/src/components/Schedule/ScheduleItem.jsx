import { useState } from 'react';
import { Pencil, Trash2, Check, X, ChevronDown, ChevronUp, Plus, Circle, CheckCircle2 } from 'lucide-react';
import styles from './Schedule.module.css';

export default function ScheduleItem({ item, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  const [editTitle, setEditTitle] = useState(item.title);
  const [editStart, setEditStart] = useState(item.startTime || item.time);
  const [editEnd, setEditEnd] = useState(item.endTime || "");

  const handleSaveBlock = (e) => {
    e.stopPropagation();
    onUpdate(item.id, { title: editTitle, startTime: editStart, endTime: editEnd });
    setIsEditing(false);
  };

  const handleAddTask = (e) => {
    e.stopPropagation();
    if (!newTaskText.trim()) return;
    onUpdate(item.id, { tasks: [...(item.tasks || []), { id: Date.now(), text: newTaskText, completed: false }] });
    setNewTaskText("");
  };

  const handleToggleTask = (e, taskId) => {
    e.stopPropagation();
    onUpdate(item.id, { tasks: item.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) });
  };

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`} onClick={() => !isEditing && setIsExpanded(!isExpanded)}>
      <div className={styles.accentBar} style={{ backgroundColor: item.color }} />
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
              <span className={styles.time}>{item.startTime || item.time} {item.endTime ? `- ${item.endTime}` : ''}</span>
            </div>
            <span className={styles.title}>{item.title}</span>
            <div className={styles.actions}>
              <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}><Pencil size={18} /></button>
              <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}><Trash2 size={18} /></button>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        )}
      </div>

      {isExpanded && !isEditing && (
        <div className={styles.taskSection} onClick={e => e.stopPropagation()}>
          <div className={styles.miniTodoList}>
            {item.tasks?.map(task => (
              <div key={task.id} className={styles.miniTask} onClick={(e) => handleToggleTask(e, task.id)}>
                <div className={styles.miniCheckWrapper}>
                  {task.completed ? <CheckCircle2 size={20} color={item.color} fill={`${item.color}33`} /> : <Circle size={20} color={item.color} />}
                </div>
                {editingTaskId === task.id ? (
                  <input 
                    className={styles.miniEditInput} value={editTaskText} autoFocus
                    onChange={e => setEditTaskText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (onUpdate(item.id, { tasks: item.tasks.map(t => t.id === task.id ? { ...t, text: editTaskText } : t) }), setEditingTaskId(null))}
                  />
                ) : (
                  <span className={task.completed ? styles.taskDone : ''}>{task.text}</span>
                )}
                <div className={styles.miniActions}>
                  <button onClick={(e) => { e.stopPropagation(); setEditingTaskId(task.id); setEditTaskText(task.text); }} className={styles.iconBtn}><Pencil size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onUpdate(item.id, { tasks: item.tasks.filter(t => t.id !== task.id) }); }} className={styles.deleteBtn}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.miniInputGroup}>
            <input placeholder="Ny uppgift..." value={newTaskText} onChange={e => setNewTaskText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTask(e)} />
            <button onClick={handleAddTask} style={{ backgroundColor: item.color }}><Plus size={14} color="white" /></button>
          </div>
        </div>
      )}
    </div>
  );
}