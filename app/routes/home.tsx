import { Box } from "@mui/material";
import { TopNav, NewTask } from "../../src/components";

export default function Home() {
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
      <NewTask />
    </Box>
  );
}
