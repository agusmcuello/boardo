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
      setError("Title is required");
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
      setError(err?.message || "Error creating task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Task title"
      />
      <label className={styles.label}>
        Description
        <textarea
          className={styles.textarea}
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Priority
        <select
          className={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </label>
      <label className={styles.label}>
        Status
        <select
          className={styles.select}
          value={listId}
          onChange={(e) => setListId(Number(e.target.value))}
        >
          <option value={1}>To do</option>
          <option value={2}>In progress</option>
          <option value={3}>Done</option>
        </select>
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
