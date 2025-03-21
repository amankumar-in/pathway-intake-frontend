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

const Step2Form = ({ formData, handleInputChange }) => {
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
      {/* Foster Home Information Section */}
      {renderFormSection(
        "Foster Home Information",
        "Details about the foster home where the client will be placed",
        <HomeIcon sx={{ fontSize: 24 }} />,
        <>
          <Alert
            severity="info"
            variant="outlined"
            sx={{ mb: 3, borderRadius: 1 }}
          >
            The payment amounts are automatically calculated based on the
            selected Level of Care.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Foster Parents Payment"
                name="fosterParentsPayment"
                value={formData.fosterParentsPayment}
                onChange={handleInputChange}
                helperText="Monthly payment to foster parents"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name of Foster Parents"
                name="nameOfFosterParents"
                value={formData.nameOfFosterParents}
                onChange={handleInputChange}
                helperText="Full names of foster parents"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telephone Number"
                name="fosterParentsTelephone"
                value={formData.fosterParentsTelephone}
                onChange={handleInputChange}
                helperText="Primary contact number for foster parents"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Foster Home Address
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="fosterParentsAddress"
                value={formData.fosterParentsAddress}
                onChange={handleInputChange}
                helperText="Street address of foster home"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mailing Address (if different from above)"
                name="fosterParentsMailingAddress"
                value={formData.fosterParentsMailingAddress}
                onChange={handleInputChange}
                helperText="Leave blank if same as physical address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="fosterParentsCity"
                value={formData.fosterParentsCity}
                onChange={handleInputChange}
                helperText="City of foster home"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="State"
                name="fosterParentsState"
                value={formData.fosterParentsState}
                onChange={handleInputChange}
                helperText="State of foster home"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Zip"
                name="fosterParentsZip"
                value={formData.fosterParentsZip}
                onChange={handleInputChange}
                helperText="Zip code of foster home"
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* County Worker Information Section */}
      {renderFormSection(
        "County Worker Information",
        "Details about the county worker responsible for this case",
        <WorkIcon sx={{ fontSize: 24 }} />,
        <>
          <Alert
            severity="info"
            variant="outlined"
            sx={{ mb: 3, borderRadius: 1 }}
          >
            The county payment amount is automatically calculated based on the
            selected Level of Care.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="County Will Pay"
                name="countyWillPay"
                value={formData.countyWillPay}
                onChange={handleInputChange}
                helperText="Monthly payment from the county"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="County Worker Name"
                name="countyWorkerName"
                value={formData.countyWorkerName}
                onChange={handleInputChange}
                required
                helperText={requiredHelperText("Full name of county worker")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="County Worker Title"
                name="countyWorkerTitle"
                value={formData.countyWorkerTitle}
                onChange={handleInputChange}
                helperText="Job title of the county worker"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Name of County"
                name="nameOfCounty"
                value={formData.nameOfCounty}
                onChange={handleInputChange}
                helperText="County issuing the placement"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Name of Department"
                name="nameOfDepartment"
                value={formData.nameOfDepartment}
                onChange={handleInputChange}
                helperText="Department within the county"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telephone Number"
                name="countyWorkerTelephone"
                value={formData.countyWorkerTelephone}
                onChange={handleInputChange}
                helperText="Contact number for county worker"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ mt: 1, color: "text.secondary" }}
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
                value={formData.countyWorkerAddress}
                onChange={handleInputChange}
                helperText="Street address of county department"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="countyWorkerCity"
                value={formData.countyWorkerCity}
                onChange={handleInputChange}
                helperText="City of county department"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="State"
                name="countyWorkerState"
                value={formData.countyWorkerState}
                onChange={handleInputChange}
                helperText="State of county department"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Zip"
                name="countyWorkerZip"
                value={formData.countyWorkerZip}
                onChange={handleInputChange}
                helperText="Zip code of county department"
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Step2Form;
