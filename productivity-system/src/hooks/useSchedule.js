// src/hooks/useSchedule.js
import { useContext, useMemo } from 'react';
import { DataContext } from "../contexts/DataContext";

export function useSchedule(selectedDate) {
  const { data, setData } = useContext(DataContext);
  const dateKey = useMemo(() => new Date(selectedDate).toLocaleDateString('sv-SE'), [selectedDate]);
  
  const activities = data[dateKey]?.schedule ?? [];

  const getColorForCategory = (cat) => {
    switch(cat) {
      case 'Arbete': return '#39bef8';
      case 'Paus': return '#f49e0c';
      case 'Möte': return '#c093fc';
      case 'Personligt': return '#fb7185';
      default: return '#0ed3ac';
    }
  };

  const updateSchedule = (newList) => {
    // Sortera automatiskt på starttid
    const sortedList = [...newList].sort((a, b) => a.startTime.localeCompare(b.startTime));
    setData(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], schedule: sortedList }
    }));
  };

  const handleAdd = (newItem) => {
    const activity = {
      ...newItem,
      id: Date.now(),
      color: getColorForCategory(newItem.category),
      tasks: []
    };
    updateSchedule([...activities, activity]);
  };

  const handleDelete = (id) => updateSchedule(activities.filter(a => a.id !== id));

  const handleUpdate = (id, updatedFields) => {
    const newList = activities.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    updateSchedule(newList);
  };

  return { activities, handleAdd, handleDelete, handleUpdate, dateKey };
}