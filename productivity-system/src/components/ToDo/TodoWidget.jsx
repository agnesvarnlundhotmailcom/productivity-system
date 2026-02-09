import React, { useState } from 'react';
import { ListTodo, CircleCheck, Circle, Plus, Trash2, Pencil, Check, X } from 'lucide-react'; 
import styles from './TodoWidget.module.css';

const TodoWidget = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const addTask = () => {
    if (inputValue.trim() === "") return;
    const newTask = { id: Date.now(), text: inputValue, completed: false };
    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: editValue } : t));
    setEditingId(null);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.headerIcon}><ListTodo size={20} /></div>
          <h2 className={styles.title}>Att göra</h2>
        </div>
        <span className={styles.counter}>
          {tasks.length > 0 ? `${completedCount}/${tasks.length} klara` : ''}
        </span>
      </div>

      {/* Input */}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Lägg till ny uppgift..."
          className={styles.inputField}
        />
        <button onClick={addTask} className={styles.addButton}><Plus size={16} /></button>
      </div>

      {/* Lista */}
      <div className={styles.list}>
        {tasks.map((task) => (
          <div key={task.id} className={`${styles.item} ${task.completed ? styles.completedItem : ''}`}>
            
            {editingId === task.id ? (
              <div className={styles.editWrapper}>
                <input 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
                <button onClick={() => saveEdit(task.id)} className={styles.iconBtn}><Check size={18} /></button>
                <button onClick={() => setEditingId(null)} className={styles.iconBtn}><X size={18} /></button>
              </div>
            ) : (
              <>
                <div className={styles.itemMain} onClick={() => toggleTask(task.id)}>
                  <div className={`${styles.checkIcon} ${task.completed ? styles.checked : styles.unchecked}`}>
                    {task.completed ? <CircleCheck size={20} /> : <Circle size={20} />}
                  </div>
                  <span className={styles.itemText}>{task.text}</span>
                </div>
                
                <div className={styles.actions}>
                  <button onClick={() => startEdit(task)} className={styles.iconBtn}><Pencil size={16} /></button>
                  <button onClick={() => deleteTask(task.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoWidget;