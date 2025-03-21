import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Alert,
} from "@mui/material";

const DentalTreatmentRecordForm = ({ data, handleInputChange }) => {
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

  // Handle radio button changes
  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    handleInputChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Dental Treatment Record
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form is used to document dental examinations and treatments.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Client Name and Date of Birth are automatically
          populated from the intake form data.
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
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Examination Type */}
      <Typography variant="h6" gutterBottom>
        Examination Type
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              name="examinationType"
              value={data?.examinationType || ""}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="initial"
                control={<Radio />}
                label="INITIAL EXAM"
              />
              <FormControlLabel
                value="annual"
                control={<Radio />}
                label="ANNUAL EXAM"
              />
              <FormControlLabel
                value="followUp"
                control={<Radio />}
                label="FOLLOW-UP EXAM"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      {/* Dental Provider Information */}
      <Typography variant="h6" gutterBottom>
        Dental Provider Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name of Dental Office"
            name="dentalOfficeName"
            value={data?.dentalOfficeName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name of Dentist"
            name="dentistName"
            value={data?.dentistName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="dentalOfficeAddress"
            value={data?.dentalOfficeAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone"
            name="dentalOfficePhone"
            value={data?.dentalOfficePhone || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Treatment Information */}
      <Typography variant="h6" gutterBottom>
        Treatment Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Treatment"
            name="treatmentDate"
            type="date"
            value={formatDateForInput(data?.treatmentDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Type of Treatment"
            name="treatmentType"
            value={data?.treatmentType || ""}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      {/* Follow-up Information */}
      <Typography variant="h6" gutterBottom>
        Follow-up Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="body2" gutterBottom>
              Follow-up treatment needed:
            </Typography>
            <RadioGroup
              row
              name="followupNeeded"
              value={data?.followupNeeded || ""}
              onChange={handleRadioChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="YES" />
              <FormControlLabel value="no" control={<Radio />} label="NO" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="If yes, please explain"
            name="followupExplanation"
            value={data?.followupExplanation || ""}
            onChange={handleInputChange}
            multiline
            rows={4}
            disabled={data?.followupNeeded !== "yes"}
          />
        </Grid>
      </Grid>

      {/* Signature Information */}
      <Typography variant="h6" gutterBottom>
        Signature Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dentist Signature Date"
            name="signatureDate"
            type="date"
            value={formatDateForInput(data?.signatureDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DentalTreatmentRecordForm;
