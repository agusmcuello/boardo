import Link from "next/link";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Bienvenido a Boardo</h1>
        <p>Tu gestor de tareas personal</p>
        <div className={styles.ctas}>
          <Button asChild>
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/register">Registrarse</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
