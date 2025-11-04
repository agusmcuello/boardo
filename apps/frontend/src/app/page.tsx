import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>
          Bienvenido a{" "}
          <span
            style={{
              color: "var(--brand-600)",
            }}
          >
            Boardo
          </span>
        </h1>
        <p className="lead">
          Tu gestor de tareas personal — simple, rápido y agradable.
        </p>

        <div className={styles.ctas}>
          <Link className={styles.ctaPrimary} href="/auth/login">
            Iniciar Sesión
          </Link>
          <Link className={styles.ctaSecondary} href="/auth/register">
            Registrarse
          </Link>
        </div>

        <div className={styles.footer}>
          <small>Hecho con ❤️ · Basado en tu logo</small>
        </div>
      </main>
    </div>
  );
}
