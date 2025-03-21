import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  LinearProgress,
  InputAdornment,
  TextField,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  ChildCare as ChildIcon,
  Backup as BackupIcon,
  DeleteOutline as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Face as FaceIcon,
  SupervisorAccount as SupervisorIcon,
  Group as GroupIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import SignatureCanvas from "react-signature-canvas";
import { getIntakeForm, updateSignature } from "../utils/api";

// Signature types with more detailed information and icons
const signatures = [
  {
    type: "childSignature",
    label: "Child Signature",
    description: "Signature of the child client (if age-appropriate)",
    icon: <ChildIcon />,
    color: "#1976d2", // primary blue
  },
  {
    type: "parentSignature",
    label: "Parent/Guardian Signature",
    description: "Signature of parent or legal guardian",
    icon: <PersonIcon />,
    color: "#9c27b0", // purple
  },
  {
    type: "caseworkerSignature",
    label: "Caseworker Signature",
    description: "Signature of the assigned caseworker",
    icon: <FaceIcon />,
    color: "#2e7d32", // green
  },
  {
    type: "supervisorSignature",
    label: "Supervisor Signature",
    description: "Signature of the supervising staff member",
    icon: <SupervisorIcon />,
    color: "#ed6c02", // orange
  },
  {
    type: "agencyRepSignature",
    label: "Agency Representative Signature",
    description: "Signature of agency official representative",
    icon: <WorkIcon />,
    color: "#d32f2f", // red
  },
];

