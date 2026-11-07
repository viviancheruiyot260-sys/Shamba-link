import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../config/supabase';
import { UserProfile, UserRole } from '../types';

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  county?: string;
  organizationName?: string;
}

export const authService = {
  async signUp({ email, password, fullName, role, phone, county, organizationName }: SignUpParams) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        user: null,
        error: 'Supabase authentication is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            phone,
            county,
            organization_name: organizationName,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      // If user profile table exists, ensure profile record is written
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          phone,
          county,
          organization_name: organizationName,
          created_at: new Date().toISOString(),
        });
        if (profileError) {
          console.warn('Profile creation sync note:', profileError.message);
        }
      }

      return { user: data.user, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      return { user: null, error: message };
    }
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        user: null,
        error: 'Supabase authentication is not configured. Please configure your Supabase credentials in .env.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return { user: null, error: message };
    }
  },

  async signOut() {
    if (!isSupabaseConfigured || !supabase) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign out error';
      return { error: message };
    }
  },

  async resetPassword(email: string) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase is not configured. Add credentials in .env to enable real password recovery.',
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset request failed';
      return { success: false, error: message };
    }
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        role: data.role as UserRole,
        phone: data.phone,
        county: data.county,
        subCounty: data.sub_county,
        farmName: data.farm_name,
        organizationName: data.organization_name,
        createdAt: data.created_at,
      };
    } catch {
      return null;
    }
  },
};
