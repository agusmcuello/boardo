"use client";

import Link from "next/link";
import styles from "./page.module.css";
import Logo from "@/components/ui/icons/Logo";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { loginGuest } = useAuth();

  const [showApp, setShowApp] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem("seen-home-loader");

    if (hasSeenLoader) {
      // ✅ Ya se mostró antes → entrar directo sin loader
      setShowApp(true);
      return;
    }

    // ✅ Primera vez → mostrar loader y luego marcarlo
    const t = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        sessionStorage.setItem("seen-home-loader", "true");
        setShowApp(true);
      }, 700); // coincide con fadeOut
    }, 900);

    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = panelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    // Rotaciones
    const rotateX = Math.max(-3, Math.min(3, ((y - midY) / midY) * -3));
    const rotateY = Math.max(-3, Math.min(3, ((x - midX) / midX) * 3));

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // --------------------------
    // ✅ SOMBRA DINÁMICA
    // --------------------------

    // Escalar rotaciones a rango usable para sombra
    const shadowX = rotateY * 6; // desplaza sombra en EJE X
    const shadowY = rotateX * 6; // desplaza sombra en EJE Y

    // Intensidad proporcional (opcional, estético)
    const blur = 20 + Math.abs(rotateX + rotateY) * 2;

    el.style.boxShadow = `${shadowX}px ${shadowY}px ${blur}px #87e0e8`;
  };

  const handleMouseLeave = () => {
    const el = panelRef.current;
    if (!el) return;

    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    el.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)"; // sombra base
  };

  if (!showApp) {
    return (
      <div
        className={`${styles.loader} ${fadeOut ? styles.loaderFadeOut : ""}`}
      >
        <svg className={styles.ring} viewBox="0 0 50 50">
          <circle className={styles.path} cx="25" cy="25" r="18" />
        </svg>
      </div>
    );
  }
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
          <Link className={styles.ctaSecondary} href="/auth/login">
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
