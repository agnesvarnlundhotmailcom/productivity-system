import React, { useState, useContext } from 'react';
import { ListTodo, CircleCheck, Circle, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { DataContext } from "../../contexts/DataContext";
import styles from './TodoWidget.module.css';

/**
 * En widget för att hantera att-göra-listor kopplade till specifika datum.
 * Tillåter användaren att lägga till, markera som klar, redigera och radera uppgifter.
 * @component
 * @param {Object} props
 * @param {Date|string} props.selectedDate - Det valda datumet från kalendern.
 */
const TodoWidget = ({ selectedDate }) => {
  // Hämtar global data och funktionen för att uppdatera den
  const { data, setData } = useContext(DataContext);

  // Skapar en unik datumnyckel för att hitta rätt dag i databasen
  const dateKey = new Date(selectedDate).toLocaleDateString('sv-SE');

  // Hämtar listan med uppgifter för det valda datumet, annars en tom lista []
  const tasks = data[dateKey]?.tasks ?? [];

  // State för att hantera inmatning och redigering lokalt i komponenten
  const [inputValue, setInputValue] = useState(""); // Ny uppgift
  const [editingId, setEditingId] = useState(null); // Vilket ID som redigeras just nu
  const [editText, setEditText] = useState(""); // Texten i redigeringsfältet

  /**
   * Uppdaterar listan med uppfiter i den globala DataContext för det valda datumet.
   * @param {Array<Object} newTasks - Den nya listan med task-objekt.
   */
  const updateTasks = (newTasks) => {
    setData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        tasks: newTasks
      }
    }));
  };

  /**
   * Skapar en ny uppgift och lägger till den i listan.
   */
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

  /**
   * Växlar status på en uppgift mellan klar och inte klar.
   * @param {number} id - ID på uppgiften som ska ändras.
   */
  const toggleTask = (id) => {
    updateTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  /**
   * Tar bort en uppgift från listan.
   * @param {Event} e - Klick-event (används för att stoppa bubbling).
   * @param {number} id - ID på uppgiften som ska raderas.
   */
  const deleteTask = (e, id) => {
    e.stopPropagation();
    updateTasks(tasks.filter(t => t.id !== id));
  };

  /**
   * Aktiverar redigeringsläget för en specifik uppgift.
   * @param {Event} e -Klick-event.
   * @param {Object} task - Uppgiften som ska redigeras.
   */
  const startEdit = (e, task) => {
    e.stopPropagation();
    setEditingId(task.id);
    setEditText(task.text);
  };

  /**
   * Avbryter redigeringsläget utan att spara ändringar.
   * @param {Event} e - Klick-event
   */
  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  /**
   * Sparar den redigerade texten till den globala datan och stänger redigeringsläget.
   * @param {Event} e - Klick-event.
   */
  const saveEdit = (e) => {
    e.stopPropagation();
    updateTasks(tasks.map(t =>
      t.id === editingId ? { ...t, text: editText } : t
    ));
    setEditingId(null);
  };

  // Räknar ut hur många uppgifter som är markerade som klara
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