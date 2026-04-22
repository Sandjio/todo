import React, { useState, useMemo } from "react";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Link } from "react-router";
import type {
  TodoistTask,
  TodoistProject,
  UpdateTaskPayload,
} from "../../types/todoist";
import { priorityToUrgency } from "../../utils/urgency";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { EditTaskDialog } from "./EditTaskDialog";

const ACCENT = "#3D52D5";

const card = {
  bgcolor: "#fff",
  borderRadius: 3,
  border: "1px solid",
  borderColor: "grey.200",
  p: 2.5,
};

const priorityColors: Record<string, string> = {
  HIGH: "#E53935",
  MED: "#FB8C00",
  LOW: "#43A047",
};

interface TaskListProps {
  tasks: TodoistTask[];
  projects: TodoistProject[];
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, payload: UpdateTaskPayload) => void;
  isDeletingId?: string;
}

interface TaskCardProps {
  task: TodoistTask;
  projectName: string | undefined;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const TaskCard = React.memo(function TaskCard({
  task,
  projectName,
  onEdit,
  onDelete,
  isDeleting,
}: TaskCardProps) {
  const urgency = priorityToUrgency(task.priority);

  return (
    <Box
      sx={{
        ...card,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 2px 12px rgba(61,82,213,0.1)" },
      }}
    >
      <Box
        sx={{
          width: 4,
          height: 48,
          borderRadius: 2,
          bgcolor: priorityColors[urgency] ?? "#bdbdbd",
          flexShrink: 0,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Link
            to={`/tasks/${task.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="body1" fontWeight={600} noWrap>
              {task.content}
            </Typography>
          </Link>
          <Chip
            label={urgency}
            size="small"
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              height: 20,
              bgcolor: priorityColors[urgency] ?? "#bdbdbd",
              color: "#fff",
            }}
          />
        </Box>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ maxWidth: 500 }}
          >
            {task.description}
          </Typography>
        )}

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}
        >
          {task.due && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: "text.disabled" }} />
              <Typography variant="caption" color="text.secondary">
                {task.due.date}
              </Typography>
            </Box>
          )}
          {projectName && (
            <Typography variant="caption" color="text.disabled">
              {projectName}
            </Typography>
          )}
          {task.labels.map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.65rem", height: 18, borderColor: "grey.300" }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
        <IconButton
          size="small"
          onClick={onEdit}
          sx={{ color: "text.secondary", "&:hover": { color: ACCENT } }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={onDelete}
          disabled={isDeleting}
          sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
});

export const TaskList = React.memo(function TaskList({
  tasks,
  projects,
  onDelete,
  onUpdate,
  isDeletingId,
}: TaskListProps) {
  const [deleteTarget, setDeleteTarget] = useState<TodoistTask | null>(null);
  const [editTarget, setEditTarget] = useState<TodoistTask | null>(null);

  const projectMap = useMemo(
    () => new Map(projects.map((p) => [p.id, p.name])),
    [projects],
  );

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (tasks.length === 0) {
    return (
      <Box sx={{ ...card, mt: 3, textAlign: "center", py: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create your first task to get started.
        </Typography>
        <Link
          to="/"
          style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}
        >
          + Create Task
        </Link>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            projectName={projectMap.get(task.project_id)}
            onEdit={() => setEditTarget(task)}
            onDelete={() => setDeleteTarget(task)}
            isDeleting={isDeletingId === task.id}
          />
        ))}
      </Box>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        taskContent={deleteTarget?.content ?? ""}
        loading={!!isDeletingId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <EditTaskDialog
        open={!!editTarget}
        task={editTarget}
        projects={projects}
        onClose={() => setEditTarget(null)}
        onUpdate={onUpdate}
      />
    </>
  );
});
