import Link from "next/link";
import Logo from "@/components/ui/icons/Logo";
import { RegisterForm } from "@/components/auth/register-form";
import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>
            <Logo width={20} height={40} />
            oardo
          </h1>
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>
            Join Boardo and start organizing your tasks.
          </p>
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
