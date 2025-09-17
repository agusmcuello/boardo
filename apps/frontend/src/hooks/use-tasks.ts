import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Mock data fijo para evitar diferencias SSR/CSR
const mockTasks = [
  {
    id: "1",
    title: "Implementar autenticación",
    description: "Crear sistema de login y registro",
    status: "IN_PROGRESS" as const,
    priority: "HIGH" as const,
    createdAt: "2024-09-17T12:00:00Z",
    updatedAt: "2024-09-17T12:00:00Z",
    userId: "1",
  },
  {
    id: "2",
    title: "Diseñar dashboard",
    description: "Crear interfaz del tablero de tareas",
    status: "TODO" as const,
    priority: "MEDIUM" as const,
    createdAt: "2024-09-17T13:00:00Z",
    updatedAt: "2024-09-17T13:00:00Z",
    userId: "1",
  },
];

// Hook para listar tareas
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      // Si estás en SSR, devolvé un array vacío para evitar hydration errors
      if (typeof window === "undefined") return [];
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockTasks;
    },
  });
}

// Hook para crear una nueva tarea
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      priority: "LOW" | "MEDIUM" | "HIGH";
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const now = new Date().toISOString();
      return {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description || "",
        status: "TODO" as const,
        priority: data.priority,
        createdAt: now,
        updatedAt: now,
        userId: "1",
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Hook para actualizar una tarea
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        title: string;
        description: string;
        status: string;
        priority: string;
      }>;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
