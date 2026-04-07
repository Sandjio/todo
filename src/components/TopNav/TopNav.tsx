import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useLocation, Link } from "react-router";

export const TopNav = () => {
  const { pathname } = useLocation();
  const tabValue = pathname === "/dashboard" ? 1 : 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        mb: 4,
        borderBottom: "1px solid",
        borderColor: "divider",
        pb: 0,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: "text.primary", whiteSpace: "nowrap", pb: 1.5 }}
      >
        Ethereal Workspace
      </Typography>

      <Tabs
        value={tabValue}
        sx={{
          "& .MuiTabs-indicator": { bgcolor: "#3D52D5", height: 3 },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "text.secondary",
            minWidth: "auto",
            px: 0,
            mr: 3,
          },
          "& .Mui-selected": { color: "#3D52D5 !important", fontWeight: 600 },
        }}
      >
        <Tab label="New Task" component={Link} to="/" />
        <Tab label="Dashboard" component={Link} to="/dashboard" />
      </Tabs>
    </Box>
  );
};
