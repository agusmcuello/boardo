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

/*crear task */
export function useCreateTask(userId?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      listId: number;
      title: string;
      description?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      assignee_id?: number | null;
      position?: number | null;
    }) => api.post("tasks", payload),

    onSuccess: (created) => {
      // invalidar las queries del user (si usás ["userTasks", userId] como clave)
      if (userId) {
        qc.invalidateQueries({ queryKey: ["userTasks", userId] });
      } else {
        // fallback: invalidar todas las userTasks
        qc.invalidateQueries({
          predicate: (q) => (q.queryKey as any)[0] === "userTasks",
        });
      }
    },
  });
}

/*mover task */
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

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`tasks/${id}`),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["userTasks"] });
      const previous = qc.getQueriesData<any>({ queryKey: ["userTasks"] });

      qc.getQueriesData({ queryKey: ["userTasks"] }).forEach(
        ([qk, data]: any) => {
          if (Array.isArray(data)) {
            const newArr = data.filter((t: any) => String(t.id) !== String(id));
            qc.setQueryData(qk as any, newArr);
          }
        }
      );

      return { previous };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previous) {
        context.previous.forEach(([qk, data]: any) => {
          qc.setQueryData(qk as any, data);
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}
