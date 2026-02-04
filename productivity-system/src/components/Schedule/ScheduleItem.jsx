import React from 'react';
import styles from './Schedule.module.css';

const ScheduleItem = ({ time, title, category, color }) => {
  return (
    <div className={styles.card}>
      {/* Den färgade staven */}
      <div 
        className={styles.accentBar} 
        style={{ backgroundColor: color }} 
      ></div>
      
      <span className={styles.time}>{time}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.categoryTag}>{category}</span>
    </div>
  );
};

export default ScheduleItem;