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
        <div className={styles.leftContent}>
          <h3 className={styles.logo}>
            <Logo width={40} height={50} />{" "}
            <span className={styles.text}>oardo</span>
          </h3>
          <h5 className={styles.welcome}>
            Welcome,{" "}
            <span>{user?.name ?? (user?.guest ? "Guest" : "Anonymous")}</span>
          </h5>
        </div>

        <div className={styles.userSection}>
          {user?.guest && (
            <div className={styles.guest}>Guest • Local demo</div>
          )}
          <span className={styles.userEmail}>{user?.email}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
