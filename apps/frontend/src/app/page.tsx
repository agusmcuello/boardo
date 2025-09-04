import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a Boardo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu gestor de tareas personal
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
