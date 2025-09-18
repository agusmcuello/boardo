"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: any }>("auth/login", {
      email,
      password,
    });

    api.setToken(res.token);
    setUser(res.user);
    router.push("/dashboard");
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("auth/register", { name, email, password });
    // después de registrarse lo llevamos al login
    router.push("/auth/login");
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  return { user, login, register, logout };
}
