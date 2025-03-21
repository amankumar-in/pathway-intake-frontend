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
        Notice of Action Form
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form allows you to edit information specific to the Notice of
        Action document. This form maps to fields from the intake form.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Office Information */}
      <Typography variant="h6" gutterBottom>
        Office Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Your Name"
            name="yourName"
            value={data?.yourName || ""}
            onChange={handleInputChange}
          />
        </Grid>
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
            label="Date Submitted"
            name="dateSubmitted"
            type="date"
            value={formatDateForInput(data?.dateSubmitted)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Type of Transaction</InputLabel>
            <Select
              name="typeOfTransaction"
              value={data?.typeOfTransaction || "Shelter Placement"}
              label="Type of Transaction"
              onChange={handleInputChange}
            >
              <MenuItem value="Intake">Intake</MenuItem>
              <MenuItem value="In House Move">In House Move</MenuItem>
              <MenuItem value="Termination">Termination</MenuItem>
              <MenuItem value="Shelter Placement">Shelter Placement</MenuItem>
              <MenuItem value="LOC Change">LOC Change</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Client Information */}
      <Typography variant="h6" gutterBottom>
        Client Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Case Number"
            name="caseNumber"
            value={data?.caseNumber || ""}
            onChange={handleInputChange}
          />
        </Grid>
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
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={data?.gender || "Male"}
              label="Gender"
              onChange={handleInputChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Ethnicity</InputLabel>
            <Select
              name="ethnicity"
              value={data?.ethnicity || "Unknown"}
              label="Ethnicity"
              onChange={handleInputChange}
            >
              <MenuItem value="African American">African American</MenuItem>
              <MenuItem value="Asian/Pacific Island">
                Asian/Pacific Island
              </MenuItem>
              <MenuItem value="Latino">Latino</MenuItem>
              <MenuItem value="Native American">Native American</MenuItem>
              <MenuItem value="White">White</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="Unknown">Unknown</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Level of Care</InputLabel>
            <Select
              name="levelOfCare"
              value={data?.levelOfCare || "Level 1"}
              label="Level of Care"
              onChange={handleInputChange}
            >
              <MenuItem value="Level 1">Level 1</MenuItem>
              <MenuItem value="Level 2">Level 2</MenuItem>
              <MenuItem value="Level 3">Level 3</MenuItem>
              <MenuItem value="Level 4">Level 4</MenuItem>
              <MenuItem value="Level 5">Level 5</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Prior Placement</InputLabel>
            <Select
              name="priorPlacement"
              value={data?.priorPlacement || "Natural Parent"}
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
          <FormControl fullWidth>
            <InputLabel>Reason for Placement</InputLabel>
            <Select
              name="reasonForPlacement"
              value={data?.reasonForPlacement || "Neglect"}
              label="Reason for Placement"
              onChange={handleInputChange}
            >
              <MenuItem value="Abandoned">Abandoned</MenuItem>
              <MenuItem value="Domestic Violence">Domestic Violence</MenuItem>
              <MenuItem value="Drug Baby">Drug Baby</MenuItem>
              <MenuItem value="Mental Abuse">Mental Abuse</MenuItem>
              <MenuItem value="Neglect">Neglect</MenuItem>
              <MenuItem value="No Care Taker">No Care Taker</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="Physical Abuse">Physical Abuse</MenuItem>
              <MenuItem value="Probation">Probation</MenuItem>
              <MenuItem value="In House Move">In House Move</MenuItem>
              <MenuItem value="Sexual Abuse to Sibling">
                Sexual Abuse to Sibling
              </MenuItem>
              <MenuItem value="Sexual Abuse">Sexual Abuse</MenuItem>
              <MenuItem value="Unknown">Unknown</MenuItem>
              <MenuItem value="Voluntary">Voluntary</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Foster Home Information */}
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Foster Parents Telephone"
            name="fosterParentsTelephone"
            value={data?.fosterParentsTelephone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Foster Parents Address"
            name="fosterParentsAddress"
            value={data?.fosterParentsAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="fosterParentsCity"
            value={data?.fosterParentsCity || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="State"
            name="fosterParentsState"
            value={data?.fosterParentsState || "California"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="ZIP Code"
            name="fosterParentsZip"
            value={data?.fosterParentsZip || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mailing Address (if different)"
            name="fosterParentsMailingAddress"
            value={data?.fosterParentsMailingAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Foster Home Certification */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Foster Home Certification Details
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bed Capacity"
            name="formData.bedCapacity"
            value={data?.bedCapacity || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Certified ages of care
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="From"
                name="formData.certifiedAgesFrom"
                value={data?.certifiedAgesFrom || ""}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="To"
                name="formData.certifiedAgesTo"
                value={data?.certifiedAgesTo || ""}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Certification dates
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="From"
                name="formData.certificationDateFrom"
                type="date"
                value={formatDateForInput(data?.certificationDateFrom)}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="To"
                name="formData.certificationDateTo"
                type="date"
                value={formatDateForInput(data?.certificationDateTo)}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Action Approved */}
      <Typography variant="h6" gutterBottom>
        Action Approved
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Actions Approved By"
            name="formData.actionsApprovedBy"
            value={data?.actionsApprovedBy || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Approval Date"
            name="formData.approvalDate"
            type="date"
            value={formatDateForInput(data?.approvalDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Notes / Comments */}
      <Typography variant="h6" gutterBottom>
        Notes / Comments
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            name="formData.notes"
            value={data?.notes || ""}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>

      {/* County Worker Information */}
      <Typography variant="h6" gutterBottom>
        County Worker Information
      </Typography>
      <Grid container spacing={3}>
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
            label="Supervisor's Initials"
            name="formData.supervisorsInitials"
            value={data?.supervisorsInitials || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NoticeOfActionForm;
