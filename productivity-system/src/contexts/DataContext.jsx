import { createContext } from 'react';

/**
 * Denna kontext håller i applikationens globala data.
 * Den delas ut till alla komponenter som behöver komma åt eller uppdatera information om t.ex. uppgifter (tasks) och inställningar.
 */
export const DataContext = createContext();