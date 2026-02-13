import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gqhzvbxrbwspbjblvbje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaHp2YnhyYndzcGJqYmx2YmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTQzNDEsImV4cCI6MjA4NjU3MDM0MX0.OmxDmIv6Nl4HfxpAy3C8JLeGBJXQxVdOGUm_gZQ9f9U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AuthResponse {
  token: string | null;
  user: {
    id: string | undefined;
    email: string | undefined;
    username?: string; // Lagt till username här
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    return {
      token: data.session?.access_token || null,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        username: data.user?.user_metadata?.display_name, // Hämtar från metadata
      }
    };
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.user_metadata?.display_name,
    };
  },

  // UPPDATERAD: Tar nu emot username
  register: async (email: string, password: string, username: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username, // Sparar namnet i metadata
        },
      },
    });

    if (error) throw new Error(error.message);

    return {
      token: data.session?.access_token || null,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        username: data.user?.user_metadata?.display_name,
      }
    };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }
};