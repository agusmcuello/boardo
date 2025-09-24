import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Task } from "@/types/task";

export function useUserTasks(userId?: number) {
  return useQuery<Task[]>({
    queryKey: ["userTasks", userId], // <-- clave única por usuario
    queryFn: () => api.get("tasks/user/me"),
    enabled: !!userId, // solo se ejecuta si existe user
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => api.post("cards", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userTasks"] }); // ✅ así en v5
    },
  });
}
