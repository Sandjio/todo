import {
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Link, redirect, useFetcher } from "react-router";
import { TopNav } from "../components";
import { EditTaskDialog } from "../components/Dashboard/EditTaskDialog";
import { ConfirmDeleteDialog } from "../components/Dashboard/ConfirmDeleteDialog";
import {
  getTask,
  listProjects,
  deleteTask,
  updateTask,
} from "../utils/todoist.service";
import { urgencyToPriority, priorityToUrgency } from "../utils/urgency";
import type { UrgencyLevel, TodoistProject } from "../types/todoist";
import type { Route } from "./+types/task";

const ACCENT = "#3D52D5";

const priorityColors: Record<string, string> = {
  HIGH: "#E53935",
  MED: "#FB8C00",
  LOW: "#43A047",
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [task, projects] = await Promise.all([
    getTask(params.taskId),
    listProjects(),
  ]);
  return { task, projects };
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "delete") {
    await deleteTask(params.taskId);
    return redirect("/dashboard");
  }

  if (intent === "update") {
    const content = formData.get("content") as string;
    const description = (formData.get("description") as string) || "";
    const due_date = (formData.get("due_date") as string) || undefined;
    const project_id = (formData.get("project_id") as string) || undefined;
    const urgency = (formData.get("urgency") as UrgencyLevel) || undefined;

    await updateTask(params.taskId, {
      content,
      description,
      due_date: due_date || undefined,
      project_id: project_id || undefined,
      priority: urgency ? urgencyToPriority(urgency) : 1,
    });
    return { ok: true };
  }

  return { ok: true };
}


export default function TaskView({ loaderData }: Route.ComponentProps) {
  const { task, projects } = loaderData;
  const fetcher = useFetcher();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const urgency = priorityToUrgency(task.priority);
  const projectName = projects.find((p: TodoistProject) => p.id === task.project_id)?.name;
  const isDeleting = fetcher.state !== "idle";

  const handleDelete = () => {
    fetcher.submit(
      { intent: "delete", taskId: task.id },
      { method: "post" },
    );
  };

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

      {/* Back link */}
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

      {/* Task detail card */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          p: 4,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
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
              sx={{
                color: ACCENT,
                textTransform: "none",
                fontWeight: 600,
              }}
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

        {/* Description */}
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

        {/* Meta info */}
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {task.due && (
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "text.disabled",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                Due Date
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" fontWeight={600}>
                  {task.due.date}
                </Typography>
              </Box>
            </Box>
          )}

          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "text.disabled",
                fontWeight: 700,
                letterSpacing: 1,
              }}
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
                sx={{
                  color: "text.disabled",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                Labels
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                {task.labels.map((label: string) => (
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
      />

      <ConfirmDeleteDialog
        open={showDelete}
        taskContent={task.content}
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </Box>
  );
}
