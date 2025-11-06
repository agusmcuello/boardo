import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import styles from "./page.module.css";
import Logo from "@/components/ui/icons/Logo";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>
            <Logo width={20} height={40} />
            oardo
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
