import { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData måste användas inom en DataProvider');
  }
  return context;
}