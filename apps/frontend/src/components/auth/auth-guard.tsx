"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.push("/auth/login");
    }
  }, [isReady, user, router]);

  if (!isReady) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>Cargando...</div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
