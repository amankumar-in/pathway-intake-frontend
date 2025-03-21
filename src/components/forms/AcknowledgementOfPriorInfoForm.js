import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
} from "@mui/material";

const AcknowledgementOfPriorInfoForm = ({
  data,
  handleInputChange,
  isStandalone = false,
}) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Acknowledgement of Prior Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This document confirms the parent/guardian's understanding and
        acceptance of responsibility.
      </Typography>

      {!isStandalone && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Client name is automatically populated from
            the intake form. Fields that are read-only are linked to the intake
            form data.
          </Typography>
        </Alert>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Client Information - READ ONLY fields from intake (unless standalone) */}
      <Typography variant="h6" gutterBottom>
        Client Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Client Name"
            name="name"
            value={data?.name || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone && true}
          />
        </Grid>
      </Grid>

      {/* Signature Information */}
      <Typography variant="h6" gutterBottom>
        Signature Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Parent/Guardian Name"
            name="parentGuardianName"
            value={data?.parentGuardianName || ""}
            onChange={handleInputChange}
            helperText="Name of parent or guardian signing the document"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Signature Date"
            name="signatureDate"
            type="date"
            value={formatDateForInput(data?.signatureDate || "")}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Date of signature"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AcknowledgementOfPriorInfoForm;
