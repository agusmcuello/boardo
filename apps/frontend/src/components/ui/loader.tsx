// components/ui/Loader.tsx
"use client";
import styles from "./loader.module.css";

export default function Loader({ size = 40 }: { size?: number }) {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 10) }}
      role="status"
      aria-label="Loading"
    />
  );
}
