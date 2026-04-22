import { useCallback, useEffect, useMemo } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useSearchParams } from "react-router";
import { TopNav, FilterBar, TaskList } from "../components";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { useFilterStore } from "../store/filterStore";
import { priorityToUrgency } from "../utils/urgency";
import type { UpdateTaskPayload } from "../types/todoist";

export default function Dashboard() {
  const { projectId, priority, searchQuery, cursor, setProjectId, setCursor } =
    useFilterStore();
  const [searchParams] = useSearchParams();

  // Sync project_id URL param into the store on first mount
  // (preserves navigation from the Projects page)
  useEffect(() => {
    const urlProjectId = searchParams.get("project_id") ?? undefined;
    setProjectId(urlProjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, isError } = useTasks({ projectId, cursor });
  const { data: projects = [] } = useProjects();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const filteredTasks = useMemo(() => {
    const results = data?.results ?? [];
    return results.filter((task) => {
      const matchesPriority =
        priority === "ALL" || priorityToUrgency(task.priority) === priority;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        task.content.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q);
      return matchesPriority && matchesSearch;
    });
  }, [data?.results, priority, searchQuery]);

  const handleDelete = useCallback(
    (taskId: string) => {
      deleteTask.mutate(taskId);
    },
    [deleteTask],
  );

  const handleUpdate = useCallback(
    (taskId: string, payload: UpdateTaskPayload) => {
      updateTask.mutate({ taskId, payload });
    },
    [updateTask],
  );

  const filteredProject = projectId
    ? projects.find((p) => p.id === projectId)
    : null;

  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#3D52D5" }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error">Failed to load tasks. Please try again.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: "100vh",
        bgcolor: "#EEEEF8",
        px: { xs: 3, md: 5 },
        py: 4,
      }}
    >
      <TopNav />
      <Typography variant="h4" fontWeight={800}>
        {filteredProject ? filteredProject.name : "Dashboard"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {filteredProject
          ? `Tasks in ${filteredProject.name}.`
          : "Your productivity overview."}
      </Typography>

      <FilterBar />

      <TaskList
        tasks={filteredTasks}
        projects={projects}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        isDeletingId={
          deleteTask.isPending ? (deleteTask.variables as string) : undefined
        }
      />

      <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
        <Button
          onClick={() => setCursor(undefined)}
          disabled={!cursor}
          variant="outlined"
          size="small"
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            data?.next_cursor ? setCursor(data.next_cursor) : undefined
          }
          disabled={!data?.next_cursor}
          variant="outlined"
          size="small"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
