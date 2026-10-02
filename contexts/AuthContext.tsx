"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { USER_KEY } from "@/constants";
import { setUnauthorizedHandler, tokenStore } from "@/services/api";
import { isTokenExpired } from "@/utils/jwt";
import type { AuthResponse, SessionUser } from "@/types";

type AuthContextValue = {
  user: SessionUser | null;
  /** False during server render / hydration, before localStorage has been read. */
  ready: boolean;
  /** Store a session returned by login or signup. */
  signIn: (res: AuthResponse) => void;
  /** Update the cached profile after an edit. */
  setUser: (user: SessionUser) => void;
  /** Clear the session. With `redirect`, reload on the home page so nothing of the old session lingers. */
  signOut: (opts?: { redirect?: boolean }) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
  signIn: () => {},
  setUser: () => {},
  signOut: () => {},
});

// The session lives in localStorage; this tiny store lets React follow it
// (including changes made in another tab) without setState-in-effect.
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const readUserJson = (): string | null => {
  try {
    if (isTokenExpired(tokenStore.get())) return null;
    return localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
};

const writeUser = (user: SessionUser) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable */
  }
};

const clearSession = () => {
  tokenStore.clear();
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* storage unavailable */
  }
};

const noopSubscribe = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const userJson = useSyncExternalStore(subscribe, readUserJson, () => null);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const user = useMemo<SessionUser | null>(() => {
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as SessionUser;
    } catch {
      return null;
    }
  }, [userJson]);

  const signIn = useCallback((res: AuthResponse) => {
    tokenStore.set(res.accessToken);
    writeUser(res.user);
    emit();
  }, []);

  const setUser = useCallback((next: SessionUser) => {
    writeUser(next);
    emit();
  }, []);

  const signOut = useCallback((opts?: { redirect?: boolean }) => {
    clearSession();
    if (opts?.redirect) window.location.assign("/");
    else emit();
  }, []);

  // A 401 on an authenticated call means the token is no longer valid
  useEffect(() => {
    setUnauthorizedHandler(() => signOut());
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo(
    () => ({ user, ready, signIn, setUser, signOut }),
    [user, ready, signIn, setUser, signOut]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
