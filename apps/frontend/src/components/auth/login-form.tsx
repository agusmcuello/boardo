"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import styles from "./login-form.module.css";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError("Email o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>
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
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
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
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            style={{
              color: "#2563eb",
              fontWeight: "500",
            }}
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
