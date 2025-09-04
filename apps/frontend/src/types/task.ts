export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: TaskStatus;
}
