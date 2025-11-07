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
import { TaskDetailsModal } from "./task-details-modal";
import styles from "./task-board.module.css";

export function TaskBoard() {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useUserTasks(user?.id);
  const moveMutation = useMoveTask(user?.id);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [initialListId, setInitialListId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleCloseTask = () => {
    setSelectedTask(null);
    setIsDetailsOpen(false);
  };

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
    const overIdStr = String(over.id);

    let destListId = Number(over.data?.current?.listId);
    if (!destListId) {
      const match = overIdStr.match(/^column-(\d+)$/);
      if (match) destListId = Number(match[1]);
      else {
        const found = tasks.find((t) => t.id === overIdStr);
        if (found) destListId = found.listId;
      }
    }

    if (!destListId) return;

    const destArr = groups[destListId] ?? [];
    const overIndex = destArr.findIndex((t) => t.id === overIdStr);
    const destIndex = overIndex === -1 ? destArr.length : overIndex;

    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, listId: destListId, position: destIndex + 1 }
          : t
      )
    );

    moveMutation.mutate({
      id: activeId,
      listId: destListId,
      position: destIndex + 1,
    });

    setActiveTask(null);
  };

  if (isLoading) return <div className={styles.loading}>Loading tasks...</div>;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => {
          const id = String(event.active.id);
          const found = localTasks.find((t) => t.id === id);
          if (found) setActiveTask(found);
        }}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveTask(null)}
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
