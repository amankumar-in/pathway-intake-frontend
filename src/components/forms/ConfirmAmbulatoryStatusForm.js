import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
} from "@mui/material";

const ConfirmAmbulatoryStatusForm = ({
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
        Confirmation of Ambulatory Status
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form certifies that the client has been examined by a medical
        professional and confirms their ambulatory status.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong>{" "}
          {isStandalone
            ? "All fields are editable in standalone document mode."
            : "Child's name and DOB are automatically populated from the intake form. The examination date and medical professional details need to be entered manually."}
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
            label="Child's Name"
            name="name"
            value={data?.name || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone
                ? "Enter child's full name"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
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
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone
                ? "Enter child's date of birth"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
      </Grid>

      {/* Examination Information - Manual entry fields */}
      <Typography variant="h6" gutterBottom>
        Examination Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Examination Date"
            name="examinationDate"
            type="date"
            value={formatDateForInput(data?.examinationDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
            helperText="Date when the client was examined"
          />
        </Grid>
      </Grid>

      {/* Medical Professional Information - Manual entry fields */}
      <Typography variant="h6" gutterBottom>
        Medical Professional Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name of Medical Professional"
            name="medicalProfessionalName"
            value={data?.medicalProfessionalName || ""}
            onChange={handleInputChange}
            required
            helperText="Full name of the medical professional who performed the examination"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="California License Number"
            name="licenseNumber"
            value={data?.licenseNumber || ""}
            onChange={handleInputChange}
            required
            helperText="Medical professional's license number"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="medicalProfessionalAddress"
            value={data?.medicalProfessionalAddress || ""}
            onChange={handleInputChange}
            helperText="Street address of the medical professional"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="medicalProfessionalCity"
            value={data?.medicalProfessionalCity || ""}
            onChange={handleInputChange}
            helperText="City of the medical professional"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Zip Code"
            name="medicalProfessionalZip"
            value={data?.medicalProfessionalZip || ""}
            onChange={handleInputChange}
            helperText="Zip code of the medical professional"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Phone Number"
            name="medicalProfessionalPhone"
            value={data?.medicalProfessionalPhone || ""}
            onChange={handleInputChange}
            helperText="Contact phone number of the medical professional"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConfirmAmbulatoryStatusForm;
