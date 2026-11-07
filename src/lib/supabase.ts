import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '../config/supabase';

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export const supabase = client;
