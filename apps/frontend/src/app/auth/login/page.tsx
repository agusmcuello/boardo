// app/auth/login/page.tsx
"use client";
import Link from "next/link";
import styles from "./page.module.css";
import Logo from "@/components/ui/icons/Logo";
import BackButton from "@/components/ui/backButton";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <BackButton href="/" />
        </div>

        <div className={styles.header}>
          <h1 className={styles.logo}>
            <Logo width={28} height={36} />
            <span>oardo</span>
          </h1>
          <h2 className={styles.title}>Sign in to your account</h2>
          <p className={styles.subtitle}>
            Welcome back! Please enter your details.
          </p>
        </div>

        <LoginForm />

        <p className={styles.footerText}>
          Don’t have an account?{" "}
          <Link href="/auth/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
