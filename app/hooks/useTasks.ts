import { useQuery } from "@tanstack/react-query";
import { listTasks } from "../utils/todoist.service";
import { queryKeys } from "../lib/queryKeys";

interface UseTasksParams {
  projectId?: string;
  filter?: string;
  cursor?: string;
}

export function useTasks(params: UseTasksParams = {}) {
  return useQuery({
    queryKey: queryKeys.tasks.filtered(params),
    queryFn: () =>
      listTasks({
        project_id: params.projectId,
        filter: params.filter,
        cursor: params.cursor,
      }),
  });
}
