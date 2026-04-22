import { useCallback, useState } from "react";
import { Box, Button, Chip, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate, useParams } from "react-router";
import { TopNav } from "../components";
import { EditTaskDialog } from "../components/Dashboard/EditTaskDialog";
import { ConfirmDeleteDialog } from "../components/Dashboard/ConfirmDeleteDialog";
import { useTask } from "../hooks/useTask";
import { useProjects } from "../hooks/useProjects";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { priorityToUrgency } from "../utils/urgency";
import type { UpdateTaskPayload } from "../types/todoist";

const ACCENT = "#3D52D5";

const priorityColors: Record<string, string> = {
  HIGH: "#E53935",
  MED: "#FB8C00",
  LOW: "#43A047",
};

export default function TaskView() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { data: task, isLoading, isError } = useTask(taskId!);
  const { data: projects = [] } = useProjects();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const handleDelete = useCallback(() => {
    deleteTask.mutate(taskId!, {
      onSuccess: () => navigate("/dashboard"),
    });
  }, [deleteTask, taskId, navigate]);

  const handleUpdate = useCallback(
    (id: string, payload: UpdateTaskPayload) => {
      updateTask.mutate({ taskId: id, payload }, { onSuccess: () => setShowEdit(false) });
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

  if (isError || !task) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error">Task not found.</Typography>
      </Box>
    );
  }

  const urgency = priorityToUrgency(task.priority);
  const projectName = projects.find((p) => p.id === task.project_id)?.name;

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

      <Link
        to="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          textDecoration: "none",
          color: "#666",
          marginBottom: 16,
        }}
      >
        <ArrowBackIcon fontSize="small" />
        <Typography variant="body2">Back to Dashboard</Typography>
      </Link>

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <Typography variant="h5" fontWeight={800}>
                {task.content}
              </Typography>
              <Chip
                label={urgency}
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  bgcolor: priorityColors[urgency] ?? "#bdbdbd",
                  color: "#fff",
                }}
              />
            </Box>
            {projectName && (
              <Typography variant="body2" color="text.secondary">
                {projectName}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setShowEdit(true)}
              sx={{ color: ACCENT, textTransform: "none", fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => setShowDelete(true)}
              color="error"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {task.description && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="overline"
              sx={{ color: ACCENT, fontWeight: 700, letterSpacing: 1 }}
            >
              Description
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.5, lineHeight: 1.8, whiteSpace: "pre-wrap" }}
            >
              {task.description}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {task.due && (
            <Box>
              <Typography
                variant="overline"
                sx={{ color: "text.disabled", fontWeight: 700, letterSpacing: 1 }}
              >
                Due Date
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
              >
                <CalendarTodayIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Typography variant="body2" fontWeight={600}>
                  {task.due.date}
                </Typography>
              </Box>
            </Box>
          )}

          <Box>
            <Typography
              variant="overline"
              sx={{ color: "text.disabled", fontWeight: 700, letterSpacing: 1 }}
            >
              Created
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
              {new Date(task.created_at).toLocaleDateString()}
            </Typography>
          </Box>

          {task.labels.length > 0 && (
            <Box>
              <Typography
                variant="overline"
                sx={{ color: "text.disabled", fontWeight: 700, letterSpacing: 1 }}
              >
                Labels
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                {task.labels.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.75rem", borderColor: "grey.300" }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <EditTaskDialog
        open={showEdit}
        task={task}
        projects={projects}
        onClose={() => setShowEdit(false)}
        onUpdate={handleUpdate}
        isSubmitting={updateTask.isPending}
      />

      <ConfirmDeleteDialog
        open={showDelete}
        taskContent={task.content}
        loading={deleteTask.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </Box>
  );
}
