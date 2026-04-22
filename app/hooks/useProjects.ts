import { useQuery } from "@tanstack/react-query";
import { listProjects } from "../utils/todoist.service";
import { queryKeys } from "../lib/queryKeys";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: listProjects,
    staleTime: 15 * 60 * 1000,
  });
}
