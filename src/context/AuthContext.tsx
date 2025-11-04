import React, { createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

interface AuthUser {
  name: string;
  email: string;
  photo: string;
  token: string;
}

export const AuthContext = createContext<{
  user: AuthUser | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}>({
  user: null,
  loginWithGoogle: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const formatUser = async (firebaseUser: User): Promise<AuthUser> => {
    const token = await firebaseUser.getIdToken();
    return {
      name: firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      photo: firebaseUser.photoURL || "",
      token,
    };
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const formatted = await formatUser(result.user);
    localStorage.setItem("Token", formatted.token);
    setUser(formatted);
  };

  const logout = () => {
    localStorage.removeItem("Token");
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const formatted = await formatUser(firebaseUser);
        setUser(formatted);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

