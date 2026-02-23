// src/components/SessionLogs/SessionLogs.jsx
import React, { useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { Clock, Zap, Trash2, History } from 'lucide-react';
import styles from './SessionLogs.module.css';

export default function SessionLogs() {
  const { data, setData } = useContext(DataContext);
  const logs = data.energyLogs || [];

  const handleDeleteLog = (index) => {
    if (window.confirm("Vill du radera denna logg?")) {
      const updatedLogs = logs.filter((_, i) => i !== index);
      setData(prev => ({ ...prev, energyLogs: updatedLogs }));
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

      {logs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Inga loggade pass än. Kör igång ett pass för att fylla listan!</p>
        </div>
      ) : (
        <div className={styles.logList}>
          {logs.map((log, index) => (
            <div key={index} className={styles.logCard}>
              <div className={styles.logMain}>
                <span className={styles.date}>{log.date}</span>
                <h3 className={styles.activityTitle}>{log.activity || 'Slutfört pass'}</h3>
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <Clock size={16} color="#0ed3ac" />
                    <span>{log.duration} min</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Zap size={16} color="#f49e0c" />
                    <span>Energi: {log.energyLevel}/10</span>
                  </div>
                </div>
              </div>
              <button className={styles.deleteBtn} onClick={() => handleDeleteLog(index)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}