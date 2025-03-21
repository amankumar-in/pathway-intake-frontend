import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentComponent } from "../utils/documentMapper";
import { generatePDF } from "../utils/pdfUtils";

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
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [touchedSignatureArea, setTouchedSignatureArea] = useState(null);
  const [showDownloadProgress, setShowDownloadProgress] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [reloading, setReloading] = useState(false);

  // Create a ref for the document content
  const documentContentRef = useRef(null);

  // Fetch document data and signatures
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        console.log("Fetching document with ID:", id);
        const response = await getDocument(id);
        console.log("Document data:", response);
        setDocument(response.data);

        // Extract any existing signatures
        if (response.data.signatures) {
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

  // Simulate download progress for visual feedback
  const simulateDownloadProgress = () => {
    setShowDownloadProgress(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prevProgress) => {
        const newProgress = prevProgress + 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowDownloadProgress(false), 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  // Export document as PDF
  const handleExportPDF = async () => {
    try {
      setGeneratingPDF(true);
      setSuccessMessage("");
      setError("");
      simulateDownloadProgress();

      // Check if documentContentRef exists
      if (!documentContentRef.current) {
        setError("Document content not available for export");
        return;
      }

      // Use generatePDF from pdfUtils with proper styling
      // The updated pdfUtils.js will handle sending to server properly
      await generatePDF(documentContentRef.current, `document-${id}.pdf`);

      setSuccessMessage("Document exported as PDF successfully!");
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError("Error exporting PDF: " + err.message);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Navigate to edit document form
  const handleEditDocument = () => {
    navigate(`/edit-document/${id}`);
  };

  // Add signature to document
  const handleAddSignature = async (signatureType, signatureArea) => {
    try {
      console.log(
        "Adding signature:",
        signatureType,
        "to area:",
        signatureArea
      );
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

      {/* Main content */}
      <Paper
        elevation={fullscreenMode ? 0 : 3}
        sx={{
          p: fullscreenMode ? 0 : 0,
          borderRadius: fullscreenMode ? 0 : 2,
          overflow: "hidden",
          height: fullscreenMode ? "100vh" : "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => {
                // Always go back to the document list view for this intake form
                if (document?.intakeForm) {
                  const intakeFormId =
                    typeof document.intakeForm === "object"
                      ? document.intakeForm._id || document.intakeForm.id
                      : document.intakeForm;
                  navigate(`/view-documents/${intakeFormId}`);
                } else {
                  // Fallback to history if no intake form ID
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
            <Box>
              <Typography
                variant="h5"
                component="h1"
                fontWeight="medium"
                color="primary.main"
              >
                {document.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 0.5,
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
                <Box
                  sx={{
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
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
                  {/* If no signatures are present, show an option to add them */}
                  {(!document.signatures ||
                    Object.keys(document.signatures).length === 0) && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/standalone-signatures/${id}`)}
                      sx={{ mt: 1, alignSelf: "flex-start" }}
                    >
                      Add Signatures
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
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

                {/* Categories display - showing multiple categories */}
                <Box sx={{ mt: 1, display: "flex", alignItems: "flex-start" }}>
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

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PdfIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Signature Status</Typography>
              </Box>
              <Box sx={{ mt: 1, ml: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {signatureCount === 0
                    ? "No signatures added to this document."
                    : `${signatureCount} signature${
                        signatureCount !== 1 ? "s" : ""
                      } on this document.`}
                </Typography>
                {intakeFormData?.signatures ? (
                  <Typography variant="body2" color="text.secondary">
                    {Object.keys(intakeFormData.signatures).length} signature(s)
                    available from intake form.
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

        {/* Document content with improved layout */}
        <Box
          className="document-container"
          sx={{
            flex: 1,
            overflowX: "auto",
            overflowY: "visible",
            p: 3,
            bgcolor: alpha(theme.palette.background.default, 0.7),
          }}
        >
          <Box
            className="document-paper"
            sx={{
              bgcolor: "background.paper",
              width: `${(8.5 * zoomLevel) / 100}in`,
              p: 4,
              mx: "auto",
              boxShadow: 2,
              position: "relative",
              minHeight: `${(11 * zoomLevel) / 100}in`,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease",
            }}
          >
            {/* Document content - Using the document mapper with signature handling */}
            {document && formData && (
              <Box ref={documentContentRef}>
                {React.cloneElement(
                  getDocumentComponent(formData.template, formData),
                  {
                    signatures,
                    onAddSignature: handleAddSignature,
                    onRemoveSignature: handleRemoveSignature,
                    onTouchSignatureArea: handleSignatureTouch,
                    touchedArea: touchedSignatureArea,
                    // Add wrapper class for signature areas
                    signatureAreaClass: "signature-area",
                    deleteButtonClass: "delete-button",
                    placeholderClass: "signature-placeholder",
                  }
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Zoom controls (fixed position) */}
        {!fullscreenMode && (
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
        )}
      </Paper>

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

      {/* Success message */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        message={successMessage}
      />
    </Container>
  );
};

// Using MUI Icons for zoom controls
const AddIcon = AddMuiIcon;
const RemoveIcon = RemoveMuiIcon;

export default ViewDocument;
