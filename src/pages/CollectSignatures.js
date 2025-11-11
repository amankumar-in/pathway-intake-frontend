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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Info as InfoIcon,
} from "@mui/icons-material";
import SignatureCanvas from "react-signature-canvas";
import { getIntakeForm, updateSignature, updateSignatureLabel } from "../utils/api";

// Signature types with more detailed information and icons
const signatures = [
  {
    type: "childSignature",
    label: "Foster Child",
    description: "Signature of the child client (if age-appropriate)",
    icon: <ChildIcon />,
    color: "#1976d2", // primary blue
  },
  {
    type: "parentSignature",
    label: "Resource Mother",
    description: "Signature of Resource Mother",
    icon: <PersonIcon />,
    color: "#9c27b0", // purple
  },
  {
    type: "caseworkerSignature",
    label: "Resource Father",
    description: "Signature of Resource Father",
    icon: <FaceIcon />,
    color: "#2e7d32", // green
  },
  {
    type: "supervisorSignature",
    label: "Pathway Social Worker",
    description: "Signature of Pathway Social Worker",
    icon: <SupervisorIcon />,
    color: "#ed6c02", // orange
  },
  {
    type: "agencyRepSignature",
    label: "County Social Worker",
    description: "Signature of County Social Worker",
    icon: <WorkIcon />,
    color: "#d32f2f", // red
  },
];

// Custom StepIcon component with enhanced colors and icons
const CustomStepIcon = ({ active, completed, skipped, icon, color, stepNumber }) => {
  if (skipped) {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.300",
          border: "3px solid",
          borderColor: "grey.400",
          color: "grey.600",
        }}
      >
        <CancelIcon sx={{ fontSize: 28 }} />
      </Box>
    );
  }

  if (completed) {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: color,
          border: "3px solid",
          borderColor: color,
          color: "white",
          boxShadow: `0 0 0 4px ${color}20`,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 32 }} />
      </Box>
    );
  }

  if (active) {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "white",
          border: "4px solid",
          borderColor: color,
          color: color,
          boxShadow: `0 0 0 4px ${color}30, 0 4px 12px ${color}40`,
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": {
              boxShadow: `0 0 0 4px ${color}30, 0 4px 12px ${color}40`,
            },
            "50%": {
              boxShadow: `0 0 0 8px ${color}20, 0 6px 16px ${color}50`,
            },
            "100%": {
              boxShadow: `0 0 0 4px ${color}30, 0 4px 12px ${color}40`,
            },
          },
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 28 } })}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        border: "3px solid",
        borderColor: "grey.300",
        color: "grey.500",
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 24 } })}
    </Box>
  );
};

