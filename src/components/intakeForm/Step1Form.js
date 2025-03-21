import React from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Box,
  Paper,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Alert,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Help as HelpIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  InfoOutlined as InfoIcon,
  LocalHospital as MedicalIcon,
  Home as HomeIcon,
  ChildCare as ChildIcon,
  WcOutlined as GenderIcon,
} from "@mui/icons-material";

const Step1Form = ({ formData, handleInputChange }) => {
  // Helper function to render section with consistent styling
  const renderFormSection = (title, description, icon, children) => (
    <Card
      elevation={0}
      variant="outlined"
      sx={{
        mb: 4,
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          bgcolor: "primary.light",
          color: "white",
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
        }}
      >
        {icon}
        <Box sx={{ ml: 1 }}>
          <Typography variant="h6" fontWeight="500" sx={{ fontSize: "1.1rem" }}>
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{ opacity: 0.9, fontSize: "0.85rem" }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      <CardContent sx={{ p: 3 }}>{children}</CardContent>
    </Card>
  );

  // Required field helper text renderer
  const requiredHelperText = (label) => (
    <Box
      component="span"
      sx={{ display: "flex", alignItems: "center", fontSize: "0.75rem" }}
    >
      <Box component="span" sx={{ color: "error.main", mr: 0.5 }}>
        *
      </Box>
      {label}
    </Box>
  );

  return (
    <Box component="form">
      {/* Office Information Section */}
      {renderFormSection(
        "Office Information",
        "Basic details about the office handling this case",
        <BusinessIcon sx={{ fontSize: 24 }} />,
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Your Name"
              name="yourName"
              value={formData.yourName}
              onChange={handleInputChange}
              required
              helperText={requiredHelperText(
                "Name of staff member completing this form"
              )}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Office"
              name="office"
              value={formData.office}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="Office location handling this case"
            >
              <MenuItem value="Santa Maria">Santa Maria</MenuItem>
              <MenuItem value="Bakersfield">Bakersfield</MenuItem>
              <MenuItem value="Riverside">Riverside</MenuItem>
              <MenuItem value="SBR">SBR</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date Submitted"
              name="dateSubmitted"
              type="date"
              value={formData.dateSubmitted}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="Date this form is being submitted"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Transaction Date"
              name="transactionDate"
              type="date"
              value={formData.transactionDate}
              onChange={handleInputChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText={requiredHelperText("Date of the intake transaction")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Type of Transaction"
              name="typeOfTransaction"
              value={formData.typeOfTransaction}
              onChange={handleInputChange}
              required
              helperText={requiredHelperText(
                "Select the type of transaction being processed"
              )}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InfoIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="Intake">Intake</MenuItem>
              <MenuItem value="In House Move">In House Move</MenuItem>
              <MenuItem value="Termination">Termination</MenuItem>
              <MenuItem value="Shelter Placement">Shelter Placement</MenuItem>
              <MenuItem value="LOC Change">LOC Change</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      )}

      {/* Case Assigned To Section */}
      {renderFormSection(
        "Case Assigned To",
        "Information about the staff member assigned to this case",
        <PersonIcon sx={{ fontSize: 24 }} />,
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pathway Representative"
              name="pathwayRepresentative"
              value={formData.pathwayRepresentative}
              onChange={handleInputChange}
              helperText="Name of the pathway representative"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Position / Job Title"
              name="positionJobTitle"
              value={formData.positionJobTitle}
              onChange={handleInputChange}
              helperText="Job title of the pathway representative"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Intake Representative"
              name="intakeRepresentative"
              value={formData.intakeRepresentative}
              onChange={handleInputChange}
              helperText="Name of the intake representative"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Office #"
              name="officeNumber"
              value={formData.officeNumber}
              onChange={handleInputChange}
              helperText="Office number"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              helperText="Contact phone number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ fontSize: "0.85rem" }}>📞</span>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}

      {/* Client Information Section */}
      {renderFormSection(
        "Client Information",
        "Personal details and background of the client",
        <ChildIcon sx={{ fontSize: 24 }} />,
        <>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 1 }}>
            All information in this section should match the client's official
            records.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Case Number"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleInputChange}
                required
                helperText={requiredHelperText(
                  "Official case number for this client"
                )}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ fontSize: "0.85rem" }}>#</span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                helperText={requiredHelperText("Client's full legal name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                helperText="Client's current age"
                InputProps={{
                  inputProps: { min: 0, max: 120 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={requiredHelperText("Client's date of birth")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Ethnicity"
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleInputChange}
                helperText="Client's ethnic background"
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
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                helperText={requiredHelperText("Client's gender")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GenderIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Client Status"
                name="clientStatus"
                value={formData.clientStatus}
                onChange={handleInputChange}
                helperText="Client's current status code"
              >
                <MenuItem value={300}>300</MenuItem>
                <MenuItem value={601}>601</MenuItem>
                <MenuItem value={602}>602</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Prior Placement"
                name="priorPlacement"
                value={formData.priorPlacement}
                onChange={handleInputChange}
                helperText="Client's placement prior to this intake"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="Natural Parent">Natural Parent</MenuItem>
                <MenuItem value="County Facility">County Facility</MenuItem>
                <MenuItem value="County Foster Home">
                  County Foster Home
                </MenuItem>
                <MenuItem value="County Hospital">County Hospital</MenuItem>
                <MenuItem value="Foster Care Agency">
                  Foster Care Agency
                </MenuItem>
                <MenuItem value="Friend of Family">Friend of Family</MenuItem>
                <MenuItem value="Group Home">Group Home</MenuItem>
                <MenuItem value="Jamison Center">Jamison Center</MenuItem>
                <MenuItem value="Legal Guardianship">
                  Legal Guardianship
                </MenuItem>
                <MenuItem value="Relative">Relative</MenuItem>
                <MenuItem value="Unknown">Unknown</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Reason for Placement"
                name="reasonForPlacement"
                value={formData.reasonForPlacement}
                onChange={handleInputChange}
                required
                helperText={requiredHelperText("Reason client is being placed")}
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
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Level of Care"
                name="levelOfCare"
                value={formData.levelOfCare}
                onChange={handleInputChange}
                required
                helperText={requiredHelperText(
                  "Required level of care for this client"
                )}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MedicalIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="Level 1">Level 1</MenuItem>
                <MenuItem value="Level 2">Level 2</MenuItem>
                <MenuItem value="Level 3">Level 3</MenuItem>
                <MenuItem value="Level 4">Level 4</MenuItem>
                <MenuItem value="Level 5">Level 5</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </>
      )}

      {/* Mother / Baby Information Section */}
      {renderFormSection(
        "Mother / Baby Information",
        "Only complete if placing mother and child together",
        <ChildIcon sx={{ fontSize: 24 }} />,
        <>
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: 1,
              fontSize: "0.9rem",
            }}
          >
            <strong>Optional Section:</strong> Complete this section only if a
            mother and her child are being placed together as a Mother/Baby
            placement.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Infant Full Name"
                name="infantFullName"
                value={formData.infantFullName}
                onChange={handleInputChange}
                helperText="Infant's legal full name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ChildIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Infant Date of Birth"
                name="infantDateOfBirth"
                type="date"
                value={formData.infantDateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="Infant's date of birth"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Infant Age"
                name="infantAge"
                type="number"
                value={formData.infantAge}
                onChange={handleInputChange}
                helperText="Infant's age (months or years)"
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Infant Intake Date"
                name="infantIntakeDate"
                type="date"
                value={formData.infantIntakeDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="Date infant entered care"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Infant Gender"
                name="infantGender"
                value={formData.infantGender}
                onChange={handleInputChange}
                helperText="Infant's gender"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GenderIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Infant Ethnicity"
                name="infantEthnicity"
                value={formData.infantEthnicity}
                onChange={handleInputChange}
                helperText="Infant's ethnic background"
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
              </TextField>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Step1Form;
