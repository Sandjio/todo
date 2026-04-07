import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type {
  TodoistTask,
  TodoistProject,
  UrgencyLevel,
} from "../../types/todoist";
import { priorityToUrgency } from "../../utils/urgency";

const ACCENT = "#3D52D5";
const urgencyLevels: UrgencyLevel[] = ["LOW", "MED", "HIGH"];

interface EditTaskDialogProps {
  open: boolean;
  task: TodoistTask | null;
  projects: TodoistProject[];
  onClose: () => void;
}

export const EditTaskDialog = ({
  open,
  task,
  projects,
  onClose,
}: EditTaskDialogProps) => {
  const fetcher = useFetcher();
  const [urgency, setUrgency] = useState<UrgencyLevel>("LOW");
  const [projectId, setProjectId] = useState("");

  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (task) {
      setUrgency(priorityToUrgency(task.priority));
      setProjectId(task.project_id);
    }
  }, [task]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>Edit Task</DialogTitle>
      <DialogContent>
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="urgency" value={urgency} />
          <input type="hidden" name="project_id" value={projectId} />

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}
          >
            {/* Task Title */}
            <Box>
              <Typography
                variant="overline"
                sx={{ color: ACCENT, fontWeight: 700, letterSpacing: 1 }}
              >
                Task Title
              </Typography>
              <InputBase
                name="content"
                fullWidth
                required
                defaultValue={task.content}
                sx={{
                  mt: 0.5,
                  fontSize: "1rem",
                  bgcolor: "#F8F9FF",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.75,
                }}
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography
                variant="overline"
                sx={{ color: ACCENT, fontWeight: 700, letterSpacing: 1 }}
              >
                Description
              </Typography>
              <InputBase
                name="description"
                fullWidth
                multiline
                minRows={3}
                defaultValue={task.description}
                sx={{
                  mt: 0.5,
                  fontSize: "0.9rem",
                  bgcolor: "#F8F9FF",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.75,
                }}
              />
            </Box>

            {/* Due Date */}
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
              <InputBase
                name="due_date"
                type="date"
                fullWidth
                defaultValue={task.due?.date ?? ""}
                sx={{
                  mt: 0.5,
                  fontSize: "0.875rem",
                  bgcolor: "#F8F9FF",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.75,
                }}
              />
            </Box>

            {/* Project */}
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "text.disabled",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                Project
              </Typography>
              <Select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                sx={{
                  mt: 0.5,
                  borderRadius: 2,
                  bgcolor: "#F8F9FF",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  fontSize: "0.875rem",
                }}
              >
                <MenuItem value="">
                  <em>No project</em>
                </MenuItem>
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Urgency Level */}
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "text.disabled",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                Urgency Level
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                {urgencyLevels.map((level) => {
                  const active = urgency === level;
                  return (
                    <Button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      size="small"
                      variant={active ? "contained" : "text"}
                      sx={{
                        flex: 1,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        borderRadius: 2,
                        minWidth: 0,
                        py: 0.75,
                        bgcolor: active ? ACCENT : "transparent",
                        color: active ? "#fff" : "text.secondary",
                        "&:hover": {
                          bgcolor: active ? ACCENT : "grey.100",
                        },
                        boxShadow: "none",
                      }}
                    >
                      {level}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            {/* Actions */}
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 1 }}
            >
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
                sx={{
                  bgcolor: ACCENT,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#2e40b8" },
                }}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
};
