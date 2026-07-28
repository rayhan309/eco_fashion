import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextValue = {
  createUser: (email: string, password: string) => Promise<unknown>;
  signInUser: (email: string, password: string) => Promise<unknown>;
  signinWithGoggle: () => Promise<unknown>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (name: string, photo: string) => Promise<void>;
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
