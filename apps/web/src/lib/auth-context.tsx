'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole, AuthSession } from '@eduverse/types';
import { login as apiLogin, logout as apiLogout, switchRole as apiSwitchRole } from '@eduverse/api';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
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
    await apiLogout();
    setSession(null);
    setUser(null);
    localStorage.removeItem('eduverse_session');
  }, []);

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
