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
  FormHelperText,
} from "@mui/material";

const AgencyToAgencyAgreementForm = ({ data, handleInputChange }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Agency to Agency Agreement Form
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form allows you to edit information specific to the Agency to
        Agency Agreement document.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Client Information */}
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Parent's Name"
            name="formData.parentsName"
            value={data?.parentsName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Birthdate of Child"
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
            label="Date Placed"
            name="formData.datePlaced"
            type="date"
            value={formatDateForInput(data?.datePlaced)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Case Number"
            name="caseNumber"
            value={data?.caseNumber || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Payment Information */}
      <Typography variant="h6" gutterBottom>
        Payment Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Monthly Payment Amount"
            name="formData.paymentAmount"
            value={data?.paymentAmount || "$2,638.00"}
            onChange={handleInputChange}
            helperText="Monthly payment for room and board, clothing, personal needs, etc."
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Amounts"
            name="formData.additionalAmounts"
            value={data?.additionalAmounts || ""}
            onChange={handleInputChange}
            multiline
            rows={3}
            helperText="If additional amounts are to be paid, provide reason, amount and conditions"
          />
        </Grid>
      </Grid>

      {/* Special Problems */}
      <Typography variant="h6" gutterBottom>
        Special Problems
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special Problems"
            name="formData.specialProblems"
            value={data?.specialProblems || ""}
            onChange={handleInputChange}
            multiline
            rows={3}
            helperText="Explain any special problems"
          />
        </Grid>
      </Grid>

      {/* Placing Agency Information */}
      <Typography variant="h6" gutterBottom>
        Placing Agency Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Initial Placement"
            name="formData.initialPlacement"
            value={data?.initialPlacement || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Placement Worker Name"
            name="formData.placementWorkerName"
            value={data?.placementWorkerName || data?.countyWorkerName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Placement Worker Title"
            name="formData.placementWorkerTitle"
            value={data?.placementWorkerTitle || "CSW"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Placing Agency Name"
            name="formData.placingAgencyName"
            value={data?.placingAgencyName || "DHS"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Placing Agency Address"
            name="formData.placingAgencyAddress"
            value={data?.placingAgencyAddress || "2125 S. Centerpoint Prkwy"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="formData.placingAgencyCity"
            value={data?.placingAgencyCity || "Santa Maria"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="State"
            name="formData.placingAgencyState"
            value={data?.placingAgencyState || "CA"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="ZIP"
            name="formData.placingAgencyZip"
            value={data?.placingAgencyZip || "93455"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="formData.placingAgencyPhone"
            value={data?.placingAgencyPhone || "805-819-1921"}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Foster Agency Information */}
      <Typography variant="h6" gutterBottom>
        Foster Family Agency Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agency Representative"
            name="formData.agencyRepresentative"
            value={data?.agencyRepresentative || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agency Representative Title"
            name="formData.agencyRepresentativeTitle"
            value={data?.agencyRepresentativeTitle || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agency Name"
            name="formData.agencyName"
            value={data?.agencyName || "Pathway Family Services, Inc."}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agency Address"
            name="formData.agencyAddress"
            value={data?.agencyAddress || "P.O. Box 888, Bakersfield, CA 93302"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agency Phone"
            name="formData.agencyPhone"
            value={data?.agencyPhone || "(805) 739-1111"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Signature Date"
            name="formData.signatureDate"
            type="date"
            value={formatDateForInput(data?.signatureDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgencyToAgencyAgreementForm;
