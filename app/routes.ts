import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("dashboard", "./routes/dashboard.tsx"),
  route("today", "./routes/today.tsx"),
  route("upcoming", "./routes/upcoming.tsx"),
  route("projects", "./routes/projects.tsx"),
  route("archive", "./routes/archive.tsx"),
  route("trash", "./routes/trash.tsx"),
] satisfies RouteConfig;
