// components/dashboard/task-board.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Task } from "@/types/task";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { useUserTasks, useMoveTask } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import Column from "./column";
import Card from "../ui/card";
import { TaskForm } from "./task-form";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import styles from "./task-board.module.css";

export function TaskBoard() {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useUserTasks(user?.id);
  const moveMutation = useMoveTask();
  const sensors = useSensors(useSensor(PointerSensor));
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
    if (!over) {
      setActiveTask(null);
      return;
    }

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

    if (!destListId) {
      setActiveTask(null);
      return;
    }

    const destArr = groups[destListId] ?? [];
    const overIndex = destArr.findIndex((t) => t.id === String(over.id));
    const destIndex = overIndex === -1 ? destArr.length : overIndex;

    setLocalTasks((prev: Task[]): Task[] => {
      return prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              listId: destListId, // ✅ actualizado
              position: destIndex + 1,
            }
          : t
      );
    });

    // 🔥 actualización al backend
    moveMutation.mutate({
      id: activeId,
      listId: destListId,
      position: destIndex + 1,
    });

    // reset del overlay
    setActiveTask(null);
  };

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        const activeId = String(event.active.id);
        const found = localTasks.find((t) => t.id === activeId);
        if (found) setActiveTask(found);
      }}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Tareas</h1>
        <Button onClick={() => setIsTaskModalOpen(true)}>Nueva Tarea</Button>
      </div>

      <div className={styles.columns}>
        <Column listId={1} title="Pendientes" tasks={groups[1]} />
        <Column listId={2} title="En Progreso" tasks={groups[2]} />
        <Column listId={3} title="Completadas" tasks={groups[3]} />
      </div>

      {/* 🔥 DragOverlay para que el item siga al cursor */}
      <DragOverlay>
        {activeTask ? <Card task={activeTask} /> : null}
      </DragOverlay>
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Nueva Tarea"
      >
        <TaskForm onClose={() => setIsTaskModalOpen(false)} />
      </Modal>
    </DndContext>
  );
}
