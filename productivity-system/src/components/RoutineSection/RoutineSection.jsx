import React, { useState } from 'react';

// --- DEL 1: VERKTYGSLÅDAN ---
// Här hämtar vi färdiga små prylar (ikoner) så vi slipper rita dem själva.
import { 
  Plus, Trash2, Check, 
  Heart, Sparkles, FolderPlus, Dumbbell, BookOpen, 
  Briefcase, Coffee, Moon, Sun, Music, Gamepad2, Code, Zap
} from 'lucide-react';
import './RoutineSection.css';

const RoutineSection = () => {
  
  // --- DEL 2: APPSENS MINNESLAPPAR (State) ---
  // React glömmer allt varje sekund. useState är som post-it-lappar där vi skriver ner:
  // 1. Vad skriver användaren i textrutan just nu?
  const [newCategoryName, setNewCategoryName] = useState('');
  // 2. Vilken bild/ikon har användaren klickat på?
  const [selectedIconName, setSelectedIconName] = useState('default');
  // 3. Vilken färg har användaren valt för sin nya kategori?
  const [selectedColor, setSelectedColor] = useState('var(--accent-primary)');

  // --- DEL 3: VALMÖJLIGHETER (Data) ---
  // Istället för att bygga 10 knappar för hand, gör vi en lista på färger och ikoner.
  // Senare ber vi koden att "titta på listan och gör en knapp för varje sak i listan".
  const colorOptions = [
    { id: 'cyan',   value: 'var(--accent-primary)' }, 
    { id: 'orange', value: 'var(--accent-warning)' }, 
    { id: 'pink',   value: 'var(--accent-danger)' },  
    { id: 'purple', value: 'var(--accent-purple)' },               
    { id: 'blue',   value: 'var(--accent-blue)' },               
    { id: 'green',  value: 'var(--accent-green)' },               
    { id: 'yellow', value: 'var(--accent-yellow)' },               
  ];

  const iconOptions = [
    { name: 'default', component: <FolderPlus size={20} /> },
    { name: 'health',  component: <Heart size={20} /> },
    { name: 'clean',   component: <Sparkles size={20} /> },
    { name: 'gym',     component: <Dumbbell size={20} /> },
    { name: 'study',   component: <BookOpen size={20} /> },
    { name: 'work',    component: <Briefcase size={20} /> },
    { name: 'food',    component: <Coffee size={20} /> },
    { name: 'sleep',   component: <Moon size={20} /> },
    { name: 'energy',  component: <Zap size={20} /> },
    { name: 'music',   component: <Music size={20} /> },
    { name: 'game',    component: <Gamepad2 size={20} /> },
    { name: 'code',    component: <Code size={20} /> },
  ];

  // En liten assistent som hjälper oss att färglägga den valda ikonen.
  const getIconComponent = (name, color) => {
    const iconObj = iconOptions.find(i => i.name === name);
    return React.cloneElement(iconObj ? iconObj.component : <FolderPlus size={20}/>, { color });
  };

  // --- DEL 4: SPARADE LISTA (Huvudminnet) ---
  // Här bor alla kategorier. Det är en lista som innehåller objekt (kategorier).
  // Varje kategori har i sin tur en egen liten lista inuti sig som heter "routines".
  const [categories, setCategories] = useState([
    {
      id: 1,
      title: 'Hälsorutiner',
      iconName: 'health',
      color: 'var(--accent-danger)', 
      routines: [
        { id: 101, title: 'Drick 8 glas vatten', completed: false },
        { id: 102, title: '10 000 steg', completed: false },
      ]
    }
  ]);

  // --- DEL 5: VAD HÄNDER NÄR VI KLICKAR? (Funktioner) ---

  // Skapa en helt ny kategori (t.ex. "Gym")
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return; // Skapa inget om textrutan är tom

    const newCategory = {
      id: Date.now(), // Ge kategorin ett unikt ID baserat på klockslaget
      title: newCategoryName,
      iconName: selectedIconName,
      color: selectedColor, 
      routines: [] // Den börjar helt tom på uppgifter
    };

    // Här säger vi till React: "Ta den gamla listan, lägg till den nya saken sist, och rita om sidan!"
    setCategories([...categories, newCategory]); 
    setNewCategoryName(''); // Töm textrutan så man kan skriva något nytt
  };

  // Lägg till en liten uppgift (t.ex. "Bänkpress") inuti en kategori (t.ex. "Gym")
  const handleAddRoutineToCategory = (categoryId, routineText) => {
    if (routineText.trim() === '') return;
    const newRoutine = { id: Date.now(), title: routineText, completed: false };
    
    // Vi letar upp rätt kategori i listan och stoppar in den nya uppgiften där.
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, routines: [...cat.routines, newRoutine] } : cat
    ));
  };

  // Markera en uppgift som "klar" eller "ej klar"
  const toggleRoutine = (categoryId, routineId) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        // Om vi hittar rätt kategori, leta upp rätt uppgift inuti den och ändra status.
        const updatedRoutines = cat.routines.map(r => 
          r.id === routineId ? { ...r, completed: !r.completed } : r
        );
        return { ...cat, routines: updatedRoutines };
      }
      return cat;
    }));
  };

  // Ta bort en hel kategori
  const deleteCategory = (id) => {
    // Behåll allt i listan UTOM den vi vill kasta bort.
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // --- DEL 6: DET SOM SYNS PÅ SKÄRMEN (Utseendet) ---
  return (
    <div className="routine-section-container">
      
      {/* FORMULÄRET: Här skapar du nya kategorier */}
      <div className="creation-area">
        <input 
          className="creation-input"
          type="text" 
          placeholder="Vad ska rutinen heta?" 
          value={newCategoryName} // Visa vad som står på vår "minneslapp"
          onChange={(e) => setNewCategoryName(e.target.value)} // När man skriver, ändra minneslappen
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
        />

        <div className="options-row">
            <div className="icon-selector">
            <span className="label-text">Välj ikon:</span>
            <div className="scroll-wrapper">
                {/* Loopa igenom ikonalternativen och skapa en knapp för varje */}
                {iconOptions.map((opt) => (
                    <button 
                      key={opt.name}
                      className={`icon-choice-btn ${selectedIconName === opt.name ? 'active' : ''}`}
                      onClick={() => setSelectedIconName(opt.name)}
                      style={selectedIconName === opt.name ? { backgroundColor: selectedColor, borderColor: selectedColor } : {}}
                    >
                    {React.cloneElement(opt.component, { 
                        color: selectedIconName === opt.name ? '#0a0c16' : 'var(--text-secondary)' 
                    })}
                    </button>
                ))}
            </div>
            </div>

            <div className="color-selector">
                <span className="label-text">Välj färg:</span>
                <div className="color-grid">
                    {/* Loopa igenom färgerna och skapa en knapp för varje */}
                    {colorOptions.map((col) => (
                        <button
                            key={col.id}
                            className={`color-btn ${selectedColor === col.value ? 'active' : ''}`}
                            style={{ backgroundColor: col.value }}
                            onClick={() => setSelectedColor(col.value)}
                        />
                    ))}
                </div>
            </div>
        </div>

        <button 
            className="create-btn" 
            onClick={handleAddCategory}
            style={{ backgroundColor: newCategoryName ? selectedColor : 'var(--surface-3)', color: '#0a0c16' }}
            disabled={!newCategoryName}
        >
          <Plus size={20} />
          <span>Skapa Kategori</span>
        </button>
      </div>

      {/* RUTNÄTET: Här ritas alla dina sparade kategorier ut som kort */}
      <div className="grid">
        {categories.map((category) => (
          <div key={category.id} className="card" style={{ borderColor: 'var(--surface-3)' }}>
            
            <div className="card-header">
              <div className="header-left">
                <div className="icon-bg" style={{ color: category.color }}>
                    {getIconComponent(category.iconName, category.color)}
                </div>
                <h3>{category.title}</h3>
              </div>
              
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                 <span style={{fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600'}}>
                    {/* Räkna ut hur många som är klara just nu */}
                    {category.routines.filter(r => r.completed).length}/{category.routines.length}
                 </span>
                 <button className="delete-btn" onClick={() => deleteCategory(category.id)}>
                    <Trash2 size={16} />
                 </button>
              </div>
            </div>
            
            {/* PROGRESS BAR: Den färglada mätaren som fylls på */}
            <div className="progress-bar-bg">
              <div 
                className="progress-fill" 
                style={{ 
                  backgroundColor: category.color,
                  width: category.routines.length > 0 
                    ? `${(category.routines.filter(r => r.completed).length / category.routines.length) * 100}%` 
                    : '0%' 
                }}
              ></div>
            </div>

            {/* LISTAN: Alla små uppgifter inuti ett kort */}
            <ul className="task-list">
              {category.routines.map((item) => (
                <li key={item.id} className={`task-item ${item.completed ? 'completed' : ''}`}>
                  <div 
                    className="checkbox"
                    onClick={() => toggleRoutine(category.id, item.id)}
                    style={{
                        borderColor: item.completed ? category.color : 'var(--text-secondary)',
                        backgroundColor: item.completed ? category.color : 'transparent'
                    }}
                  >
                    {item.completed && <Check size={14} color="#0a0c16" strokeWidth={4} />}
                  </div>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>

            {/* SKRIVRUTA I KORTET: Lägg till nya uppgifter direkt i kategorin */}
            <div style={{marginTop: 'auto'}}>
                <input 
                    type="text"
                    placeholder="+ Lägg till uppgift..."
                    className="inner-card-input" 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddRoutineToCategory(category.id, e.target.value);
                            e.target.value = ''; 
                        }
                    }}
                />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineSection;