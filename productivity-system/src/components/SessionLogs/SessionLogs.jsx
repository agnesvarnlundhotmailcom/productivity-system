import React from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Clock, Zap, Trash2, History, Calendar } from 'lucide-react';
import styles from './SessionLogs.module.css';

/**
 * Komponent som visar en historik över alla loggade arbetspass.
 * 
 * Visar en lista med alla sessioner sorterade från nyast till äldst.
 * Varje session innehåller:
 * - Datum och tid
 * - Fokusläge (Deep Work, Möte, Paus)
 * - Varaktighet
 * - Energinivå med emoji
 * - Möjlighet att radera sessionen
 * 
 * @component
 * @returns {React.ReactElement} En sida med sessionhistoriken
 * 
 * @example
 * <SessionLogs />
 */
export default function SessionLogs() {
  // Hämtar alla sparade sessioner och funktion för att radera en session
  const { sessions, removeSession } = useSession();

  /**
   * Konverterar energinivå (1-5) till motsvarande emoji.
   * 
   * @param {number} level - Energinivå från 1 till 5
   * @returns {string} Emoji-sträng som representerar energinivån
   * 
   * @example
   * getEnergyEmoji(5) // "🔥"
   * getEnergyEmoji(1) // "😴"
   */
  const getEnergyEmoji = (level) => {
    const emojis = { 1: "😴", 2: "😔", 3: "😐", 4: "😊", 5: "🔥" };
    return emojis[level] || "😐";
  };

  /**
   * Konverterar läge-ID till användarvänt namn.
   * 
   * @param {string} id - Läge-ID (deepWork, meeting, break)
   * @returns {string} Läge-namn på svenska
   * 
   * @example
   * getModeName('deepWork') // "Deep Work"
   * getModeName('break')    // "Paus"
   */
  const getModeName = (id) => {
    const names = { deepWork: 'Deep Work', meeting: 'Möte', break: 'Paus' };
    return names[id] || 'Arbetspass';
  };

  /**
   * Raderar en session efter användarbekräftelse.
   * 
   * Visar en bekräftelse-dialog innan sessionen raderas permanent.
   * 
   * @param {string|number} id - ID för sessionen som ska raderas
   */
  const handleDeleteLog = (id) => {
    if (window.confirm("Vill du radera detta pass?")) {
      removeSession(id);
    }
  };

  return (
    <div className={styles.fullPage}>

      {/* Visa tomt tillstånd eller sessionslista */}
      {!sessions || sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Inga loggade pass än. Kör igång timern!</p>
        </div>
      ) : (
        <div className={styles.logList}>
          {/* Visar sessioner från nyast till äldst */}
          {[...sessions].reverse().map((log) => (
            <div key={log.id} className={styles.logCard}>
              <div className={styles.logMain}>
                {/* Datum och tid */}
                <div className={styles.dateRow}>
                  <Calendar size={14} />
                  <span className={styles.date}>
                    {new Date(log.timestamp).toLocaleDateString('sv-SE')} kl {new Date(log.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {/* Fokusläge */}
                <h3 className={styles.activityTitle}>{getModeName(log.modeId)}</h3>
                
                {/* Varaktighet och energinivå */}
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <Clock size={16} color="#0ed3ac" />
                    <span>
                      {Math.floor(log.duration / 60)} min {log.duration % 60} sek
                    </span>
                  </div>
                  {log.energyLevel && (
                    <div className={styles.metaItem}>
                      <Zap size={16} color="#f49e0c" />
                      <span>Energi: {getEnergyEmoji(log.energyLevel)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Knapp för att radera sessionen */}
              <button 
                className={styles.deleteBtn} 
                onClick={() => handleDeleteLog(log.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}