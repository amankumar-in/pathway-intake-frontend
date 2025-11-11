import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { Assignment as AssignmentIcon } from "@mui/icons-material";

const RegenerateDocumentsDialog = ({
  open,
  onClose,
  onRegenerate,
  isGenerating,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={() => !isGenerating && onClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha(theme.palette.warning.main, 0.05),
          borderBottom: "1px solid",
          borderColor: alpha(theme.palette.warning.main, 0.1),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AssignmentIcon color="warning" sx={{ mr: 1.5 }} />
          <Typography variant="h6">Regenerate Documents</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" paragraph>
          Are you sure you want to regenerate all documents for this intake
          form?
        </Typography>
        <Alert
          severity="warning"
          variant="outlined"
          sx={{ mt: 2, borderRadius: 1 }}
        >
          <Typography variant="body2">
            <strong>Important:</strong> This will replace all existing
            documents with new ones based on the current form data. Any edits
            made directly to documents will be lost.
          </Typography>
        </Alert>
        {isGenerating && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isGenerating}>
          Cancel
        </Button>
        <Button
          onClick={onRegenerate}
          variant="contained"
          color="warning"
          disabled={isGenerating}
          startIcon={
            isGenerating ? <CircularProgress size={16} /> : <AssignmentIcon />
          }
        >
          {isGenerating ? "Regenerating..." : "Yes, Regenerate All"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegenerateDocumentsDialog;
