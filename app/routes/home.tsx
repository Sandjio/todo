import { Box } from "@mui/material";
import { useNavigate } from "react-router";
import { TopNav, NewTask } from "../components";
import { useProjects } from "../hooks/useProjects";
import { useCreateTask } from "../hooks/useCreateTask";
import type { CreateTaskPayload } from "../types/todoist";

export default function Home() {
  const { data: projects = [] } = useProjects();
  const createTask = useCreateTask();
  const navigate = useNavigate();

  const handleSubmit = async (payload: CreateTaskPayload) => {
    await createTask.mutateAsync(payload);
    navigate("/dashboard");
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
      <NewTask
        projects={projects}
        onSubmit={handleSubmit}
        isSubmitting={createTask.isPending}
        error={createTask.error}
      />
    </Box>
  );
}
