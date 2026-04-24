import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthUser = {
  email: string;
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

const AUTH_STORAGE_KEY = 'jaiman_auth_session_v1';

const AuthContext = createContext<AuthContextValue | null>(null);

function getEnvAdminCreds() {
  const email = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
  const password = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
  return { email, password };
}

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  try {
    if (!user) localStorage.removeItem(AUTH_STORAGE_KEY);
    else localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    setUser(readSession());
  }, []);

  const openSignIn = useCallback(() => setIsSignInOpen(true), []);
  const closeSignIn = useCallback(() => setIsSignInOpen(false), []);

  const openAdmin = useCallback(() => setIsAdminOpen(true), []);
  const closeAdmin = useCallback(() => setIsAdminOpen(false), []);

  const signIn: AuthContextValue['signIn'] = useCallback(async ({ email, password }) => {
    const env = getEnvAdminCreds();
    const expectedEmail = env.email ?? 'admin@jaimanco.com';
    const expectedPassword = env.password ?? 'admin123';

    // small delay to feel real and avoid instant brute force loops
    await new Promise((r) => setTimeout(r, 250));

    if (email.trim().toLowerCase() !== expectedEmail.trim().toLowerCase()) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    if (password !== expectedPassword) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const nextUser = { email: expectedEmail };
    setUser(nextUser);
    writeSession(nextUser);
    setIsSignInOpen(false);
    setIsAdminOpen(true);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    writeSession(null);
    setIsAdminOpen(false);
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

