import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Mock data para desarrollo
const mockTasks = [
  {
    id: "1",
    title: "Implementar autenticación",
    description: "Crear sistema de login y registro",
    status: "IN_PROGRESS" as const,
    priority: "HIGH" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "1",
  },
  {
    id: "2",
    title: "Diseñar dashboard",
    description: "Crear interfaz del tablero de tareas",
    status: "TODO" as const,
    priority: "MEDIUM" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "1",
  },
];

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      // Simulamos una llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockTasks;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      // Simulamos creación de tarea
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newTask = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description || "",
        status: "TODO" as const,
        priority: data.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "1",
      };
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Simulamos actualización de tarea
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
