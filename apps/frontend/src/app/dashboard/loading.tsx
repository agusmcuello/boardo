import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loader}>
      <svg className={styles.ring} viewBox="0 0 50 50">
        <circle className={styles.path} cx="25" cy="25" r="18" />
      </svg>
    </div>
  );
}
