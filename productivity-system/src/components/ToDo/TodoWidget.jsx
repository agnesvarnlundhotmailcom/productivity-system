import React, { useState, useContext } from 'react';
import { ListTodo, CircleCheck, Circle, Plus, Pencil, Trash2, Check, X } from 'lucide-react'; 
import { DataContext } from "../../contexts/DataContext";
import styles from './TodoWidget.module.css';

const TodoWidget = ({ selectedDate }) => {
  const { data, setData } = useContext(DataContext);
  
  // Skapar datumnyckel baserat på valda dagen i kalendern
  const dateKey = new Date(selectedDate).toLocaleDateString('sv-SE');
  
  // Hämtar tasks för valt datum
  const tasks = data[dateKey]?.tasks ?? [];
  
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const updateTasks = (newTasks) => {
    setData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        tasks: newTasks
      }
    }));
  };

  const addTask = () => {
    if (inputValue.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    updateTasks([...tasks, newTask]);
    setInputValue("");
  };

  const toggleTask = (id) => {
    updateTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (e, id) => {
    e.stopPropagation(); 
    updateTasks(tasks.filter(t => t.id !== id));
  };

  const startEdit = (e, task) => {
    e.stopPropagation();
    setEditingId(task.id);
    setEditText(task.text);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const saveEdit = (e) => {
    e.stopPropagation();
    updateTasks(tasks.map(t => 
      t.id === editingId ? { ...t, text: editText } : t
    ));
    setEditingId(null);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.headerIcon}>
            <ListTodo size={20} strokeWidth={2} />
          </div>
          <h2 className={styles.title}>Att göra</h2>
        </div>
        <span className={styles.counter}>
          {tasks.length > 0 ? `${completedCount}/${tasks.length} klara` : ''}
        </span>
      </div>

      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Lägg till ny uppgift..."
          className={styles.inputField}
        />
        <button onClick={addTask} className={styles.addButton}>
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>

      <div className={styles.list}>
        {tasks.length === 0 && (
          <p className={styles.emptyText}>Inga uppgifter än för denna dag.</p>
        )}

        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`${styles.item} ${task.completed ? styles.completedItem : ''}`}
          >
            <div className={styles.itemMain} onClick={() => toggleTask(task.id)}>
              <div className={`${styles.checkIcon} ${task.completed ? styles.checked : ''}`}>
                {task.completed ? <CircleCheck size={20} /> : <Circle size={20} />}
              </div>
              
              {editingId === task.id ? (
                <div className={styles.editWrapper}>
                  <input 
                    className={styles.editInput}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              ) : (
                <span className={styles.itemText}>{task.text}</span>
              )}
            </div>

            <div className={styles.actions}>
              {editingId === task.id ? (
                <>
                  <button onClick={saveEdit} className={styles.iconBtn} title="Spara">
                    <Check size={18} />
                  </button>
                  <button onClick={cancelEdit} className={styles.iconBtn} title="Avbryt">
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={(e) => startEdit(e, task)} className={styles.iconBtn} title="Redigera">
                    <Pencil size={18} />
                  </button>
                  <button onClick={(e) => deleteTask(e, task.id)} className={styles.deleteBtn} title="Ta bort">
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoWidget;