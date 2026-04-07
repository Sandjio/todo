import { Box, Typography } from "@mui/material";
import { TopNav } from "../components";
import { TaskList } from "../components/Dashboard/TaskList";
import {
  listTasks,
  listProjects,
  deleteTask,
  updateTask,
} from "../utils/todoist.service";
import { urgencyToPriority } from "../utils/urgency";
import type { UrgencyLevel, TodoistProject } from "../types/todoist";
import type { Route } from "./+types/dashboard";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const project_id = url.searchParams.get("project_id") || undefined;

  const [tasks, projects] = await Promise.all([
    listTasks(project_id ? { project_id } : undefined),
    listProjects(),
  ]);
  return { tasks, projects, project_id };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "delete") {
    const taskId = formData.get("taskId") as string;
    await deleteTask(taskId);
    return { ok: true };
  }

  if (intent === "update") {
    const taskId = formData.get("taskId") as string;
    const content = formData.get("content") as string;
    const description = (formData.get("description") as string) || "";
    const due_date = (formData.get("due_date") as string) || undefined;
    const project_id = (formData.get("project_id") as string) || undefined;
    const urgency = (formData.get("urgency") as UrgencyLevel) || undefined;

    await updateTask(taskId, {
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

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const filteredProject = loaderData.project_id
    ? loaderData.projects.find(
        (p: TodoistProject) => p.id === loaderData.project_id,
      )
    : null;

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
      <TaskList tasks={loaderData.tasks} projects={loaderData.projects} />
    </Box>
  );
}
