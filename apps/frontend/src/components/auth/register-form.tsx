"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from "./login-form.module.css";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      // Aquí harías la llamada a tu API de registro
      console.log("Registering user:", { name, email, password });

      // Simulamos éxito y redirigimos
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      setError("Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>
          <Input
            label="Nombre completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Tu nombre completo"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
        </Button>
      </form>

      <div
        style={{
          textAlign: "center",
          marginTop: "24px",
          padding: "16px 0",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            style={{
              color: "#2563eb",
              fontWeight: "500",
            }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
