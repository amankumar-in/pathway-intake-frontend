import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
} from "@mui/material";

const ClientDisciplinaryPPForm = ({
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
        Client Disciplinary Policy & Procedures
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This document outlines the disciplinary policies and procedures for
        clients in foster care.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong>{" "}
          {isStandalone
            ? "All fields can be edited in standalone mode."
            : "Client name is automatically populated from the intake form."}
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client Information */}
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
            helperText={
              isStandalone
                ? "Enter client name"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
      </Grid>

      {/* Signature Dates */}
      <Typography variant="h6" gutterBottom>
        Signature Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Client Signature Date"
            name="clientSignatureDate"
            type="date"
            value={formatDateForInput(data?.clientSignatureDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Date when client signed the document"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Signature Date"
            name="countyWorkerSignatureDate"
            type="date"
            value={formatDateForInput(data?.countyWorkerSignatureDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Date when county worker signed the document"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDisciplinaryPPForm;
