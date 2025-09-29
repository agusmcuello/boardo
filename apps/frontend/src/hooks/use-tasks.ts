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
    description: r.description ?? undefined,
    // soporta tanto listId (camel) como list_id (snake)
    listId: r.listId ?? r.list_id ?? 0,
    position: r.position ?? 0, // 👈 agregar este campo
    priority: r.priority ?? "MEDIUM",
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
    mutationFn: (payload: any) => api.post("tasks", payload),
    onSuccess: () => {
      // invalidamos todas las queries que empiecen con "userTasks"
      qc.invalidateQueries({
        predicate: (query: Query) => query.queryKey[0] === "userTasks",
      } as any);
    },
  });
}

export function useMoveTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; listId: number; position: number }) =>
      api.put(`tasks/${payload.id}`, payload),

    // ⚡ update optimista
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["userTasks"] });

      const prev = qc.getQueryData<Task[]>(["userTasks"]);

      if (prev) {
        // movemos en memoria
        const newTasks = prev.map((t) =>
          t.id === payload.id
            ? { ...t, listId: payload.listId, position: payload.position }
            : t
        );
        qc.setQueryData(["userTasks"], newTasks);
      }

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      // rollback si falla
      if (ctx?.prev) {
        qc.setQueryData(["userTasks"], ctx.prev);
      }
    },

    onSettled: () => {
      // refresco para alinear posiciones
      qc.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}
