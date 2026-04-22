import { useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { TopNav } from "../components";
import { TaskList } from "../components/Dashboard/TaskList";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { UpdateTaskPayload } from "../types/todoist";

export default function UpcomingRoute() {
  const { data, isLoading } = useTasks({ filter: "7 days" });
  const { data: projects = [] } = useProjects();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const tasks = data?.results ?? [];

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
        Upcoming
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Tasks due in the next 7 days.
      </Typography>
      <TaskList
        tasks={tasks}
        projects={projects}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        isDeletingId={
          deleteTask.isPending ? (deleteTask.variables as string) : undefined
        }
      />
    </Box>
  );
}
