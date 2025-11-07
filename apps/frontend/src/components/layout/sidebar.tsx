// components/layout/Sidebar.tsx
"use client";
import React from "react";
import Link from "next/link";
import styles from "./sidebar.module.css";
import { useAuth } from "@/hooks/use-auth";
import Logo from "../ui/icons/Logo";

export default function Sidebar({}: {}) {
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.brand}>
        <h3 className={styles.title}>
          <Logo width={40} height={50} />{" "}
          <span className={styles.text}>oardo</span>
        </h3>
      </div>

      <nav className={styles.nav}>
        <Link href="/dashboard" className={styles.navItem}>
          <span className={styles.label}>Dashboard</span>
        </Link>

        <Link href="/dashboard" className={styles.navItem}>
          <span className={styles.label}>Boards</span>
        </Link>

        <Link href="/dashboard" className={styles.navItem}>
          <span className={styles.label}>My tasks</span>
        </Link>
      </nav>

      <div className={styles.bottom}>
        <div className={styles.user}>
          <div className={styles.avatar} aria-hidden>
            {user?.name ? user.name[0]?.toUpperCase() : "G"}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {user?.name ?? (user?.guest ? "Guest" : "Anonymous")}
            </div>
            <div className={styles.userEmail}>
              {user?.email ?? (user?.guest ? "guest@boardo" : "")}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.linkBtn} onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
