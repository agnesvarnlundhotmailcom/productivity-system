import React, { useState } from 'react';
import styles from './TodoWidget.module.css';

// --- Ikoner (SVG) ---
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const IconHeader = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="6" height="6" rx="1" />
    <path d="m3 17 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
  </svg>
);

const TodoWidget = () => {
  // ÄNDRING: Startar med en tom lista istället för dummy-data
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTask = () => {
    if (inputValue.trim() === "") return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false, // Nya uppgifter är alltid ej klara
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
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
          <div className={styles.headerIcon}>
            <IconHeader />
          </div>
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
          onKeyDown={handleKeyDown}
          placeholder="Lägg till ny uppgift..."
          className={styles.inputField}
        />
        <button onClick={addTask} className={styles.addButton}>
          <IconPlus />
        </button>
      </div>

      {/* Lista */}
      <div className={styles.list}>
        {tasks.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginTop: '1rem' }}>
            Inga uppgifter än. Lägg till en ovan!
          </p>
        )}

        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`${styles.item} ${task.completed ? styles.completedItem : ''}`}
          >
            <div className={`${styles.checkIcon} ${task.completed ? styles.checked : styles.unchecked}`}>
              {task.completed ? <IconCheck /> : <IconCircle />}
            </div>
            
            <span className={styles.itemText}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoWidget;