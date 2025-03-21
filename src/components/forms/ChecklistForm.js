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
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  School as SchoolIcon,
  Inventory as InventoryIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

const ChecklistForm = ({ data, handleInputChange }) => {
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
        Foster Parent Checklist
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This checklist must be completed when you have a new placement. Your
        social worker will ask for this form at the first weekly visit after
        placement.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Fields marked as read-only are automatically
          populated from the intake form.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Basic Information Section */}
      <Typography variant="h6" gutterBottom>
        Basic Information
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
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Placement"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Checklist Items Section */}
      <Typography variant="h6" gutterBottom>
        Checklist Items
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The following is a list of things that you must do immediately after
        placement.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.doctorAppointmentScheduled || false}
                onChange={handleCheckboxChange}
                name="doctorAppointmentScheduled"
              />
            }
            label="Schedule a doctor's appointment"
          />
          <TextField
            fullWidth
            label="Date Scheduled"
            name="doctorAppointmentDate"
            type="date"
            value={formatDateForInput(data?.doctorAppointmentDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            disabled={!data?.doctorAppointmentScheduled}
            sx={{ mt: 1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.dentalAppointmentScheduled || false}
                onChange={handleCheckboxChange}
                name="dentalAppointmentScheduled"
              />
            }
            label="Schedule a dental appointment"
          />
          <TextField
            fullWidth
            label="Date Scheduled"
            name="dentalAppointmentDate"
            type="date"
            value={formatDateForInput(data?.dentalAppointmentDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            disabled={!data?.dentalAppointmentScheduled}
            sx={{ mt: 1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.childEnrolledInSchool || false}
                onChange={handleCheckboxChange}
                name="childEnrolledInSchool"
              />
            }
            label="Enroll the child in school immediately if school is in session. If the child is staying in the same school, make sure to change the contact information at the school."
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.inventoryCompleted || false}
                onChange={handleCheckboxChange}
                name="inventoryCompleted"
              />
            }
            label="Complete child's inventory on all of his/her belongings."
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Visitation schedule and location, if known"
            name="visitationSchedule"
            value={data?.visitationSchedule || ""}
            onChange={handleInputChange}
            multiline
            rows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medications child is taking (name, dosage, and time of day to take it)"
            name="medications"
            value={data?.medications || ""}
            onChange={handleInputChange}
            multiline
            rows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MedicalIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date of first home visit (to be scheduled with Pathway Social Worker)"
            name="firstHomeVisitDate"
            type="date"
            value={formatDateForInput(data?.firstHomeVisitDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChecklistForm;
