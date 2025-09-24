"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useUserTasks } from "@/hooks/use-tasks";
import { TaskModal } from "./task-modal";
import styles from "./task-board.module.css";
import { useAuth } from "@/hooks/use-auth";

export function TaskBoard() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useUserTasks(user?.id);
  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  if (isLoading) {
    return <div className={styles.loading}>Cargando tareas...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Tareas</h1>
        <Button onClick={() => setIsTaskModalOpen(true)}>Nueva Tarea</Button>
      </div>

      <div className={styles.columns}>
        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Por Hacer ({todoTasks.length})</h2>
          <div className={styles.taskList}>
            {todoTasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
                <div
                  className={`${styles.priority} ${
                    styles[task.priority.toLowerCase()]
                  }`}
                >
                  {task.priority}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>
            En Progreso ({inProgressTasks.length})
          </h2>
          <div className={styles.taskList}>
            {inProgressTasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
                <div
                  className={`${styles.priority} ${
                    styles[task.priority.toLowerCase()]
                  }`}
                >
                  {task.priority}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>
            Completadas ({doneTasks.length})
          </h2>
          <div className={styles.taskList}>
            {doneTasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
                <div
                  className={`${styles.priority} ${
                    styles[task.priority.toLowerCase()]
                  }`}
                >
                  {task.priority}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Nueva Tarea"
      >
        <TaskModal onClose={() => setIsTaskModalOpen(false)} />
      </Modal>
    </div>
  );
}
