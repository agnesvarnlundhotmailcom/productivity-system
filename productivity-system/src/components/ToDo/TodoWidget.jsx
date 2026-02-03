import React, { useState } from 'react';
// 1. Importera alla ikoner vi behöver från Lucide
import { ListTodo, CircleCheck, Circle, Plus } from 'lucide-react'; 
import styles from './TodoWidget.module.css';

const TodoWidget = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTask = () => {
    if (inputValue.trim() === "") return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
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
            {/* Bytt till ListTodo */}
            <ListTodo size={20} strokeWidth={2} />
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
          {/* Bytt till Plus */}
          <Plus size={16} strokeWidth={3} />
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
              {/* Bytt till CircleCheck och Circle */}
              {task.completed ? (
                <CircleCheck size={20} strokeWidth={2} />
              ) : (
                <Circle size={20} strokeWidth={2} />
              )}
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