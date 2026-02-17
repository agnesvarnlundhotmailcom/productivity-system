// src/hooks/useSchedule.js
import { useContext } from 'react';
import { DataContext } from "../contexts/DataContext";

export function useSchedule(valtDatum) {
  const { data, setData } = useContext(DataContext);

  const datumNyckel = new Date(valtDatum).toLocaleDateString('sv-SE');
  const dagensAktiviteter = data[datumNyckel]?.schedule ?? [];

  // Enkel lista för att hitta rätt färg baserat på kategori
  const färgKarta = {
    'Arbete': '#39bef8',
    'Paus': '#f49e0c',
    'Möte': '#c093fc',
    'Personligt': '#fb7185',
    'default': '#0ed3ac'
  };

  const sparaSchema = (nyLista) => {
    const sorterad = [...nyLista].sort((a, b) => a.startTime.localeCompare(b.startTime));
    setData(prev => ({
      ...prev,
      [datumNyckel]: { ...prev[datumNyckel], schedule: sorterad }
    }));
  };

  const läggTill = (info) => {
    const nyHändelse = {
      ...info,
      id: Date.now(),
      // Hämtar färg från listan ovanför, eller väljer 'default' om kategorin inte finns
      color: färgKarta[info.category] || färgKarta.default,
      tasks: []
    };
    sparaSchema([...dagensAktiviteter, nyHändelse]);
  };

  const taBort = (id) => {
    const filtrerad = dagensAktiviteter.filter(h => h.id !== id);
    sparaSchema(filtrerad);
  };

  const uppdatera = (id, ändringar) => {
    const uppdaterad = dagensAktiviteter.map(h => 
      h.id === id ? { ...h, ...ändringar } : h
    );
    sparaSchema(uppdaterad);
  };

  return { 
    activities: dagensAktiviteter, 
    handleAdd: läggTill, 
    handleDelete: taBort, 
    handleUpdate: uppdatera, 
    dateKey: datumNyckel 
  };
}