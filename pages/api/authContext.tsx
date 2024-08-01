import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";

type User = {
  email: string;
  password: string;
};

export const AuthContext = createContext<any>({});
export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setCurrentUser(null);
    await signOut(auth);
    return;
  };

  useEffect(() => {
    const unsubsrcibe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubsrcibe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, setCurrentUser, login, logout, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
