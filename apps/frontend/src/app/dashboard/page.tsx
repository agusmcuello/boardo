// apps/frontend/src/app/dashboard/page.tsx
import { AuthGuard } from "@/components/auth/auth-guard";
import { TaskBoard } from "@/components/dashboard/task-board";
import { Header } from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className={styles.appLayout}>
        <Sidebar />
        <div className={styles.mainArea}>
          <Header />
          <main className={styles.content}>
            <TaskBoard />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
