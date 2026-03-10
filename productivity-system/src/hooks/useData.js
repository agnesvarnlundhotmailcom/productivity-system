import { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

/**
 * Hook för att få åtkomst till DataContext.
 *
 * @returns {Object} DataContext-objektet som innehåller delad datatillstånd och funktioner.
 * @throws {Error} Kastas om hook:en används utanför en DataProvider.
 *
 * @example
 * function MyComponent() {
 *   const data = useData();
 *   return <div>{data.value}</div>;
 * }
 */
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData måste användas inom en DataProvider');
  }
  return context;
}