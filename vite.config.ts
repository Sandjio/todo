import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    proxy: {
      "/api/todoist": {
        target: "https://api.todoist.com/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/todoist/, ""),
      },
    },
  },
});
