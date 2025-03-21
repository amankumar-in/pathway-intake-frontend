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

const AgencyToFosterParentForm = ({ data, handleInputChange }) => {
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
        Agency to Foster Parent Agreement
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This agreement will be initiated when the child is placed in the
        facility and whenever the rate changes.
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
            label="Name of Child"
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
            label="Parent's Name"
            name="parentsName"
            value={data?.parentsName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Birthdate of Child"
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Date Placed"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from transaction date"
            disabled
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
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      {/* Resource Parent Information - READ ONLY fields from intake */}
      <Typography variant="h6" gutterBottom>
        Resource Parent Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Resource Parent (Foster Parents)"
            name="nameOfFosterParents"
            value={data?.nameOfFosterParents || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form (Name of Foster Parents)"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
            label="ZIP Code"
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
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
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
      </Grid>

      {/* Payment Information - READ ONLY fields from intake */}
      <Typography variant="h6" gutterBottom>
        Payment Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Level of Care"
            name="levelOfCare"
            value={data?.levelOfCare || "Level 1"}
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
            label="Monthly Payment Amount"
            name="fosterParentsPayment"
            value={data?.fosterParentsPayment || "$1206.00"}
            onChange={handleInputChange}
            helperText="Auto-calculated from Level of Care in intake form"
            InputProps={{
              readOnly: true,
            }}
            disabled
          />
        </Grid>
      </Grid>

      {/* Placement Details - Document specific fields that can be edited */}
      <Typography variant="h6" gutterBottom>
        Placement Details
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Anticipated Duration of Placement (months)"
            name="anticipatedDuration"
            value={data?.anticipatedDuration || "twelve (12)"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Optional Service Rate Details"
            name="additionalServices"
            value={data?.additionalServices || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Level Explanation"
            name="levelExplanation"
            value={data?.levelExplanation || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Special Permissions - Document specific fields that can be edited */}
      <Typography variant="h6" gutterBottom>
        Special Permissions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.canBeUnsupervised || false}
                  onChange={handleCheckboxChange}
                  name="canBeUnsupervised"
                />
              }
              label="Child 15 years or older has permission to remain without adult supervision during temporary absences of the foster parents(s), not to exceed six (6) hours in any one 72-hour period"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.receivingMentalHealthServices || false}
                  onChange={handleCheckboxChange}
                  name="receivingMentalHealthServices"
                />
              }
              label="Youth is currently receiving mental health services"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mental Health Services Provider"
            name="mentalHealthServicesProvider"
            value={data?.mentalHealthServicesProvider || ""}
            onChange={handleInputChange}
            disabled={!data?.receivingMentalHealthServices}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.otherPermission || false}
                onChange={handleCheckboxChange}
                name="otherPermission"
              />
            }
            label="Other special permission"
          />
          <TextField
            fullWidth
            label="Other Permission Details"
            name="otherPermissionDetails"
            value={data?.otherPermissionDetails || ""}
            onChange={handleInputChange}
            disabled={!data?.otherPermission}
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.noSpecialPermissions || true}
                onChange={handleCheckboxChange}
                name="noSpecialPermissions"
              />
            }
            label="No special permissions granted"
          />
        </Grid>
      </Grid>

      {/* Signature Information */}
      <Typography variant="h6" gutterBottom>
        Signature Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Child Placement Worker Name"
            name="childPlacementWorkerName"
            value={
              data?.childPlacementWorkerName || data?.countyWorkerName || ""
            }
            onChange={handleInputChange}
            InputProps={{
              readOnly: data?.countyWorkerName ? true : false,
            }}
            helperText={
              data?.countyWorkerName ? "Auto-populated from intake form" : ""
            }
            disabled={data?.countyWorkerName ? true : false}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Child Placement Worker Title"
            name="childPlacementWorkerTitle"
            value={
              data?.childPlacementWorkerTitle ||
              data?.countyWorkerTitle ||
              "CSW"
            }
            onChange={handleInputChange}
            InputProps={{
              readOnly: data?.countyWorkerTitle ? true : false,
            }}
            helperText={
              data?.countyWorkerTitle ? "Auto-populated from intake form" : ""
            }
            disabled={data?.countyWorkerTitle ? true : false}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agency Name"
            name="agencyName"
            value={data?.agencyName || "Pathway Family Services, Inc."}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agency Address"
            name="agencyAddress"
            value={
              data?.agencyAddress || "P.O. Box 888   Bakersfield,  Ca    93302"
            }
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agency Phone"
            name="agencyPhone"
            value={data?.agencyPhone || "(805) 739-1111"}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from office phone number"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Signature Date"
            name="signatureDate"
            type="date"
            value={formatDateForInput(
              data?.signatureDate || data?.transactionDate || new Date()
            )}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgencyToFosterParentForm;
