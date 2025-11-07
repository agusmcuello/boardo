// app/auth/register/page.tsx
"use client";
import BackButton from "@/components/ui/backButton";
import { RegisterForm } from "@/components/auth/register-form";
import styles from "./page.module.css";
import Logo from "@/components/ui/icons/Logo";
import Link from "next/link";

export default function RegisterPage() {
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
          <h2 className={styles.title}>Create an account</h2>
          <p className={styles.subtitle}>Join Boardo to manage your tasks</p>
        </div>

        <RegisterForm />

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/auth/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
