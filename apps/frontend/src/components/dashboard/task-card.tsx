"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import Card from "../ui/card";

export default function TaskCardSortable({
  task,
  onOpen,
}: {
  task: Task;
  onOpen: (task: Task) => void;
}) {
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
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? "none" : "auto",
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} // 👈 sigue aplicando drag a toda la card
      onClick={() => {
        if (!isDragging) {
          onOpen(task);
        }
      }}
    >
      <Card task={task} />
    </div>
  );
}
