"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInWithGoogle: async () => null,
  signOut: async () => {},
});

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* Listen for auth state changes */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /* Create / update user doc in Firestore on sign-in */
  const upsertUserDoc = useCallback(async (u: User) => {
    try {
      const userRef = doc(db, "users", u.uid);
      await setDoc(
        userRef,
        {
          displayName: u.displayName ?? "",
          email: u.email ?? "",
          photoURL: u.photoURL ?? "",
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
      // Set createdAt only if it doesn't exist (merge keeps existing)
      await setDoc(
        userRef,
        { createdAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to upsert user doc:", err);
    }
  }, []);

  /* Google sign-in */
  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await upsertUserDoc(result.user);
      return result.user;
    } catch (err) {
      console.error("Google sign-in failed:", err);
      return null;
    }
  }, [upsertUserDoc]);

  /* Sign out */
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
