"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { useQueryClient } from "@tanstack/react-query";

import Column from "./column";
import Card from "../ui/card";
import { TaskForm } from "./task-form";
import { Modal } from "../ui/modal";
import { TaskDetailsModal } from "./task-details-modal";
import styles from "./task-board.module.css";

export function TaskBoard() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useUserTasks(user?.id);
  const moveMutation = useMoveTask(user?.id);

  // ✅ local snapshot only during drag
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [initialListId, setInitialListId] = useState<number | null>(null);

  // ✅ fuente de verdad para render
  const effectiveTasks = localTasks ?? tasks;

  // ✅ cuando cambia el user, limpiar snapshot
  useEffect(() => {
    setLocalTasks(null);
  }, [user?.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // ✅ columnas memoizadas (evita recalcular y recrear arrays)
  const groups = useMemo(() => {
    const source = effectiveTasks;
    return {
      1: source
        .filter((t) => t.listId === 1)
        .slice()
        .sort((a, b) => a.position - b.position),
      2: source
        .filter((t) => t.listId === 2)
        .slice()
        .sort((a, b) => a.position - b.position),
      3: source
        .filter((t) => t.listId === 3)
        .slice()
        .sort((a, b) => a.position - b.position),
    };
  }, [effectiveTasks]);

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleCloseTask = () => {
    setSelectedTask(null);
    setIsDetailsOpen(false);
  };

  // ✅ snapshot cuando comienza el drag
  const handleDragStart = (event: any) => {
    const id = String(event.active.id);

    // Creamos snapshot de tasks
    setLocalTasks(tasks);

    // tarea activa
    const found = (localTasks ?? tasks).find((t) => t.id === id);
    if (found) setActiveTask(found);
  };

  // ✅ fin del drag
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      setLocalTasks(null);
      return;
    }

    const activeId = String(active.id);
    const overIdStr = String(over.id);

    let destListId = Number(over.data?.current?.listId);

    if (!destListId) {
      const match = overIdStr.match(/^column-(\d+)$/);
      if (match) destListId = Number(match[1]);
      else {
        const found = effectiveTasks.find((t) => t.id === overIdStr);
        if (found) destListId = found.listId;
      }
    }

    if (!destListId) {
      setActiveTask(null);
      setLocalTasks(null);
      return;
    }

    const source = localTasks ?? tasks;
    if (destListId !== 1 && destListId !== 2 && destListId !== 3) {
      setLocalTasks(null);
      setActiveTask(null);
      return;
    }

    const destArr = groups[destListId];
    const overIndex = destArr.findIndex((t: any) => t.id === overIdStr);
    const destIndex = overIndex === -1 ? destArr.length : overIndex;

    // ✅ optimistic UI local
    setLocalTasks((prev) =>
      (prev ?? tasks).map((t) =>
        t.id === activeId
          ? { ...t, listId: destListId, position: destIndex + 1 }
          : t
      )
    );

    // ✅ mutate backend
    moveMutation.mutate(
      { id: activeId, listId: destListId, position: destIndex + 1 },
      {
        onSettled: () => {
          // recargar tareas desde cache o API
          qc.invalidateQueries({ queryKey: ["userTasks", user?.id] });

          // volver a modo normal
          setLocalTasks(null);
          setActiveTask(null);
        },
      }
    );
  };

  // ✅ Si no hay tareas en cache y está cargando → mostrar loader
  if (isLoading && tasks.length === 0) {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => {
          setLocalTasks(null);
          setActiveTask(null);
        }}
      >
        <div className={styles.columns}>
          <Column
            listId={1}
            title="To Do"
            tasks={groups[1]}
            onOpen={handleOpenTask}
            onCreate={(listId) => {
              setInitialListId(listId);
              setIsTaskModalOpen(true);
            }}
          />
          <Column
            listId={2}
            title="In Progress"
            tasks={groups[2]}
            onOpen={handleOpenTask}
            onCreate={(listId) => {
              setInitialListId(listId);
              setIsTaskModalOpen(true);
            }}
          />
          <Column
            listId={3}
            title="Done"
            tasks={groups[3]}
            onOpen={handleOpenTask}
            onCreate={(listId) => {
              setInitialListId(listId);
              setIsTaskModalOpen(true);
            }}
          />
        </div>

        <DragOverlay style={{ zIndex: 9999, pointerEvents: "none" }}>
          {activeTask ? <Card task={activeTask} /> : null}
        </DragOverlay>

        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title="New Task"
        >
          <TaskForm
            onClose={() => setIsTaskModalOpen(false)}
            initialListId={initialListId ?? undefined}
          />
        </Modal>
      </DndContext>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsOpen}
        onClose={handleCloseTask}
      />
    </>
  );
}