const CollectSignatures = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [existingSignatures, setExistingSignatures] = useState({});
  const sigPadRef = useRef({});
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [pendingSignatureData, setPendingSignatureData] = useState(null);
  const [signatureLabels, setSignatureLabels] = useState({
    childSignature: "Foster Child",
    parentSignature: "Resource Mother",
    caseworkerSignature: "Resource Father",
    supervisorSignature: "Pathway Social Worker",
    agencyRepSignature: "County Social Worker",
  });
  const [editingLabel, setEditingLabel] = useState(null);
  const [tempLabel, setTempLabel] = useState("");

  useEffect(() => {
      document.title = "Signatures | Pathway Foster Agency";
    }, []);
  // Fetch form data on component mount
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await getIntakeForm(id);
        const form = response.data;
        setFormData(form);

        // Load saved signature labels if they exist
        if (form.signatureLabels) {
          const savedLabels = {};
          signatures.forEach((sig) => {
            let labelData = null;
            if (form.signatureLabels.get && typeof form.signatureLabels.get === 'function') {
              labelData = form.signatureLabels.get(sig.type);
            } else if (form.signatureLabels[sig.type]) {
              labelData = form.signatureLabels[sig.type];
            }

            if (labelData) {
              savedLabels[sig.type] = labelData;
            }
          });

          // Merge saved labels with defaults
          setSignatureLabels((prev) => ({
            ...prev,
            ...savedLabels,
          }));
        }

        // Check for existing signatures and mark as completed
        if (form.signatures) {
          const existingSigs = {};
          const completedIndexes = [];

          signatures.forEach((sig, index) => {
            // Check if signature exists in the form data
            let signatureData = null;
            if (form.signatures.get && typeof form.signatures.get === 'function') {
              signatureData = form.signatures.get(sig.type);
            } else if (form.signatures[sig.type]) {
              signatureData = form.signatures[sig.type];
            }

            if (signatureData) {
              // Extract the actual signature image data
              if (signatureData.signature) {
                existingSigs[sig.type] = signatureData.signature;
              } else if (typeof signatureData === 'string') {
                existingSigs[sig.type] = signatureData;
              }
              completedIndexes.push(index);
            }
          });

          setExistingSignatures(existingSigs);
          setCompletedSteps(completedIndexes);
        }
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
    }
  };

  useEffect(() => {
    if (sigPadRef.current && sigPadRef.current._ctx) {
      // Configure the signature pad for better quality
      // Enable high quality rendering with anti-aliasing
      sigPadRef.current._ctx.imageSmoothingEnabled = true;
      sigPadRef.current._ctx.imageSmoothingQuality = "high";

      // Adjust line join and cap for smoother signatures
      sigPadRef.current._ctx.lineJoin = "round";
      sigPadRef.current._ctx.lineCap = "round";
    }
  }, []);

  useEffect(() => {
    // Clear the signature pad whenever the active step changes
    if (sigPadRef.current) {
      sigPadRef.current.clear();
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

      setError("");

      // Get enhanced signature data with improved quality settings
      const canvas = sigPadRef.current.getCanvas();

      // Create a larger canvas for higher resolution output
      const highResCanvas = document.createElement("canvas");
      const ctx = highResCanvas.getContext("2d");

      // Set dimensions 2x larger for better quality
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

      // Check if signature already exists - if so, show confirmation dialog
      if (existingSignatures[signatureType]) {
        setPendingSignatureData({ signatureData, signatureType });
        setShowReplaceDialog(true);
        return;
      }

      // No existing signature, save directly
      await performSave(signatureData, signatureType);
    } catch (err) {
      console.error("Error saving signature:", err);
      setError(
        "Error saving signature: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Perform the actual save operation
  const performSave = async (signatureData, signatureType) => {
    try {
      setLoading(true);
      setError("");

      // Save signature to server
      await updateSignature(id, signatureType, signatureData);

      // Update existing signatures state
      setExistingSignatures((prev) => ({
        ...prev,
        [signatureType]: signatureData,
      }));

      // Mark step as completed if not already
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps((prev) => [...prev, activeStep]);
      }

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

  // Confirm replacement
  const handleConfirmReplace = async () => {
    setShowReplaceDialog(false);
    if (pendingSignatureData) {
      await performSave(
        pendingSignatureData.signatureData,
        pendingSignatureData.signatureType
      );
      setPendingSignatureData(null);
    }
  };

  // Cancel replacement and keep original
  const handleCancelReplace = () => {
    setShowReplaceDialog(false);
    setPendingSignatureData(null);
    // Move to next step without saving
    handleNext();
  };

  // Handle label editing
  const handleStartEditLabel = (signatureType, currentLabel) => {
    setEditingLabel(signatureType);
    setTempLabel(currentLabel);
  };

  const handleSaveLabel = async (signatureType) => {
    if (tempLabel.trim()) {
      try {
        // Update in local state first for immediate UI feedback
        setSignatureLabels((prev) => ({
          ...prev,
          [signatureType]: tempLabel.trim(),
        }));

        // Save to backend
        await updateSignatureLabel(id, signatureType, tempLabel.trim());
      } catch (err) {
        console.error("Error saving signature label:", err);
        setError("Error saving label: " + (err.response?.data?.message || err.message));
      }
    }
    setEditingLabel(null);
    setTempLabel("");
  };

  const handleCancelEditLabel = () => {
    setEditingLabel(null);
    setTempLabel("");
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
            <Chip
              icon={<CheckCircleIcon />}
              label={`${completedSteps.length} of ${signatures.length} collected`}
              color={completedSteps.length === signatures.length ? "success" : "default"}
              variant="outlined"
            />
          </Box>

          {/* Signature Step Process */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Signature Collection Progress
              </Typography>
              <Chip
                icon={<InfoIcon />}
                label="Click edit icon to customize labels"
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 24 }}
              />
            </Box>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                "& .MuiStepConnector-line": {
                  borderColor: "grey.300",
                  borderTopWidth: 3,
                },
                "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                  borderColor: signatures[activeStep]?.color || "primary.main",
                  borderTopWidth: 3,
                },
                "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                  borderColor: signatures[activeStep]?.color || "primary.main",
                  borderTopWidth: 3,
                },
              }}
            >
              {signatures.map((sig, index) => {
                const isCompleted = completedSteps.includes(index);
                const isSkipped = skippedSteps.includes(index);
                const isActive = index === activeStep;

                return (
                  <Step key={sig.type} completed={isCompleted}>
                    <StepLabel
                      StepIconComponent={() => (
                        <CustomStepIcon
                          active={isActive}
                          completed={isCompleted}
                          skipped={isSkipped}
                          icon={sig.icon}
                          color={sig.color}
                          stepNumber={index + 1}
                        />
                      )}
                    >
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight={isActive ? "bold" : "medium"}
                          sx={{
                            color: isActive ? sig.color : "text.primary",
                            fontSize: isActive ? "0.9rem" : "0.8rem",
                          }}
                        >
                          {signatureLabels[sig.type]}
                        </Typography>
                        {isCompleted && (
                          <Chip
                            label="Collected"
                            size="small"
                            sx={{
                              mt: 0.5,
                              height: 18,
                              fontSize: "0.65rem",
                              bgcolor: `${sig.color}20`,
                              color: sig.color,
                              fontWeight: "bold",
                            }}
                          />
                        )}
                        {isSkipped && (
                          <Chip
                            label="Skipped"
                            size="small"
                            sx={{
                              mt: 0.5,
                              height: 18,
                              fontSize: "0.65rem",
                              bgcolor: "grey.200",
                              color: "grey.600",
                            }}
                          />
                        )}
                      </Box>
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
                justifyContent: "space-between",
                bgcolor: `${currentSignature.color}15`,
                borderBottom: `1px solid ${currentSignature.color}40`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <Avatar sx={{ bgcolor: currentSignature.color, mr: 2 }}>
                  {currentSignature.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  {editingLabel === currentSignature.type ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TextField
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        size="small"
                        autoFocus
                        sx={{ flex: 1 }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSaveLabel(currentSignature.type);
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleSaveLabel(currentSignature.type)}
                        color="success"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton size="small" onClick={handleCancelEditLabel} color="error">
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" fontWeight="500">
                          {signatureLabels[currentSignature.type]}
                        </Typography>
                        <Tooltip title="Edit label">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleStartEditLabel(
                                currentSignature.type,
                                signatureLabels[currentSignature.type]
                              )
                            }
                            sx={{
                              color: currentSignature.color,
                              "&:hover": { bgcolor: `${currentSignature.color}20` },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {currentSignature.description}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Show existing signature if available */}
              {existingSignatures[currentSignature.type] && (
                <Alert
                  severity="success"
                  variant="outlined"
                  sx={{ mb: 2, borderRadius: 1 }}
                  icon={<CheckCircleIcon />}
                >
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Signature Already Collected
                  </Typography>
                  <Typography variant="caption" color="text.secondary" paragraph>
                    A signature for {currentSignature.label} is already on file. You can replace it by drawing a new signature below.
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      border: "2px solid",
                      borderColor: "success.light",
                      borderRadius: 1,
                      backgroundColor: "background.paper",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 100,
                    }}
                  >
                    <img
                      src={existingSignatures[currentSignature.type]}
                      alt={`${currentSignature.label} signature`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Alert>
              )}

              <Typography variant="body2" paragraph>
                {existingSignatures[currentSignature.type]
                  ? "Draw a new signature below to replace the existing one, or skip to keep the current signature."
                  : "Please sign clearly within the signature box below. If this signature is not applicable, you can skip to the next one."}
              </Typography>

              <Box
                sx={{
                  border: "2px solid #e0e0e0",
                  borderRadius: 1,
                  backgroundColor: "#f9f9f9",
                  mb: 3,
                  height: 200,
                  width: "100%",
                  position: "relative",
                  touchAction: "none",
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
                skipped if not applicable. You can return to this page anytime to
                collect missing signatures or replace existing ones. Once finished,
                you'll be redirected to view the completed documents.
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>

      {/* Replacement Confirmation Dialog */}
      <Dialog
        open={showReplaceDialog}
        onClose={() => setShowReplaceDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "warning.light", color: "warning.contrastText" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EditIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6">Replace Existing Signature?</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Alert severity="warning" variant="outlined" sx={{ mb: 3 }}>
            <Typography variant="body2">
              You are about to replace the existing signature for <strong>{signatureLabels[signatures[activeStep]?.type]}</strong>.
              This action will permanently overwrite the current signature.
            </Typography>
          </Alert>

          <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
            Please review the comparison below:
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: "grey.400",
                  borderWidth: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <CancelIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                    Current Signature (will be replaced)
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 150,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    p: 2,
                    opacity: 0.7,
                  }}
                >
                  <img
                    src={existingSignatures[signatures[activeStep]?.type]}
                    alt="Current signature"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "130px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: "warning.main",
                  borderWidth: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: "warning.main", mr: 1, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="warning.main">
                    New Signature (will be saved)
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 150,
                    bgcolor: "warning.lighter",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <img
                    src={pendingSignatureData?.signatureData}
                    alt="New signature"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "130px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            onClick={handleCancelReplace}
            variant="outlined"
            startIcon={<CancelIcon />}
            disabled={loading}
          >
            Keep Original
          </Button>
          <Button
            onClick={handleConfirmReplace}
            variant="contained"
            color="warning"
            startIcon={<CheckCircleIcon />}
            disabled={loading}
          >
            Replace Signature
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CollectSignatures;
