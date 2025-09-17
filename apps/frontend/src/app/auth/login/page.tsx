import { LoginForm } from "@/components/auth/login-form";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.header}>
          <h2 className={styles.title}>Iniciar Sesión</h2>
          <p className={styles.subtitle}>Accede a tu cuenta de Boardo</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
