import React, { useState, useContext } from 'react';

import {
  Plus, Trash2, Check,
  Heart, Sparkles, FolderPlus, Dumbbell, BookOpen,
  Briefcase, Coffee, Moon, Sun, Music, Gamepad2, Code, Zap
} from 'lucide-react';
import './RoutineSection.css';
import { DataContext } from "../../context/DataContext";

const RoutineSection = () => {

  const { data, setData } = useContext(DataContext);
  const categories = data.routines;

  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('default');
  const [selectedColor, setSelectedColor] = useState('var(--accent-primary)');

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

  const getIconComponent = (name, color) => {
    const iconObj = iconOptions.find(i => i.name === name);
    return React.cloneElement(
      iconObj ? iconObj.component : <FolderPlus size={20} />,
      { color }
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;

    const newCategory = {
      id: Date.now(),
      title: newCategoryName,
      iconName: selectedIconName,
      color: selectedColor,
      routines: []
    };

    setData(prev => ({
      ...prev,
      routines: [...prev.routines, newCategory]
    }));

    setNewCategoryName('');
  };

  const handleAddRoutineToCategory = (categoryId, routineText) => {
    if (routineText.trim() === '') return;
    const newRoutine = { id: Date.now(), title: routineText, completed: false };

    setData(prev => ({
      ...prev,
      routines: prev.routines.map(cat =>
        cat.id === categoryId
          ? { ...cat, routines: [...cat.routines, newRoutine] }
          : cat
      )
    }));
  };

  const toggleRoutine = (categoryId, routineId) => {
    setData(prev => ({
      ...prev,
      routines: prev.routines.map(cat => {
        if (cat.id === categoryId) {
          const updatedRoutines = cat.routines.map(r =>
            r.id === routineId ? { ...r, completed: !r.completed } : r
          );
          return { ...cat, routines: updatedRoutines };
        }
        return cat;
      })
    }));
  };

  const deleteCategory = (id) => {
    setData(prev => ({
      ...prev,
      routines: prev.routines.filter(cat => cat.id !== id)
    }));
  };

  return (
    <div className="routine-section-container">

      <div className="creation-area">
        <input
          className="creation-input"
          type="text"
          placeholder="Vad ska rutinen heta?"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
        />

        <div className="options-row">
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
                  width: category.routines.length > 0
                    ? `${(category.routines.filter(r => r.completed).length / category.routines.length) * 100}%`
                    : '0%'
                }}
              />
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
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineSection;
