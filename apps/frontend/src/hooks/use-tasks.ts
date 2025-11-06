// src/hooks/use-tasks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Task } from "@/types/task";

// --------------------------
// NORMALIZADOR
// --------------------------
type RawTask = Record<string, any>;

function normalizeTask(r: RawTask): Task {
  return {
    id: String(r.id),
    title: r.title,
    description: r.description ?? undefined,
    listId: Number(r.listId ?? r.list_id ?? 0),
    position: Number(r.position ?? 0),
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

// --------------------------
// GUEST MODE HELPERS
// --------------------------
function readGuestTasksRaw() {
  try {
    const raw = localStorage.getItem("guestTasks");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeGuestTasksRaw(tasks: any[]) {
  localStorage.setItem("guestTasks", JSON.stringify(tasks));
}

function readGuestTasks(): Task[] {
  return readGuestTasksRaw().map(normalizeTask);
}

// --------------------------
// Traer las task del user
// --------------------------
export function useUserTasks(userId?: number) {
  return useQuery<Task[]>({
    queryKey: ["userTasks", userId],
    queryFn: async () => {
      if (userId === 0) {
        return readGuestTasks();
      }

      const rows = await api.get<any[]>("tasks/user");
      return (rows || []).map(normalizeTask);
    },
    enabled: userId !== undefined && userId !== null,
  });
}

// --------------------------
// 2) Crear tasks
// --------------------------
export function useCreateTask(userId?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      listId: number;
      title: string;
      description?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      assignee_id?: number | null;
      position?: number | null;
    }) => {
      if (userId === 0) {
        // ✅ guest local create
        const arr = readGuestTasksRaw();
        const newTask = {
          id: `g-${Date.now()}`,
          title: payload.title,
          description: payload.description || "",
          listId: payload.listId,
          position:
            payload.position ??
            arr.filter((t: any) => Number(t.listId) === payload.listId).length +
              1,
          priority: payload.priority || "MEDIUM",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "0",
        };

        arr.push(newTask);
        writeGuestTasksRaw(arr);
        return newTask;
      }

      // ✅ real user → API
      return api.post("tasks", payload);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userTasks", userId] });
    },
  });
}

// --------------------------
// 3) Mover tasks
// --------------------------
export function useMoveTask(userId?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (p: { id: string; listId: number; position: number }) => {
      if (!userId) {
        // ✅ guest update
        const arr = readGuestTasksRaw();
        const idx = arr.findIndex((t: any) => String(t.id) === String(p.id));
        if (idx === -1) return;

        arr[idx].listId = p.listId;
        arr[idx].position = p.position;
        arr[idx].updatedAt = new Date().toISOString();

        writeGuestTasksRaw(arr);
        return;
      }

      return api.put(`tasks/${p.id}`, p);
    },

    // Optimistic update (funciona igual para guest y real)
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["userTasks"] });

      const prev = qc.getQueryData<Task[]>(["userTasks"]);

      if (prev) {
        const next = prev.map((t) =>
          t.id === payload.id
            ? { ...t, listId: payload.listId, position: payload.position }
            : t
        );

        qc.setQueryData(["userTasks"], next);
      }

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(["userTasks"], ctx.prev);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}

// --------------------------
// 4) Borrar Tasks
// --------------------------
export function useDeleteTask(userId?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (userId === 0) {
        // ✅ guest delete
        const arr = readGuestTasksRaw();
        const next = arr.filter((t: any) => String(t.id) !== String(id));
        writeGuestTasksRaw(next);
        return;
      }

      return api.del(`tasks/${id}`);
    },

    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["userTasks"] });

      const previous = qc.getQueriesData({ queryKey: ["userTasks"] });

      qc.getQueriesData({ queryKey: ["userTasks"] }).forEach(
        ([qk, data]: any) => {
          if (Array.isArray(data)) {
            const updated = data.filter((t) => String(t.id) !== String(id));
            qc.setQueryData(qk as any, updated);
          }
        }
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        context.previous.forEach(([qk, data]: any) => {
          qc.setQueryData(qk as any, data);
        });
      }
    },

    onSettled: (_d, _e, _v, _c) => {
      qc.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}
