import React from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Clock, Zap, Trash2, History, Calendar } from 'lucide-react';
import styles from './SessionLogs.module.css';

export default function SessionLogs() {
  const { sessions, setSessions } = useSession();

  const handleDeleteLog = (id) => {
    if (window.confirm("Vill du radera denna logg?")) {
      setSessions(prev => prev.filter(session => session.id !== id));
    }
  };

  return (
    <div className={styles.fullPage}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <History size={32} color="#0ed3ac" />
          <h1>Historik</h1>
        </div>
      </header>

      {sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Inga loggade pass än. Kör igång ett pass för att fylla listan!</p>
        </div>
      ) : (
        <div className={styles.logList}>
          {/* Vi vänder på listan (.reverse) så de senaste passen hamnar överst */}
          {[...sessions].reverse().map((session) => (
            <div key={session.id} className={styles.logCard}>
              <div className={styles.logMain}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontSize: '0.9rem' }}>
                  <Calendar size={14} />
                  <span>{session.startTime.toLocaleDateString('sv-SE')}</span>
                </div>
                
                <h3 className={styles.activityTitle}>{session.activity || 'Slutfört pass'}</h3>
                
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <Clock size={16} color="#0ed3ac" />
                    <span>{session.focusDuration || 0} min</span>
                  </div>
                  {session.energyLevel && (
                    <div className={styles.metaItem}>
                      <Zap size={16} color="#f49e0c" />
                      <span>Energi: {session.energyLevel}/10</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                className={styles.deleteBtn} 
                onClick={() => handleDeleteLog(session.id)}
                title="Radera logg"
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