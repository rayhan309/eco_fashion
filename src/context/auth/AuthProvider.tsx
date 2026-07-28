"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/context/auth/AuthContext";
import { api } from "@/lib/axios";
import type { AdminUserPublic } from "@/lib/validations/admin-user";
import { z } from "zod";
import { adminUserPublicSchema } from "@/lib/validations/admin-user";

const meResponseSchema = z.object({
  user: adminUserPublicSchema.nullable(),
});

const loginResponseSchema = z.object({
  user: adminUserPublicSchema,
  redirectTo: z.string(),
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUserPublic | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      const parsed = meResponseSchema.safeParse(data);
      setUser(parsed.success ? parsed.data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    const parsed = loginResponseSchema.parse(data);
    setUser(parsed.user);
    return { redirectTo: parsed.redirectTo };
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext
      value={{
        user,
        loading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext>
  );
}
