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
  Radio,
  RadioGroup,
  FormGroup,
  FormLabel,
  Alert,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  MedicalServices as MedicalIcon,
  Home as HomeIcon,
  Description as DocumentIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

const PlacementApplicationForm = ({ data, handleInputChange }) => {
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

  // Handle radio button changes
  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    handleInputChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Placement Application
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form is used to document placement application details for the
        client.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Several fields in this form are automatically
          populated from the intake form. Fields that are read-only are linked
          to the intake form data.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* REFERRAL SOURCE Section */}
      <Typography variant="h6" gutterBottom>
        Referral Source
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Referred by"
            name="nameOfCounty"
            value={data?.nameOfCounty || ""}
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
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.is300 || false}
                  onChange={handleCheckboxChange}
                  name="is300"
                  disabled={data?.clientStatus === 300}
                />
              }
              label="300"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.is601602 || false}
                  onChange={handleCheckboxChange}
                  name="is601602"
                  disabled={
                    data?.clientStatus === 601 || data?.clientStatus === 602
                  }
                />
              }
              label="601/602"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Placing Agency Representative"
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
            label="Phone"
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
      </Grid>

      {/* CLIENT INFORMATION Section */}
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={data?.age || ""}
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
            label="Sex"
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
            label="DOB"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth)}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
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
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Language"
            name="language"
            value={data?.language || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Reason for Foster Placement"
            name="reasonForPlacement"
            value={data?.reasonForPlacement || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Auto-populated from intake form"
            disabled
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">Current Court Status</FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.courtStatusReunification || false}
                  onChange={handleCheckboxChange}
                  name="courtStatusReunification"
                />
              }
              label="Reunification"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.courtStatusPermanent || false}
                  onChange={handleCheckboxChange}
                  name="courtStatusPermanent"
                />
              }
              label="Permanent"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.courtStatusAdoption || false}
                  onChange={handleCheckboxChange}
                  name="courtStatusAdoption"
                />
              }
              label="Adoption"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of previous placements"
            name="previousPlacements"
            value={data?.previousPlacements || ""}
            onChange={handleInputChange}
            type="number"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Length of Placement needed"
            name="placementLength"
            value={data?.placementLength || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Client Behavioral problems"
            name="behavioralProblems"
            value={data?.behavioralProblems || ""}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special needs/services"
            name="specialNeeds"
            value={data?.specialNeeds || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      {/* MEDICAL HISTORY Section */}
      <Typography variant="h6" gutterBottom>
        Medical History/Conditions/Needs
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormLabel component="legend">
            Exposed to communicable diseases:
          </FormLabel>
          <RadioGroup
            row
            name="exposedToCommunicableDiseases"
            value={data?.exposedToCommunicableDiseases || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current Medications"
            name="currentMedications"
            value={data?.currentMedications || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">
            If Psychotropic, is there a current court order?
          </FormLabel>
          <RadioGroup
            row
            name="hasPsychotropicCourtOrder"
            value={data?.hasPsychotropicCourtOrder || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">
            Does client have at least a 30 day supply of medication?
          </FormLabel>
          <RadioGroup
            row
            name="has30DayMedication"
            value={data?.has30DayMedication || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">
            Does client need a CHDP completed?
          </FormLabel>
          <RadioGroup
            row
            name="needsCHDP"
            value={data?.needsCHDP || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">
            Does client have any Special Health Care Needs/Conditions?
          </FormLabel>
          <RadioGroup
            row
            name="hasSpecialHealthNeeds"
            value={data?.hasSpecialHealthNeeds || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special health conditions"
            name="specialHealthConditions"
            value={data?.specialHealthConditions || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
            disabled={data?.hasSpecialHealthNeeds !== "Yes"}
          />
        </Grid>
      </Grid>

      {/* BEHAVIOR ASSESSMENT SECTION */}
      <Typography variant="h6" gutterBottom>
        Behavior Assessment
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormLabel component="legend">
            Does client currently demonstrate or have a history of inappropriate
            sexual conduct?
          </FormLabel>
          <RadioGroup
            row
            name="hasInappropriateSexualConduct"
            value={data?.hasInappropriateSexualConduct || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Sexual conduct details"
            name="sexualConductDetails"
            value={data?.sexualConductDetails || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
            disabled={data?.hasInappropriateSexualConduct !== "Yes"}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">
            Does client currently demonstrate or have a history of being a
            danger to self?
          </FormLabel>
          <RadioGroup
            row
            name="hasDangerToSelf"
            value={data?.hasDangerToSelf || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Danger to self details"
            name="dangerToSelfDetails"
            value={data?.dangerToSelfDetails || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
            disabled={data?.hasDangerToSelf !== "Yes"}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">
            Does client currently demonstrate or have a history of being a
            danger to others?
          </FormLabel>
          <RadioGroup
            row
            name="hasDangerToOthers"
            value={data?.hasDangerToOthers || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Danger to others details"
            name="dangerToOthersDetails"
            value={data?.dangerToOthersDetails || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
            disabled={data?.hasDangerToOthers !== "Yes"}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">
            Does client currently demonstrate or have a history of being
            destructive to property?
          </FormLabel>
          <RadioGroup
            row
            name="hasDestructiveToProperty"
            value={data?.hasDestructiveToProperty || "No"}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Destructive to property details"
            name="destructiveToPropertyDetails"
            value={data?.destructiveToPropertyDetails || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
            disabled={data?.hasDestructiveToProperty !== "Yes"}
          />
        </Grid>
      </Grid>

      {/* PLACEMENT NEEDS */}
      <Typography variant="h6" gutterBottom>
        Placement Needs
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Family Dynamics</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.needsIndividualAttention || false}
                  onChange={handleCheckboxChange}
                  name="needsIndividualAttention"
                />
              }
              label="Needs individual attention"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.needsStructure || false}
                  onChange={handleCheckboxChange}
                  name="needsStructure"
                />
              }
              label="Needs structure"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.needsFemaleRoleModel || false}
                  onChange={handleCheckboxChange}
                  name="needsFemaleRoleModel"
                />
              }
              label="Needs female role model"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.needsMaleRoleModel || false}
                  onChange={handleCheckboxChange}
                  name="needsMaleRoleModel"
                />
              }
              label="Needs male role model"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={data?.needsReligiousUpbringing || false}
                  onChange={handleCheckboxChange}
                  name="needsReligiousUpbringing"
                />
              }
              label="Needs religious upbringing"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Client needs professional counseling for"
            name="counselingNeeds"
            value={data?.counselingNeeds || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Client is currently in counseling with"
            name="currentCounselor"
            value={data?.currentCounselor || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1">Educational Needs</Typography>
          <TextField
            fullWidth
            label="Client is currently enrolled in"
            name="currentSchool"
            value={data?.currentSchool || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.hasIEP || false}
                onChange={handleCheckboxChange}
                name="hasIEP"
              />
            }
            label="Has IEP"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isInSpecialEd || false}
                onChange={handleCheckboxChange}
                name="isInSpecialEd"
              />
            }
            label="Is in special education class"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1">Family Visitation</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.hasVisitation || false}
                onChange={handleCheckboxChange}
                name="hasVisitation"
              />
            }
            label="Has visitation with natural family members"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="The visits are with"
            name="visitsWithWho"
            value={data?.visitsWithWho || ""}
            onChange={handleInputChange}
            disabled={!data?.hasVisitation}
          />
        </Grid>
      </Grid>

      {/* PLACEMENT SERVICES INFORMATION */}
      <Typography variant="h6" gutterBottom>
        Placement Services Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Information from previous placements"
            name="previousPlacementsInfo"
            value={data?.previousPlacementsInfo || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medical insurance is provided by"
            name="medicalInsuranceProvider"
            value={data?.medicalInsuranceProvider || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.hasMedicalCard || false}
                onChange={handleCheckboxChange}
                name="hasMedicalCard"
              />
            }
            label="Medical card available"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.hasMedicalRecords || false}
                onChange={handleCheckboxChange}
                name="hasMedicalRecords"
              />
            }
            label="Medical records available"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.hasSocialSecurityNumber || false}
                onChange={handleCheckboxChange}
                name="hasSocialSecurityNumber"
              />
            }
            label="Social Security number available"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.hasClothingAllowance || false}
                onChange={handleCheckboxChange}
                name="hasClothingAllowance"
              />
            }
            label="Clothing allowance available"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Client will be placed into the home of"
            name="placementHome"
            value={data?.placementHome || data?.nameOfFosterParents || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.wasPrePlacementVisit || false}
                onChange={handleCheckboxChange}
                name="wasPrePlacementVisit"
              />
            }
            label="There was a pre-placement visit"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Visit date"
            name="prePlacementVisitDate"
            type="date"
            value={formatDateForInput(data?.prePlacementVisitDate)}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={!data?.wasPrePlacementVisit}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Placement date"
            name="placementDate"
            type="date"
            value={formatDateForInput(data?.placementDate)}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Approved by"
            name="approvedBy"
            value={data?.approvedBy || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* PLACEMENT AGREEMENT */}
      <Typography variant="h6" gutterBottom>
        Placement Agreement
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="body2" paragraph>
            Based upon the information provided within the application as being
            true and complete, the client will be accepted into Pathway Family
            Services. Any other discovery of relevant history (behavior, health,
            etc) will be promptly provided to Pathway Family Services to ensure
            appropriate and effective services are provided for the client.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Signature Date"
            name="signatureDate"
            type="date"
            value={formatDateForInput(
              data?.signatureDate || data?.transactionDate
            )}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlacementApplicationForm;
