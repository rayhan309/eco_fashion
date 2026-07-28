import { createContext } from "react";
import type { AdminUserPublic } from "@/lib/validations/admin-user";

export type AuthContextValue = {
  user: AdminUserPublic | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ redirectTo: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
