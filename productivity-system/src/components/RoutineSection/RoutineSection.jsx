import React, { useState } from 'react';
import { 
  Plus, Trash2, Check, 
  Heart, Sparkles, FolderPlus, Dumbbell, BookOpen, 
  Briefcase, Coffee, Moon, Sun, Music, Gamepad2, Code, Zap
} from 'lucide-react';
import './RoutineSection.css';

const RoutineSection = () => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('default');
  
  // Nytt state: Vilken färg är vald? (Default är din neon-färg)
  const [selectedColor, setSelectedColor] = useState('var(--accent-primary)');

  // Lista över färger att välja mellan
  const colorOptions = [
    { id: 'cyan',   value: 'var(--accent-primary)' }, // Din huvudfärg
    { id: 'orange', value: 'var(--accent-warning)' }, // Din varningsfärg
    { id: 'pink',   value: 'var(--accent-danger)' },  // Din röda/rosa
    { id: 'purple', value: 'var(--accent-purple)' },               // Lila
    { id: 'blue',   value: 'var(--accent-blue)' },               // Klarblå
    { id: 'green',  value: 'var(--accent-green)' },               // Grön
    { id: 'yellow', value: 'var(--accent-yellow)' },               // Gul
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

  const getIconComponent = (name, color) => {
    const iconObj = iconOptions.find(i => i.name === name);
    return React.cloneElement(iconObj ? iconObj.component : <FolderPlus size={20}/>, { color });
  };

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

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;

    const newCategory = {
      id: Date.now(),
      title: newCategoryName,
      iconName: selectedIconName,
      color: selectedColor, // Här sparas den valda färgen!
      routines: [] 
    };

    setCategories([...categories, newCategory]); 
    setNewCategoryName(''); 
    setSelectedIconName('default');
    setSelectedColor('var(--accent-primary)'); // Återställ till standardfärg
  };

  const handleAddRoutineToCategory = (categoryId, routineText) => {
    if (routineText.trim() === '') return;
    const newRoutine = { id: Date.now(), title: routineText, completed: false };
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, routines: [...cat.routines, newRoutine] } : cat
    ));
  };

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

  const deleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="routine-section-container">
      
      {/* --- SKAPA NY KATEGORI --- */}
      <div className="creation-area">
        
        {/* 1. TEXT INPUT */}
        <input 
          className="creation-input"
          type="text" 
          placeholder="Vad ska rutinen heta? (t.ex. Morgongym)..." 
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
        />

        <div className="options-row">
            {/* 2. IKONVÄLJARE */}
            <div className="icon-selector">
            <span className="label-text">Välj ikon:</span>
            <div className="scroll-wrapper">
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

            {/* 3. FÄRGVÄLJARE */}
            <div className="color-selector">
                <span className="label-text">Välj färg:</span>
                <div className="color-grid">
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

        {/* 4. SKAPA KNAPP */}
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

      {/* --- GRID MED KORT --- */}
      <div className="grid">
        {categories.map((category) => (
          <div key={category.id} className="card" style={{ borderColor: 'var(--surface-3)' }}>
            
            <div className="card-header">
              <div className="header-left">
                {/* Dynamisk ikon och färg */}
                <div className="icon-bg" style={{ color: category.color }}>
                    {getIconComponent(category.iconName, category.color)}
                </div>
                <h3>{category.title}</h3>
              </div>
              
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                 <span style={{fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600'}}>
                    {category.routines.filter(r => r.completed).length}/{category.routines.length}
                 </span>
                 <button className="delete-btn" onClick={() => deleteCategory(category.id)}>
                    <Trash2 size={16} />
                 </button>
              </div>
            </div>
            
            <div className="progress-bar-bg">
              <div 
                className="progress-fill" 
                style={{ 
                  backgroundColor: category.color,
                  boxShadow: `0 0 10px ${category.color}`, // Glow-effekt i vald färg
                  width: category.routines.length > 0 
                    ? `${(category.routines.filter(r => r.completed).length / category.routines.length) * 100}%` 
                    : '0%' 
                }}
              ></div>
            </div>

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