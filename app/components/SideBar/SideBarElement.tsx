import type { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export const SideBarElement = ({
  icon: Icon,
  message,
}: {
  icon: SvgIconComponent;
  message: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        px: 1.5,
        py: 1,
        borderRadius: 2,
        "&:hover": { bgcolor: "grey.200" },
      }}
    >
      <Icon fontSize="small" />
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
};
