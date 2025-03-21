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
} from "@mui/material";

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
        This form allows you to edit information for the ID-Emergency
        Information document. This information is used for emergency contacts
        and identification.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Some fields are automatically populated based on the intake form data.
        Others are specific to this document and can be customized here.
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={data?.age || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={data?.gender || ""}
              label="Gender"
              onChange={handleInputChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Social Security Number (Optional)"
            name="formData.socialSecurityNumber"
            value={data?.socialSecurityNumber || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Client Status</InputLabel>
            <Select
              name="clientStatus"
              value={data?.clientStatus || ""}
              label="Client Status"
              onChange={handleInputChange}
            >
              <MenuItem value={300}>300</MenuItem>
              <MenuItem value={601}>601</MenuItem>
              <MenuItem value={602}>602</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Admission Information */}
      <Typography variant="h6" gutterBottom>
        Admission Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date Admitted to Facility"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Prior Placement</InputLabel>
            <Select
              name="priorPlacement"
              value={data?.priorPlacement || ""}
              label="Prior Placement"
              onChange={handleInputChange}
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Forwarding Address"
            name="formData.forwardingAddress"
            value={data?.forwardingAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Reasons for Leaving Facility"
            name="formData.reasonsForLeaving"
            value={data?.reasonsForLeaving || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* County Information */}
      <Typography variant="h6" gutterBottom>
        County Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Office</InputLabel>
            <Select
              name="office"
              value={data?.office || "Santa Maria"}
              label="Office"
              onChange={handleInputChange}
            >
              <MenuItem value="Santa Maria">Santa Maria</MenuItem>
              <MenuItem value="Bakersfield">Bakersfield</MenuItem>
              <MenuItem value="Riverside">Riverside</MenuItem>
              <MenuItem value="SBR">SBR</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name of County"
            name="nameOfCounty"
            value={data?.nameOfCounty || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Name"
            name="countyWorkerName"
            value={data?.countyWorkerName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Telephone"
            name="countyWorkerTelephone"
            value={data?.countyWorkerTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="County Worker Address"
            name="countyWorkerAddress"
            value={data?.countyWorkerAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Pathway Information */}
      <Typography variant="h6" gutterBottom>
        Pathway Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pathway Representative"
            name="pathwayRepresentative"
            value={data?.pathwayRepresentative || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={data?.phoneNumber || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Pathway Address"
            name="formData.pathwayAddress"
            value={data?.pathwayAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Emergency Contact - Nearest Relative */}
      <Typography variant="h6" gutterBottom>
        Nearest Relative Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nearest Relative Name"
            name="formData.nearestRelativeName"
            value={data?.nearestRelativeName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relationship to Client"
            name="formData.nearestRelativeRelationship"
            value={data?.nearestRelativeRelationship || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address"
            name="formData.nearestRelativeAddress"
            value={data?.nearestRelativeAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Telephone"
            name="formData.nearestRelativeTelephone"
            value={data?.nearestRelativeTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Emergency Contacts - Professionals */}
      <Typography variant="h6" gutterBottom>
        Professional Contacts
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Physician Telephone"
            name="formData.physicianTelephone"
            value={data?.physicianTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Physician Address"
            name="formData.physicianAddress"
            value={data?.physicianAddress || ""}
            onChange={handleInputChange}
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mental Health Provider Telephone"
            name="formData.mentalHealthTelephone"
            value={data?.mentalHealthTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mental Health Provider Address"
            name="formData.mentalHealthAddress"
            value={data?.mentalHealthAddress || ""}
            onChange={handleInputChange}
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Dentist Telephone"
            name="formData.dentistTelephone"
            value={data?.dentistTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dentist Address"
            name="formData.dentistAddress"
            value={data?.dentistAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Emergency Contacts - Other */}
      <Typography variant="h6" gutterBottom>
        Other Emergency Contacts
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relative Telephone"
            name="formData.relativeTelephone"
            value={data?.relativeTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Relative Address"
            name="formData.relativeAddress"
            value={data?.relativeAddress || ""}
            onChange={handleInputChange}
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Friend Telephone"
            name="formData.friendTelephone"
            value={data?.friendTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Friend Address"
            name="formData.friendAddress"
            value={data?.friendAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Hospital Information */}
      <Typography variant="h6" gutterBottom>
        Hospital Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Hospital Name"
            name="formData.hospitalName"
            value={data?.hospitalName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Hospital Address"
            name="formData.hospitalAddress"
            value={data?.hospitalAddress || ""}
            onChange={handleInputChange}
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
      <Typography variant="h6" gutterBottom>
        Medical Information
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
            label="Comments"
            name="formData.comments"
            value={data?.comments || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Parent Information */}
      <Typography variant="h6" gutterBottom>
        Parent Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Parent Name"
            name="formData.parentName"
            value={data?.parentName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Parent Telephone"
            name="formData.parentTelephone"
            value={data?.parentTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Parent Address"
            name="formData.parentAddress"
            value={data?.parentAddress || ""}
            onChange={handleInputChange}
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
      <Typography variant="h6" gutterBottom>
        Prior Living Situation
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Prior Guardian Name"
            name="formData.priorGuardianName"
            value={data?.priorGuardianName || ""}
            onChange={handleInputChange}
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
          />
        </Grid>
      </Grid>

      {/* Visitation & Restrictions */}
      <Typography variant="h6" gutterBottom>
        Visitation & Restrictions
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default IDEmergencyInfoForm;
