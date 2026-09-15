'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole, AuthSession } from '@eduverse/types';
import { login as apiLogin, logout as apiLogout, switchRole as apiSwitchRole, getAdminUsers } from '@eduverse/api';
import { createClientBrowser } from '@eduverse/api/src/supabase';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rolePath?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on mount
    const stored = typeof window !== 'undefined' ? localStorage.getItem('eduverse_session') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthSession;
        setSession(parsed);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem('eduverse_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, rolePath?: string) => {
    setIsLoading(true);
    try {
      // If logging into the admin or hod portal, use Supabase Auth
      if (rolePath === 'admin' || rolePath === 'hod') {
        const supabase = createClientBrowser();
        const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) return { success: false, error: error.message };
        
        // Fetch profile to make sure they match the requested role
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
        
        if (profile?.role !== rolePath) {
          await supabase.auth.signOut();
          return { success: false, error: `Unauthorized: ${rolePath.toUpperCase()} access required.` };
        }

        const authenticatedUser: User = {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          role: profile.role as UserRole,
          isActive: profile.status === 'active',
          createdAt: profile.created_at,
          mustChangePassword: profile.must_change_password,
        };

        const newSession = { user: authenticatedUser, token: authData.session.access_token, expiresAt: new Date(authData.session.expires_at! * 1000).toISOString() };
        setSession(newSession);
        setUser(authenticatedUser);
        localStorage.setItem('eduverse_session', JSON.stringify(newSession));
        return { success: true };
      }

      // For other roles, use the mock API
      const result = await apiLogin({ email, password });
      if (result.success) {
        setSession(result.data);
        setUser(result.data.user);
        localStorage.setItem('eduverse_session', JSON.stringify(result.data));
        return { success: true };
      }
      return { success: false, error: result.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const currentRole = user?.role || 'student';
    
    if (currentRole === 'admin' || currentRole === 'hod') {
      const supabase = createClientBrowser();
      await supabase.auth.signOut();
    } else {
      await apiLogout();
    }
    
    setSession(null);
    setUser(null);
    localStorage.removeItem('eduverse_session');
    router.push(`/${currentRole}/login`);
  }, [router, user]);

  const switchRole = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    try {
      const result = await apiSwitchRole(role);
      if (result.success) {
        setSession(result.data);
        setUser(result.data.user);
        localStorage.setItem('eduverse_session', JSON.stringify(result.data));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
