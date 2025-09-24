// src/hooks/use-tasks.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  Query,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Task } from "@/types/task";

type RawTask = Record<string, any>;

function normalizeTask(r: RawTask): Task {
  return {
    id: String(r.id),
    title: r.title,
    description: r.description ?? r.description,
    // soporta tanto listId (camel) como list_id (snake)
    listId: r.listId ?? r.list_id ?? null,
    priority: r.priority ?? "MEDIUM",
    // normalizamos fechas si vienen
    createdAt: r.created_at
      ? new Date(r.created_at)
      : r.createdAt
      ? new Date(r.createdAt)
      : new Date(),
    updatedAt: r.updated_at
      ? new Date(r.updated_at)
      : r.updatedAt
      ? new Date(r.updatedAt)
      : new Date(),
    // userId puede venir como createdBy / created_by
    userId: String(r.createdBy ?? r.created_by ?? r.userId ?? ""),
  };
}

export function useUserTasks(userId?: number) {
  return useQuery<Task[]>({
    queryKey: ["userTasks", userId],
    queryFn: async () => {
      // Llamamos al endpoint que preferís (usar /tasks/user para alias camelCase)
      const rows = await api.get<any[]>("tasks/user"); // o "tasks/user/mine" si preferís
      return (rows || []).map(normalizeTask);
    },
    enabled: !!userId,
  });
}

/* opcional: hook para crear task */
export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => api.post("cards", payload),
    onSuccess: () => {
      // invalidamos todas las queries que empiecen con "userTasks"
      qc.invalidateQueries({
        predicate: (query: Query) => query.queryKey[0] === "userTasks",
      } as any);
    },
  });
}
