import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import { AuthContext } from "../context/AuthContext";
import { getFormComponent } from "../utils/documentMapper";
import { createStandaloneDocument } from "../utils/api";

const StandaloneDocumentForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [documentData, setDocumentData] = useState(null);

  // Get document data from URL query params if present
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const documentDataParam = queryParams.get("documentData");

    if (documentDataParam) {
      try {
        const decodedDocumentData = JSON.parse(
          decodeURIComponent(documentDataParam)
        );
        setDocumentData(decodedDocumentData);

        // Initialize formData from the passed document data
        if (decodedDocumentData.formData) {
          setFormData(decodedDocumentData.formData);
        }
      } catch (err) {
        console.error("Error parsing document data from URL:", err);
        setError("Invalid document data in URL parameters");
      }
    } else {
      // Redirect back to dashboard if no document data
      navigate("/");
    }
  }, [navigate]);

  // Make disabled fields editable using direct DOM manipulation
  useEffect(() => {
    if (!documentData) return;

    // Function to enable all disabled fields
    const enableDisabledFields = () => {
      console.log("Enabling all disabled fields");

      // Wait a bit for the DOM to fully render
      setTimeout(() => {
        try {
          // Get all disabled inputs and make them editable
          const disabledInputs = document.querySelectorAll(
            "input[disabled], textarea[disabled]"
          );
          console.log(`Found ${disabledInputs.length} disabled inputs`);

          disabledInputs.forEach((input) => {
            // Remove disabled attribute
            input.removeAttribute("disabled");

            // Store original name to identify the field
            const fieldName =
              input.name || input.getAttribute("data-field-name");
            if (!fieldName) return;

            // Add data attribute to mark as originally disabled
            input.setAttribute("data-originally-disabled", "true");

            // Add event listener to update state when input changes
            input.addEventListener("change", (e) => {
              console.log(`Field ${fieldName} changed to:`, e.target.value);
              handleInputChange({
                target: {
                  name: fieldName,
                  value: e.target.value,
                },
              });
            });

            console.log(`Enabled field: ${fieldName}`);
          });

          // Handle readonly inputs
          const readonlyInputs = document.querySelectorAll(
            "input[readonly], textarea[readonly]"
          );
          console.log(`Found ${readonlyInputs.length} readonly inputs`);

          readonlyInputs.forEach((input) => {
            // Remove readonly attribute
            input.removeAttribute("readonly");

            // Store original name to identify the field
            const fieldName =
              input.name || input.getAttribute("data-field-name");
            if (!fieldName) return;

            // Add data attribute to mark as originally readonly
            input.setAttribute("data-originally-readonly", "true");

            // Add event listener to update state when input changes
            input.addEventListener("change", (e) => {
              console.log(`Field ${fieldName} changed to:`, e.target.value);
              handleInputChange({
                target: {
                  name: fieldName,
                  value: e.target.value,
                },
              });
            });

            console.log(`Made editable: ${fieldName}`);
          });

          // Fix MUI TextField styling
          const muiDisabledElements =
            document.querySelectorAll(".Mui-disabled");
          muiDisabledElements.forEach((el) => {
            el.classList.remove("Mui-disabled");
            el.classList.add("MuiOutlinedInput-notchedOutline");
          });

          console.log("All fields should now be editable");
        } catch (err) {
          console.error("Error making fields editable:", err);
        }
      }, 500); // Wait 500ms for the DOM to render
    };

    // Call the function when component mounts and when document data changes
    enableDisabledFields();

    // Also add a mutation observer to handle dynamically added fields
    const observer = new MutationObserver(enableDisabledFields);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "readonly"],
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [documentData, formData]); // Re-run when document data or form data changes

  // Define steps - reduced from 3 to 2 steps for better flow
  const steps = [
    {
      label: "Document Information",
      description: "Fill in the document details",
    },
    {
      label: "Review & Submit",
      description: "Review information and create document",
    },
  ];

  // Update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the field name has "formData." prefix
    if (name.startsWith("formData.")) {
      // Extract the actual field name without the prefix
      const actualFieldName = name.replace("formData.", "");

      // Update formData correctly
      setFormData((prev) => ({
        ...prev,
        [actualFieldName]: value,
      }));
    } else {
      // Regular field without formData prefix
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSaveMessage("Creating document...");

      if (!documentData) {
        setError("Document data is missing");
        return;
      }

      // Create document data object for submission
      const dataToSubmit = {
        ...documentData,
        formData: {
          ...formData,
          template: documentData.template, // Ensure template is preserved
        },
      };

      console.log("Submitting standalone document:", dataToSubmit);

      // Create the standalone document
      const response = await createStandaloneDocument(dataToSubmit);
      console.log("Document created successfully:", response);

      setSaveMessage(
        "Document created successfully! Redirecting to signature collection..."
      );

      // Navigate directly to signature collection
      setTimeout(() => {
        navigate(`/standalone-signatures/${response.data._id}`);
      }, 1000);
    } catch (err) {
      console.error("Error creating document:", err);
      setError(
        "Error creating document: " +
          (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  // Handle step navigation
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step - submit the form
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      // Go back to dashboard on first step
      navigate("/");
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Render form based on the document template
  const renderForm = () => {
    if (!documentData || !documentData.template) {
      return (
        <Alert severity="error">
          Document template information is missing. Please go back and try
          again.
        </Alert>
      );
    }

    return getFormComponent(documentData.template, formData, handleInputChange);
  };

  // Render review content
  const renderReviewStep = () => {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please review the document information carefully before proceeding.
          All fields should be accurately filled.
        </Alert>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontSize: isMobile ? "0.9rem" : undefined }}
            >
              Document Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", width: isMobile ? 120 : 200 }}
                >
                  Document Type:
                </Typography>
                <Typography variant="body2">{documentData.title}</Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", width: isMobile ? 120 : 200 }}
                >
                  Created For:
                </Typography>
                <Typography variant="body2">
                  {documentData.createdFor}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", width: isMobile ? 120 : 200 }}
                >
                  Category:
                </Typography>
                <Typography variant="body2">{documentData.category}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => setActiveStep(0)}
          sx={{ mb: 3 }}
          size={isMobile ? "small" : "medium"}
        >
          Edit Information
        </Button>

        <Alert severity="success">
          After submitting, you'll be able to add signatures to this document
          directly.
        </Alert>
      </Box>
    );
  };

  // Render content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderForm();
      case 1:
        return renderReviewStep();
      default:
        return "Unknown step";
    }
  };

  if (!documentData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", p: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading document information...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 1 : 2 }}
    >
      {/* Success message */}
      <Snackbar
        open={!!saveMessage}
        autoHideDuration={6000}
        onClose={() => setSaveMessage("")}
        message={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {loading ? (
              <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
            ) : (
              <CheckIcon fontSize="small" sx={{ mr: 1 }} />
            )}
            {saveMessage}
          </Box>
        }
      />

      <Paper
        elevation={isMobile ? 1 : 3}
        sx={{
          p: 0,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: isMobile ? 2 : 3,
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            bgcolor: isMobile ? "transparent" : "primary.main",
            color: isMobile ? "text.primary" : "white",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleBack}
              sx={{
                mr: 1.5,
                color: isMobile ? "primary.main" : "white",
                p: isMobile ? 0.5 : 1,
              }}
            >
              <ArrowBackIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="h1"
              sx={{
                fontSize: isMobile ? "1rem" : isTablet ? "1.25rem" : undefined,
              }}
            >
              Create {documentData.title}
            </Typography>
          </Box>

          {!isMobile && (
            <Typography variant="body2" sx={{ opacity: 0.9, ml: 1 }}>
              For: {documentData.createdFor}
            </Typography>
          )}

          {isMobile && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem", ml: 5, mt: 0.5 }}
            >
              For: {documentData.createdFor}
            </Typography>
          )}
        </Box>

        {/* Stepper */}
        <Box sx={{ p: isMobile ? 1.5 : 3, bgcolor: "#f8f9fa" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                  >
                    {step.label}
                  </Typography>
                  {!isMobile && (
                    <Typography variant="caption" color="text.secondary">
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
            sx={{ mx: 3, mt: 3, borderRadius: 1 }}
          >
            {error}
          </Alert>
        )}

        {/* Form content */}
        <Box sx={{ p: isMobile ? 2 : 3 }}>{renderStepContent()}</Box>

        {/* Navigation buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: isMobile ? 2 : 3,
            bgcolor: "#f8f9fa",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isTablet ? "0.8rem" : undefined }}
          >
            {activeStep === 0 ? "Cancel" : "Back"}
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={activeStep === steps.length - 1 ? <SendIcon /> : null}
            disabled={loading}
            color={activeStep === steps.length - 1 ? "primary" : "primary"}
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isTablet ? "0.8rem" : undefined }}
          >
            {loading ? (
              <CircularProgress size={isMobile ? 16 : 24} />
            ) : activeStep === steps.length - 1 ? (
              isMobile ? (
                "Create & Sign"
              ) : (
                "Create & Continue to Signatures"
              )
            ) : (
              "Continue"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default StandaloneDocumentForm;
