import InboxIcon from "@mui/icons-material/Inbox";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FolderIcon from "@mui/icons-material/Folder";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography } from "@mui/material";
import { SideBarElement } from "./SideBarElement";
import { Link } from "react-router";

const mainNavItems = [
  { icon: InboxIcon, message: "Inbox", to: "/" },
  { icon: TodayIcon, message: "Today", to: "/today" },
  { icon: DateRangeIcon, message: "Upcoming", to: "/upcoming" },
  { icon: FolderIcon, message: "Projects", to: "/projects" },
];

const bottomNavItems = [
  { icon: ArchiveIcon, message: "Archive", to: "/archive" },
  { icon: DeleteIcon, message: "Trash", to: "/trash" },
];

export const SideBar = () => {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        width: { md: "33%", lg: "16.67%" },
        height: "100vh",
        bgcolor: "#F1F5F9",
        px: 2.5,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              bgcolor: "info.main",
              color: "white",
              borderRadius: 2,
              p: 1,
              fontSize: "0.875rem",
              fontWeight: "bold",
            }}
          >
            S
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              The Studio
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PRODUCTIVITY FLOW
            </Typography>
          </Box>
        </Box>

        {mainNavItems.map((item) => (
          <Link
            key={item.message}
            to={item.to}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SideBarElement icon={item.icon} message={item.message} />
          </Link>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {bottomNavItems.map((item) => (
          <Link
            key={item.message}
            to={item.to}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SideBarElement icon={item.icon} message={item.message} />
          </Link>
        ))}
      </Box>
    </Box>
  );
};
