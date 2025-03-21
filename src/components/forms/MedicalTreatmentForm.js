import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Alert,
} from "@mui/material";

const MedicalTreatmentForm = ({ data, handleInputChange }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Consent For Medical Treatment Of Client
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form authorizes Pathway Family Services and foster parents to
        provide medical and dental care for the client.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Client name and county of placement are
          automatically populated from the intake form. The medication allergies
          field should be filled in manually.
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
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County of Placement"
            name="nameOfCounty"
            value={data?.nameOfCounty || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Medication Allergies - Editable manual field */}
      <Typography variant="h6" gutterBottom>
        Medication Allergies
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medication Allergies"
            name="medicationAllergies"
            value={data?.medicationAllergies || ""}
            onChange={handleInputChange}
            multiline
            rows={4}
            helperText="Enter any known medication allergies for this client. If none, enter 'None known'."
          />
        </Grid>
      </Grid>

      {/* Parent/Guardian Information - Editable manual fields */}
      <Typography variant="h6" gutterBottom>
        Parent or Authorized Representative Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Parent/Representative Address"
            name="parentAddress"
            value={data?.parentAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Phone Number"
            name="parentPhone"
            value={data?.parentPhone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Fax Number"
            name="parentFax"
            value={data?.parentFax || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Signature Date - Editable manual field */}
      <Typography variant="h6" gutterBottom>
        Signature Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Signature Date"
            name="signatureDate"
            type="date"
            value={formatDateForInput(data?.signatureDate || "")}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pathway Representative"
            name="pathwayRepresentative"
            value={data?.pathwayRepresentative || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MedicalTreatmentForm;
