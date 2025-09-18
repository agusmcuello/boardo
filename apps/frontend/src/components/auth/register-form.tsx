"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import styles from "./register-form.module.css";

export function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}
