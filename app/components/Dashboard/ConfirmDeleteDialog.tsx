import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDeleteDialogProps {
  open: boolean;
  taskContent: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteDialog = ({
  open,
  taskContent,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>Delete Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete &ldquo;{taskContent}&rdquo;? This
          action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
