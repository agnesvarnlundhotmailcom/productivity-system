import { createClient } from '@supabase/supabase-js';

// BYT UT DESSA TVÅ MOT DINA EGNA NYCKLAR FRÅN SUPABASE
const SUPABASE_URL = 'https://gqhzvbxrbwspbjblvbje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaHp2YnhyYndzcGJqYmx2YmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTQzNDEsImV4cCI6MjA4NjU3MDM0MX0.OmxDmIv6Nl4HfxpAy3C8JLeGBJXQxVdOGUm_gZQ9f9U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AuthResponse {
  token: string | null;
  user: {
    id: string | undefined;
    username: string | undefined;
  };
}

export const authService = {
  // LOGGA IN
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw new Error(error.message);

    return {
      token: data.session?.access_token || null,
      user: {
        id: data.user?.id,
        username: data.user?.email,
      }
    };
  },

  // Hämta inloggad användare vid sidladdning
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      username: user.email
    };
  },

  // REGISTRERA
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) throw new Error(error.message);

    return {
      token: data.session?.access_token || null,
      user: {
        id: data.user?.id,
        username: data.user?.email,
      }
    };
  },

  // SPARA TOKEN (Valfritt, Supabase sköter mycket själv)
  saveToken: (token: string | null) => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  },

  // LOGGA UT
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    localStorage.removeItem("authToken");
  }
};