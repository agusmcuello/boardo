// src/components/dashboard/task-form.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateTask } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "../ui/input";
import styles from "./task-form.module.css";

export function TaskForm({
  onClose,
  initialListId,
}: {
  onClose: () => void;
  initialListId?: number;
}) {
  const { user } = useAuth();
  const createTask = useCreateTask(Number(user?.id));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [listId, setListId] = useState<number>(initialListId ?? 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    setIsLoading(true);
    try {
      await createTask.mutateAsync({
        listId,
        title,
        description,
        priority,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Error al crear la tarea");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Título de la tarea"
      />
      <label>
        Descripción
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Prioridad
        <select
          className={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
        >
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
        </select>
      </label>
      <label className={styles.label}>
        Status
        <select
          className={styles.select}
          value={listId}
          onChange={(e) => setListId(Number(e.target.value))}
        >
          <option value={1}>Pendientes</option>
          <option value={2}>En Progreso</option>
          <option value={3}>Completadas</option>
        </select>
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creando..." : "Crear tarea"}
        </Button>
      </div>
    </form>
  );
}
