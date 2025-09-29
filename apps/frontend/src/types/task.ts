export interface Task {
  id: string;
  title: string;
  description?: string;
  listId: number;
  position: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  listId: number; // 👈 obligatorio al crear
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}
