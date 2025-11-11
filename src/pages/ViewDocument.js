import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentComponent } from "../utils/documentMapper";
import { generatePDF } from "../utils/pdfUtils";
import DocumentGenerationAnimation from "../components/shared/DocumentGenerationAnimation";

import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Snackbar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
  Fade,
  Zoom,
  Menu,
  MenuItem,
  Backdrop,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Grid,
  Stack,
  List,
  ListItem,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  ContentCopy as CopyIcon,
  Fingerprint as FingerprintIcon,
  Info as InfoIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Add as AddMuiIcon,
  Remove as RemoveMuiIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  Description as DescriptionIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import {
  getDocument,
  updateDocumentSignature,
  deleteDocumentSignature,
  getIntakeForm,
} from "../utils/api";

// CSS for signature areas that will only show delete button on hover
// and hide them during printing/PDF export
const signatureAreaStyles = `
  .signature-area {
    position: relative;
    border: 1px dashed transparent;
    transition: all 0.2s ease;
    border-radius: 4px;
    padding: 4px;
    cursor: pointer;
  }
  
  /* Show controls only on screen, not when printing */
  @media screen {
    .signature-area:hover {
      border-color: #1976d2;
      background-color: rgba(25, 118, 210, 0.04);
    }
    
    .signature-area .delete-button {
      position: absolute;
      top: -10px;
      right: -10px;
      opacity: 0;
      transition: opacity 0.2s ease;
      background-color: #f44336;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .signature-area:hover .delete-button {
      opacity: 1;
    }
    
    .signature-area:hover .delete-button:hover {
      background-color: #d32f2f;
      transform: scale(1.1);
    }
  
    .signature-area .signature-placeholder {
      border: 1px dashed #1976d2;
      background-color: rgba(25, 118, 210, 0.04);
      padding: 8px;
      text-align: center;
      color: #1976d2;
      font-style: italic;
      font-size: 14px;
      cursor: pointer;
    }
  }
  
  /* Hide all signature controls when printing */
  @media print {
    .signature-area {
      border: none !important;
      padding: 0 !important;
      background: none !important;
    }
    
    .signature-area .delete-button,
    .signature-area .signature-placeholder {
      display: none !important;
    }
    
    /* Improve general print layout */
    .document-paper {
      box-shadow: none !important;
      margin: 0 !important;
      padding: 0.5in !important;
      transform: none !important;
    }
    
    /* Hide UI elements during print */
    button, .MuiIconButton-root, .zoom-controls {
      display: none !important;
    }
  }

  /* Improved document container styles */
  .document-container {
    padding: 2rem;
    background-color: #f8f9fa;
    position: relative;
  }

  .document-paper {
    background-color: white;
    padding: 2rem;
    margin: 0 auto 2rem auto;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  /* Support for page breaks in multi-page documents */
  .page-break {
    page-break-after: always;
    height: 0;
    margin: 0;
    border: 0;
  }
  
  /* Responsive container for small screens */
  @media (max-width: 600px) {
    .document-container {
      padding: 0;
    }
    .document-paper {
      padding: 0.5rem;
      margin: 0 auto;
      box-shadow: none;
    }
  }
`;

