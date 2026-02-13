import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { DataProvider } from "./contexts/DataProvider";
import { AuthProvider } from "./context/AuthContext"; // 1. Importera AuthProvider
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 2. Lägg till AuthProvider här */}
        <ThemeProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);