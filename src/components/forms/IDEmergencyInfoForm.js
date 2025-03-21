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
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  DateRange as DateIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocalHospital as HospitalIcon,
  Wc as GenderIcon,
  Assignment as AssignmentIcon,
  ContactPhone as ContactPhoneIcon,
  LocationCity as LocationIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

const IDEmergencyInfoForm = ({ data, handleInputChange }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        ID-Emergency Information Form
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form contains essential identification and emergency contact
        information for the child. Some fields are auto-populated from the
        intake form and cannot be edited here.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Fields marked with <strong>*</strong> are
          auto-populated from the intake form and cannot be modified here. You
          can edit these fields in the main intake form if needed.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client Information */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PersonIcon sx={{ mr: 1 }} /> Client Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Client Name *"
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
            label="Date of Birth *"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <DateIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Age *"
            name="age"
            type="number"
            value={data?.age || ""}
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
        <Grid item xs={12} md={4}>
          <FormControl fullWidth disabled>
            <InputLabel>Gender *</InputLabel>
            <Select
              name="gender"
              value={data?.gender || "Male"}
              label="Gender *"
              onChange={handleInputChange}
              inputProps={{ readOnly: true }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary">
            Auto-populated from intake form
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Social Security Number"
            name="formData.socialSecurityNumber"
            value={data?.socialSecurityNumber || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AssignmentIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Optional"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth disabled>
            <InputLabel>Office *</InputLabel>
            <Select
              name="office"
              value={data?.office || "Santa Maria"}
              label="Office *"
              onChange={handleInputChange}
              inputProps={{ readOnly: true }}
            >
              <MenuItem value="Santa Maria">Santa Maria</MenuItem>
              <MenuItem value="Bakersfield">Bakersfield</MenuItem>
              <MenuItem value="Riverside">Riverside</MenuItem>
              <MenuItem value="SBR">SBR</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary">
            Auto-populated from intake form
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth disabled>
            <InputLabel>Client Status *</InputLabel>
            <Select
              name="clientStatus"
              value={data?.clientStatus || 300}
              label="Client Status *"
              onChange={handleInputChange}
              inputProps={{ readOnly: true }}
            >
              <MenuItem value={300}>300</MenuItem>
              <MenuItem value={601}>601</MenuItem>
              <MenuItem value={602}>602</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary">
            Auto-populated from intake form
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth disabled>
            <InputLabel>Prior Placement *</InputLabel>
            <Select
              name="priorPlacement"
              value={data?.priorPlacement || ""}
              label="Prior Placement *"
              onChange={handleInputChange}
              inputProps={{ readOnly: true }}
            >
              <MenuItem value="Natural Parent">Natural Parent</MenuItem>
              <MenuItem value="County Facility">County Facility</MenuItem>
              <MenuItem value="County Foster Home">County Foster Home</MenuItem>
              <MenuItem value="County Hospital">County Hospital</MenuItem>
              <MenuItem value="Foster Care Agency">Foster Care Agency</MenuItem>
              <MenuItem value="Friend of Family">Friend of Family</MenuItem>
              <MenuItem value="Group Home">Group Home</MenuItem>
              <MenuItem value="Jamison Center">Jamison Center</MenuItem>
              <MenuItem value="Legal Guardianship">Legal Guardianship</MenuItem>
              <MenuItem value="Relative">Relative</MenuItem>
              <MenuItem value="Unknown">Unknown</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary">
            Auto-populated from intake form
          </Typography>
        </Grid>
      </Grid>

      {/* Admission Information */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <DateIcon sx={{ mr: 1 }} /> Admission Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date Admitted to Facility *"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <DateIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-populated from intake form transaction date"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date Left Facility"
            name="formData.dateLeft"
            type="date"
            value={formatDateForInput(data?.dateLeft)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Date child left the facility (if applicable)"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Forwarding Address"
            name="formData.forwardingAddress"
            value={data?.forwardingAddress || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Where child went after leaving facility"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Reasons for Leaving Facility"
            name="formData.reasonsForLeaving"
            value={data?.reasonsForLeaving || ""}
            onChange={handleInputChange}
            helperText="Explain why the child left the facility"
          />
        </Grid>
      </Grid>

      {/* County Information - These are mapped based on office selection */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LocationIcon sx={{ mr: 1 }} /> County Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name of County *"
            name="nameOfCounty"
            value={data?.nameOfCounty || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-populated based on office selection"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Name *"
            name="countyWorkerName"
            value={data?.countyWorkerName || ""}
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
            label="County Worker Telephone *"
            name="countyWorkerTelephone"
            value={data?.countyWorkerTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
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
            label="County Worker Address *"
            name="countyWorkerAddress"
            value={data?.countyWorkerAddress || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Pathway Information */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HomeIcon sx={{ mr: 1 }} /> Pathway Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pathway Representative *"
            name="pathwayRepresentative"
            value={data?.pathwayRepresentative || ""}
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
            label="Phone Number *"
            name="phoneNumber"
            value={data?.phoneNumber || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Pathway Address"
            name="formData.pathwayAddress"
            value={data?.pathwayAddress || getOfficeAddress(data?.office)}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-filled based on office selection, but can be modified"
          />
        </Grid>
      </Grid>

      {/* Emergency Contact - Nearest Relative */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PersonIcon sx={{ mr: 1 }} /> Nearest Relative Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nearest Relative Name"
            name="formData.nearestRelativeName"
            value={data?.nearestRelativeName || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Name of closest relative (optional)"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relationship to Client"
            name="formData.nearestRelativeRelationship"
            value={data?.nearestRelativeRelationship || ""}
            onChange={handleInputChange}
            helperText="E.g., Mother, Father, Grandparent, etc."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address"
            name="formData.nearestRelativeAddress"
            value={data?.nearestRelativeAddress || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Telephone"
            name="formData.nearestRelativeTelephone"
            value={data?.nearestRelativeTelephone || ""}
            onChange={handleInputChange}
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

      {/* Emergency Contacts - Professionals */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HospitalIcon sx={{ mr: 1 }} /> Professional Contacts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Physician
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Physician Name"
            name="formData.physicianName"
            value={data?.physicianName || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Physician Telephone"
            name="formData.physicianTelephone"
            value={data?.physicianTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Physician Address"
            name="formData.physicianAddress"
            value={data?.physicianAddress || ""}
            onChange={handleInputChange}
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
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Mental Health Provider
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mental Health Provider Name"
            name="formData.mentalHealthName"
            value={data?.mentalHealthName || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mental Health Provider Telephone"
            name="formData.mentalHealthTelephone"
            value={data?.mentalHealthTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mental Health Provider Address"
            name="formData.mentalHealthAddress"
            value={data?.mentalHealthAddress || ""}
            onChange={handleInputChange}
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
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Dentist
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Dentist Name"
            name="formData.dentistName"
            value={data?.dentistName || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Dentist Telephone"
            name="formData.dentistTelephone"
            value={data?.dentistTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dentist Address"
            name="formData.dentistAddress"
            value={data?.dentistAddress || ""}
            onChange={handleInputChange}
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

      {/* Emergency Contacts - Other */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ContactPhoneIcon sx={{ mr: 1 }} /> Other Emergency Contacts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Relative
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relative Name"
            name="formData.relativeName"
            value={data?.relativeName || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relative Telephone"
            name="formData.relativeTelephone"
            value={data?.relativeTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Relative Address"
            name="formData.relativeAddress"
            value={data?.relativeAddress || ""}
            onChange={handleInputChange}
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
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Friend
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Friend Name"
            name="formData.friendName"
            value={data?.friendName || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Friend Telephone"
            name="formData.friendTelephone"
            value={data?.friendTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Friend Address"
            name="formData.friendAddress"
            value={data?.friendAddress || ""}
            onChange={handleInputChange}
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

      {/* Hospital Information - These are mapped based on office location */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HospitalIcon sx={{ mr: 1 }} /> Hospital Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Hospital Name"
            name="formData.hospitalName"
            value={data?.hospitalName || getHospitalName(data?.office)}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HospitalIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-filled based on office selection, but can be modified"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Hospital Address"
            name="formData.hospitalAddress"
            value={data?.hospitalAddress || getHospitalAddress(data?.office)}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-filled based on office selection, but can be modified"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Medical Plan"
            name="formData.medicalPlan"
            value={data?.medicalPlan || "MEDI-CAL"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Dental Plan"
            name="formData.dentalPlan"
            value={data?.dentalPlan || "MEDI-CAL"}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Medical Information */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HospitalIcon sx={{ mr: 1 }} /> Medical Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Ambulatory Status</InputLabel>
            <Select
              name="formData.ambulatoryStatus"
              value={data?.ambulatoryStatus || "AMBULATORY"}
              label="Ambulatory Status"
              onChange={handleInputChange}
            >
              <MenuItem value="AMBULATORY">AMBULATORY</MenuItem>
              <MenuItem value="NON-AMBULATORY">NON-AMBULATORY</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Religious Preference"
            name="formData.religiousPreference"
            value={data?.religiousPreference || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Medical Comments"
            name="formData.comments"
            value={data?.comments || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Parent Information */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PersonIcon sx={{ mr: 1 }} /> Parent Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Parent Name"
            name="formData.parentName"
            value={data?.parentName || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Parent Telephone"
            name="formData.parentTelephone"
            value={data?.parentTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Parent Address"
            name="formData.parentAddress"
            value={data?.parentAddress || ""}
            onChange={handleInputChange}
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
            multiline
            rows={2}
            label="Court Status Notes"
            name="formData.courtStatusNotes"
            value={data?.courtStatusNotes || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Prior Living Situation */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HomeIcon sx={{ mr: 1 }} /> Prior Living Situation
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Prior Guardian Name"
            name="formData.priorGuardianName"
            value={data?.priorGuardianName || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relationship"
            name="formData.priorGuardianRelationship"
            value={data?.priorGuardianRelationship || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Prior Guardian Address"
            name="formData.priorGuardianAddress"
            value={data?.priorGuardianAddress || ""}
            onChange={handleInputChange}
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

      {/* Visitation & Restrictions */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 3,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <SchoolIcon sx={{ mr: 1 }} /> Visitation & Restrictions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Visitation Restrictions"
            name="formData.visitationRestrictions"
            value={data?.visitationRestrictions || ""}
            onChange={handleInputChange}
            helperText="Persons not authorized to visit child"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Family Visitation Restrictions"
            name="formData.familyVisitationRestrictions"
            value={data?.familyVisitationRestrictions || ""}
            onChange={handleInputChange}
            helperText="Family residence visitation restrictions"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Persons Authorized to Remove Child"
            name="formData.personsAuthorizedToRemove"
            value={data?.personsAuthorizedToRemove || ""}
            onChange={handleInputChange}
            helperText="List all persons authorized to remove child from home"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Telephone Access</InputLabel>
            <Select
              name="formData.telephoneAccess"
              value={data?.telephoneAccess || "Allowed"}
              label="Telephone Access"
              onChange={handleInputChange}
            >
              <MenuItem value="Allowed">Allowed</MenuItem>
              <MenuItem value="Limited">Limited</MenuItem>
              <MenuItem value="Supervised Only">Supervised Only</MenuItem>
              <MenuItem value="Not Allowed">Not Allowed</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary">
            Child's ability to make and receive confidential calls
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper functions to get office-specific information
const getOfficeAddress = (office) => {
  switch (office) {
    case "Bakersfield":
      return "5000 California Ave #209, Bakersfield, CA 93309";
    case "Riverside":
      return "1600 N Florida Ave #301, Hemet, CA 92544";
    case "Santa Maria":
      return "218 W Carmen Ln #208, Santa Maria, CA 93458";
    case "SBR":
      return "1200 S Woodland St #D, San Bernardino, CA 92408";
    default:
      return "218 W Carmen Ln #208, Santa Maria, CA 93458";
  }
};

const getHospitalName = (office) => {
  switch (office) {
    case "Bakersfield":
      return "KERN MEDICAL CENTER";
    case "Riverside":
      return "HEMET VALLEY MEDICAL CENTER";
    case "Santa Maria":
      return "VALLEY COMMUNITY HOSPITAL";
    case "SBR":
      return "SAN BERNARDINO COMMUNITY HOSPITAL";
    default:
      return "VALLEY COMMUNITY HOSPITAL";
  }
};

const getHospitalAddress = (office) => {
  switch (office) {
    case "Bakersfield":
      return "1830 Flower St, Bakersfield, CA 93305";
    case "Riverside":
      return "1117 E Devonshire Ave, Hemet, CA 92543";
    case "Santa Maria":
      return "505 Plaza Drive, Santa Maria, CA 93454";
    case "SBR":
      return "1805 Medical Center Dr, San Bernardino, CA 92411";
    default:
      return "505 Plaza Drive, Santa Maria, CA 93454";
  }
};

export default IDEmergencyInfoForm;
