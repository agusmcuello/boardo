"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import styles from "./auth-guard.module.css";

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
      <div className={styles.loader}>
        <svg className={styles.ring} viewBox="0 0 50 50">
          <circle className={styles.path} cx="25" cy="25" r="18" />
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
