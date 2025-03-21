import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  Button,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MedicationOutlined as MedicationIcon,
  AccessTime as TimeIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  HealthAndSafety as HealthIcon,
} from "@mui/icons-material";

const MonthlyMedicationRecordForm = ({ data, handleInputChange }) => {
  // Initialize medications array if not present in data
  const initMedications = data?.medications || [
    { name: "", dosage: "", times: ["", "", "", ""] },
    { name: "", dosage: "", times: ["", "", "", ""] },
    { name: "", dosage: "", times: ["", "", "", ""] },
    { name: "", dosage: "", times: ["", "", "", ""] },
  ];

  // State for medications
  const [medications, setMedications] = useState(initMedications);

  // Initialize or use calendar data from props
  const [calendarData, setCalendarData] = useState(data?.calendarData || {});

  // Month dropdown options
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Year dropdown options (current year and next 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i);

  // Update local state when props change
  useEffect(() => {
    if (data?.medications) {
      setMedications(data.medications);
    }
    if (data?.calendarData) {
      setCalendarData(data.calendarData);
    }
  }, [data?.medications, data?.calendarData]);

  // Handle medication field change
  const handleMedicationChange = (medIndex, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[medIndex][field] = value;

    // Update both local state and parent component data
    setMedications(updatedMedications);
    handleInputChange({
      target: {
        name: "medications",
        value: updatedMedications,
      },
    });
  };

  // Handle time field change for a medication
  const handleTimeChange = (medIndex, timeIndex, value) => {
    const updatedMedications = [...medications];
    updatedMedications[medIndex].times[timeIndex] = value;

    // Update both local state and parent component data
    setMedications(updatedMedications);
    handleInputChange({
      target: {
        name: "medications",
        value: updatedMedications,
      },
    });
  };

  // Add a new medication
  const addMedication = () => {
    const updatedMedications = [
      ...medications,
      { name: "", dosage: "", times: ["", "", "", ""] },
    ];
    setMedications(updatedMedications);
    handleInputChange({
      target: {
        name: "medications",
        value: updatedMedications,
      },
    });
  };

  // Remove a medication
  const removeMedication = (indexToRemove) => {
    if (medications.length <= 1) {
      return; // Don't remove the last medication
    }

    const updatedMedications = medications.filter(
      (_, index) => index !== indexToRemove
    );
    setMedications(updatedMedications);
    handleInputChange({
      target: {
        name: "medications",
        value: updatedMedications,
      },
    });
  };

  // Handle calendar data update
  const handleCalendarDataChange = (updatedCalendarData) => {
    setCalendarData(updatedCalendarData);
    handleInputChange({
      target: {
        name: "calendarData",
        value: updatedCalendarData,
      },
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Monthly Medication Record
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form is used to track medications administered to a client
        throughout the month.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Several fields in this form are automatically
          populated from the intake form. Fields that are read-only are linked
          to the intake form data.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client and Physician Information */}
      <Typography variant="h6" gutterBottom>
        Client Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Client Name"
            name="name"
            value={data?.name || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !data?.isStandalone,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText={
              data?.isStandalone ? "" : "Auto-populated from intake form"
            }
            disabled={!data?.isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Attending Physician"
            name="attendingPhysician"
            value={data?.attendingPhysician || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HealthIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              name="month"
              value={data?.month || ""}
              onChange={handleInputChange}
              label="Month"
              startAdornment={
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              }
            >
              {monthOptions.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Year"
            name="year"
            value={data?.year || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Medications Section */}
      <Typography variant="h6" gutterBottom>
        Medications
      </Typography>
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Enter medication details below. Each medication can have multiple
          administration times. After saving the form, you will be able to check
          off days when medications were administered in the document view.
        </Typography>
      </Alert>

      <Paper sx={{ p: 2, mb: 3 }}>
        {medications.map((medication, medIndex) => (
          <Box
            key={`medication-${medIndex}`}
            sx={{
              mb: 3,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              position: "relative",
            }}
          >
            <IconButton
              size="small"
              color="error"
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                display: medications.length > 1 ? "flex" : "none",
              }}
              onClick={() => removeMedication(medIndex)}
            >
              <DeleteIcon />
            </IconButton>

            <Typography variant="subtitle1" gutterBottom>
              Medication #{medIndex + 1}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Medication Name"
                  value={medication.name}
                  onChange={(e) =>
                    handleMedicationChange(medIndex, "name", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MedicationIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dosage & Instructions"
                  value={medication.dosage}
                  onChange={(e) =>
                    handleMedicationChange(medIndex, "dosage", e.target.value)
                  }
                  placeholder="e.g., 500mg twice daily"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                  Administration Times
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "50px",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          #
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          Hour/Time
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {medication.times.map((time, timeIndex) => (
                        <TableRow key={`time-${medIndex}-${timeIndex}`}>
                          <TableCell
                            sx={{
                              fontSize: "12px",
                            }}
                          >
                            {timeIndex + 1}
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="e.g., 8:00 AM"
                              value={time}
                              onChange={(e) =>
                                handleTimeChange(
                                  medIndex,
                                  timeIndex,
                                  e.target.value
                                )
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <TimeIcon fontSize="small" color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addMedication}
          sx={{ mt: 1 }}
        >
          Add Medication
        </Button>
      </Paper>

      {/* No signature fields needed */}

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          After saving this form, you will be able to view the medication record
          and check off days when medications were administered. The calendar
          layout will show all 31 days of the month with checkboxes for each
          medication/time combination.
        </Typography>
      </Alert>
    </Box>
  );
};

export default MonthlyMedicationRecordForm;
