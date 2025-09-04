"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTask } from "@/hooks/use-tasks";
import styles from "./task-modal.module.css";

interface TaskModalProps {
  onClose: () => void;
}

export function TaskModal({ onClose }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTask.mutateAsync({
        title,
        description,
        priority,
      });
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fields}>
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Título de la tarea"
        />

        <div className={styles.textareaContainer}>
          <label className={styles.label}>Descripción</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la tarea (opcional)"
            rows={4}
          />
        </div>

        <div className={styles.selectContainer}>
          <label className={styles.label}>Prioridad</label>
          <select
            className={styles.select}
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
            }
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={createTask.isPending}>
          {createTask.isPending ? "Creando..." : "Crear Tarea"}
        </Button>
      </div>
    </form>
  );
}
