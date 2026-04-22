import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../utils/todoist.service";
import { queryKeys } from "../lib/queryKeys";

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all() });
    },
  });
}
