import { RegisterForm } from "@/components/auth/register-form";
import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.header}>
          <h2 className={styles.title}>Crear Cuenta</h2>
          <p className={styles.subtitle}>
            Únete a Boardo para gestionar tus tareas
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
