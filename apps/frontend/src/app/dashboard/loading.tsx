import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.text}>Cargando dashboard…</p>
      </div>
    </div>
  );
}
