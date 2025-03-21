import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

const ClientInitialCarePlanForm = ({
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
        Client Initial CARE Plan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form documents the initial care plan for the client, including
        needs assessment, appointments, and goals.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong>{" "}
          {isStandalone
            ? "All fields are editable in standalone document mode."
            : "Client name, DOB, DOI, and Status are automatically populated from the intake form."}
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client Information */}
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
              readOnly: !isStandalone,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText={
              isStandalone
                ? "Enter client's full name"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={2}>
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
                ? "Enter client's date of birth"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Date of Intake"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
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
                ? "Enter intake date"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Status"
            name="clientStatus"
            value={data?.clientStatus || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone
                ? "Enter client status code"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
      </Grid>

      {/* Placement Type Checkboxes */}
      <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Placement Type
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.isReunification || false}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: "isReunification",
                        value: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Reunification"
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.isPlacement || false}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: "isPlacement",
                        value: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Placement"
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.isSiblingPlacement || false}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: "isSiblingPlacement",
                        value: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Sibling Placement"
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.isAdoption || false}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: "isAdoption",
                        value: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Adoption"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 1: General Needs */}
      <Typography variant="h6" gutterBottom>
        1. General Needs and Services
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Brief description of client's emotional/behavioral and social problems;
        functional capabilities; ability to handle personal cash resources and
        perform simple homemaking tasks; client's likes and dislikes.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={5}
        name="generalNeeds"
        value={data?.generalNeeds || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {/* Section 2: Physical/Health */}
      <Typography variant="h6" gutterBottom>
        2. Physical/Health
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Difficulty with physical development and poor health habits regarding
        body functions and include allergies, medications, and physical
        restrictions; general medical dental needs.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={5}
        name="physicalHealth"
        value={data?.physicalHealth || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {/* Section 3: Scheduled Client Dates */}
      <Typography variant="h6" gutterBottom>
        3. Scheduled Client Dates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Include medical, dental, counseling, testing, support groups, court,
        home visits, friends & reunification meetings.
      </Typography>

      <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Required Appointments
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="CHDP Physical Date"
              name="chdpPhysicalDate"
              type="date"
              value={formatDateForInput(data?.chdpPhysicalDate)}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              helperText="Required within 30 days"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="CHDP Dental Date"
              name="chdpDentalDate"
              type="date"
              value={formatDateForInput(data?.chdpDentalDate)}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              helperText="Required within 30 days"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Social Worker Visits"
              name="socialWorkerVisitSchedule"
              value={data?.socialWorkerVisitSchedule || "WEEKLY & BI WEEKLY"}
              onChange={handleInputChange}
              helperText="Visit frequency"
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Appointments"
            name="additionalAppointments"
            value={data?.additionalAppointments || ""}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Appointment Details"
            name="appointmentDetails"
            value={data?.appointmentDetails || ""}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* Section 4: Client Contacts */}
      <Typography variant="h6" gutterBottom>
        4. Client Contacts
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Frequency and time frames of home visits; phone calls to natural family
        or friends; reunification meetings.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="clientContacts"
        value={data?.clientContacts || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {/* Section 5: School/Educational/Developmental Needs */}
      <Typography variant="h6" gutterBottom>
        5. School / Educational / Developmental Needs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Goals, objectives, difficulties and limitations. Support child's
        educational needs. Enroll into school, daycare or Head Start as
        applicable.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="educationalNeeds"
        value={data?.educationalNeeds || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {/* Section 6: Counseling */}
      <Typography variant="h6" gutterBottom>
        6. Counseling, Testing, Support Group Agreements
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Goals, objectives, difficulty with intellectual functioning.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="counselingAgreements"
        value={data?.counselingAgreements || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {/* Section 7: Independent Living Program */}
      <Typography variant="h6" gutterBottom>
        7. Independent Living Program
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={2}
        name="independentLivingProgram"
        value={data?.independentLivingProgram || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {/* Section 8: Religious Preference */}
      <Typography variant="h6" gutterBottom>
        8. Religious Preference
      </Typography>
      <TextField
        fullWidth
        name="religiousPreference"
        value={data?.religiousPreference || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {/* Section 9: Additional Information */}
      <Typography variant="h6" gutterBottom>
        9. Additional Information
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="additionalInformation"
        value={data?.additionalInformation || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 3 }}
      />
    </Box>
  );
};

export default ClientInitialCarePlanForm;
