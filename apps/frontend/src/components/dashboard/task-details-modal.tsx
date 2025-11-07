"use client";

import { useEffect } from "react";
import { Task } from "@/types/task";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useDeleteTask } from "@/hooks/use-tasks";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function TaskDetailsModal({
  isOpen,
  onClose,
  task,
}: {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}) {
  const { user } = useAuth();
  const deleteTask = useDeleteTask(user?.id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmDelete(false);
      setIsDeleting(false);
    }
  }, [isOpen, task]);

  if (!task) return null;

  const handleDeleteClick = () => setConfirmDelete(true);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask.mutateAsync(String(task.id));
      onClose();
    } catch (err) {
      console.error("Error eliminando tarea", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task details">
      <div>
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <p>
          <strong>Priority:</strong> {task.priority}
        </p>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {!confirmDelete ? (
          <Button variant="destructive" onClick={handleDeleteClick}>
            Delete
          </Button>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <h4 style={{ color: "#1f1d2a", margin: "0" }}>Sure?</h4>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing" : "Delete"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
