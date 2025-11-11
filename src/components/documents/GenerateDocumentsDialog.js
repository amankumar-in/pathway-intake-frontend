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

const GenerateDocumentsDialog = ({
  open,
  onClose,
  onGenerate,
  isGenerating,
  clientName,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={() => !isGenerating && onClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx:{
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AssignmentIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="h6">Generate Documents</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" paragraph>
          No documents have been generated for this intake form yet. Would you
          like to generate them now?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This will create all required documentation for {clientName}'s
          case including:
        </Typography>
        <Box sx={{ ml: 2, mb: 2 }}>
          <Typography variant="body2" component="div">
            • Intake forms and assessments
            <br />
            • Consent and authorization documents
            <br />
            • Placement agreements
            <br />• Service plans
          </Typography>
        </Box>
        <Alert
          severity="info"
          variant="outlined"
          sx={{ mt: 2, borderRadius: 1 }}
        >
          You can edit all documents after they are generated.
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
          onClick={onGenerate}
          variant="contained"
          disabled={isGenerating}
          startIcon={
            isGenerating ? <CircularProgress size={16} /> : <AssignmentIcon />
          }
        >
          {isGenerating ? "Generating..." : "Generate Documents"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateDocumentsDialog;
