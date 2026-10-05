"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { User } from "../types/user";

// ponytail: the signed-in user lives in localStorage until a real session exists from the backend
const STORAGE_KEY = "nook-user";
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// `undefined` on the server and during hydration, so consumers can wait for the real value.
function getServerSnapshot(): undefined {
  return undefined;
}

function writeUser(user: User | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable; the session just won't persist
  }
  listeners.forEach((l) => l());
}

type AuthContextValue = {
  user: User | null;
  /** False until the stored user has been read on the client. */
  isReady: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<AuthContextValue>(() => {
    let user: User | null = null;
    try {
      const parsed = raw ? (JSON.parse(raw) as Partial<User>) : null;
      // Ignore sessions saved before usernames existed.
      user = parsed?.username ? (parsed as User) : null;
    } catch {
      user = null;
    }
    return { user, isReady: raw !== undefined, signIn: writeUser, signOut: () => writeUser(null) };
  }, [raw]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
