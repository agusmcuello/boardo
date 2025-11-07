// components/ui/BackButton.tsx
"use client";
import Link from "next/link";
import styles from "./back-button.module.css";

export default function BackButton({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className={styles.btn} aria-label="Go back">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          d="M15 18l-6-6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.label}>Back</span>
    </Link>
  );
}
