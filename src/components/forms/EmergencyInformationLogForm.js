import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  Paper
} from "@mui/material";

const EmergencyInformationLogForm = ({ data, handleInputChange, isStandalone = false }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Client Emergency Contact Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This document logs emergency contact information and important details
        about the client.
      </Typography>

      {!isStandalone && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Some fields are automatically populated from
            the intake form. Fields that are read-only are linked to the intake
            form data.
          </Typography>
        </Alert>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Client Basic Information */}
      <Typography variant="h6" gutterBottom>
        Client Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={data?.name || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone && true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth || "")}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone && true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="CSW (County Social Worker)"
            name="countyWorkerName"
            value={data?.countyWorkerName || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone && true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Intake"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate || "")}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone && true}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="County"
            name="nameOfCounty"
            value={data?.nameOfCounty || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone && true}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Status"
            name="clientStatus"
            value={data?.clientStatus || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone && true}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Case Number"
            name="caseNumber"
            value={data?.caseNumber || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone && true}
          />
        </Grid>
      </Grid>

      {/* Additional Client Information */}
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Additional Client Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Social Security Number"
              name="ssn"
              value={data?.ssn || ""}
              onChange={handleInputChange}
              placeholder="XXX-XX-XXXX"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Medi-Cal Number"
              name="mediCalNumber"
              value={data?.mediCalNumber || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              label="Height"
              name="height"
              value={data?.height || ""}
              onChange={handleInputChange}
              placeholder="5'10&quot;"
            />
          </Grid>
          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              label="Weight"
              name="weight"
              value={data?.weight || ""}
              onChange={handleInputChange}
              placeholder="150 lbs"
            />
          </Grid>
          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              label="Hair Color"
              name="hairColor"
              value={data?.hairColor || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              label="Eye Color"
              name="eyeColor"
              value={data?.eyeColor || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Distinguishing Marks"
              name="distinguishingMarks"
              value={data?.distinguishingMarks || ""}
              onChange={handleInputChange}
              multiline
              rows={2}
              placeholder="Scars, birthmarks, tattoos, etc."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Emergency Contact Information */}
      <Typography variant="h6" gutterBottom>
        Emergency Contact Information
      </Typography>
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Primary Emergency Contact
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="emergencyContactName"
              value={data?.emergencyContactName || data?.countyWorkerName || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Relationship"
              name="emergencyContactRelationship"
              value={data?.emergencyContactRelationship || "CSW"}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Phone Number"
              name="emergencyContactPhone"
              value={
                data?.emergencyContactPhone || data?.countyWorkerTelephone || ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label="Address"
              name="emergencyContactAddress"
              value={
                data?.emergencyContactAddress || data?.countyWorkerAddress || ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="City"
              name="emergencyContactCity"
              value={data?.emergencyContactCity || data?.countyWorkerCity || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="State"
              name="emergencyContactState"
              value={
                data?.emergencyContactState || data?.countyWorkerState || ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="emergencyContactZip"
              value={data?.emergencyContactZip || data?.countyWorkerZip || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Additional Contacts */}
      <Typography variant="h6" gutterBottom>
        Additional Contacts
      </Typography>

      {/* Doctor */}
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Medical Contact
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Doctor Name"
              name="doctorName"
              value={data?.doctorName || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Phone Number"
              name="doctorPhone"
              value={data?.doctorPhone || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* School */}
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Educational Contact
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="School Name"
              name="schoolName"
              value={data?.schoolName || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Phone Number"
              name="schoolPhone"
              value={data?.schoolPhone || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Visitation */}
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Visitation Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Visitation Schedule"
              name="visitationSchedule"
              value={data?.visitationSchedule || ""}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Visitor Name #1"
              name="visitorName1"
              value={data?.visitorName1 || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="visitorPhone1"
              value={data?.visitorPhone1 || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Visitor Name #2"
              name="visitorName2"
              value={data?.visitorName2 || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="visitorPhone2"
              value={data?.visitorPhone2 || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Employment */}
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Employment Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Employer Name"
              name="employerName"
              value={data?.employerName || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Phone Number"
              name="employerPhone"
              value={data?.employerPhone || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EmergencyInformationLogForm;