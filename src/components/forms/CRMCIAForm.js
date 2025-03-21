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
  FormGroup,
  Alert,
  Paper,
} from "@mui/material";

const CRMCIAForm = ({ data, handleInputChange }) => {
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
        Consent to Release Medical/Confidential Information Authorization
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form authorizes Pathway Family Services to administer
        non-prescription medication and allows for the disclosure of
        confidential information for the named client.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Client Name, Date of Birth, and Date of Intake
          fields are automatically populated from the intake form and cannot be
          edited here.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client Information - READ ONLY fields from intake */}
      <Typography variant="h6" gutterBottom>
        Client Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Child's Name"
            name="name"
            value={data?.name || ""}
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
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth)}
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
            label="Date of Intake"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from transaction date"
            disabled
          />
        </Grid>
      </Grid>

      {/* Part 1 - Consent to Administer Non-Prescription Drugs */}
      <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Part 1 - Consent to Administer Non-Prescription Drugs
        </Typography>
        <Typography variant="body2" paragraph>
          I, the undersigned, hereby authorize Pathway Family Services, Inc., to
          administer non-prescription medication, as needed with the direct
          written or verbal permission of an authorized medical professional. It
          is understood that these authorizations are given in advance of any
          such actions but are given to provide permission for such action.
          These authorizations shall remain in effect until the discharge of the
          child from Pathway's care or revoked in writing by the undersigned.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Part 1 Signature Date"
              name="part1SignatureDate"
              type="date"
              value={formatDateForInput(data?.part1SignatureDate || "")}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              helperText="Date of signature for Part 1"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Part 2 - Authorization for Use or Disclosure of Confidential Information */}
      <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Part 2 - Authorization for Use or Disclosure of Confidential
          Information
        </Typography>
        <Typography variant="body2" paragraph>
          I, the undersigned, authorize the use or disclosure of the following
          confidential information for the above named minor:
        </Typography>

        <FormGroup sx={{ ml: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.psychologicalInfo || false}
                onChange={handleCheckboxChange}
                name="psychologicalInfo"
              />
            }
            label="Psychological/Developmental Info"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.educationalInfo || false}
                onChange={handleCheckboxChange}
                name="educationalInfo"
              />
            }
            label="Educational Information"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.counselingReports || false}
                onChange={handleCheckboxChange}
                name="counselingReports"
              />
            }
            label="Counseling Reports"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.medicalDental || false}
                onChange={handleCheckboxChange}
                name="medicalDental"
              />
            }
            label="Medical/Dental"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.otherInfo || false}
                onChange={handleCheckboxChange}
                name="otherInfo"
              />
            }
            label="Other"
          />
          {data?.otherInfo && (
            <TextField
              fullWidth
              label="Other Information (Please Explain)"
              name="otherInfoExplain"
              value={data?.otherInfoExplain || ""}
              onChange={handleInputChange}
              sx={{ mt: 1, ml: 3 }}
            />
          )}
        </FormGroup>

        <Typography variant="body2" paragraph sx={{ fontSize: "12px" }}>
          <strong>NOTE:</strong> Exchange of information may take place by
          personal contact, telephone, email, and fax.
        </Typography>

        <Typography variant="body2" paragraph sx={{ fontSize: "12px" }}>
          <strong>
            - Persons or organizations authorized to use and disclose the
            minor's information:
          </strong>{" "}
          Pathway's staff, Certified foster parents and respite providers for
          the Minor (as needed).
        </Typography>

        <Typography variant="body2" paragraph sx={{ fontSize: "12px" }}>
          <strong>
            - Persons or organizations authorized to receive the Minor's
            information:
          </strong>{" "}
          Pathway staff, Certified foster parents and respite providers for the
          Minor, the Minor's health and mental health care providers, the
          Minor's school, day care providers for the Minor, and
          extra-curricular/recreational program providers for the Minor and
          state licensing agency.
        </Typography>

        <Typography variant="body2" paragraph sx={{ fontSize: "12px" }}>
          <strong>- Purpose of this authorization:</strong> To facilitate the
          Minor's care, safety and treatment plan, as well as, the Minor's
          education and recreational activities, and for compliance with
          auditing and follow-up with investigation findings.
        </Typography>

        <Typography variant="body2" paragraph sx={{ fontSize: "12px" }}>
          <strong>
            - This authorization applies to the following information (as
            necessary):
          </strong>{" "}
          the Minor's medical information, dental information, mental health
          information (except psychotherapy notes), education information,
          developmental information, and psycho-social information.
        </Typography>

        <Typography variant="body2" paragraph sx={{ fontSize: "12px" }}>
          <strong>- Expiration:</strong> This authorization expires upon the
          Minor's discharge or every 12 months from the date of intake of child
          into Pathway's care.
        </Typography>

        <Typography variant="body2" paragraph sx={{ fontSize: "12px" }}>
          The Minor's authorized "Representative" may refuse to sign this
          Authorization, and the services provided to the Minor by Pathway will
          not be conditioned on providing this authorization. However, the Minor
          may not be able to participate in certain activities, such as
          recreational programs or receive respite provider services without
          this Authorization. The Representative may revoke this authorization
          at any time but the revocation must be in writing, signed by the
          Representative and delivered to the Pathway's local office from which
          the Minor receives services. The revocation will be effective upon
          receipt, but will not be effective to the extent that Pathway or
          others have acted in reliance upon this Authorization. The person
          signing this form has a right to receive a copy of the form.
          Information disclosed pursuant to this authorization could be
          re-disclosed by the recipient and might no longer be protected by the
          federal confidentiality law. (HIPAA).
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Representative Signature Date"
              name="minorRepresentativeDate"
              type="date"
              value={formatDateForInput(data?.minorRepresentativeDate || "")}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              helperText="Date of Minor Representative signature"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Minor's Representative Title"
              name="minorRepresentativeTitle"
              value={data?.minorRepresentativeTitle || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Minor's Signature Date"
              name="minorSignatureDate"
              type="date"
              value={formatDateForInput(data?.minorSignatureDate || "")}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              helperText="Date of Minor's signature"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CRMCIAForm;
