import React, { useState } from 'react';

// [VECKA 2: Komponenter & Bibliotek]
// Här hämtar vi färdiga "byggstenar" (ikoner) från ett externt bibliotek.
// Istället för att rita egna bilder använder vi färdiga komponenter.
// Det är detta som menas med "Komponentbaserad utveckling" – vi bygger med klossar.
import { 
  Plus, Trash2, Check, 
  Heart, Sparkles, FolderPlus, Dumbbell, BookOpen, 
  Briefcase, Coffee, Moon, Sun, Music, Gamepad2, Code, Zap
} from 'lucide-react';
import './RoutineSection.css';

const RoutineSection = () => {
  
  // [VECKA 3: State (Minne)]
  // React-komponenter har inget minne av sig själva. När de ritas om glömmer de allt.
  // `useState` är Reacts sätt att ge komponenten ett minne.
  // newCategoryName = Värdet just nu (t.ex. "Gym").
  // setNewCategoryName = Verktyget vi använder för att ändra värdet.
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('default');
  
  // [VECKA 3: Interaktivitet]
  // Vi sparar vilken färg användaren har klickat på i minnet (state).
  // När detta ändras kommer React automatiskt att uppdatera (rita om) de delar av sidan som använder färgen.
  const [selectedColor, setSelectedColor] = useState('var(--accent-primary)');

  // [VECKA 2: Datastrukturer]
  // Istället för att hårdkoda varje färgknapp i HTML:en, gör vi en lista (array) med data.
  // Senare kommer vi loopa igenom denna lista för att skapa knapparna.
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

  // [VECKA 2: Props & Återanvändning]
  // En hjälpfunktion (som en fabrik).
  // Du skickar in ett namn och en färg (argument), och den spottar ut en färdig ikon-komponent.
  // `React.cloneElement` är lite överkurs, men det används här för att tvinga ikonen att byta färg.
  const getIconComponent = (name, color) => {
    const iconObj = iconOptions.find(i => i.name === name);
    return React.cloneElement(iconObj ? iconObj.component : <FolderPlus size={20}/>, { color });
  };

  // [VECKA 3 & 4: Komplex State]
  // Här har vi appens huvuddata. Det är en lista (Array) som innehåller objekt.
  // Varje objekt (Kategori) har i sin tur en lista inuti sig (Routines).
  // Att kunna hantera "listor inuti listor" är en viktig kunskap för Vecka 3 och 4.
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
    },
    {
      id: 2,
      title: 'Städrutiner',
      iconName: 'clean',
      color: 'var(--accent-warning)',
      routines: [
        { id: 201, title: 'Bädda sängen', completed: false },
        { id: 202, title: 'Diska', completed: false },
      ]
    }
  ]);

  // [VECKA 3: Immutability (Att inte ändra direkt)]
  // I React får man aldrig ändra original-listan direkt (t.ex. categories.push()).
  // Istället måste man skapa en KOPIA av listan och lägga till det nya objektet i kopian.
  // `[...categories, newCategory]` betyder: "Ta allt som fanns i categories, och lägg till newCategory på slutet".
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return; // Gör inget om textrutan är tom

    const newCategory = {
      id: Date.now(), // Skapar ett unikt ID baserat på klockan
      title: newCategoryName,
      iconName: selectedIconName,
      color: selectedColor, 
      routines: [] 
    };

    setCategories([...categories, newCategory]); // Uppdatera minnet med den nya listan
    setNewCategoryName(''); // Töm textrutan
    setSelectedIconName('default'); // Återställ ikonen
    setSelectedColor('var(--accent-primary)'); // Återställ färgen
  };

  // [VECKA 3: Uppdatera nästlad data]
  // Detta är lite klurigt! Vi ska lägga till en rutin i EN specifik kategori.
  // Vi använder `.map` för att gå igenom alla kategorier.
  // Om id matchar: Skapa en kopia av kategorin men med den nya rutinen tillagd.
  // Om id INTE matchar: Låt kategorin vara som den är.
  const handleAddRoutineToCategory = (categoryId, routineText) => {
    if (routineText.trim() === '') return;
    const newRoutine = { id: Date.now(), title: routineText, completed: false };
    
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, routines: [...cat.routines, newRoutine] } : cat
    ));
  };

  // [VECKA 3: Toggling]
  // Samma logik här. Vi måste hitta rätt kategori OCH rätt rutin inuti den kategorin
  // för att ändra `completed` från false till true (eller tvärtom).
  const toggleRoutine = (categoryId, routineId) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedRoutines = cat.routines.map(r => 
          r.id === routineId ? { ...r, completed: !r.completed } : r
        );
        return { ...cat, routines: updatedRoutines };
      }
      return cat;
    }));
  };

  // [VECKA 3: Filtrering]
  // För att ta bort något använder vi `.filter`.
  // Det betyder: "Behåll alla kategorier vars ID INTE är det vi vill ta bort".
  const deleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="routine-section-container">
      
      {/* --- SKAPA-DELEN --- */}
      <div className="creation-area">
        
        {/* [VECKA 3: Controlled Input] 
            React kontrollerar vad som står i rutan.
            value={newCategoryName} -> Det är Reacts minne som bestämmer vad som syns.
            onChange -> Varje gång du trycker på en tangent, uppdaterar vi Reacts minne. */}
        <input 
          className="creation-input"
          type="text" 
          placeholder="Vad ska rutinen heta? (t.ex. Morgongym)..." 
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          aria-label="Namn på ny rutin" // För skärmläsare
        />

        <div className="options-row">
            <div className="icon-selector">
            <span className="label-text">Välj ikon:</span>
            <div className="scroll-wrapper">
                {/* [VECKA 2: Rendering med .map] 
                    Här tar vi vår lista med ikoner (iconOptions) och gör om varje objekt till en <button>.
                    key={opt.name} behövs för att React ska kunna hålla reda på vilken knapp som är vilken. */}
                {iconOptions.map((opt) => (
                    <button 
                    key={opt.name}
                    // Vi kollar: Är just denna ikon vald? I så fall får den klassen 'active'.
                    className={`icon-choice-btn ${selectedIconName === opt.name ? 'active' : ''}`}
                    onClick={() => setSelectedIconName(opt.name)}
                    // Dynamisk stil: Om den är vald, ge den färgen vi valt.
                    style={selectedIconName === opt.name ? { backgroundColor: selectedColor, borderColor: selectedColor } : {}}
                    // FIX: Beskrivning för skärmläsare (Accessibility)
                    aria-label={`Välj ikon: ${opt.name}`}
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
                    {colorOptions.map((col) => (
                        <button
                            key={col.id}
                            className={`color-btn ${selectedColor === col.value ? 'active' : ''}`}
                            style={{ backgroundColor: col.value }}
                            onClick={() => setSelectedColor(col.value)}
                            // FIX: Beskrivning för skärmläsare
                            aria-label={`Välj färg: ${col.id}`}
                        />
                    ))}
                </div>
            </div>
        </div>

        <button 
            className="create-btn" 
            onClick={handleAddCategory}
            style={{ backgroundColor: newCategoryName ? selectedColor : 'var(--surface-3)', color: '#0a0c16' }}
            // Knappen är inaktiverad (grå) om man inte skrivit något namn än.
            disabled={!newCategoryName}
        >
          <Plus size={20} />
          <span>Skapa Kategori</span>
        </button>
      </div>

      {/* --- GRID (KORTEN) --- */}
      <div className="grid">
        {/* Här ritar vi ut alla kategorier som finns i 'categories'-listan */}
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
                    {/* [VECKA 3: Beräkning i realtid]
                        Här räknar vi hur många rutiner som är klara (completed === true)
                        och visar det, t.ex. "2/5". */}
                    {category.routines.filter(r => r.completed).length}/{category.routines.length}
                 </span>
                 <button 
                    className="delete-btn" 
                    onClick={() => deleteCategory(category.id)}
                    // FIX: Accessibility för papperskorgen
                    aria-label={`Ta bort kategori ${category.title}`}
                 >
                    <Trash2 size={16} />
                 </button>
              </div>
            </div>
            
            {/* Progress bar (Mätaren som fylls på) */}
            <div className="progress-bar-bg">
              <div 
                className="progress-fill" 
                style={{ 
                  backgroundColor: category.color,
                  boxShadow: `0 0 10px ${category.color}`, 
                  // Matte-formel för att räkna ut hur bred mätaren ska vara i procent (%)
                  width: category.routines.length > 0 
                    ? `${(category.routines.filter(r => r.completed).length / category.routines.length) * 100}%` 
                    : '0%' 
                }}
              ></div>
            </div>

            <ul className="task-list">
              {/* Här loopar vi igenom rutinerna INUTI varje kategori */}
              {category.routines.map((item) => (
                <li key={item.id} className={`task-item ${item.completed ? 'completed' : ''}`}>
                  <div 
                    className="checkbox"
                    onClick={() => toggleRoutine(category.id, item.id)}
                    style={{
                        borderColor: item.completed ? category.color : 'var(--text-secondary)',
                        backgroundColor: item.completed ? category.color : 'transparent'
                    }}
                    role="checkbox"
                    aria-checked={item.completed}
                    tabIndex={0}
                    aria-label={`Markera ${item.title} som klar`}
                  >
                    {/* Visa bocken bara om uppgiften är klar */}
                    {item.completed && <Check size={14} color="#0a0c16" strokeWidth={4} />}
                  </div>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>

            <div style={{marginTop: 'auto'}}>
                <input 
                    type="text"
                    placeholder="+ Lägg till uppgift..."
                    className="inner-card-input" 
                    aria-label="Lägg till ny uppgift"
                    // Lägg till rutin när man trycker Enter
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddRoutineToCategory(category.id, e.target.value);
                            e.target.value = ''; // Töm rutan manuellt (okontrollerad input här för enkelhets skull)
                        }
                    }}
                    // Gör input-rutan snygg (färgad ram) när man klickar i den
                    onFocus={(e) => {
                        e.target.style.borderColor = category.color;
                        e.target.style.boxShadow = `0 0 0 1px ${category.color}`;
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--surface-3)';
                        e.target.style.boxShadow = 'none';
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