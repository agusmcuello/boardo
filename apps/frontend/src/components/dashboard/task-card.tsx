import { Task } from "@/types/task";

export function TaskCard({
  task,
  onOpen,
}: {
  task: Task;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="taskCard" onClick={() => onOpen(task.id)}>
      <h4>{task.title}</h4>
      <div className="meta">
        {task.priority} • {task.status}
      </div>
    </div>
  );
}
