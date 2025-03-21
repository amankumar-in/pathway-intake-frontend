import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as MedicalIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

const ConfirmTBTestForm = ({
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
        Confirmation of T.B. Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        (Required by State of California)
      </Typography>
      {!isStandalone && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Child's name and date of birth are
            automatically populated from the intake form. All other fields can
            be manually entered.
          </Typography>
        </Alert>
      )}
      {isStandalone && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> All fields can be manually edited in
            standalone mode.
          </Typography>
        </Alert>
      )}

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
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText={
              isStandalone
                ? "Enter the child's full name"
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
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText={
              isStandalone
                ? "Enter the child's date of birth"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
      </Grid>

      {/* TB Test Information */}
      <Typography variant="h6" gutterBottom>
        TB Test Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            This is to certify that the above named child was tested for active
            Tuberculosis on:
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Test Date"
            name="tbTestDate"
            type="date"
            value={data?.tbTestDate || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Enter the date when the TB test was administered"
          />
        </Grid>
      </Grid>

      {/* Medical Professional Information */}
      <Typography variant="h6" gutterBottom>
        Medical Professional Information
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        THIS CERTIFICATE MUST BE SIGNED BY A MEDICAL PROFESSIONAL LICENSED IN
        THE STATE OF CALIFORNIA.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name of Medical Professional"
            name="medicalProfessionalName"
            value={data?.medicalProfessionalName || ""}
            onChange={handleInputChange}
            helperText="Enter the full name of the medical professional"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MedicalIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="California License Number"
            name="licenseNumber"
            value={data?.licenseNumber || ""}
            onChange={handleInputChange}
            helperText="Enter the license number of the medical professional"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="medicalAddress"
            value={data?.medicalAddress || ""}
            onChange={handleInputChange}
            helperText="Enter the complete address of the medical practice"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            name="medicalCity"
            value={data?.medicalCity || ""}
            onChange={handleInputChange}
            helperText="City of the medical practice"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Zip Code"
            name="medicalZip"
            value={data?.medicalZip || ""}
            onChange={handleInputChange}
            helperText="Zip code of the medical practice"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="medicalPhone"
            value={data?.medicalPhone || ""}
            onChange={handleInputChange}
            helperText="Contact phone number for the medical professional"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Signature Information - Note: Actual signatures are handled by the signature system */}
      <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
        Signature Information
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        The signature of the licensed medical professional will be collected
        separately.
      </Typography>
    </Box>
  );
};

export default ConfirmTBTestForm;
