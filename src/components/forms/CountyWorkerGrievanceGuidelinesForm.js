import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
} from "@mui/material";

const CountyWorkerGrievanceGuidelinesForm = ({ data, handleInputChange }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        County Worker Grievance Guidelines
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Guidelines for county workers to address grievances with Pathway Family
        Services.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> County worker information is automatically
          populated from the intake form. The dates can be edited as needed.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* County Worker Information - READ ONLY field from intake */}
      <Typography variant="h6" gutterBottom>
        County Worker Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Name"
            name="countyWorkerName"
            value={data?.countyWorkerName || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Signature Date Information - Editable fields */}
      <Typography variant="h6" gutterBottom>
        Signature Dates
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Signature Date"
            name="countyWorkerSignatureDate"
            type="date"
            value={formatDateForInput(data?.countyWorkerSignatureDate || "")}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Date when the county worker signed"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pathway Representative Signature Date"
            name="pathwayRepSignatureDate"
            type="date"
            value={formatDateForInput(data?.pathwayRepSignatureDate || "")}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Date when the Pathway representative signed"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CountyWorkerGrievanceGuidelinesForm;
