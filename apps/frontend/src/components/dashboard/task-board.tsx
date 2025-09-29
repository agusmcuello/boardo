// components/dashboard/task-board.tsx
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { useUserTasks, useMoveTask } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import Column from "./column";
import styles from "./task-board.module.css";

export function TaskBoard() {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useUserTasks(user?.id);
  const moveMutation = useMoveTask();
  const sensors = useSensors(useSensor(PointerSensor));

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // groups como Record<number, Task[]>
  const groups: Record<number, Task[]> = {
    1: localTasks
      .filter((t) => t.listId === 1)
      .sort((a, b) => a.position - b.position),
    2: localTasks
      .filter((t) => t.listId === 2)
      .sort((a, b) => a.position - b.position),
    3: localTasks
      .filter((t) => t.listId === 3)
      .sort((a, b) => a.position - b.position),
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const sourceListId = Number(active.data?.current?.listId);

    let destListId: number = 0; // fallback seguro
    const overList = over.data?.current?.listId;
    if (typeof overList === "number") {
      destListId = overList;
    } else {
      const overIdStr = String(over.id);
      const match = overIdStr.match(/^column-(\d+)$/);
      if (match) {
        destListId = Number(match[1]);
      } else {
        const found = tasks.find((t) => t.id === overIdStr);
        if (found) destListId = found.listId;
      }
    }

    if (!destListId) return;

    const destArr = groups[destListId] ?? [];
    const overIndex = destArr.findIndex((t) => t.id === String(over.id));
    const destIndex = overIndex === -1 ? destArr.length : overIndex;

    setLocalTasks((prev: Task[]): Task[] => {
      return prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              listId: destListId, // ✅ ya es number, nunca null
              position: destIndex + 1, // ✅ number
            }
          : t
      );
    });

    // 🔥 then call mutation (backend)
    moveMutation.mutate({
      id: activeId,
      listId: destListId,
      position: destIndex + 1,
    });
  };

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Tareas</h1>
      </div>

      <div className={styles.columns}>
        <Column listId={1} title="Pendientes" tasks={groups[1]} />
        <Column listId={2} title="En Progreso" tasks={groups[2]} />
        <Column listId={3} title="Completadas" tasks={groups[3]} />
      </div>
    </DndContext>
  );
}
