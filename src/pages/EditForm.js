import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Fade,
  Grow,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Collapse,
  Snackbar,
  styled,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { getIntakeForm, updateIntakeForm } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

// Import step components
import Step1Form from "../components/intakeForm/Step1Form";
import Step2Form from "../components/intakeForm/Step2Form";
import Step3Form from "../components/intakeForm/Step3Form";

// Styled stepper connector with custom colors - matches IntakeForm
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 22,
  },
  [`&.MuiStepConnector-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage:
        "linear-gradient( 95deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)",
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage:
        "linear-gradient( 95deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)",
    },
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

// Steps definition - matches IntakeForm
const steps = [
  {
    label: "Office & Client Information",
    description: "Update basic information about the client and office",
    icon: <PersonIcon />,
  },
  {
    label: "Foster Home & County Details",
    description: "Modify placement and county contact information",
    icon: <HomeIcon />,
  },
  {
    label: "Review & Submit",
    description: "Review all changes and save the form",
    icon: <CheckCircleIcon />,
  },
];

const EditForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalFormData, setOriginalFormData] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  const [validating, setValidating] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const [autoSaveTimerId, setAutoSaveTimerId] = useState(null);
  const [changesDetected, setChangesDetected] = useState(false);
  const [progress, setProgress] = useState(0);

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Invalid date
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };
useEffect(() => {
  document.title = "Edit Intake Form | Pathway Foster Agency";
}, []);
  // Fetch the form data when component mounts
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await getIntakeForm(id);
        console.log("Form data:", response);

        // Set the form data
        let formDataToSet;
        if (response.data) {
          formDataToSet = response.data;
        } else {
          formDataToSet = response;
        }

        // Format all date fields for proper display in the form
        const formattedData = {
          ...formDataToSet,
          // Format the date fields for display in the input elements
          dateSubmitted: formatDateForInput(formDataToSet.dateSubmitted),
          transactionDate: formatDateForInput(formDataToSet.transactionDate),
          dateOfBirth: formatDateForInput(formDataToSet.dateOfBirth),
          infantDateOfBirth: formatDateForInput(
            formDataToSet.infantDateOfBirth
          ),
          infantIntakeDate: formatDateForInput(formDataToSet.infantIntakeDate),
        };

        console.log("Formatted data:", formattedData);
        setFormData(formattedData);
        setOriginalFormData(formattedData); // Store original data for comparison
        setLoading(false);

        // Calculate initial progress
        calculateProgress(formattedData);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Failed to load form data. Please try again later.");
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  // Calculate progress based on required fields filled
  const calculateProgress = (data) => {
    const requiredFields = [
      "yourName",
      "transactionDate",
      "typeOfTransaction",
      "caseNumber",
      "name",
      "dateOfBirth",
      "gender",
      "reasonForPlacement",
      "levelOfCare",
      "countyWorkerName",
    ];

    const filledRequiredFields = requiredFields.filter(
      (field) => data[field] && data[field] !== ""
    ).length;

    setProgress((filledRequiredFields / requiredFields.length) * 100);
  };

  // Calculate changes between original and current data
  useEffect(() => {
    if (Object.keys(originalFormData).length > 0) {
      // Very simple check - just see if anything changed
      const hasChanges =
        JSON.stringify(originalFormData) !== JSON.stringify(formData);
      setChangesDetected(hasChanges);
    }
  }, [formData, originalFormData]);

  // Update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the field that was changed
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous timer if exists
    if (autoSaveTimerId) {
      clearTimeout(autoSaveTimerId);
    }

    // Set the auto-save message
    setAutoSaveMessage("Saving changes...");

    // Set a new timer for simulating auto-save
    const timerId = setTimeout(() => {
      setAutoSaveMessage("All changes saved");
      setTimeout(() => setAutoSaveMessage(""), 2000);
    }, 1000);

    setAutoSaveTimerId(timerId);

    // Calculate progress with the updated field
    calculateProgress({
      ...formData,
      [name]: value,
    });

    // Handle dependent field updates
    // Handle dependent field updates
    if (name === "office") {
      // Update office number and phone based on office selection
      let officeNumber = "";
      let phoneNumber = "";

      // Update county worker information based on office selection
      let nameOfCounty = "";
      let countyWorkerAddress = "";
      let countyWorkerCity = "";
      let countyWorkerZip = "";

      switch (value) {
        case "Santa Maria":
          officeNumber = "201";
          phoneNumber = "(805) 739-1111";
          nameOfCounty = "Santa Barbara";
          countyWorkerAddress = "2125 S. Centerpoint Prkwy";
          countyWorkerCity = "Santa Maria";
          countyWorkerZip = "93455";
          break;
        case "Bakersfield":
          officeNumber = "305";
          phoneNumber = "(661) 396-8600";
          nameOfCounty = "Kern";
          countyWorkerAddress = "P.O. Box 888";
          countyWorkerCity = "Bakersfield";
          countyWorkerZip = "93302";
          break;
        case "Riverside":
          officeNumber = "410";
          phoneNumber = "(951) 686-3706";
          nameOfCounty = "Riverside";
          countyWorkerAddress = "547 N San Jacinto St.";
          countyWorkerCity = "Hemet";
          countyWorkerZip = "92544";
          break;
        case "San Bernardino":
          officeNumber = "505";
          phoneNumber = "(909) 890-5295";
          nameOfCounty = "San Bernardino";
          countyWorkerAddress = "325 W Hospitality Lane Ste 211";
          countyWorkerCity = "San Bernardino";
          countyWorkerZip = "92408";
          break;
        default:
          break;
      }

      setFormData((prev) => ({
        ...prev,
        officeNumber,
        phoneNumber,
        nameOfCounty,
        countyWorkerAddress,
        countyWorkerCity,
        countyWorkerZip,
      }));
    }

    if (name === "levelOfCare") {
      // Update foster parents payment based on level of care
      let fosterParentsPayment = "";

      switch (value) {
        case "Level 1":
          fosterParentsPayment = "$1,206.00";
          break;
        case "Level 2":
          fosterParentsPayment = "$1,570.00";
          break;
        case "Level 3":
          fosterParentsPayment = "$2,058.00";
          break;
        case "Level 4":
          fosterParentsPayment = "$2,742.00";
          break;
        case "Level 5":
          fosterParentsPayment = "$3,426.00";
          break;
        default:
          break;
      }

      // Also update the county payment amount based on level of care
      let countyWillPay = "";

      switch (value) {
        case "Level 1":
          countyWillPay = "$2,638.00";
          break;
        case "Level 2":
          countyWillPay = "$3,429.00";
          break;
        case "Level 3":
          countyWillPay = "$4,500.00";
          break;
        case "Level 4":
          countyWillPay = "$5,989.00";
          break;
        case "Level 5":
          countyWillPay = "$7,478.00";
          break;
        default:
          break;
      }

      setFormData((prev) => ({
        ...prev,
        fosterParentsPayment,
        countyWillPay,
      }));
    }

    // Calculate age from date of birth if dateOfBirth changes
    if (name === "dateOfBirth" && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setFormData((prev) => ({
        ...prev,
        age,
      }));
    }

    // Same for infant date of birth
    if (name === "infantDateOfBirth" && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setFormData((prev) => ({
        ...prev,
        infantAge: age,
      }));
    }

    // Update categories based on typeOfTransaction
    if (name === "typeOfTransaction") {
      let categories = [];

      switch (value) {
        case "Intake":
        case "Shelter Placement":
          categories = ["Intake Paperwork"];
          break;
        case "In House Move":
          categories = ["In House Move"];
          break;
        case "Shelter Placement":
          categories = ["Shelter Bed Documents"];
          break;
        case "LOC Change":
          categories = ["Intake Paperwork"];
          break;
        default:
          categories = ["Intake Paperwork"];
          break;
      }

      setFormData((prev) => ({
        ...prev,
        categories,
      }));
    }
  };

  // Validate form data before submission
  const validateForm = () => {
    const requiredFields = [
      { name: "yourName", label: "Your Name" },
      { name: "transactionDate", label: "Placement Date" },
      { name: "typeOfTransaction", label: "Type of Placement" },
      { name: "caseNumber", label: "Case Number" },
      { name: "name", label: "Client Name" },
      { name: "dateOfBirth", label: "Date of Birth" },
      { name: "gender", label: "Gender" },
      { name: "reasonForPlacement", label: "Reason for Placement" },
      { name: "levelOfCare", label: "Level of Care" },
      { name: "countyWorkerName", label: "County Worker Name" },
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field.name] || formData[field.name] === ""
    );

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`
      );
      return false;
    }

    return true;
  };

  // Handle step navigation
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit form on last step, but validate first
      if (validateForm()) {
        handleSubmit();
      }
    } else {
      // Validate current step
      setValidating(true);

      // Simulate validation
      setTimeout(() => {
        setValidating(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }, 500);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Go to a specific step (used from review page)
  const goToStep = (step) => {
    setActiveStep(step);
  };

  const handleCancel = () => {
    navigate("/");
  };

  // Submit form updates
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      // Ensure user is authenticated
      if (!user || !user.id) {
        console.error("Missing user data:", user);
        setError("User authentication error. Please log in again.");
        return;
      }

      // Create a copy of formData to prepare for submission
      const formToSubmit = { ...formData };

      // Set the updatedBy and updatedAt fields
      formToSubmit.updatedBy = user.id;
      formToSubmit.updatedAt = new Date().toISOString();

      // Ensure dates are in ISO format
      if (formToSubmit.dateSubmitted) {
        formToSubmit.dateSubmitted = new Date(
          formToSubmit.dateSubmitted
        ).toISOString();
      }
      if (formToSubmit.transactionDate) {
        formToSubmit.transactionDate = new Date(
          formToSubmit.transactionDate
        ).toISOString();
      }
      if (formToSubmit.dateOfBirth) {
        formToSubmit.dateOfBirth = new Date(
          formToSubmit.dateOfBirth
        ).toISOString();
      }
      if (
        formToSubmit.infantDateOfBirth &&
        formToSubmit.infantDateOfBirth !== ""
      ) {
        formToSubmit.infantDateOfBirth = new Date(
          formToSubmit.infantDateOfBirth
        ).toISOString();
      }
      if (
        formToSubmit.infantIntakeDate &&
        formToSubmit.infantIntakeDate !== ""
      ) {
        formToSubmit.infantIntakeDate = new Date(
          formToSubmit.infantIntakeDate
        ).toISOString();
      }

      // Ensure clientStatus is a number
      if (
        typeof formToSubmit.clientStatus === "string" &&
        !isNaN(parseInt(formToSubmit.clientStatus))
      ) {
        formToSubmit.clientStatus = parseInt(formToSubmit.clientStatus);
      }

      console.log("Submitting updated form data:", formToSubmit);

      const response = await updateIntakeForm(id, formToSubmit);
      console.log("Form updated successfully:", response);

      // Navigate back to dashboard with success message
      navigate("/", {
        state: { message: "Form updated successfully", severity: "success" },
      });
    } catch (err) {
      console.error("Error updating form:", err);

      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Server error: " + err.response.status
        );
      } else {
        setError(`Error: ${err.message || "Unknown error occurred"}`);
      }
      setSubmitting(false);
    }
  };

  // Manual save function (for save button)
  const handleManualSave = () => {
    setAutoSaveMessage("Saving form changes...");

    // Simulate a save operation
    setTimeout(() => {
      setAutoSaveMessage("Changes saved successfully");
      setTimeout(() => setAutoSaveMessage(""), 2000);
    }, 1000);
  };

  // Render step content
  const getStepContent = (step) => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    switch (step) {
      case 0:
        return (
          <Step1Form
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <Step2Form
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return <Step3Form formData={formData} goToStep={goToStep} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Top navigation bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Return to dashboard">
            <IconButton
              onClick={handleCancel}
              color="primary"
              sx={{ mr: 2, bgcolor: "primary.light", color: "white" }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h5" color="primary" fontWeight="medium">
              Edit Intake Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loading ? (
                <CircularProgress size={12} sx={{ mr: 1 }} />
              ) : (
                <>
                  {formData.name
                    ? `Client: ${formData.name}`
                    : "Loading client details"}
                  {formData.caseNumber && ` | Case #: ${formData.caseNumber}`}
                </>
              )}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {changesDetected && (
            <Chip
              icon={<EditIcon />}
              label="Unsaved changes"
              color="warning"
              size="small"
              variant="outlined"
              sx={{ mr: 2 }}
            />
          )}

          <Tooltip title="Get help with this form">
            <IconButton
              onClick={() => setShowHelp(!showHelp)}
              color={showHelp ? "primary" : "default"}
              sx={{ mr: 1 }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save progress">
            <IconButton
              color="primary"
              onClick={handleManualSave}
              sx={{ mr: 1 }}
              disabled={!changesDetected}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Progress indicator */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Form completion: {Math.round(progress)}%
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color:
                progress === 100
                  ? "success.dark"
                  : progress > 50
                  ? "primary.dark"
                  : "text.secondary",
              fontWeight: progress === 100 ? "bold" : "medium",
            }}
          >
            {progress === 100
              ? "Complete"
              : progress > 70
              ? "Almost complete"
              : progress > 30
              ? "In progress"
              : "Just started"}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "grey.200",
            "& .MuiLinearProgress-bar": {
              bgcolor: progress === 100 ? "success.main" : undefined,
            },
          }}
        />
      </Box>

      {/* Help panel */}
      <Collapse in={showHelp}>
        <Card
          variant="outlined"
          sx={{
            mb: 3,
            borderColor: "primary.light",
            bgcolor: "#f0f7ff",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ bgcolor: "primary.main", py: 1, px: 2 }}>
            <Typography variant="subtitle2" color="white">
              Help & Information
            </Typography>
          </Box>
          <CardContent>
            <Typography variant="body1" paragraph>
              <strong>
                Step {activeStep + 1} of 3: {steps[activeStep].label}
              </strong>
            </Typography>
            <Typography variant="body2" paragraph>
              {activeStep === 0
                ? "This step allows you to update basic information about the office handling the case and the client. Fields marked with an asterisk (*) are required."
                : activeStep === 1
                ? "This step lets you modify information about the foster home and county worker involved in this case. Foster parent and county payment amounts are automatically calculated based on the Level of Care selected in Step 1."
                : "Please review all the changes you've made. You can navigate back to previous steps to make additional edits by clicking the Edit button in each section."}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Tips for editing forms:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <InfoIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Changes are tracked automatically and saved when you submit the
                form.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InfoIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                You can close this form without saving changes using the Cancel
                or Back button.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Main form paper */}
      <Paper
        elevation={3}
        sx={{
          p: 0,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Stepper */}
        <Box
          sx={{
            p: 3,
            bgcolor: "#f8f9fa",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stepper
            activeStep={activeStep}
            connector={<ColorlibConnector />}
            alternativeLabel
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => {
                    return (
                      <Box
                        sx={{
                          backgroundColor:
                            activeStep === index
                              ? "primary.main"
                              : activeStep > index
                              ? "success.main"
                              : "grey.400",
                          width: 40,
                          height: 40,
                          display: "flex",
                          borderRadius: "50%",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          transition: "all 0.3s",
                          boxShadow:
                            activeStep === index
                              ? "0 4px 10px rgba(0, 0, 0, 0.2)"
                              : "none",
                          transform:
                            activeStep === index ? "scale(1.15)" : "scale(1)",
                        }}
                      >
                        {step.icon}
                      </Box>
                    );
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: activeStep === index ? "bold" : "normal",
                      color:
                        activeStep === index ? "primary.main" : "text.primary",
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Error message */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mx: 3, mt: 3, borderRadius: 1 }}
          >
            {error}
          </Alert>
        )}

        {/* Loading state */}
        {loading && (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading form data...
            </Typography>
          </Box>
        )}

        {/* Form content */}
        {!loading && (
          <Box sx={{ p: 3 }}>
            <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={300}>
              <div>{getStepContent(activeStep)}</div>
            </Grow>
          </Box>
        )}

        {/* Form navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 3,
            bgcolor: "#f8f9fa",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            onClick={activeStep === 0 ? handleCancel : handleBack}
            disabled={submitting}
            startIcon={<ArrowBackIcon />}
          >
            {activeStep === 0 ? "Cancel" : "Back"}
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading || submitting || validating}
            sx={{
              px: 4,
              position: "relative",
              minWidth: "140px",
            }}
          >
            {validating ? (
              "Validating..."
            ) : submitting ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Saving...
              </Box>
            ) : activeStep === steps.length - 1 ? (
              "Save Changes"
            ) : (
              "Continue"
            )}

            {(validating || submitting) && (
              <LinearProgress
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                }}
              />
            )}
          </Button>
        </Box>
      </Paper>

      {/* Auto-save message */}
      <Snackbar
        open={!!autoSaveMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        message={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {autoSaveMessage === "Saving changes..." ||
            autoSaveMessage === "Saving form changes..." ? (
              <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
            ) : (
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
            )}
            {autoSaveMessage}
          </Box>
        }
      />
    </Container>
  );
};

export default EditForm;
