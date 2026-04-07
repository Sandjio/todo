import { Box, Typography } from "@mui/material";
import { TopNav } from "../../src/components";

export default function Dashboard() {
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
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Your productivity overview.
      </Typography>
    </Box>
  );
}
