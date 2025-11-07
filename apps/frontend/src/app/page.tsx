"use client";

import Link from "next/link";
import styles from "./page.module.css";
import Logo from "@/components/ui/icons/Logo";
import { useRef } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { loginGuest } = useAuth();

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = panelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // posición dentro del panel
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    // rotaciones
    const rotateX = Math.max(-3, Math.min(3, ((y - midY) / midY) * -3));
    const rotateY = Math.max(-3, Math.min(3, ((x - midX) / midX) * 3));
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const el = panelRef.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  };
  return (
    <div className={styles.page}>
      <main
        ref={panelRef}
        className={styles.main}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <h1 className={styles.logo}>
          <Logo width={40} height={50} />
          oardo
        </h1>
        <p className={styles.lead}>
          Your personal task manager. Simple, fast and enjoyable.
        </p>

        <div className={styles.ctas}>
          <Link className={styles.ctaPrimary} href="/auth/login">
            Login
          </Link>
          <Link className={styles.ctaSecondary} href="/auth/register">
            Sign up
          </Link>
        </div>

        <div className={styles.footer}>
          <small>Or</small> <br />
          <Link
            className={styles.ctaSecondary}
            href="/dashboard"
            onClick={loginGuest}
          >
            Enter as Guest
          </Link>
        </div>
      </main>
    </div>
  );
}