const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [document, setDocument] = useState(null);
  const [intakeFormData, setIntakeFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [signatures, setSignatures] = useState({});
  const [signatureLabels, setSignatureLabels] = useState({});
  const [collectedSignatures, setCollectedSignatures] = useState({});
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfPhase, setPdfPhase] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [touchedSignatureArea, setTouchedSignatureArea] = useState(null);
  const [showDownloadProgress, setShowDownloadProgress] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [reloading, setReloading] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);

  // New state variables for signature selection
  const [currentSignatureArea, setCurrentSignatureArea] = useState(null);
  const [showSignatureMenu, setShowSignatureMenu] = useState(false);
  const [signatureMenuAnchorEl, setSignatureMenuAnchorEl] = useState(null);

  // Create a ref for the document content
  const documentContentRef = useRef(null);

  // Media queries for responsive design
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm")); // Phone
  const isSmScreen = useMediaQuery(theme.breakpoints.between("sm", "md")); // Tablet
  const isMdScreen = useMediaQuery(theme.breakpoints.between("md", "lg")); // Small laptop

  // Fetch document data and signatures
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        console.log("Fetching document with ID:", id);
        const response = await getDocument(id);
        console.log("Document data:", response);
        setDocument(response.data);

        // Only set signatures if we don't already have them
        // This prevents duplicates when returning from standalone signatures page
        if (response.data.signatures && Object.keys(signatures).length === 0) {
          const docSignatures = {};
          // Convert Map to object
          for (const [key, value] of Object.entries(response.data.signatures)) {
            docSignatures[key] = value.signature;
          }
          setSignatures(docSignatures);
        }

        // Fetch intake form to get collected signatures
        if (response.data.intakeForm) {
          try {
            // Extract the intake form ID - might be an object or just the ID
            const intakeFormId =
              typeof response.data.intakeForm === "object"
                ? response.data.intakeForm._id || response.data.intakeForm.id
                : response.data.intakeForm;

            console.log("Fetching intake form with ID:", intakeFormId);

            const intakeFormResponse = await getIntakeForm(intakeFormId);
            console.log("Intake form data:", intakeFormResponse);
            setIntakeFormData(intakeFormResponse.data);

            // Extract signature labels if they exist
            if (intakeFormResponse.data.signatureLabels) {
              const labels = {};
              // Handle both Map and plain object formats
              if (intakeFormResponse.data.signatureLabels.get && typeof intakeFormResponse.data.signatureLabels.get === 'function') {
                // It's a Map
                for (const key of ['childSignature', 'parentSignature', 'caseworkerSignature', 'supervisorSignature', 'agencyRepSignature']) {
                  const label = intakeFormResponse.data.signatureLabels.get(key);
                  if (label) labels[key] = label;
                }
              } else {
                // It's a plain object
                Object.assign(labels, intakeFormResponse.data.signatureLabels);
              }
              setSignatureLabels(labels);
            }

            // Extract collected signatures from intake form if they exist
            if (intakeFormResponse.data.signatures) {
              const collected = {};
              // Handle both Map and plain object formats
              if (intakeFormResponse.data.signatures.get && typeof intakeFormResponse.data.signatures.get === 'function') {
                // It's a Map
                for (const key of ['childSignature', 'parentSignature', 'caseworkerSignature', 'supervisorSignature', 'agencyRepSignature']) {
                  const sig = intakeFormResponse.data.signatures.get(key);
                  if (sig) collected[key] = sig;
                }
              } else {
                // It's a plain object
                Object.assign(collected, intakeFormResponse.data.signatures);
              }
              setCollectedSignatures(collected);
            }
          } catch (err) {
            console.error("Error fetching intake form:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError(
          "Error loading document: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id, reloading]);


  // Export document as PDF
  const handleExportPDF = async () => {
    try {
      setGeneratingPDF(true);
      setPdfProgress(0);
      setSuccessMessage("");
      setError("");

      // Check if documentContentRef exists
      if (!documentContentRef.current) {
        setError("Document content not available for export");
        setGeneratingPDF(false);
        return;
      }

      // Phase 1: Preparing (0-15%)
      setPdfPhase("Preparing document...");
      setPdfProgress(5);
      await new Promise(resolve => setTimeout(resolve, 100));
      setPdfProgress(15);

      // Phase 2: Rendering content (15-30%)
      setPdfPhase("Rendering content...");
      setPdfProgress(20);
      await new Promise(resolve => setTimeout(resolve, 100));
      setPdfProgress(30);

      // Phase 3: Generating PDF (30-90%)
      setPdfPhase("Generating PDF...");
      setPdfProgress(40);

      await generatePDF(documentContentRef.current, `document-${id}.pdf`);

      setPdfProgress(90);

      // Phase 4: Finalizing (90-100%)
      setPdfPhase("Finalizing...");
      setPdfProgress(95);
      await new Promise(resolve => setTimeout(resolve, 200));

      setPdfProgress(100);
      setPdfPhase("Complete!");

      setSuccessMessage("Document exported as PDF successfully!");
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError("Error exporting PDF: " + err.message);
    } finally {
      // Let animation complete before hiding
      setTimeout(() => setGeneratingPDF(false), 500);
    }
  };

  // Navigate to edit document form
  const handleEditDocument = () => {
    if (document?.standAlone) {
      // For standalone documents, redirect to StandaloneDocumentForm
      // with the document data as URL parameters
      const documentData = {
        title: document.title,
        template: document.formData.template,
        category: document.category,
        createdFor: document.createdFor,
        formData: document.formData,
      };

      // Encode the document data for URL
      const encodedData = encodeURIComponent(JSON.stringify(documentData));

      // Navigate to standalone document form with the document data
      navigate(`/standalone-document?documentData=${encodedData}`);
    } else {
      // For regular documents, use the normal edit route
      navigate(`/edit-document/${id}`);
    }
  };

  // Add signature to document - MODIFIED for standalone documents
  const handleAddSignature = async (signatureType, signatureArea, event) => {
    try {
      console.log(
        "Adding signature:",
        signatureType,
        "to area:",
        signatureArea
      );

      // Check if this is a standalone document
      if (document?.standAlone) {
        // For standalone documents, check if document already has signatures
        if (
          document.signatures &&
          Object.keys(document.signatures).length > 0
        ) {
          // Show signature selection menu
          setCurrentSignatureArea(signatureArea);
          setSignatureMenuAnchorEl(event.currentTarget);
          setShowSignatureMenu(true);
        } else {
          // If no signatures exist, redirect to the standalone signatures page
          navigate(`/standalone-signatures/${id}`);
        }
        return;
      }

      // For regular documents, continue with the existing intake form logic
      console.log("Intake form data:", intakeFormData);

      // Get the signature data from intake form
      if (!intakeFormData) {
        setError("Intake form data not loaded. Please try again.");
        return;
      }

      // Check if signatures exist in the intake form
      console.log("Looking for signatures in:", intakeFormData.signatures);

      if (!intakeFormData.signatures) {
        setError(
          "No signatures found in the intake form. Please collect signatures first."
        );
        return;
      }

      // Check if the specific signature type exists
      if (!intakeFormData.signatures[signatureType]) {
        setError(
          `No ${signatureType} found. Please collect this signature first.`
        );
        return;
      }

      const signatureData = intakeFormData.signatures[signatureType];
      console.log("Found signature data of length:", signatureData.length);

      // Update document with signature
      const position = { x: 0, y: 0 }; // Default position
      await updateDocumentSignature(id, signatureArea, signatureData, position);

      // Update local state
      setSignatures((prev) => ({
        ...prev,
        [signatureArea]: signatureData,
      }));

      setSuccessMessage("Signature added successfully!");
    } catch (err) {
      console.error("Error adding signature:", err);
      setError(
        "Error adding signature: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // New function to handle signature selection from menu
  const handleSelectSignature = async (signatureData) => {
    try {
      if (!currentSignatureArea) {
        setError("No signature area selected");
        return;
      }

      setShowSignatureMenu(false);
      setSignatureMenuAnchorEl(null);

      // Update document with selected signature
      const position = { x: 0, y: 0 };
      await updateDocumentSignature(
        id,
        currentSignatureArea,
        signatureData,
        position
      );

      // Update local state
      setSignatures((prev) => ({
        ...prev,
        [currentSignatureArea]: signatureData,
      }));

      setSuccessMessage("Signature placed successfully!");
    } catch (err) {
      console.error("Error placing signature:", err);
      setError("Error placing signature: " + err.message);
    }
  };

  // Remove signature from document
  const handleRemoveSignature = async (signatureArea) => {
    try {
      // Delete signature from document
      await deleteDocumentSignature(id, signatureArea);

      // Update local state
      const updatedSignatures = { ...signatures };
      delete updatedSignatures[signatureArea];
      setSignatures(updatedSignatures);

      setSuccessMessage("Signature removed successfully!");

      // Clear the touched signature area state
      setTouchedSignatureArea(null);
    } catch (err) {
      console.error("Error removing signature:", err);
      setError("Error removing signature: " + err.message);
    }
  };

  // Handle signature area touch for mobile devices
  const handleSignatureTouch = (area) => {
    if (touchedSignatureArea === area) {
      setTouchedSignatureArea(null);
    } else {
      setTouchedSignatureArea(area);
    }
  };

  // Menu handlers
  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    setFullscreenMode(!fullscreenMode);
    handleCloseMenu();
  };

  // Handle zoom change
  const handleZoomChange = (newZoom) => {
    setZoomLevel(newZoom);
    handleCloseMenu();
  };

  // Print document
  const handlePrint = () => {
    window.print();
    handleCloseMenu();
  };

  // Reload document
  const handleReload = () => {
    setReloading(true);
    setReloading(false);
    handleCloseMenu();
  };

  // Format creation date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get all categories a document belongs to
  const getAllCategories = () => {
    if (!document) return [];

    const allCategories = [document.category];

    if (
      document.additionalCategories &&
      document.additionalCategories.length > 0
    ) {
      allCategories.push(...document.additionalCategories);
    }

    return allCategories;
  };

  // Get category color based on name
  const getCategoryColor = (category) => {
    switch (category) {
      case "Intake Paperwork":
        return "secondary";
      case "Shelter Bed Documents":
        return "info";
      case "In House Move":
        return "success";
      default:
        return "primary";
    }
  };

  // Close success message
  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: "text.secondary" }}>
            Loading document...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error && !document) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Alert
            severity="error"
            variant="filled"
            sx={{ mb: 3, borderRadius: 1 }}
          >
            {error}
          </Alert>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!document) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Document not found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            The requested document could not be found or may have been deleted.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  // Get form data from document
  const formData = document.formData || {};
  const intakeForm = document.intakeForm || {};

  // Count existing signatures
  const signatureCount = Object.keys(signatures).length;

  // Get all categories for this document
  const categories = getAllCategories();

  return (
    <Container
      maxWidth={fullscreenMode ? false : "lg"}
      sx={{
        mt: fullscreenMode ? 0 : 4,
        mb: fullscreenMode ? 0 : 4,
        px: fullscreenMode ? 0 : undefined,
      }}
    >
      {/* Download progress backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showDownloadProgress}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={downloadProgress}
            size={60}
            thickness={3}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="white"
              fontWeight="bold"
            >
              {`${Math.round(downloadProgress)}%`}
            </Typography>
          </Box>
        </Box>
      </Backdrop>

      {/* Add the CSS for signature areas */}
      <style>{signatureAreaStyles}</style>

      {/* Main content - Different wrapper based on screen size */}
      {isXsScreen ? (
        // Mobile view - no Paper wrapper
        <Box
          sx={{
            overflow: "hidden",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {/* Header for mobile */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            {/* Row 1: Back button and title only */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mb: 2,
              }}
            >
              <IconButton
                onClick={() => {
                  if (document?.intakeForm) {
                    const intakeFormId =
                      typeof document.intakeForm === "object"
                        ? document.intakeForm._id || document.intakeForm.id
                        : document.intakeForm;
                    navigate(`/view-documents/${intakeFormId}`);
                  } else {
                    navigate("/");
                  }
                }}
                sx={{
                  mr: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                component="h1"
                fontWeight="medium"
                color="primary.main"
                sx={{ fontSize: "16px" }}
              >
                {document.title}
              </Typography>
            </Box>

            {/* Row 2: Chips - 100% width, left aligned */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                mb: 2,
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  width: "100%",
                }}
              >
                {intakeForm.name && (
                  <Chip
                    size="small"
                    icon={<PersonIcon fontSize="small" />}
                    label={`Client: ${intakeForm.name}`}
                    variant="outlined"
                  />
                )}
                {intakeForm.caseNumber && (
                  <Chip
                    size="small"
                    icon={<FingerprintIcon fontSize="small" />}
                    label={`Case: ${intakeForm.caseNumber}`}
                    variant="outlined"
                  />
                )}
                <Chip
                  size="small"
                  icon={<HistoryIcon fontSize="small" />}
                  label={`Created: ${formatDate(document.createdAt)}`}
                  variant="outlined"
                  color="default"
                />
              </Box>

              {/* Standalone document information */}
              {document?.standAlone && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Chip
                      icon={<DescriptionIcon fontSize="small" />}
                      label="Standalone Document"
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                    {document.createdFor && (
                      <Chip
                        icon={<PersonIcon fontSize="small" />}
                        label={`Created For: ${document.createdFor}`}
                        color="info"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                  {/* If no signatures are present, show an option to add them */}
                  {(!document.signatures ||
                    Object.keys(document.signatures).length === 0) && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/standalone-signatures/${id}`)}
                      sx={{ mt: 1 }}
                    >
                      Add Signatures
                    </Button>
                  )}
                </Box>
              )}
            </Box>

            {/* Row 3: Action buttons - 100% width, left aligned */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditDocument}
                sx={{ mr: 1 }}
                size="small"
              >
                Edit
              </Button>
              <Button
                variant="contained"
                startIcon={<PdfIcon />}
                onClick={handleExportPDF}
                disabled={generatingPDF}
                size="small"
              >
                {generatingPDF ? "Generating..." : "Export"}
              </Button>
              <Tooltip title="More options">
                <IconButton onClick={handleOpenMenu} size="small">
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
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

          {/* Document info toggle for mobile */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={() => setInfoExpanded(!infoExpanded)}
              aria-expanded={infoExpanded}
              aria-label="show document info"
              color="primary"
            >
              <InfoIcon />
              {infoExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {infoExpanded ? "Hide" : "Show"} document information
            </Typography>
          </Box>

          {/* Document info content - Collapsible on mobile */}
          <Collapse in={infoExpanded}>
            <Box
              sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InfoIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      Document Information
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1, ml: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {formData.template || "Standard"}
                    </Typography>

                    {/* Categories display */}
                    <Box
                      sx={{ mt: 1, display: "flex", alignItems: "flex-start" }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mr: 1, mt: 0.5 }}
                      >
                        Categories:
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ flexWrap: "wrap" }}
                      >
                        {categories.map((category, index) => (
                          <Chip
                            key={index}
                            size="small"
                            label={category}
                            color={getCategoryColor(category)}
                            variant="outlined"
                            icon={<CategoryIcon fontSize="small" />}
                            sx={{
                              height: 24,
                              "& .MuiChip-label": {
                                px: 0.75,
                                fontSize: "0.7rem",
                              },
                              mb: 0.5,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {document.updatedAt && (
                      <Typography variant="body2" color="text.secondary">
                        Last modified: {formatDate(document.updatedAt)}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PdfIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      Signature Status
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1, ml: 4 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {signatureCount === 0
                        ? "No signatures added to this document."
                        : `${signatureCount} signature${
                            signatureCount !== 1 ? "s" : ""
                          } on this document.`}
                    </Typography>
                    {document?.standAlone ? (
                      <Typography variant="body2" color="text.secondary">
                        {signatureCount === 0
                          ? "Click 'Add Signatures' to collect signatures for this document."
                          : "Click on any signature area in the document to place a signature."}
                      </Typography>
                    ) : intakeFormData?.signatures ? (
                      <Typography variant="body2" color="text.secondary">
                        {Object.keys(intakeFormData.signatures).length}{" "}
                        signature(s) available from intake form.
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No signatures collected in the intake form yet.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          {/* Document content - No padding for mobile */}
          <Box
            className="document-container"
            sx={{
              flex: 1,
              overflowX: "auto",
              overflowY: "visible",
              p: 0,
              bgcolor: alpha(theme.palette.background.default, 0.7),
            }}
          >
            <Box
              className="document-paper"
              sx={{
                bgcolor: "background.paper",
                width: "100%",
                p: 0.5,
                mx: "auto",
                boxShadow: 0,
                position: "relative",
                minHeight: "auto",
                transform: "none",
              }}
            >
              {/* Document content - Using the document mapper with signature handling */}
              {document && formData && (
                <Box ref={documentContentRef}>
                  {React.cloneElement(
                    getDocumentComponent(formData.template, formData, signatureLabels),
                    {
                      signatures,
                      onAddSignature: handleAddSignature,
                      onRemoveSignature: handleRemoveSignature,
                      onTouchSignatureArea: handleSignatureTouch,
                      touchedArea: touchedSignatureArea,
                      signatureAreaClass: "signature-area",
                      deleteButtonClass: "delete-button",
                      placeholderClass: "signature-placeholder",
                      isStandalone: document.standAlone,
                      collectedSignatures,
                    }
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        // Tablet and Desktop view - with Paper wrapper
        <Paper
          elevation={fullscreenMode ? 0 : 3}
          sx={{
            p: 0,
            borderRadius: fullscreenMode ? 0 : 2,
            overflow: "hidden",
            height: fullscreenMode ? "100vh" : "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header for tablet/desktop */}
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            {/* Row 1: Back button and title only */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mb: isSmScreen ? 2 : 0,
              }}
            >
              <IconButton
                onClick={() => {
                  if (document?.intakeForm) {
                    const intakeFormId =
                      typeof document.intakeForm === "object"
                        ? document.intakeForm._id || document.intakeForm.id
                        : document.intakeForm;
                    navigate(`/view-documents/${intakeFormId}`);
                  } else {
                    navigate("/");
                  }
                }}
                sx={{
                  mr: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                component="h1"
                fontWeight="medium"
                color="primary.main"
                sx={{ fontSize: isSmScreen ? "18px" : "h5.fontSize" }}
              >
                {document.title}
              </Typography>
            </Box>

            {/* For tablet - Row 2: 50/50 split with chips and buttons */}
            {isSmScreen && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* Left side - Chips */}
                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {intakeForm.name && (
                      <Chip
                        size="small"
                        icon={<PersonIcon fontSize="small" />}
                        label={`Client: ${intakeForm.name}`}
                        variant="outlined"
                      />
                    )}
                    {intakeForm.caseNumber && (
                      <Chip
                        size="small"
                        icon={<FingerprintIcon fontSize="small" />}
                        label={`Case: ${intakeForm.caseNumber}`}
                        variant="outlined"
                      />
                    )}
                    <Chip
                      size="small"
                      icon={<HistoryIcon fontSize="small" />}
                      label={`Created: ${formatDate(document.createdAt)}`}
                      variant="outlined"
                      color="default"
                    />
                  </Box>

                  {/* Standalone document information */}
                  {document?.standAlone && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          icon={<DescriptionIcon fontSize="small" />}
                          label="Standalone Document"
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                        {document.createdFor && (
                          <Chip
                            icon={<PersonIcon fontSize="small" />}
                            label={`Created For: ${document.createdFor}`}
                            color="info"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Box>
                      {(!document.signatures ||
                        Object.keys(document.signatures).length === 0) && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() =>
                            navigate(`/standalone-signatures/${id}`)
                          }
                          sx={{ mt: 1 }}
                        >
                          Add Signatures
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Right side - Action buttons */}
                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditDocument}
                    sx={{ mr: 1 }}
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PdfIcon />}
                    onClick={handleExportPDF}
                    disabled={generatingPDF}
                    size="small"
                  >
                    {generatingPDF ? "Generating..." : "Export"}
                  </Button>
                  <Tooltip title="More options">
                    <IconButton onClick={handleOpenMenu} size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}

            {/* Desktop layout - everything in one row */}
            {!isSmScreen && !isXsScreen && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {intakeForm.name && (
                      <Chip
                        size="small"
                        icon={<PersonIcon fontSize="small" />}
                        label={`Client: ${intakeForm.name}`}
                        variant="outlined"
                      />
                    )}
                    {intakeForm.caseNumber && (
                      <Chip
                        size="small"
                        icon={<FingerprintIcon fontSize="small" />}
                        label={`Case: ${intakeForm.caseNumber}`}
                        variant="outlined"
                      />
                    )}
                    <Chip
                      size="small"
                      icon={<HistoryIcon fontSize="small" />}
                      label={`Created: ${formatDate(document.createdAt)}`}
                      variant="outlined"
                      color="default"
                    />
                  </Box>

                  {/* Standalone document information */}
                  {document?.standAlone && (
                    <Box sx={{ mt: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          icon={<DescriptionIcon fontSize="small" />}
                          label="Standalone Document"
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                        {document.createdFor && (
                          <Chip
                            icon={<PersonIcon fontSize="small" />}
                            label={`Created For: ${document.createdFor}`}
                            color="info"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Box>
                      {(!document.signatures ||
                        Object.keys(document.signatures).length === 0) && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() =>
                            navigate(`/standalone-signatures/${id}`)
                          }
                        >
                          Add Signatures
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditDocument}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PdfIcon />}
                    onClick={handleExportPDF}
                    disabled={generatingPDF}
                  >
                    {generatingPDF ? "Generating..." : "Export PDF"}
                  </Button>
                  <Tooltip title="More options">
                    <IconButton onClick={handleOpenMenu}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
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

          {/* Document info and signature status */}
          <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
            <Grid container spacing={2} alignItems="flex-start">
              {/* Force 50% width on tablet to ensure side-by-side layout */}
              <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InfoIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Document Information
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, ml: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Type: {formData.template || "Standard"}
                  </Typography>

                  {/* Categories display */}
                  <Box
                    sx={{ mt: 1, display: "flex", alignItems: "flex-start" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 1, mt: 0.5 }}
                    >
                      Categories:
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ flexWrap: "wrap" }}
                    >
                      {categories.map((category, index) => (
                        <Chip
                          key={index}
                          size="small"
                          label={category}
                          color={getCategoryColor(category)}
                          variant="outlined"
                          icon={<CategoryIcon fontSize="small" />}
                          sx={{
                            height: 24,
                            "& .MuiChip-label": {
                              px: 0.75,
                              fontSize: "0.7rem",
                            },
                            mb: 0.5,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {document.updatedAt && (
                    <Typography variant="body2" color="text.secondary">
                      Last modified: {formatDate(document.updatedAt)}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Force 50% width on tablet to ensure side-by-side layout */}
              <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PdfIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Signature Status</Typography>
                </Box>
                <Box sx={{ mt: 1, ml: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {signatureCount === 0
                      ? "No signatures added to this document."
                      : `${signatureCount} signature${
                          signatureCount !== 1 ? "s" : ""
                        } on this document.`}
                  </Typography>
                  {document?.standAlone ? (
                    <Typography variant="body2" color="text.secondary">
                      {signatureCount === 0
                        ? "Click 'Add Signatures' to collect signatures for this document."
                        : "Click on any signature area in the document to place a signature."}
                    </Typography>
                  ) : intakeFormData?.signatures ? (
                    <Typography variant="body2" color="text.secondary">
                      {Object.keys(intakeFormData.signatures).length}{" "}
                      signature(s) available from intake form.
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No signatures collected in the intake form yet.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Document content */}
          <Box
            className="document-container"
            sx={{
              flex: 1,
              overflowX: "auto",
              overflowY: "visible",
              p: isSmScreen ? 2 : 3,
              bgcolor: alpha(theme.palette.background.default, 0.7),
            }}
          >
            <Box
              className="document-paper"
              sx={{
                bgcolor: "background.paper",
                width: isSmScreen ? "100%" : `${(8.5 * zoomLevel) / 100}in`,
                p: 4,
                mx: "auto",
                boxShadow: 2,
                position: "relative",
                minHeight: isSmScreen ? "auto" : `${(11 * zoomLevel) / 100}in`,
                transform: isSmScreen ? "none" : `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.2s ease",
              }}
            >
              {/* Document content - Using the document mapper with signature handling */}
              {document && formData && (
                <Box ref={documentContentRef}>
                  {React.cloneElement(
                    getDocumentComponent(formData.template, formData, signatureLabels),
                    {
                      signatures,
                      onAddSignature: handleAddSignature,
                      onRemoveSignature: handleRemoveSignature,
                      onTouchSignatureArea: handleSignatureTouch,
                      touchedArea: touchedSignatureArea,
                      signatureAreaClass: "signature-area",
                      deleteButtonClass: "delete-button",
                      placeholderClass: "signature-placeholder",
                      isStandalone: document.standAlone,
                      collectedSignatures,
                    }
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Zoom controls */}
          <Box
            className="zoom-controls"
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              display: "flex",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: 2,
              p: 0.5,
              zIndex: 100,
            }}
          >
            <Tooltip title="Zoom out">
              <IconButton
                size="small"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1,
                minWidth: 60,
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                {zoomLevel}%
              </Typography>
            </Box>
            <Tooltip title="Zoom in">
              <IconButton
                size="small"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      )}

      {/* Actions menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleToggleFullscreen}>
          <ListItemIcon>
            <FullscreenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {fullscreenMode ? "Exit Fullscreen" : "Fullscreen Mode"}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePrint}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Document</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleZoomChange(75)}>
          <ListItemText sx={{ pl: 2 }}>75% Zoom</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleZoomChange(100)}>
          <ListItemText sx={{ pl: 2 }}>100% Zoom</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleZoomChange(125)}>
          <ListItemText sx={{ pl: 2 }}>125% Zoom</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleZoomChange(150)}>
          <ListItemText sx={{ pl: 2 }}>150% Zoom</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleReload}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reload Document</ListItemText>
        </MenuItem>
      </Menu>

      {/* Signature Menu for standalone documents */}
      <Menu
        anchorEl={signatureMenuAnchorEl}
        open={showSignatureMenu}
        onClose={() => {
          setShowSignatureMenu(false);
          setSignatureMenuAnchorEl(null);
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">
            Select a signature to place:
          </Typography>
        </MenuItem>
        <Divider />

        {document?.signatures &&
          Object.entries(document.signatures).map(([key, value]) => (
            <MenuItem
              key={key}
              onClick={() => handleSelectSignature(value.signature)}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={value.title || "Signature"}
                secondary={
                  <Box
                    sx={{
                      height: 30,
                      width: 120,
                      backgroundImage: `url(${value.signature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "left center",
                      mt: 0.5,
                    }}
                  />
                }
              />
            </MenuItem>
          ))}

        <Divider />
        <MenuItem
          onClick={() => {
            setShowSignatureMenu(false);
            setSignatureMenuAnchorEl(null);
            navigate(`/standalone-signatures/${id}`);
          }}
        >
          <ListItemIcon>
            <AddMuiIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Collect New Signatures..." />
        </MenuItem>
      </Menu>

      {/* Success message */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        message={successMessage}
      />

      {/* Document generation animation */}
      <DocumentGenerationAnimation
        isGenerating={generatingPDF}
        documentCount={1}
        realProgress={pdfProgress}
        currentPhaseText={pdfPhase}
      />
    </Container>
  );
};

// Using MUI Icons for zoom controls
const AddIcon = AddMuiIcon;
const RemoveIcon = RemoveMuiIcon;

export default ViewDocument;
