// components/dashboard/column.tsx
"use client";
import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCardSortable from "./task-card";
import { Task } from "@/types/task";
import styles from "./column.module.css";
import { useDroppable } from "@dnd-kit/core";

export default function Column({
  listId,
  title,
  tasks,
  onOpen,
  onCreate,
}: {
  listId: number;
  title: string;
  tasks: Task[];
  onOpen: (task: Task) => void; // 👈 lo agregamos acá
  onCreate?: (listId: number) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: `column-${listId}`,
    data: { listId },
  });

  return (
    <div ref={setNodeRef} className={styles.column}>
      <h3 className={styles.columnTitle}>
        {title} ({tasks.length})
      </h3>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCardSortable key={task.id} task={task} onOpen={onOpen} />
        ))}
      </SortableContext>
      {/** ✅ botón para crear tarea en esta columna */}
      {onCreate && (
        <button className={styles.addTaskBtn} onClick={() => onCreate(listId)}>
          + Add task
        </button>
      )}
    </div>
  );
}
