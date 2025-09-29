"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import styles from "./task-card.module.css";

export default function TaskCardSortable({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: { listId: task.listId }, // esto es clave para que active.data.current.listId exista
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition,
    touchAction: "manipulation",
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
      <p className="meta">Lista {task.description}</p>
    </div>
  );
}
