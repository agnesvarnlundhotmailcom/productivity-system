// src/hooks/useSchedule.js
import { useContext } from 'react';
import { DataContext } from "../contexts/DataContext";

/**
 * Hook för att hantera schemaaktiviteter för ett specifikt datum.
 *
 * @param {Date|string} valtDatum - Det valda datumet för schemat (konverteras till 'sv-SE' format).
 *
 * @returns {Object} Ett objekt med schemahanteringsfunktioner och data:
 * @returns {Array} activities - Lista över aktiviteter för det valda datumet.
 * @returns {Function} handleAdd - Funktion för att lägga till en ny aktivitet.
 * @returns {Function} handleDelete - Funktion för att ta bort en aktivitet (tar id som parameter).
 * @returns {Function} handleUpdate - Funktion för att uppdatera en aktivitet (tar id och ändringar som parametrar).
 * @returns {string} dateKey - Datumnyckeln i 'sv-SE' format.
 *
 * @example
 * function ScheduleComponent() {
 *   const { activities, handleAdd, handleDelete, handleUpdate } = useSchedule(new Date());
 *   return (
 *     <div>
 *       {activities.map(activity => (
 *         <div key={activity.id}>{activity.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useSchedule(valtDatum) {
  const { data, setData, updateScheduleItem } = useContext(DataContext);

  const datumNyckel = new Date(valtDatum).toLocaleDateString('sv-SE');
  const dagensAktiviteter = data[datumNyckel]?.schedule ?? [];

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
      color: färgKarta[info.category] || färgKarta.default,
      tasks: []
    };
    sparaSchema([...dagensAktiviteter, nyHändelse]);
  };

  const taBort = (id) => {
    const filtrerad = dagensAktiviteter.filter(h => h.id !== id);
    sparaSchema(filtrerad);
  };

  // Använder nu den centrala funktionen för att hålla koden ren
  const uppdatera = (id, ändringar) => {
    updateScheduleItem(datumNyckel, id, ändringar);
  };

  return {
    activities: dagensAktiviteter,
    handleAdd: läggTill,
    handleDelete: taBort,
    handleUpdate: uppdatera,
    dateKey: datumNyckel
  };
}