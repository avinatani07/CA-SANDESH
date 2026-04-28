import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from './supabase';

type AuthUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  isSignInOpen: boolean;
  isAdminOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  signIn: (args: { email: string; password: string }) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readUser(): Promise<AuthUser | null> {
  try {
    if (!isSupabaseConfigured()) return null;
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    if (!user?.email) return null;
    const { data } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    return { id: user.id, email: user.email, isAdmin: Boolean(data?.user_id) };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    readUser().then((next) => {
      if (!isMounted) return;
      setUser(next);
    });

    if (!isSupabaseConfigured()) {
      return () => {
        isMounted = false;
      };
    }

    const { data } = supabase.auth.onAuthStateChange(() => {
      readUser().then((next) => {
        if (!isMounted) return;
        setUser(next);
      });
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const openSignIn = useCallback(() => setIsSignInOpen(true), []);
  const closeSignIn = useCallback(() => setIsSignInOpen(false), []);

  const openAdmin = useCallback(() => {
    if (!user) {
      setIsSignInOpen(true);
      return;
    }
    if (!user.isAdmin) {
      setIsSignInOpen(true);
      return;
    }
    setIsAdminOpen(true);
  }, [user]);
  const closeAdmin = useCallback(() => setIsAdminOpen(false), []);

  const signIn: AuthContextValue['signIn'] = useCallback(async ({ email, password }) => {
    if (!isSupabaseConfigured()) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const result = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (result.error) {
      return { ok: false, error: result.error.message || 'Invalid email or password.' };
    }

    const nextUser = await readUser();
    setUser(nextUser);
    setIsSignInOpen(false);
    setIsAdminOpen(Boolean(nextUser?.isAdmin));
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setIsAdminOpen(false);
      return;
    }
    supabase.auth.signOut().finally(() => {
      setUser(null);
      setIsAdminOpen(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isSignInOpen,
      isAdminOpen,
      openSignIn,
      closeSignIn,
      openAdmin,
      closeAdmin,
      signIn,
      signOut,
    }),
    [user, isSignInOpen, isAdminOpen, openSignIn, closeSignIn, openAdmin, closeAdmin, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
