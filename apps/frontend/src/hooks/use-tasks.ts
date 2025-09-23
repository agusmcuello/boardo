import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Task } from "@/types/task";

export function useUserTasks() {
  return useQuery<Task[]>({
    queryKey: ["userTasks"],
    queryFn: () => api.get("cards/user/me"),
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
