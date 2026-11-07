import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../config/supabase';
import { authService } from '../services/authService';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Dev preview toggle (for inspecting role-specific UI before Supabase DB is connected)
  demoRole: UserRole | null;
  setDemoRole: (role: UserRole | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoRole, setDemoRole] = useState<UserRole | null>(null);

  const fetchProfile = async (userId: string) => {
    const userProfile = await authService.getProfile(userId);
    setProfile(userProfile);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setDemoRole(null);
    if (isSupabaseConfigured && supabase) {
      await authService.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // If user has set a demoRole for inspecting the dashboard locally without Supabase credentials
  const effectiveProfile: UserProfile | null = profile || (demoRole ? {
    id: 'demo-user-123',
    email: demoRole === 'farmer' ? 'wanjiku@shambalink.demo' : 'chef.amani@shambalink.demo',
    fullName: demoRole === 'farmer' ? 'Wanjiku Kamau (Demo Farmer)' : 'Amani Mworia (Demo Restaurant Buyer)',
    role: demoRole,
    county: demoRole === 'farmer' ? 'Murang\'a' : 'Nairobi',
    phone: '+254 712 345 678',
    organizationName: demoRole === 'farmer' ? 'Kamau Highlands Farm' : 'Amani Fine Dining',
    createdAt: new Date().toISOString(),
  } : null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: effectiveProfile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signOut,
        refreshProfile,
        demoRole,
        setDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