const CollectSignatures = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const sigPadRef = useRef({});
  const [isDrawing, setIsDrawing] = useState(false);

  // Event handlers to track drawing state
  const handleBeginDrawing = () => {
    setIsDrawing(true);
    setError(""); // Clear any previous errors
  };

  // Fetch form data on component mount
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await getIntakeForm(id);
        setFormData(response.data);
      } catch (err) {
        setError(
          "Error loading form data: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  // Clear signature pad
  const clearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    if (sigPadRef.current && sigPadRef.current.on) {
      // Add event listeners for begin drawing
      sigPadRef.current.on("beginStroke", handleBeginDrawing);

      // Configure the signature pad for better quality
      if (sigPadRef.current._ctx) {
        // Enable high quality rendering with anti-aliasing
        sigPadRef.current._ctx.imageSmoothingEnabled = true;
        sigPadRef.current._ctx.imageSmoothingQuality = "high";

        // Adjust line join and cap for smoother signatures
        sigPadRef.current._ctx.lineJoin = "round";
        sigPadRef.current._ctx.lineCap = "round";
      }

      return () => {
        // Clean up event listeners when component unmounts
        if (sigPadRef.current && sigPadRef.current.off) {
          sigPadRef.current.off("beginStroke", handleBeginDrawing);
        }
      };
    }
  }, []);

  useEffect(() => {
    // Clear the signature pad whenever the active step changes
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      setIsDrawing(false); // Reset drawing state for the new signature
    }
  }, [activeStep]); // This will run whenever activeStep changes

  // Save current signature with high-quality settings
  const saveSignature = async () => {
    try {
      if (!sigPadRef.current) {
        setError("Signature pad not properly initialized");
        return;
      }

      if (sigPadRef.current.isEmpty()) {
        setError("Please provide a signature before proceeding.");
        return;
      }

      setLoading(true);
      setError("");

      // Get enhanced signature data with improved quality settings
      // Use higher quality settings for the PNG and set proper DPI
      const canvas = sigPadRef.current.getCanvas();
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Create a larger canvas for higher resolution output
      const highResCanvas = document.createElement("canvas");
      const ctx = highResCanvas.getContext("2d");

      // Set dimensions 2x larger for better quality (can be adjusted if needed)
      const width = canvas.width * 2;
      const height = canvas.height * 2;

      highResCanvas.width = width;
      highResCanvas.height = height;

      // White background for cleaner appearance
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      // Scale and draw the original signature (with smoothing)
      ctx.scale(2, 2);
      ctx.drawImage(canvas, 0, 0);

      // Get high quality image data
      const signatureData = highResCanvas.toDataURL("image/png", 1.0);
      const signatureType = signatures[activeStep].type;

      // Save signature to server
      await updateSignature(id, signatureType, signatureData);

      // Mark step as completed
      setCompletedSteps((prev) => [...prev, activeStep]);

      // Move to next step or finish
      handleNext();
    } catch (err) {
      console.error("Error saving signature:", err);
      setError(
        "Error saving signature: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Skip current signature
  const skipSignature = () => {
    // Mark step as skipped
    setSkippedSteps((prev) => [...prev, activeStep]);
    handleNext();
  };

  // Handle step navigation
  const handleNext = () => {
    if (activeStep === signatures.length - 1) {
      // All signatures collected, navigate to document view
      navigate(`/view-documents/${id}`);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    return ((activeStep + 1) / signatures.length) * 100;
  };

  if (loading && !formData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Loading form data...
          </Typography>
          <LinearProgress />
        </Paper>
      </Container>
    );
  }

  if (error && !formData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              startIcon={<ArrowBackIcon />}
            >
              Return to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Get current signature info
  const currentSignature = signatures[activeStep];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card
        elevation={0}
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h5" component="h1">
            Collect Signatures
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
            Complete all required signatures for document processing
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={calculateProgress()}
          sx={{ height: 6 }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* Client Summary */}
          <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip
              icon={<PersonIcon />}
              label={`Client: ${formData?.name || "Not specified"}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<BusinessIcon />}
              label={`Case #: ${formData?.caseNumber || "Not specified"}`}
              color="secondary"
              variant="outlined"
            />
            {formData?.typeOfTransaction && (
              <Chip label={formData.typeOfTransaction} variant="outlined" />
            )}
            {formData?.levelOfCare && (
              <Chip label={`LOC: ${formData.levelOfCare}`} variant="outlined" />
            )}
          </Box>

          {/* Signature Step Process */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {signatures.map((sig, index) => {
                const stepProps = {};
                const labelProps = {};

                const isCompleted = completedSteps.includes(index);
                const isSkipped = skippedSteps.includes(index);

                return (
                  <Step key={sig.type} {...stepProps} completed={isCompleted}>
                    <StepLabel
                      {...labelProps}
                      StepIconProps={{
                        icon: isSkipped ? <CancelIcon color="action" /> : null,
                        style: { color: sig.color },
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={index === activeStep ? "medium" : "normal"}
                      >
                        {sig.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>

          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{ mb: 3, borderRadius: 1 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Current Signature Section */}
          <Card
            elevation={0}
            variant="outlined"
            sx={{
              borderRadius: 2,
              mb: 3,
              borderColor: currentSignature.color,
              borderWidth: 2,
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
                bgcolor: `${currentSignature.color}15`,
                borderBottom: `1px solid ${currentSignature.color}40`,
              }}
            >
              <Avatar sx={{ bgcolor: currentSignature.color, mr: 2 }}>
                {currentSignature.icon}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="500">
                  {currentSignature.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentSignature.description}
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" paragraph>
                Please sign clearly within the signature box below. If this
                signature is not applicable, you can skip to the next one.
              </Typography>

              <Box
                sx={{
                  border: `2px solid ${
                    isDrawing ? currentSignature.color : "#e0e0e0"
                  }`,
                  borderRadius: 1,
                  backgroundColor: "#f9f9f9",
                  mb: 3,
                  height: 200,
                  width: "100%",
                  position: "relative",
                  touchAction: "none",
                  transition: "border-color 0.3s ease",
                }}
              >
                <SignatureCanvas
                  ref={sigPadRef}
                  penColor="black"
                  dotSize={2} // Thicker dots for smoother lines
                  minWidth={1.5} // Minimum line width
                  maxWidth={3} // Maximum line width
                  throttle={16} // Smoother rendering (ms)
                  backgroundColor="rgba(255,255,255,0)" // Transparent background
                  canvasProps={{
                    className: "signature-canvas",
                    style: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      touchAction: "none",
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={clearSignature}
                disabled={loading}
              >
                Clear Signature
              </Button>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", gap: 2 }}>
                {activeStep > 0 && (
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<ArrowForwardIcon />}
                  onClick={skipSignature}
                  disabled={loading}
                >
                  Skip {activeStep === signatures.length - 1 ? "& Finish" : ""}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={saveSignature}
                  disabled={loading}
                  sx={{ bgcolor: currentSignature.color }}
                >
                  {activeStep === signatures.length - 1
                    ? "Save & Finish"
                    : "Save & Next"}
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Helpful Information */}
          <Box sx={{ mt: 4 }}>
            <Alert severity="info" variant="outlined" sx={{ borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Note:</strong> All signatures are optional and can be
                skipped if not applicable. Once all signatures are collected or
                skipped, you'll be redirected to view the completed documents.
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CollectSignatures;
