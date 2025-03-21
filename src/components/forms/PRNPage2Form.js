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

const PRNPage2Form = ({ data, handleInputChange, isStandalone = false }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Medical Professional's Check List of Recommended Over the Counter (OTC)
        Medications for PRN Administration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Regulations preclude foster parents from administering medication on a
        PRN basis without prior approval and instruction from a medical
        professional. This includes Over The Counter (OTC) medications. The
        following form is provided to indicate those medications that are not
        appropriate for the child. Any category removed will require phone or
        office contact prior to administration.
      </Typography>

      {/* Only show this alert for non-standalone documents */}
      {!isStandalone && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Client name, age, and date of birth are
            automatically populated from the intake form. You only need to fill
            in the remaining fields.
          </Typography>
        </Alert>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Client Information - READ ONLY only when not standalone */}
      <Typography variant="h6" gutterBottom>
        Client Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Child's Name"
            name="name"
            value={data?.name || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={!isStandalone ? "Auto-populated from intake form" : ""}
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={data?.age || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
              inputProps: { min: 0 },
            }}
            helperText={!isStandalone ? "Auto-populated from intake form" : ""}
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth)}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            InputLabelProps={{ shrink: true }}
            helperText={!isStandalone ? "Auto-populated from intake form" : ""}
            disabled={!isStandalone}
          />
        </Grid>
      </Grid>

      {/* Medical Professional Information - Manual fields */}
      <Typography variant="h6" gutterBottom>
        Medical Professional Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Medical Professional's Name"
            name="medicalProfessionalName"
            value={data?.medicalProfessionalName || ""}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Office Phone"
            name="officePhone"
            value={data?.officePhone || ""}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="After Hours Phone"
            name="afterHoursPhone"
            value={data?.afterHoursPhone || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
        In each category, please CROSS OFF the medication that is NOT acceptable
        for this child.
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, fontStyle: "italic" }}>
        Please use medication per label instructions.
      </Typography>

      {/* Medication Categories - These would be displayed in the template */}
      <Typography variant="h6" gutterBottom>
        Medication Categories
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          The medication categories will be displayed in the document for the
          medical professional to cross off medications that are NOT acceptable.
          You do not need to fill this out electronically.
        </Typography>
      </Alert>

      {/* Signature Details */}
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
      </Grid>
    </Box>
  );
};

export default PRNPage2Form;
