// Här kan du senare byta ut till din riktiga URL, t.ex. från .env-fil
const API_URL = "http://localhost:5000/api/auth";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
  message?: string;
}

export const authService = {
  // Logga in användare
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Inloggningen misslyckades");
    }

    return response.json();
  },

  // Registrera ny användare
  register: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registreringen misslyckades");
    }

    return response.json();
  },

  // Spara token i localStorage
  saveToken: (token: string) => {
    localStorage.setItem("authToken", token);
  },

  // Hämta token
  getToken: () => {
    return localStorage.getItem("authToken");
  },

  // Logga ut
  logout: () => {
    localStorage.removeItem("authToken");
  }
};