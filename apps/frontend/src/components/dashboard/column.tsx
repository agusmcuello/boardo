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
}: {
  listId: number;
  title: string;
  tasks: Task[];
  onOpen: (task: Task) => void; // 👈 lo agregamos acá
}) {
  const { setNodeRef } = useDroppable({
    id: `column-${listId}`,
    data: { listId },
  });

  return (
    <div ref={setNodeRef} className={styles.column}>
      <h3>
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
    </div>
  );
}
