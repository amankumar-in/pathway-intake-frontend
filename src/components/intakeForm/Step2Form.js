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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Help as HelpIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  LocationCity as LocationCityIcon,
} from "@mui/icons-material";

const Step2Form = ({ formData = {}, handleInputChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Helper function to render section with consistent styling
  const renderFormSection = (title, description, icon, children) => (
    <Card
      elevation={0}
      variant="outlined"
      sx={{
        mb: isMobile ? 2 : 4,
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
          p: isMobile ? 1.5 : 2,
          display: "flex",
          alignItems: "center",
          bgcolor: "primary.light",
          color: "white",
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
        }}
      >
        {React.cloneElement(icon, {
          sx: { fontSize: isMobile ? 20 : 24 },
        })}
        <Box sx={{ ml: 1 }}>
          <Typography
            variant="h6"
            fontWeight="500"
            sx={{ fontSize: isMobile ? "0.95rem" : "1.1rem" }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: isMobile ? "0.75rem" : "0.85rem",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>{children}</CardContent>
    </Card>
  );

  // Required field helper text renderer
  const requiredHelperText = (label) => (
    <Box
      component="span"
      sx={{
        display: "flex",
        alignItems: "center",
        fontSize: isMobile ? "0.7rem" : "0.75rem",
      }}
    >
      <Box component="span" sx={{ color: "error.main", mr: 0.5 }}>
        *
      </Box>
      {label}
    </Box>
  );

  // Field text size for mobile
  const textFieldProps = isMobile
    ? {
        InputProps: { style: { fontSize: "0.9rem" } },
        InputLabelProps: { style: { fontSize: "0.9rem" } },
        SelectProps: {
          MenuProps: {
            PaperProps: { style: { maxHeight: 300 } },
          },
        },
      }
    : {};

  return (
    <Box component="form">
      {/* Resource Home Information Section */}
      {renderFormSection(
        "Resource Home Information",
        "Details about the Resource home where the client will be placed",
        <HomeIcon />,
        <>
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: 1,
              "& .MuiAlert-message": {
                fontSize: isMobile ? "0.8rem" : "0.9rem",
              },
            }}
          >
            The payment amounts are automatically calculated based on the
            selected Level of Care.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resource Parents Payment"
                name="ResourceParentsPayment"
                value={formData.ResourceParentsPayment || ""}
                onChange={handleInputChange}
                helperText="Monthly payment to Resource parents"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name of Resource Parents"
                name="nameOfResourceParents"
                value={formData.nameOfResourceParents || ""}
                onChange={handleInputChange}
                helperText="Full names of Resource parents"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telephone Number"
                name="ResourceParentsTelephone"
                value={formData.ResourceParentsTelephone || ""}
                onChange={handleInputChange}
                helperText="Primary contact number for Resource parents"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  fontSize: isMobile ? "0.85rem" : "0.875rem",
                }}
              >
                Resource Home Address
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="ResourceParentsAddress"
                value={formData.ResourceParentsAddress || ""}
                onChange={handleInputChange}
                helperText="Street address of Resource home"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mailing Address (if different from above)"
                name="ResourceParentsMailingAddress"
                value={formData.ResourceParentsMailingAddress || ""}
                onChange={handleInputChange}
                helperText="Leave blank if same as physical address"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="ResourceParentsCity"
                value={formData.ResourceParentsCity || ""}
                onChange={handleInputChange}
                helperText="City of Resource home"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="State"
                name="ResourceParentsState"
                value={formData.ResourceParentsState || ""}
                onChange={handleInputChange}
                helperText="State of Resource home"
                InputProps={textFieldProps.InputProps}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Zip"
                name="ResourceParentsZip"
                value={formData.ResourceParentsZip || ""}
                onChange={handleInputChange}
                helperText="Zip code of Resource home"
                InputProps={textFieldProps.InputProps}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* County Worker Information Section */}
      {renderFormSection(
        "County Worker Information",
        "Details about the county worker responsible for this case",
        <WorkIcon />,
        <>
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: 1,
              "& .MuiAlert-message": {
                fontSize: isMobile ? "0.8rem" : "0.9rem",
              },
            }}
          >
            The county payment amount is automatically calculated based on the
            selected Level of Care.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="County Will Pay"
                name="countyWillPay"
                value={formData.countyWillPay || ""}
                onChange={handleInputChange}
                helperText="Monthly payment from the county"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="County Worker Name"
                name="countyWorkerName"
                value={formData.countyWorkerName || ""}
                onChange={handleInputChange}
                required
                helperText={requiredHelperText("Full name of county worker")}
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                label="County Worker Title"
                name="countyWorkerTitle"
                value={formData.countyWorkerTitle || ""}
                onChange={handleInputChange}
                helperText="Job title of the county worker"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                label="Name of County"
                name="nameOfCounty"
                value={formData.nameOfCounty || ""}
                onChange={handleInputChange}
                helperText="County issuing the placement"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Name of Department"
                name="nameOfDepartment"
                value={formData.nameOfDepartment || ""}
                onChange={handleInputChange}
                helperText="Department within the county"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telephone Number"
                name="countyWorkerTelephone"
                value={formData.countyWorkerTelephone || ""}
                onChange={handleInputChange}
                helperText="Contact number for county worker"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  fontSize: isMobile ? "0.85rem" : "0.875rem",
                }}
              >
                County Department Address
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="countyWorkerAddress"
                value={formData.countyWorkerAddress || ""}
                onChange={handleInputChange}
                helperText="Street address of county department"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="countyWorkerCity"
                value={formData.countyWorkerCity || ""}
                onChange={handleInputChange}
                helperText="City of county department"
                InputProps={{
                  ...textFieldProps.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="State"
                name="countyWorkerState"
                value={formData.countyWorkerState || ""}
                onChange={handleInputChange}
                helperText="State of county department"
                InputProps={textFieldProps.InputProps}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Zip"
                name="countyWorkerZip"
                value={formData.countyWorkerZip || ""}
                onChange={handleInputChange}
                helperText="Zip code of county department"
                InputProps={textFieldProps.InputProps}
                InputLabelProps={textFieldProps.InputLabelProps}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Step2Form;
