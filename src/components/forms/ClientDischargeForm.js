import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const ClientDischargeForm = ({ data, handleInputChange }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Client Discharge
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This document outlines Pathway Family Services' policies regarding
        planned and unplanned terminations.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Client name is automatically populated from the
          intake form. Fields that are read-only are linked to the intake form
          data.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client Information - READ ONLY fields from intake */}
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
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Additional Fields - Document specific fields that can be edited */}
      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Discharge Reason"
            name="dischargeReason"
            select
            value={data?.dischargeReason || ""}
            onChange={handleInputChange}
            helperText="Reason for client discharge or placement change"
          >
            <MenuItem value="Achievement of Treatment Plan">
              Achievement of Treatment Plan
            </MenuItem>
            <MenuItem value="Reunification with Family">
              Reunification with Family
            </MenuItem>
            <MenuItem value="Guardianship or Adoption">
              Guardianship or Adoption
            </MenuItem>
            <MenuItem value="Change in Foster Family Circumstances">
              Change in Foster Family Circumstances
            </MenuItem>
            <MenuItem value="Client Request">Client Request</MenuItem>
            <MenuItem value="Placement Agency Request">
              Placement Agency Request
            </MenuItem>
            <MenuItem value="Court Order">Court Order</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Details"
            name="additionalDetails"
            multiline
            rows={4}
            value={data?.additionalDetails || ""}
            onChange={handleInputChange}
            helperText="Please provide any additional details about the discharge"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Termination Report Prepared By"
            name="reportPreparedBy"
            value={data?.reportPreparedBy || ""}
            onChange={handleInputChange}
            helperText="Name of social worker who prepared the termination report"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Termination Report Date"
            name="reportDate"
            type="date"
            value={formatDateForInput(data?.reportDate || "")}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Date termination report was prepared"
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
            label="Client Signature Date"
            name="clientSignatureDate"
            type="date"
            value={formatDateForInput(data?.clientSignatureDate || "")}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Date of client signature"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Name"
            name="countyWorkerName"
            value={data?.countyWorkerName || ""}
            onChange={handleInputChange}
            helperText="Name of county worker or authorized representative"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Signature Date"
            name="countyWorkerSignatureDate"
            type="date"
            value={formatDateForInput(data?.countyWorkerSignatureDate || "")}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Date of county worker signature"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDischargeForm;
