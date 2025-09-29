"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import styles from "./task-card.module.css";

export default function TaskCardSortable({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { listId: task.listId },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition,
    touchAction: "manipulation",
    opacity: isDragging ? 0 : 1, // 👈 ocultamos el original mientras se arrastra
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.taskCard}
    >
      <h4 className={styles.taskTitle}>{task.title}</h4>
      {task.description && (
        <p className={styles.taskDescription}>{task.description}</p>
      )}
      <div className={styles.priority}>{task.priority}</div>
    </div>
  );
}
