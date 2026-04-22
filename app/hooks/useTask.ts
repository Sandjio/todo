import { useQuery } from "@tanstack/react-query";
import { getTask } from "../utils/todoist.service";
import { queryKeys } from "../lib/queryKeys";

export function useTask(taskId: string) {
  return useQuery({
    queryKey: queryKeys.task.detail(taskId),
    queryFn: () => getTask(taskId),
  });
}
