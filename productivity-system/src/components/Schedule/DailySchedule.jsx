import { useState, useContext } from 'react';
import ScheduleItem from './ScheduleItem';
import styles from './Schedule.module.css';
import { Clock } from 'lucide-react'; 
import { DataContext } from "../../contexts/DataContext";

/**
 * En komponent som ritar upp dagens schema.
 * Den sköter allt från att visa listan till att skapa nya tidsblock.
 * * @component
 * @param {Object} props
 * @param {string|Date} props.selectedDate - Datumet som användaren har valt att titta på.
 */
export default function DailySchedule({ selectedDate }) {
  //Hämtar all sparad data från vår DataContext
  const { data, setData } = useContext(DataContext);
  
  // Skapar ett datum-objekt en gång för att använda i flera beräkningar
  const dateObj = new Date(selectedDate);
  // Skapar en söknyckel (t.ex. "2024-05-20" för att hitta rätt dag i databasen)
  const dateKey = dateObj.toLocaleDateString('sv-SE');

  // Hämtar aktiviteterna för den valda dagen. Om det inte finns några blir det en tom lista []
  const activities = data[dateKey]?.schedule ?? [];

  //States för att hålla koll på vad man skriver i "Lägg till"-formuläret"
  const [isAdding, setIsAdding] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState(""); 
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Arbete");

  // Skapar en snygg text för rubriken, t.ex. "måndag 20 maj"
  const displayDate = dateObj.toLocaleDateString('sv-SE', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  /**
   * Hittar rätt färgkod baserat på vilken kategori man valt.
   * * @param {string} cat - Namnet på kategorin (t.ex. 'Rast').
   * @returns {string} En färgkod i Hex-format
   */
  const getColorForCategory = (cat) => {
    const colors = {
      'Arbete': '#0ed3ac',
      'Rast': '#f49e0c',
      'Möte': '#39bef8',
      'Personligt': '#c083fc'
    };
    return colors[cat] || '#fb7185';
  };

  /**
   * Sparar ner den uppdaterade listan i vårt globala arkiv (DataContext).
   * * @param {Array} newList - Den nya listan med aktiviteter.
   */
  const updateGlobalData = (newList) => {
    setData(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], schedule: newList }
    }));
  };

  /**
   * Skapar ett helt nytt tidsblock och sparar det i listan.
   * Sorterar automatiskt så att den tidigaste händelsen hamnar först.
   */
  const handleAdd = () => {
    if (!startTime || !endTime || !newTitle) return; 

    const newItem = {
      id: Date.now(),
      startTime,
      endTime, 
      title: newTitle,
      category: newCategory,
      color: getColorForCategory(newCategory),
      tasks: [] 
    };

    const updatedList = [...activities, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime));

    updateGlobalData(updatedList);

    // Nollställ formuläret och stäng det
    setIsAdding(false);
    setStartTime("");
    setEndTime("");
    setNewTitle("");
  };

  /**
   * Tar bort ett block från listan baserat på dess ID.
   * * @param {number} id - Det unika ID:t för blocket som ska bort.
   */
  const handleDelete = (id) => {
    updateGlobalData(activities.filter(item => item.id !== id));
  };

  /**
   * Uppdaterar information i ett block som redan finns i listan.
   * * @param {number} id - ID:t på blocket vi vill ändra.
   * @param {Object} updateData - Den nya informationen som ska sparas.
   */
  const handleUpdate = (id, updatedData) => {
    const updatedList = activities.map(item =>
      item.id === id ? { ...item, ...updatedData } : item
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    updateGlobalData(updatedList);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Clock size={20} color="#0ed3ac" style={{ marginRight: '8px' }} />
          Schema - {displayDate}
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className={styles.addButton}>
          {isAdding ? '−' : '+'}
        </button>
      </div>

      {isAdding && (
        <div className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.timeInputGroup}>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={styles.input} title="Starttid" />
              <span>till</span>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.input} title="Sluttid" />
            </div>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={styles.select}>
              <option value="Arbete">Arbete</option>
              <option value="Rast">Rast</option>
              <option value="Möte">Möte</option>
              <option value="Personligt">Personligt</option>
            </select>
          </div>
          <input type="text" placeholder="Aktivitet..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className={styles.input} />
          <button onClick={handleAdd} className={styles.saveBtn}>Skapa block</button>
        </div>
      )}

      <div className={styles.list}>
        {activities.map((item) => (
          <ScheduleItem 
            key={item.id} 
            item={item} 
            onDelete={handleDelete} 
            onUpdate={handleUpdate}
            dateKey={dateKey}
          />
        ))}
      </div>
    </div>
  );
}