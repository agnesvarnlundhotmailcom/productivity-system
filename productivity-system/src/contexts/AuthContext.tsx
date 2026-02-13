import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService } from "../services/authService";

// Definiera hur vår data ser ut
interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Skapa själva contexten
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider-komponenten som omsluter hela appen
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Kontrollera om någon är inloggad direkt när appen startar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Kunde inte hämta användare", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setUser(data.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// En egen "hook" för att enkelt använda contexten i andra filer
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth måste användas inom en AuthProvider");
  return context;
};