import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../utils/todoist.service";
import { queryKeys } from "../lib/queryKeys";

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all() });
    },
  });
}
