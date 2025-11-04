"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import styles from "./header.module.css";
import Logo from "@/components/ui/icons/Logo";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Logo width={40} />
        </div>

        <div className={styles.userSection}>
          <span className={styles.userEmail}>{user?.email}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
