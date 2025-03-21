import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Alert,
} from "@mui/material";

const PRNAuthorizationLetterForm = ({ data, handleInputChange }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    handleInputChange({
      target: {
        name,
        value: checked,
      },
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        PRN Authorization Letter
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This letter should be completed by the medical professional responsible
        for prescribing PRN medications to the client.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Some fields in this form are automatically
          populated from the intake form. Fields that are read-only are linked
          to the intake form data.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Doctor Information */}
      <Typography variant="h6" gutterBottom>
        Medical Professional Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Doctor's Name"
            name="doctorName"
            value={data?.doctorName || ""}
            onChange={handleInputChange}
            placeholder="Dr. John Smith"
          />
        </Grid>
      </Grid>

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
            label="Case Number"
            name="caseNumber"
            value={data?.caseNumber || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Signature Information */}
      <Typography variant="h6" gutterBottom>
        Signature Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Social Worker Title"
            name="positionJobTitle"
            value={data?.positionJobTitle || "Social Worker"}
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
            label="Phone Number"
            name="phoneNumber"
            value={data?.phoneNumber || ""}
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
            label="Date"
            name="signatureDate"
            type="date"
            value={formatDateForInput(
              data?.signatureDate || data?.transactionDate || new Date()
            )}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Checkbox Options */}
      <Typography variant="h6" gutterBottom>
        Patient Assessment
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Please select which circumstance describes your patient:
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={data?.canDetermineMedication || false}
              onChange={handleCheckboxChange}
              name="canDetermineMedication"
            />
          }
          label="My patient can determine and clearly communicate his/her need for prescription and nonprescription medication on a PRN basis."
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data?.cannotDeterminePrescription || false}
              onChange={handleCheckboxChange}
              name="cannotDeterminePrescription"
            />
          }
          label="My patient cannot determine his/her own need for nonprescription PRN medication, but can clearly communicate his/her symptoms indicating a need for nonprescription medication."
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data?.cannotDetermineOrCommunicate || false}
              onChange={handleCheckboxChange}
              name="cannotDetermineOrCommunicate"
            />
          }
          label="My patient cannot determine his/her need for prescription and/or nonprescription PRN medication and cannot clearly communicate his/her symptoms indicating a need for nonprescription PRN medication. (Licensee must contact physician before each dose.)"
        />
      </FormGroup>

      {/* Additional Information */}
      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Information"
            name="additionalInfo"
            value={data?.additionalInfo || ""}
            onChange={handleInputChange}
            multiline
            rows={4}
            placeholder="Enter any additional information or notes here"
          />
        </Grid>
      </Grid>

      {/* Medical Professional's Signature */}
      <Typography variant="h6" gutterBottom>
        Medical Professional's Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Medical Professional's Name"
            name="medicalProfessionalName"
            value={data?.medicalProfessionalName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Medical Professional's Signature Date"
            name="medicalProfessionalSignatureDate"
            type="date"
            value={formatDateForInput(
              data?.medicalProfessionalSignatureDate || ""
            )}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PRNAuthorizationLetterForm;
