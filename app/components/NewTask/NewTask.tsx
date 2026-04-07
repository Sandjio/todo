import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useState } from "react";
import { Form, useNavigation, useActionData } from "react-router";
import type { TodoistProject, UrgencyLevel } from "../../types/todoist";

const ACCENT = "#3D52D5";

const suggestedLabels = ["High focus", "Deep work", "Collaborative"];
const urgencyLevels: UrgencyLevel[] = ["LOW", "MED", "HIGH"];

const card = {
  bgcolor: "#fff",
  borderRadius: 3,
  border: "1px solid",
  borderColor: "grey.200",
  p: 2.5,
};

interface NewTaskProps {
  projects: TodoistProject[];
}

export const NewTask = ({ projects }: NewTaskProps) => {
  const [urgency, setUrgency] = useState<UrgencyLevel>("HIGH");
  const [projectId, setProjectId] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>();
  const isSubmitting = navigation.state === "submitting";

  const toggleLabel = (label: string) => {
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  return (
    <Form method="post">
      {actionData?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionData.error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        {/* ── Left column ── */}
        <Box
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Create task
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define your next milestone in the ethereal flow.
            </Typography>
          </Box>

          {/* Task Title + Notes card */}
          <Box sx={card}>
            {/* Task Title */}
            <Typography
              variant="overline"
              sx={{ color: ACCENT, fontWeight: 700, letterSpacing: 1 }}
            >
              Task Title
            </Typography>
            <InputBase
              name="content"
              fullWidth
              placeholder="What needs to be done?"
              required
              sx={{
                mt: 0.5,
                mb: 1.5,
                fontSize: "1rem",
                color: "text.secondary",
              }}
            />

            <Divider sx={{ mb: 2 }} />

            {/* Notes & Context */}
            <Typography
              variant="overline"
              sx={{ color: ACCENT, fontWeight: 700, letterSpacing: 1 }}
            >
              Notes &amp; Context
            </Typography>

            {/* Rich-text toolbar */}
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                mt: 1,
                mb: 1,
                color: "text.secondary",
              }}
            >
              {[
                FormatBoldIcon,
                FormatItalicIcon,
                FormatListBulletedIcon,
                LinkIcon,
                AttachFileIcon,
              ].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  type="button"
                  sx={{ color: "text.secondary" }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>

            <InputBase
              name="description"
              fullWidth
              multiline
              minRows={6}
              placeholder="Elaborate on the details..."
              sx={{ fontSize: "0.9rem", color: "text.secondary" }}
            />
          </Box>

          {/* Suggested labels */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              SUGGESTED LABELS:
            </Typography>
            {suggestedLabels.map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                variant={labels.includes(label) ? "filled" : "outlined"}
                onClick={() => toggleLabel(label)}
                sx={{
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  borderColor: labels.includes(label) ? ACCENT : "grey.300",
                  bgcolor: labels.includes(label) ? ACCENT : "transparent",
                  color: labels.includes(label) ? "#fff" : "text.secondary",
                  "&:hover": {
                    bgcolor: labels.includes(label) ? "#2e40b8" : "grey.100",
                    cursor: "pointer",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* ── Right column ── */}
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 8.5,
          }}
        >
          {/* Timeline */}
          <Box sx={card}>
            <Typography
              variant="overline"
              sx={{
                color: "text.disabled",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              Timeline
            </Typography>

            <Box
              sx={{
                mt: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {/* Due Date */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#F8F9FF",
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.disabled",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    DUE DATE
                  </Typography>
                  <InputBase
                    name="due_date"
                    type="date"
                    fullWidth
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      "& input": { p: 0 },
                    }}
                  />
                </Box>
                <CalendarTodayIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </Box>
            </Box>
          </Box>

          {/* Project Anchor */}
          <Box sx={card}>
            <Typography
              variant="overline"
              sx={{
                color: "text.disabled",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              Project Anchor
            </Typography>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              displayEmpty
              fullWidth
              size="small"
              sx={{
                mt: 1,
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
          <Box sx={card}>
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
            <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
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

          {/* Hidden inputs for non-standard form controls */}
          <input type="hidden" name="urgency" value={urgency} />
          <input type="hidden" name="project_id" value={projectId} />
          {labels.map((label) => (
            <input key={label} type="hidden" name="labels" value={label} />
          ))}

          {/* Deploy Task button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <AutoAwesomeIcon fontSize="small" />
              )
            }
            sx={{
              bgcolor: ACCENT,
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              boxShadow: "0 4px 14px rgba(61,82,213,0.35)",
              "&:hover": { bgcolor: "#2e40b8" },
            }}
          >
            {isSubmitting ? "Deploying..." : "Deploy Task"}
          </Button>

          {/* Workspace Insight */}
          <Box
            sx={{
              bgcolor: "#1A1F4E",
              borderRadius: 3,
              p: 2,
              mt: 0.5,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: "0.6rem",
              }}
            >
              Workspace Insight
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#fff", mt: 0.5, lineHeight: 1.6 }}
            >
              This task requires &ldquo;Deep Work&rdquo; focus. We&rsquo;ve
              scheduled it for your morning peak.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Form>
  );
};
