import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../utils/todoist.service";
import { queryKeys } from "../lib/queryKeys";
import type { UpdateTaskPayload } from "../types/todoist";

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskPayload;
    }) => updateTask(taskId, payload),
    onSuccess: (_data, { taskId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all() });
      qc.invalidateQueries({ queryKey: queryKeys.task.detail(taskId) });
    },
  });
}
