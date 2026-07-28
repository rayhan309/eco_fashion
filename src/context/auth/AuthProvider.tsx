import React, { useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/firebase/firebase.init";
import { AuthContext } from "./AuthContext";


const goggleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const createUser = (email: string, password: string) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => signOut(auth);

  const signinWithGoggle = () => {
    setLoading(true);
    return signInWithPopup(auth, goggleProvider);
  };

  const resetPassword = (email: string) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const updateUser = (name: string, photo: string) => {
    setLoading(true);
    return updateProfile(auth.currentUser!, {
      displayName: name,
      photoURL: photo,
    });
  };

  // curren user
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  // all auth info
  const authInfo = {
    createUser,
    signInUser,
    signinWithGoggle,
    signOutUser,
    resetPassword,
    updateUser,
    user,
    loading,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;