import React, { useState, useContext } from 'react';
import { ListTodo, CircleCheck, Circle, Plus } from 'lucide-react'; 
import { DataContext } from "../../contexts/DataContext";
import styles from './TodoWidget.module.css';

const TodoWidget = ({ selectedDate }) => {
  const { data, setData } = useContext(DataContext);
  const dateKey = new Date(selectedDate).toLocaleDateString('sv-SE');
  const tasks = data[dateKey]?.tasks ?? [];
  const [inputValue, setInputValue] = useState("");

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
    const newTask = { id: Date.now(), text: inputValue, completed: false };
    updateTasks([...tasks, newTask]);
    setInputValue("");
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    updateTasks(updated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <ListTodo size={20} className={styles.headerIcon} />
          <h2 className={styles.title}>Att göra</h2>
        </div>
        <span className={styles.counter}>{tasks.length > 0 ? `${tasks.filter(t=>t.completed).length}/${tasks.length} klara` : ''}</span>
      </div>

      <div className={styles.inputWrapper}>
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Lägg till..." 
          className={styles.inputField} 
        />
        <button onClick={addTask} className={styles.addButton}><Plus size={16} /></button>
      </div>

      <div className={styles.list}>
        {tasks.length === 0 && <p className={styles.emptyText}>Inga uppgifter än.</p>}
        {tasks.map((task) => (
          <div key={task.id} onClick={() => toggleTask(task.id)} className={`${styles.item} ${task.completed ? styles.completedItem : ''}`}>
            {task.completed ? <CircleCheck size={20} color="#0ed3ac" /> : <Circle size={20} />}
            <span className={styles.itemText}>{task.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoWidget;