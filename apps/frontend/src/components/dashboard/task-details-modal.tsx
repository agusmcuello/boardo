"use client";

import { Task } from "@/types/task";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useDeleteTask } from "@/hooks/use-tasks";
import { useState } from "react";

export function TaskDetailsModal({
  isOpen,
  onClose,
  task,
}: {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}) {
  const deleteTask = useDeleteTask();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la tarea">
      <div>
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <p>
          <strong>Prioridad:</strong> {task.priority}
        </p>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
        {!confirmDelete ? (
          <Button variant="destructive" onClick={handleDeleteClick}>
            Eliminar
          </Button>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Confirmar eliminación"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
