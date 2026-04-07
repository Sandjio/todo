import { Box, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { Link } from "react-router";
import { TopNav } from "../components";
import { listProjects } from "../utils/todoist.service";
import type { TodoistProject } from "../types/todoist";
import type { Route } from "./+types/projects";

const ACCENT = "#3D52D5";

export async function clientLoader() {
  const projects = await listProjects();
  return { projects };
}


export default function ProjectsRoute({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;

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
        Projects
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Your Todoist projects.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 2,
          mt: 3,
        }}
      >
        {projects.map((project: TodoistProject) => (
          <Link
            key={project.id}
            to={`/dashboard?project_id=${project.id}`}
            style={{ textDecoration: "none" }}
          >
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "box-shadow 0.2s",
                "&:hover": {
                  boxShadow: "0 2px 12px rgba(61,82,213,0.12)",
                  borderColor: ACCENT,
                },
              }}
            >
              <FolderIcon sx={{ color: ACCENT }} />
              <Box>
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {project.name}
                </Typography>
                {project.is_favorite && (
                  <Typography variant="caption" color="text.secondary">
                    Favorite
                  </Typography>
                )}
              </Box>
            </Box>
          </Link>
        ))}
      </Box>

      {projects.length === 0 && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No projects found.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
