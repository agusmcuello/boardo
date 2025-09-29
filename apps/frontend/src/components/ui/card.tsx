"use client";
import React from "react";
import { Task } from "@/types/task";
import styles from "./card.module.css";

function getPriorityColor(priority: Task["priority"]) {
  switch (priority) {
    case "HIGH":
      return "#f87171"; // rojo
    case "MEDIUM":
      return "#facc15"; // amarillo
    case "LOW":
      return "#60a5fa"; // azul
    default:
      return "#d1d5db";
  }
}

function getListBackground(listId: number) {
  switch (listId) {
    case 1:
      return "#fef2f2"; // Pendientes → rojo claro
    case 2:
      return "#fef9c3"; // En progreso → amarillo claro
    case 3:
      return "#dcfce7"; // Completadas → verde claro
    default:
      return "#f9fafb";
  }
}

export default function TaskCardUI({ task }: { task: Task }) {
  return (
    <div
      className={styles.taskCard}
      style={{
        backgroundColor: getListBackground(task.listId),
      }}
    >
      <h4 className={styles.taskTitle}>{task.title}</h4>
      {task.description && (
        <p className={styles.taskDescription}>{task.description}</p>
      )}
      <p
        className={styles.priority}
        style={{
          color: `${getPriorityColor(task.priority)}`,
        }}
      >
        {task.priority}
      </p>
    </div>
  );
}
