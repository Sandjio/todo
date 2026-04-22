import { Suspense, lazy } from "react";
import { Box, CircularProgress } from "@mui/material";

const AdminApp = lazy(() => import("../components/AdminApp"));

export default function AdminRoute() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 8,
          }}
        >
          <CircularProgress sx={{ color: "#3D52D5" }} />
        </Box>
      }
    >
      <AdminApp />
    </Suspense>
  );
}
