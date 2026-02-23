import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { DataProvider } from "./contexts/DataProvider";
import { SessionProvider } from "./contexts/SessionContext"; 
import { FocusModeProvider } from "./contexts/FocusModeContext"; 
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <SessionProvider>
          <FocusModeProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </FocusModeProvider>
        </SessionProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);