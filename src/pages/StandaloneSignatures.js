import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  CircularProgress,
  Tooltip,
  Avatar,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  alpha,
  Fade,
  Badge,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  PersonOutline as PersonIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Create as CreateIcon,
  PermIdentity as IdentityIcon,
  Add as AddIcon,
  Gesture as GestureIcon,
  RemoveRedEye as EyeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import SignatureCanvas from "react-signature-canvas";
import { getDocument, addStandaloneSignatures } from "../utils/api";

const StandaloneSignatures = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [documentData, setDocumentData] = useState(null);
  const [signatures, setSignatures] = useState({});
  const [currentSignatureKey, setCurrentSignatureKey] = useState(null);
  const sigPadRef = useRef({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [signatureTitle, setSignatureTitle] = useState("");
  const [signatureNames, setSignatureNames] = useState({});
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Steps for guiding the user
  const steps = [
    {
      label: "Add Signatures",
      description: "Collect all required signatures for this document",
      icon: <CreateIcon />,
    },
    {
      label: "Review & Save",
      description: "Review signatures and save to document",
      icon: <CheckCircleIcon />,
    },
  ];

  // Event handlers to track drawing state
  const handleBeginDrawing = () => {
    setIsDrawing(true);
    setError(""); // Clear any previous errors
  };

  useEffect(() => {
    document.title = "Signatures | Pathway Foster Agency";
  }, []);
  // Fetch document data on component mount
  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        const response = await getDocument(id);
        console.log("Document data:", response.data);
        setDocumentData(response.data);
      } catch (err) {
        setError(
          "Error loading document data: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
        setInitialLoadDone(true);
      }
    };

    fetchDocumentData();
  }, [id]);

  // Auto-open signature pad when first loaded and no signatures exist
  useEffect(() => {
    if (
      initialLoadDone &&
      Object.keys(signatures).length === 0 &&
      !currentSignatureKey
    ) {
      // Small delay to ensure UI is fully rendered
      const timer = setTimeout(() => {
        handleAddSignature();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialLoadDone, signatures, currentSignatureKey]);

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
  }, [currentSignatureKey]);

  // Clear signature pad
  const clearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      setIsDrawing(false);
      setSaveAttempted(false);
    }
  };

  // Handle creating a new signature
  const handleAddSignature = () => {
    const newSignatureKey = `signature_${Date.now()}`;
    setCurrentSignatureKey(newSignatureKey);
    setSignatureTitle("");
    setIsDrawing(false);
    setSaveAttempted(false);

    // Clear the signature pad if it exists
    if (sigPadRef.current && sigPadRef.current.clear) {
      sigPadRef.current.clear();
    }
  };

  // Save current signature
  const handleSaveSignature = () => {
    // Mark that save was attempted to show validation errors
    setSaveAttempted(true);

    if (!sigPadRef.current) {
      setError("Signature pad not properly initialized");
      return;
    }

    // Check if signature pad has data points
    if (!sigPadRef.current || sigPadRef.current.toData().length === 0) {
      setError("Please provide a signature before saving");
      return;
    }

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

    // Add signature to our state
    const newSignatures = { ...signatures };
    newSignatures[currentSignatureKey] = signatureData;
    setSignatures(newSignatures);

    // Add title to our signature names
    const title =
      signatureTitle || `Signature ${Object.keys(signatures).length + 1}`;
    setSignatureNames({
      ...signatureNames,
      [currentSignatureKey]: title,
    });

    // Reset current signature
    setCurrentSignatureKey(null);
    setSignatureTitle("");
    clearSignature();
    setSaveAttempted(false);

    // No auto-navigation to review step
  };

  // Handle canceling current signature
  const handleCancelSignature = () => {
    setCurrentSignatureKey(null);
    setSignatureTitle("");
    clearSignature();
    setSaveAttempted(false);
  };

  // Delete a signature
  const handleDeleteSignature = (sigKey) => {
    const newSignatures = { ...signatures };
    delete newSignatures[sigKey];
    setSignatures(newSignatures);

    const newNames = { ...signatureNames };
    delete newNames[sigKey];
    setSignatureNames(newNames);
  };

  // Save all collected signatures to the document
  const handleSaveAllSignatures = async () => {
    try {
      setLoading(true);
      setError("");

      if (Object.keys(signatures).length === 0) {
        setError("Please collect at least one signature before saving");
        setLoading(false);
        return;
      }

      // Save all collected signatures to the document
      await addStandaloneSignatures(id, signatures);

      setSuccess(true);

      // Navigate back to the document view
      setTimeout(() => {
        navigate(`/view-document/${id}`);
      }, 1200);
    } catch (err) {
      console.error("Error saving signatures:", err);
      setError(
        "Error saving signatures: " +
          (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    if (activeStep === 0) {
      // On first step, go back to previous page
      navigate(-1);
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  if (loading && !documentData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Loading document data...
          </Typography>
          <LinearProgress />
        </Paper>
      </Container>
    );
  }

  if (error && !documentData) {
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

  // Get template type from document data
  const templateType = documentData?.formData?.template || "";

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          Signatures saved successfully! Redirecting to document view...
        </Alert>
      )}

      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 2, color: "white" }} onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" component="h1">
                Signature Collection
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                {documentData?.title || "Document"}
                {documentData?.createdFor
                  ? ` for ${documentData.createdFor}`
                  : ""}
              </Typography>
            </Box>
          </Box>

          <Badge
            badgeContent={Object.keys(signatures).length}
            color="secondary"
            showZero
            max={99}
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.8rem",
                height: 22,
                minWidth: 22,
                padding: "0 6px",
              },
            }}
          >
            <Chip
              icon={<IdentityIcon />}
              label="Signatures"
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.25),
                color: "white",
                fontWeight: "medium",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
          </Badge>
        </Box>

        {/* Progress indicator */}
        <Box>
          <LinearProgress
            variant="determinate"
            value={activeStep === 0 ? 40 : 80}
            sx={{ height: 6 }}
          />
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Document Summary */}
          <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip
              icon={<DescriptionIcon />}
              label={`Document: ${documentData?.title || "Not specified"}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<PersonIcon />}
              label={`Created For: ${
                documentData?.createdFor || "Not specified"
              }`}
              color="secondary"
              variant="outlined"
            />
            {templateType && (
              <Chip
                icon={<AssignmentIcon />}
                label={`Template: ${templateType}`}
                color="info"
                variant="outlined"
              />
            )}
          </Box>

          {/* Error message */}
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

          {/* Horizontal Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar
                        sx={{
                          bgcolor:
                            activeStep >= index ? "primary.main" : "grey.400",
                          width: 36,
                          height: 36,
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    )}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={activeStep === index ? "bold" : "normal"}
                    >
                      {step.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step content */}
          <Box sx={{ mb: 3 }}>
            {activeStep === 0 ? (
              /* Step 1: Add Signatures */
              <Box>
                {!currentSignatureKey ? (
                  /* Signature list and add button */
                  <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.07),
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <GestureIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Collected Signatures
                          </Typography>
                        </Box>
                      </Box>

                      {Object.keys(signatures).length === 0 ? (
                        <Box sx={{ p: 4, textAlign: "center" }}>
                          <InfoIcon
                            sx={{
                              fontSize: 48,
                              color: "text.secondary",
                              mb: 2,
                              opacity: 0.5,
                            }}
                          />
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            gutterBottom
                          >
                            No signatures collected yet
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ maxWidth: 400, mx: "auto", mb: 3 }}
                          >
                            The signature pad will open automatically in a
                            moment...
                          </Typography>
                          <CircularProgress size={24} />
                        </Box>
                      ) : (
                        <List sx={{ py: 0 }}>
                          {Object.keys(signatures).map((key, index) => (
                            <React.Fragment key={key}>
                              {index > 0 && <Divider />}
                              <ListItem
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => handleDeleteSignature(key)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      bgcolor:
                                        index % 4 === 0
                                          ? "primary.main"
                                          : index % 4 === 1
                                          ? "secondary.main"
                                          : index % 4 === 2
                                          ? "success.main"
                                          : "info.main",
                                    }}
                                  >
                                    <IdentityIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle2">
                                      {signatureNames[key] ||
                                        `Signature ${index + 1}`}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box
                                      sx={{
                                        height: 40,
                                        backgroundImage: `url(${signatures[key]})`,
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "left center",
                                        mt: 0.5,
                                      }}
                                    />
                                  }
                                />
                              </ListItem>
                            </React.Fragment>
                          ))}
                          <Box
                            sx={{
                              p: 2,
                              borderTop: "1px solid",
                              borderColor: "divider",
                              textAlign: "center",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={handleAddSignature}
                              sx={{ mr: 2 }}
                            >
                              Add Signature
                            </Button>

                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<CheckIcon />}
                              onClick={() => setActiveStep(1)}
                            >
                              Continue to Review
                            </Button>
                          </Box>
                        </List>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  /* Signature creation card */
                  <Fade in={true}>
                    <Card
                      variant="outlined"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        borderColor: isDrawing ? "primary.main" : undefined,
                        borderWidth: isDrawing ? 2 : 1,
                        boxShadow: isDrawing
                          ? "0 0 10px rgba(25, 118, 210, 0.2)"
                          : undefined,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.07),
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="medium">
                          <CreateIcon
                            sx={{
                              mr: 1,
                              verticalAlign: "middle",
                              fontSize: "1.2rem",
                            }}
                          />
                          Add New Signature
                        </Typography>
                      </Box>

                      <CardContent>
                        <TextField
                          fullWidth
                          label="Signature Title/Name"
                          value={signatureTitle}
                          onChange={(e) => setSignatureTitle(e.target.value)}
                          placeholder="e.g., John Smith, Social Worker, Client, etc."
                          margin="normal"
                          size="medium"
                          variant="outlined"
                          autoFocus
                        />

                        <Typography
                          variant="subtitle2"
                          color="text.primary"
                          sx={{ mb: 1, mt: 2 }}
                        >
                          Draw signature below:
                        </Typography>

                        <Box
                          sx={{
                            border: `2px solid ${
                              isDrawing ? theme.palette.primary.main : "#e0e0e0"
                            }`,
                            borderRadius: 1,
                            backgroundColor: alpha(
                              theme.palette.background.paper,
                              0.8
                            ),
                            mb: 2,
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
                            dotSize={2}
                            minWidth={1.5}
                            maxWidth={3}
                            throttle={16}
                            backgroundColor="rgba(255,255,255,0)"
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

                        {/* Validation error - only show if save attempted */}
                        {saveAttempted && !isDrawing && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            Please draw a signature before saving
                          </Alert>
                        )}

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                              onClick={clearSignature}
                            >
                              Clear
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              startIcon={<CheckIcon />}
                              onClick={handleSaveSignature}
                              // No disabled condition - rely on validation in handler
                            >
                              Save Signature
                            </Button>
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <Button
                            variant="text"
                            color="inherit"
                            onClick={handleCancelSignature}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                )}

                {/* Instructions for first step */}
                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                  icon={<InfoIcon />}
                >
                  <Typography variant="body2">
                    <strong>Instructions:</strong> Collect all required
                    signatures for this document. You can add multiple
                    signatures with different names and roles (e.g., client,
                    caseworker, supervisor).
                  </Typography>
                </Alert>
              </Box>
            ) : (
              /* Step 2: Review & Save */
              <Box>
                <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.07),
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      color="success.dark"
                    >
                      <CheckCircleIcon
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                          fontSize: "1.2rem",
                        }}
                      />
                      Review & Submit Signatures
                    </Typography>
                  </Box>

                  <CardContent>
                    {Object.keys(signatures).length === 0 ? (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        No signatures have been collected. Go back to add
                        signatures.
                      </Alert>
                    ) : (
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          You've collected {Object.keys(signatures).length}{" "}
                          signature
                          {Object.keys(signatures).length !== 1 ? "s" : ""}:
                        </Typography>

                        <Box sx={{ my: 2 }}>
                          {Object.keys(signatures).map((key, index) => (
                            <Box
                              key={key}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                p: 1,
                                borderRadius: 1,
                                bgcolor: alpha(
                                  theme.palette.background.default,
                                  0.5
                                ),
                                border: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  bgcolor:
                                    index % 4 === 0
                                      ? "primary.main"
                                      : index % 4 === 1
                                      ? "secondary.main"
                                      : index % 4 === 2
                                      ? "success.main"
                                      : "info.main",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 2,
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2">
                                  {signatureNames[key] ||
                                    `Signature ${index + 1}`}
                                </Typography>
                                <Box
                                  sx={{
                                    height: 40,
                                    backgroundImage: `url(${signatures[key]})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "left center",
                                    mt: 0.5,
                                  }}
                                />
                              </Box>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteSignature(key)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>

                        <Alert severity="success" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Your signatures will be saved to this document and
                            can be placed within the document's signature areas.
                            You'll be redirected to the document view after
                            saving.
                          </Typography>
                        </Alert>
                      </>
                    )}

                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => setActiveStep(0)}
                      >
                        Back to Signatures
                      </Button>

                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<EyeIcon />}
                        onClick={handleSaveAllSignatures}
                        disabled={
                          Object.keys(signatures).length === 0 || loading
                        }
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Save & View Document"
                        )}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                  icon={<InfoIcon />}
                >
                  <Typography variant="body2">
                    <strong>Next Steps:</strong> After saving, you'll be
                    redirected to the document view where you can place these
                    signatures in the appropriate signature areas of the
                    document.
                  </Typography>
                </Alert>
              </Box>
            )}
          </Box>

          {/* Only show back button when not in signature creation mode */}
          {!currentSignatureKey && (
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                disabled={loading}
              >
                {activeStep === 0 ? "Back to Form" : "Back to Signatures"}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default StandaloneSignatures;
