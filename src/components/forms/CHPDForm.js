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
  Radio,
  RadioGroup,
  MenuItem,
} from "@mui/material";

const CHPDForm = ({ data, handleInputChange }) => {
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
        CHDP Form
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Child Health and Disability Prevention Program Assessment Form
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Client name, age, date of birth, and gender are
          automatically populated from the intake form. Other fields need to be
          filled in manually.
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
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Date of Birth"
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
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Age"
            name="age"
            value={data?.age || ""}
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
      </Grid>

      {/* Residence Information - Editable manual fields */}
      <Typography variant="h6" gutterBottom>
        Residence Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Patient's County of Residence"
            name="countyOfResidence"
            value={data?.countyOfResidence || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={data?.phone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Person Responsible (Name)"
            name="personResponsible"
            value={data?.personResponsible || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={data?.address || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={data?.zipCode || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* CHDP Assessment Section - Editable manual fields */}
      <Typography variant="h6" gutterBottom>
        CHDP Assessment
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Select the appropriate outcome for each screening procedure.
          </Alert>
        </Grid>

        {/* Screening Procedures */}
        {[
          "HISTORY & PHYSICAL EXAM",
          "DENTAL ASSESSMENT/REFERRAL",
          "NUTRITIONAL ASSESSMENT",
          "ANTICIPATORY GUIDANCE",
          "HEALTH EDUCATION",
          "DEVELOPMENT ASSESSMENT",
          "SNELLEN OR EQUIVALENT",
          "AUDIOMETRIC",
          "HEMOGLOBIN OR HEMATOCRIT",
          "URINE DIPSTICK",
          "COMPLETE URINALYSIS",
          "TB - MANTOUX",
        ].map((procedure, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ border: "1px solid #e0e0e0", p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {procedure}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          data?.[
                            `${procedure
                              .replace(/\s+/g, "_")
                              .toLowerCase()}_noProb`
                          ] || false
                        }
                        onChange={handleCheckboxChange}
                        name={`${procedure
                          .replace(/\s+/g, "_")
                          .toLowerCase()}_noProb`}
                      />
                    }
                    label="No Problem"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          data?.[
                            `${procedure
                              .replace(/\s+/g, "_")
                              .toLowerCase()}_refused`
                          ] || false
                        }
                        onChange={handleCheckboxChange}
                        name={`${procedure
                          .replace(/\s+/g, "_")
                          .toLowerCase()}_refused`}
                      />
                    }
                    label="Refused/Not Needed"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          data?.[
                            `${procedure
                              .replace(/\s+/g, "_")
                              .toLowerCase()}_new`
                          ] || false
                        }
                        onChange={handleCheckboxChange}
                        name={`${procedure
                          .replace(/\s+/g, "_")
                          .toLowerCase()}_new`}
                      />
                    }
                    label="New Problem"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          data?.[
                            `${procedure
                              .replace(/\s+/g, "_")
                              .toLowerCase()}_known`
                          ] || false
                        }
                        onChange={handleCheckboxChange}
                        name={`${procedure
                          .replace(/\s+/g, "_")
                          .toLowerCase()}_known`}
                      />
                    }
                    label="Known Problem"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comments/Problem"
                    name={`${procedure
                      .replace(/\s+/g, "_")
                      .toLowerCase()}_comments`}
                    value={
                      data?.[
                        `${procedure
                          .replace(/\s+/g, "_")
                          .toLowerCase()}_comments`
                      ] || ""
                    }
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Follow Up Code"
                    name={`${procedure
                      .replace(/\s+/g, "_")
                      .toLowerCase()}_followup`}
                    value={
                      data?.[
                        `${procedure
                          .replace(/\s+/g, "_")
                          .toLowerCase()}_followup`
                      ] || ""
                    }
                    onChange={handleInputChange}
                    size="small"
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="1">
                      1. NO DX/RX INDICATED OR NOW UNDER CARE
                    </MenuItem>
                    <MenuItem value="2">
                      2. QUESTIONABLE RESULT, RECHECK SCHEDULE
                    </MenuItem>
                    <MenuItem value="3">3. DX MADE AND RX STARTED</MenuItem>
                    <MenuItem value="4">
                      4. DX PENDING/RETURN VISIT SCHEDULE
                    </MenuItem>
                    <MenuItem value="5">
                      5. REFERRED TO ANOTHER EXAMINER FOR DX/RX
                    </MenuItem>
                    <MenuItem value="6">6. REFERRAL REFUSED</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Other Tests */}
      <Typography variant="h6" gutterBottom>
        Other Tests
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Other Test 1 Code"
            name="otherTest1Code"
            value={data?.otherTest1Code || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Other Test 1 Description"
            name="otherTest1Desc"
            value={data?.otherTest1Desc || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Other Test 2 Code"
            name="otherTest2Code"
            value={data?.otherTest2Code || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Other Test 2 Description"
            name="otherTest2Desc"
            value={data?.otherTest2Desc || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Referrals */}
      <Typography variant="h6" gutterBottom>
        Routine Referrals
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.bloodLeadTest || false}
                onChange={handleCheckboxChange}
                name="bloodLeadTest"
              />
            }
            label="Blood Lead"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.dentalReferral || false}
                onChange={handleCheckboxChange}
                name="dentalReferral"
              />
            }
            label="Dental"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Referred To:
          </Typography>
          <TextField
            fullWidth
            name="referredTo1"
            value={data?.referredTo1 || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            name="referredTo1Phone"
            value={data?.referredTo1Phone || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Referred To:
          </Typography>
          <TextField
            fullWidth
            name="referredTo2"
            value={data?.referredTo2 || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            name="referredTo2Phone"
            value={data?.referredTo2Phone || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Patient Status */}
      <Typography variant="h6" gutterBottom>
        Patient Status
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isFosterChild || false}
                onChange={handleCheckboxChange}
                name="isFosterChild"
              />
            }
            label="Patient is a Foster Child"
          />
        </Grid>
      </Grid>

      {/* Measurements */}
      <Typography variant="h6" gutterBottom>
        Measurements
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Height"
            name="height"
            value={data?.height || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Weight"
            name="weight"
            value={data?.weight || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Blood Pressure"
            name="bloodPressure"
            value={data?.bloodPressure || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Hemoglobin"
            name="hemoglobin"
            value={data?.hemoglobin || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Hematocrit"
            name="hematocrit"
            value={data?.hematocrit || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Ambulatory Status
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isAmbulatory || false}
                onChange={handleCheckboxChange}
                name="isAmbulatory"
              />
            }
            label="YES"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isNotAmbulatory || false}
                onChange={handleCheckboxChange}
                name="isNotAmbulatory"
              />
            }
            label="NO"
          />
        </Grid>
      </Grid>

      {/* Tobacco Questions */}
      <Typography variant="h6" gutterBottom>
        Tobacco Related Questions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            1. Patient is Exposed to Passive (second hand) Tobacco Smoke.
          </Typography>
          <RadioGroup
            row
            name="passiveSmokeExposure"
            value={data?.passiveSmokeExposure || ""}
            onChange={handleInputChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="YES" />
            <FormControlLabel value="no" control={<Radio />} label="NO" />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            2. Tobacco Used by Patient
          </Typography>
          <RadioGroup
            row
            name="patientUsesTobacco"
            value={data?.patientUsesTobacco || ""}
            onChange={handleInputChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="YES" />
            <FormControlLabel value="no" control={<Radio />} label="NO" />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            3. Counseled about/Referred for Tobacco Use Prevention Cessation.
          </Typography>
          <RadioGroup
            row
            name="counseledForTobacco"
            value={data?.counseledForTobacco || ""}
            onChange={handleInputChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="YES" />
            <FormControlLabel value="no" control={<Radio />} label="NO" />
          </RadioGroup>
        </Grid>
      </Grid>

      {/* Immunizations */}
      <Typography variant="h6" gutterBottom>
        Immunizations
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please enter immunization details if applicable.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Immunization Notes"
            name="immunizationNotes"
            value={data?.immunizationNotes || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Service Information */}
      <Typography variant="h6" gutterBottom>
        Service Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            CHDP Services Requested
          </Typography>
          <RadioGroup
            name="servicesRequested"
            value={data?.servicesRequested || ""}
            onChange={handleInputChange}
          >
            <FormControlLabel
              value="01"
              control={<Radio />}
              label="01 - Information only"
            />
            <FormControlLabel
              value="02"
              control={<Radio />}
              label="02 - Medical and Dental"
            />
            <FormControlLabel
              value="03"
              control={<Radio />}
              label="03 - Medical only"
            />
            <FormControlLabel
              value="04"
              control={<Radio />}
              label="04 - Dental only"
            />
            <FormControlLabel
              value="05"
              control={<Radio />}
              label="05 - No referral made; child under care"
            />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            CHDP brochure/explanation given date:
          </Typography>
          <TextField
            type="date"
            fullWidth
            name="brochureGivenDate"
            value={data?.brochureGivenDate || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Patient Visit Information */}
      <Typography variant="h6" gutterBottom>
        Patient Visit Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Patient Visit
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isNewPatient || false}
                onChange={handleCheckboxChange}
                name="isNewPatient"
              />
            }
            label="NEW PATIENT OR EXTENDED VISIT"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isRoutineVisit || false}
                onChange={handleCheckboxChange}
                name="isRoutineVisit"
              />
            }
            label="ROUTINE VISIT"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Type of Screen
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isInitialScreen || false}
                onChange={handleCheckboxChange}
                name="isInitialScreen"
              />
            }
            label="INITIAL"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isPeriodicScreen || false}
                onChange={handleCheckboxChange}
                name="isPeriodicScreen"
              />
            }
            label="PERIODIC"
          />
        </Grid>
      </Grid>

      {/* Provider Information */}
      <Typography variant="h6" gutterBottom>
        Provider Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Order of Service: Name, Address, Phone Number"
            name="orderOfService"
            value={data?.orderOfService || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Provider Number"
            name="providerNumber"
            value={data?.providerNumber || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.coveredByMediCal || false}
                onChange={handleCheckboxChange}
                name="coveredByMediCal"
              />
            }
            label="Covered by Medi-Cal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medi-Cal #"
            name="mediCalNumber"
            value={data?.mediCalNumber || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Certification */}
      <Typography variant="h6" gutterBottom>
        Certification
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="body2">
            I certify that the screening information is true and complete, and
            the results explained to the child or his/her foster parent or
            guardian.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date"
            name="certificationDate"
            type="date"
            value={data?.certificationDate || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CHPDForm;
