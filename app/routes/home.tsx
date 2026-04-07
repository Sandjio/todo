import { Box } from "@mui/material";
import { redirect } from "react-router";
import { TopNav, NewTask } from "../components";
import { createTask, listProjects } from "../utils/todoist.service";
import { urgencyToPriority } from "../utils/urgency";
import type { UrgencyLevel } from "../types/todoist";
import type { Route } from "./+types/home";

export async function clientLoader() {
  const projects = await listProjects();
  return { projects };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const content = formData.get("content") as string;
  const description = (formData.get("description") as string) || "";
  const due_date = (formData.get("due_date") as string) || undefined;
  const project_id = (formData.get("project_id") as string) || undefined;
  const urgency = (formData.get("urgency") as UrgencyLevel) || undefined;
  const labels = formData.getAll("labels") as string[];

  if (!content?.trim()) {
    return { error: "Task title is required." };
  }

  try {
    await createTask({
      content: content.trim(),
      description,
      due_date: due_date || undefined,
      project_id: project_id || undefined,
      priority: urgency ? urgencyToPriority(urgency) : 1,
      labels: labels.length > 0 ? labels : undefined,
    });
    return redirect("/dashboard");
  } catch {
    return { error: "Failed to create task. Please try again." };
  }
}


export default function Home({ loaderData }: Route.ComponentProps) {
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
      <NewTask projects={loaderData.projects} />
    </Box>
  );
}
