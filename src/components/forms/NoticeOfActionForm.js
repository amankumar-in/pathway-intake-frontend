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
  FormControlLabel,
  Checkbox,
  FormGroup,
  Alert,
} from "@mui/material";

const NoticeOfActionForm = ({ data, handleInputChange }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Notice of Action
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This document notifies relevant parties of actions taken regarding the
        client's case.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Several fields in this form are automatically
          populated from the intake form. Fields that are read-only are linked
          to the intake form data.
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
            label="Submitted by"
            name="yourName"
            value={data?.yourName || ""}
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
            label="Office Location"
            name="office"
            value={data?.office || ""}
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
            label="Date Submitted"
            name="dateSubmitted"
            type="date"
            value={formatDateForInput(data?.dateSubmitted)}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Action"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            helperText="Auto-populated from intake form (Transaction Date)"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Transaction Type"
            name="typeOfTransaction"
            value={data?.typeOfTransaction || ""}
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
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Gender"
            name="gender"
            value={data?.gender || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Ethnicity"
            name="ethnicity"
            value={data?.ethnicity || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Level of Care"
            name="levelOfCare"
            value={data?.levelOfCare || ""}
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
            label="Prior Placement"
            name="priorPlacement"
            value={data?.priorPlacement || ""}
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
            label="Reason for Placement"
            name="reasonForPlacement"
            value={data?.reasonForPlacement || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Foster Home Information - READ ONLY fields from intake */}
      <Typography variant="h6" gutterBottom>
        Foster Home Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name of Foster Parents"
            name="nameOfFosterParents"
            value={data?.nameOfFosterParents || ""}
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
            label="Telephone Number"
            name="fosterParentsTelephone"
            value={data?.fosterParentsTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="fosterParentsAddress"
            value={data?.fosterParentsAddress || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="fosterParentsCity"
            value={data?.fosterParentsCity || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="State"
            name="fosterParentsState"
            value={data?.fosterParentsState || "California"}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="ZIP"
            name="fosterParentsZip"
            value={data?.fosterParentsZip || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mailing Address (if different from above)"
            name="fosterParentsMailingAddress"
            value={data?.fosterParentsMailingAddress || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* County Worker Information - READ ONLY fields from intake */}
      <Typography variant="h6" gutterBottom>
        County Worker Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="County Worker Name"
            name="countyWorkerName"
            value={data?.countyWorkerName || ""}
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
            label="County Worker Title"
            name="countyWorkerTitle"
            value={data?.countyWorkerTitle || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="countyWorkerAddress"
            value={data?.countyWorkerAddress || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="countyWorkerCity"
            value={data?.countyWorkerCity || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="State"
            name="countyWorkerState"
            value={data?.countyWorkerState || "CA"}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="ZIP"
            name="countyWorkerZip"
            value={data?.countyWorkerZip || ""}
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
            label="Telephone"
            name="countyWorkerTelephone"
            value={data?.countyWorkerTelephone || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="County"
            name="nameOfCounty"
            value={data?.nameOfCounty || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Department"
            name="nameOfDepartment"
            value={data?.nameOfDepartment || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Editable Form Details */}
      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Bed Capacity"
            name="bedCapacity"
            value={data?.bedCapacity || ""}
            onChange={handleInputChange}
            helperText="Enter the bed capacity"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Certified Ages From"
            name="certifiedAgesFrom"
            value={data?.certifiedAgesFrom || ""}
            onChange={handleInputChange}
            helperText="Enter minimum certified age"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Certified Ages To"
            name="certifiedAgesTo"
            value={data?.certifiedAgesTo || ""}
            onChange={handleInputChange}
            helperText="Enter maximum certified age"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Certification Date From"
            name="certificationDateFrom"
            type="date"
            value={formatDateForInput(data?.certificationDateFrom)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Enter certification start date"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Certification Date To"
            name="certificationDateTo"
            type="date"
            value={formatDateForInput(data?.certificationDateTo)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Enter certification end date"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Actions Approved By"
            name="actionsApprovedBy"
            value={data?.actionsApprovedBy || ""}
            onChange={handleInputChange}
            helperText="Enter name of person who approved actions"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Approval Date"
            name="approvalDate"
            type="date"
            value={formatDateForInput(data?.approvalDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Enter date of approval"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pathway Social Worker"
            name="pathwayRepresentative"
            value={data?.pathwayRepresentative || ""}
            onChange={handleInputChange}
            helperText="Enter name of Pathway social worker assigned to the case"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Supervisor's Initials"
            name="supervisorsInitials"
            value={data?.supervisorsInitials || ""}
            onChange={handleInputChange}
            helperText="Enter supervisor's initials"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={data?.notes || ""}
            onChange={handleInputChange}
            multiline
            rows={4}
            helperText="Enter any additional notes or comments"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NoticeOfActionForm;
