import { AuthGuard } from "@/components/auth/auth-guard";
import { TaskBoard } from "@/components/dashboard/task-board";
import { Header } from "@/components/layout/header";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <TaskBoard />
        </main>
      </div>
    </AuthGuard>
  );
}
