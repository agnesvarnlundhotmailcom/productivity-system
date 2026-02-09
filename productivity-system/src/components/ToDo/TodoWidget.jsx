import React, { useState, useContext } from 'react';
import { ListTodo, CircleCheck, Circle, Plus } from 'lucide-react'; 
import { DataContext } from "../../contexts/DataContext";
import styles from './TodoWidget.module.css';

const TodoWidget = () => {
  const { data, setData } = useContext(DataContext);
  const tasks = data.tasks;
  const [inputValue, setInputValue] = useState("");

  const addTask = () => {
    if (inputValue.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));

    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const toggleTask = (id) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
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
          onKeyDown={handleKeyDown}
          placeholder="Lägg till ny uppgift..."
          className={styles.inputField}
        />
        <button onClick={addTask} className={styles.addButton}>
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>

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
              {task.completed ? (
                <CircleCheck size={20} strokeWidth={2} />
              ) : (
                <Circle size={20} strokeWidth={2} />
              )}
            </div>
            <span className={styles.itemText}>{task.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoWidget;
