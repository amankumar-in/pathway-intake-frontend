import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { createIntakeForm } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

// Step components
import Step1Form from "../components/intakeForm/Step1Form";
import Step2Form from "../components/intakeForm/Step2Form";
import Step3Form from "../components/intakeForm/Step3Form";

// Styled stepper connector with custom colors
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

// Define the step icons and information
const steps = [
  {
    label: "Office & Client Information",
    description: "Enter basic information about the client and office",
    icon: <PersonIcon />,
  },
  {
    label: "Resource Home & County Details",
    description: "Provide placement and county contact information",
    icon: <HomeIcon />,
  },
  {
    label: "Review & Submit",
    description: "Review all information and submit the form",
    icon: <CheckCircleIcon />,
  },
];

const IntakeForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const [autoSaveTimerId, setAutoSaveTimerId] = useState(null);
  const [progress, setProgress] = useState(0);

  // Initialize form data with defaults from model - ensure all county worker fields match office selection
  const [formData, setFormData] = useState({
    // Office Information
    yourName: user?.name || "",
    office: "Santa Maria",
    dateSubmitted: new Date().toISOString().split("T")[0],
    transactionDate: new Date().toISOString().split("T")[0],
    typeOfTransaction: "Shelter Placement",

    // Case Assigned To
    pathwayRepresentative: "",
    positionJobTitle: "Social Worker",
    intakeRepresentative: "",
    officeNumber: "201",
    phoneNumber: "(805) 739-1111",

    // Client Information
    caseNumber: "",
    name: "",
    age: "",
    dateOfBirth: "",
    ethnicity: "Unknown",
    gender: "Male",
    clientStatus: 300,
    priorPlacement: "Natural Parent",
    reasonForPlacement: "Neglect",
    levelOfCare: "Level 1",

    // Mother/Baby Information
    infantFullName: "",
    infantDateOfBirth: "",
    infantAge: "",
    infantIntakeDate: "",
    infantGender: "Male",
    infantEthnicity: "Unknown",

    // Resource Home Information
    ResourceParentsPayment: "$1206.00",
    nameOfResourceParents: "",
    ResourceParentsTelephone: "",
    ResourceParentsAddress: "",
    ResourceParentsMailingAddress: "",
    ResourceParentsCity: "",
    ResourceParentsState: "California",
    ResourceParentsZip: "",

    // County Worker Information - correctly mapped to default office (Santa Maria)
    countyWillPay: "$2,638.00",
    countyWorkerName: "",
    countyWorkerTitle: "CSW",
    nameOfCounty: "Santa Barbara", // Default for Santa Maria
    nameOfDepartment: "DHS",
    countyWorkerTelephone: "805-819-1921",
    countyWorkerAddress: "2125 S. Centerpoint Prkwy", // Default for Santa Maria
    countyWorkerCity: "Santa Maria", // Default for Santa Maria
    countyWorkerState: "CA",
    countyWorkerZip: "93455", // Default for Santa Maria

    // Categories (default to Intake Paperwork)
    categories: ["Intake Paperwork"],
  });

  useEffect(() => {
    document.title = "New Intake | Pathway Foster Agency";
  }, []);

  // Calculate progress based on required fields filled
  useEffect(() => {
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
      (field) => formData[field] && formData[field] !== ""
    ).length;

    setProgress((filledRequiredFields / requiredFields.length) * 100);
  }, [formData]);

  // Update form data
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
      // Update Resource parents payment based on level of care
      let ResourceParentsPayment = "";

      switch (value) {
        case "Level 1":
          ResourceParentsPayment = "$1,206.00";
          break;
        case "Level 2":
          ResourceParentsPayment = "$1,570.00";
          break;
        case "Level 3":
          ResourceParentsPayment = "$2,058.00";
          break;
        case "Level 4":
          ResourceParentsPayment = "$2,742.00";
          break;
        case "Level 5":
          ResourceParentsPayment = "$3,426.00";
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
        ResourceParentsPayment,
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

  // Handle form cancel
  const handleCancel = () => {
    navigate("/");
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setSaving(true);
      setError("");

      // Check for user.id instead of user._id since that's what the backend returns
      if (!user || !user.id) {
        console.error("Missing user data:", user);
        setError("User authentication error. Please log in again.");
        return;
      }

      // Create a copy of formData to prepare for submission
      const formToSubmit = { ...formData };

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

      // Use user.id instead of user._id for the createdBy field
      formToSubmit.createdBy = user.id;

      // Form status (different from client status)
      formToSubmit.status = "In Progress";

      console.log("Submitting form data:", formToSubmit);

      const response = await createIntakeForm(formToSubmit);
      console.log("Form created successfully, full response:", response);

      // Handle different possible response structures
      let formId;

      if (response._id) {
        // If ID is directly in the response
        formId = response._id;
      } else if (response.data && response.data._id) {
        // If ID is in response.data
        formId = response.data._id;
      } else if (response.id) {
        // If ID is named "id" instead of "_id"
        formId = response.id;
      } else if (response.data && response.data.id) {
        // If ID is named "id" in response.data
        formId = response.data.id;
      }

      if (!formId) {
        console.error("Could not find form ID in response:", response);
        setError("Error: Could not retrieve the created form ID");
        return;
      }

      console.log("Navigating to signature collection with formId:", formId);

      // Navigate to signature collection with the correct ID
      navigate(`/collect-signatures/${formId}`);
    } catch (err) {
      console.error("Error submitting form:", err);

      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Server error: " + err.response.status
        );
        console.error("Server response:", err.response.data);
      } else {
        setError(`Error: ${err.message || "Unknown error occurred"}`);
      }
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  // Manual save function (for save button)
  const handleManualSave = () => {
    setAutoSaveMessage("Saving form progress...");

    // Simulate a save operation
    setTimeout(() => {
      setAutoSaveMessage("Progress saved successfully");
      setTimeout(() => setAutoSaveMessage(""), 2000);
    }, 1000);
  };

  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Step1Form
            formData={formData}
            handleInputChange={handleInputChange}
            isMobile={isMobile}
          />
        );
      case 1:
        return (
          <Step2Form
            formData={formData}
            handleInputChange={handleInputChange}
            isMobile={isMobile}
          />
        );
      case 2:
        return (
          <Step3Form
            formData={formData}
            goToStep={goToStep}
            isMobile={isMobile}
          />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: isMobile ? 2 : 4,
        mb: isMobile ? 4 : 8,
        px: isMobile ? 1 : 2, // Reduce horizontal padding on mobile
      }}
    >
      {/* Top navigation bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: isMobile ? 1.5 : 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Return to dashboard">
            <IconButton
              onClick={handleCancel}
              color="primary"
              sx={{
                mr: isMobile ? 1 : 2,
                bgcolor: "primary.light",
                color: "white",
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
              }}
            >
              <ArrowBackIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              color="primary"
              fontWeight="medium"
              sx={{ fontSize: isMobile ? "1.1rem" : undefined }}
            >
              New Intake
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
            >
              Creating intake record{" "}
              {formData.name ? `for ${formData.name}` : "for a new client"}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Tooltip title="Get help with this form">
            <IconButton
              onClick={() => setShowHelp(!showHelp)}
              color={showHelp ? "primary" : "default"}
              sx={{ mr: isMobile ? 0.5 : 1, padding: isMobile ? 0.5 : 1 }}
              size={isMobile ? "small" : "medium"}
            >
              <HelpIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save progress">
            <IconButton
              color="primary"
              onClick={handleManualSave}
              sx={{ mr: isMobile ? 0.5 : 1, padding: isMobile ? 0.5 : 1 }}
              size={isMobile ? "small" : "medium"}
            >
              <SaveIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Progress indicator */}
      <Box sx={{ mb: isMobile ? 1.5 : 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mr: 1, fontSize: isMobile ? "0.7rem" : "0.75rem" }}
          >
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
              fontSize: isMobile ? "0.7rem" : "0.75rem",
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
            height: isMobile ? 4 : 6,
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
            mb: isMobile ? 1.5 : 3,
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
          <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
            <Typography variant="body1" paragraph>
              <strong>
                Step {activeStep + 1} of 3: {steps[activeStep].label}
              </strong>
            </Typography>
            <Typography
              variant="body2"
              paragraph
              sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
            >
              {activeStep === 0
                ? "This step collects basic information about the office handling the case and the client being admitted. Fields marked with an asterisk (*) are required."
                : activeStep === 1
                ? "This step gathers information about the Resource home and county worker involved in this case. Resource parent and county payment amounts are automatically calculated based on the Level of Care selected in Step 1."
                : "Please review all the information you've entered. You can navigate back to previous steps to make corrections by clicking the Edit button in each section."}
            </Typography>

            <Divider sx={{ my: isMobile ? 1 : 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Tips for this section:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <InfoIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
              <Typography
                variant="body2"
                sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
              >
                {activeStep === 0
                  ? "The office selection will automatically fill in the office number and phone number."
                  : activeStep === 1
                  ? "Payment amounts are determined by the Level of Care selected in the previous step."
                  : "Missing required fields will be highlighted in red."}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InfoIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
              <Typography
                variant="body2"
                sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
              >
                Your progress is saved automatically as you type.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Main form container - Remove Paper on mobile */}
      {isMobile ? (
        <Box>
          {/* Stepper - optimized for mobile */}
          <Box
            sx={{
              px: isMobile ? 0.5 : 3,
              py: isMobile ? 1 : 3,
              bgcolor: "#f8f9fa",
              borderRadius: 2,
              mb: 2,
              border: "1px solid",
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
                            width: isMobile ? 32 : 40,
                            height: isMobile ? 32 : 40,
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
                          activeStep === index
                            ? "primary.main"
                            : "text.primary",
                        fontSize: isMobile ? "0.7rem" : undefined,
                      }}
                    >
                      {step.label}
                    </Typography>
                    {/* Hide description on mobile */}
                    {!isMobile && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {step.description}
                      </Typography>
                    )}
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
              sx={{ mb: 2, borderRadius: 1 }}
            >
              {error}
            </Alert>
          )}

          {/* Form content */}
          <Box sx={{ p: 0 }}>
            <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={300}>
              <div>{getStepContent(activeStep)}</div>
            </Grow>
          </Box>

          {/* Form navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 2,
              mt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? handleCancel : handleBack}
              disabled={loading}
              startIcon={<ArrowBackIcon />}
              size={isMobile ? "small" : "medium"}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || validating}
              sx={{
                px: isMobile ? 2 : 4,
                position: "relative",
                minWidth: isMobile ? "100px" : "140px",
              }}
              size={isMobile ? "small" : "medium"}
            >
              {validating ? (
                "Validating..."
              ) : loading ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress
                    size={isMobile ? 16 : 20}
                    sx={{ mr: 1 }}
                    color="inherit"
                  />
                  Submitting...
                </Box>
              ) : activeStep === steps.length - 1 ? (
                "Submit"
              ) : (
                "Continue"
              )}

              {(validating || loading) && (
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
        </Box>
      ) : (
        /* Regular layout for non-mobile screens */
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
                          activeStep === index
                            ? "primary.main"
                            : "text.primary",
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

          {/* Form content */}
          <Box sx={{ p: 3 }}>
            <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={300}>
              <div>{getStepContent(activeStep)}</div>
            </Grow>
          </Box>

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
              disabled={loading}
              startIcon={<ArrowBackIcon />}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || validating}
              sx={{
                px: 4,
                position: "relative",
                minWidth: "140px",
              }}
            >
              {validating ? (
                "Validating..."
              ) : loading ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  Submitting...
                </Box>
              ) : activeStep === steps.length - 1 ? (
                "Submit"
              ) : (
                "Continue"
              )}

              {(validating || loading) && (
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
      )}

      {/* Auto-save message */}
      <Snackbar
        open={!!autoSaveMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        message={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {autoSaveMessage === "Saving changes..." ||
            autoSaveMessage === "Saving form progress..." ? (
              <CircularProgress
                size={isMobile ? 14 : 16}
                sx={{ mr: 1 }}
                color="inherit"
              />
            ) : (
              <CheckCircleIcon
                fontSize={isMobile ? "small" : "medium"}
                sx={{ mr: 1 }}
              />
            )}
            {autoSaveMessage}
          </Box>
        }
      />
    </Container>
  );
};

export default IntakeForm;
