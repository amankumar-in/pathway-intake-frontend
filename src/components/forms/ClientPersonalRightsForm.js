import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  Paper,
} from "@mui/material";

const ClientPersonalRightsForm = ({
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
        Client Personal Rights
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form is used to inform the client of their personal rights as
        required by California Code of Regulations, Title 22.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong>{" "}
          {isStandalone
            ? "All fields are editable in standalone document mode."
            : "Several fields in this form are automatically populated from the intake form. Fields that are read-only are linked to the intake form data."}
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
            label="Client Name"
            name="name"
            value={data?.name || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={isStandalone ? "" : "Auto-populated from intake form"}
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Office Address"
            name="officeAddress"
            value={data?.officeAddress || getOfficeAddress(data?.office)}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone ? "" : "Auto-populated based on office selection"
            }
            disabled={!isStandalone}
          />
        </Grid>
      </Grid>

      {/* Authorized Representative Information */}
      <Typography variant="h6" gutterBottom>
        Authorized Representative Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Authorized Representative Name"
            name="countyWorkerName"
            value={data?.countyWorkerName || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone ? "" : "Auto-populated from County Worker Name"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Authorized Representative Title"
            name="countyWorkerTitle"
            value={data?.countyWorkerTitle || "CSW"}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone ? "" : "Auto-populated from County Worker Title"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Child Signature Date"
            name="childSignatureDate"
            type="date"
            value={formatDateForInput(
              data?.childSignatureDate || data?.transactionDate || new Date()
            )}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Date when child signed the document"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Authorized Representative Signature Date"
            name="signatureDate"
            type="date"
            value={formatDateForInput(
              data?.signatureDate || data?.transactionDate || new Date()
            )}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Date when authorized representative signed the document"
          />
        </Grid>
      </Grid>

      {/* Licensing Agency Information - Editable */}
      <Typography variant="h6" gutterBottom>
        Licensing Agency Information
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This is the licensing agency that should be contacted regarding
          complaints. Default values are provided but can be modified if needed.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Licensing Agency Name"
              name="licensingAgencyName"
              value={data?.licensingAgencyName || "Community Care Licensing"}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Licensing Agency Address"
              name="licensingAgencyAddress"
              value={
                data?.licensingAgencyAddress ||
                "1000 Corporate Center Drive  Ste 200A"
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="City"
              name="licensingAgencyCity"
              value={data?.licensingAgencyCity || "Monterey Park, CA"}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="licensingAgencyZip"
              value={data?.licensingAgencyZip || "91754"}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Phone Number"
              name="licensingAgencyPhone"
              value={data?.licensingAgencyPhone || "323-981-3300"}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          The content of this form is primarily informational. The client and/or
          authorized representative must be provided with a copy of this form
          upon admission, which explains their personal rights and complaint
          procedures.
        </Typography>
        {isStandalone && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Note:</strong> In standalone mode, all fields are editable
            including those that would normally be populated from the intake
            form.
          </Typography>
        )}
      </Alert>
    </Box>
  );
};

// Helper function to get office address based on office selection
const getOfficeAddress = (office) => {
  switch (office) {
    case "Bakersfield":
      return "P.O. Box 511, Bakersfield, CA 93302";
    case "Atascadero":
      return "P.O. Box 8119 San Luis Obispo, CA 93403";
    case "Riverside":
      return "547 N San Jacinto St., Hemet, CA 92544";
    case "Santa Maria":
      return "2125 S. Centerpoint Prkwy, Santa Maria, CA 93455";
    case "Visalia":
      return "26500 S Mooney Blvd, Visalia, CA 93277-9311";
    default:
      return "";
  }
};

export default ClientPersonalRightsForm;
