import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import ReactDOM from "react-dom/client";
import { PDFDocument } from "pdf-lib";

// API imports
import {
  getIntakeForm,
  getDocumentsByIntakeForm,
  generateDocuments,
  getDocument,
} from "../utils/api";
import { getDocumentComponent } from "../utils/documentMapper";
import { generatePDF, generatePDFBlob } from "../utils/pdfUtils";
import DocumentGenerationAnimation from "../components/shared/DocumentGenerationAnimation";

// Helper functions and config
import {
  getDocumentIcon,
  getDocumentColor,
  getFormattedDate,
  getAllDocumentCategories,
  calculateSignatureStatus,
  renderCategoryChips,
} from "../utils/documentHelpers";
import { getDocumentCopies } from "../constants/documentCopiesConfig";

// Extracted components
import CustomCopiesDialog from "../components/documents/CustomCopiesDialog";
import DocumentCard from "../components/documents/DocumentCard";
import DocumentListItem from "../components/documents/DocumentListItem";
import GenerateDocumentsDialog from "../components/documents/GenerateDocumentsDialog";
import RegenerateDocumentsDialog from "../components/documents/RegenerateDocumentsDialog";
import DocumentActionsMenu from "../components/documents/DocumentActionsMenu";

// MUI components import - consolidated
import {
  Container,
  Typography,
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Snackbar,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Grid,
  Badge,
  useTheme,
  alpha,
  Backdrop,
  Menu,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Stack,
  Collapse,
  useMediaQuery,
} from "@mui/material";

// MUI icons import - consolidated
import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  Sort as SortIcon,
  MoveToInbox as MoveToInboxIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  CloudDownload as CloudDownloadIcon,
  Assignment as AssignmentIcon,
  FileDownload as FileDownloadIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Layers as LayersIcon,
  Article as ArticleIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Clear as ClearIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  BurstMode as BurstModeIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Fingerprint as FingerprintIcon,
  AccessTime as AccessTimeIcon,
  Archive as ArchiveIcon,
  FilterListIcon,
  Draw as DrawIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`documents-tabpanel-${index}`}
      aria-labelledby={`documents-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}


const ViewDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State variables
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [intakeForm, setIntakeForm] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [openRegenerateDialog, setOpenRegenerateDialog] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingDocumentCount, setGeneratingDocumentCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // asc = A-Z (changed from date to alphabetical)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [actionDocument, setActionDocument] = useState(null);
  const [showDownloadProgress, setShowDownloadProgress] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfPhase, setPdfPhase] = useState("");
  const [currentDocName, setCurrentDocName] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showTips, setShowTips] = useState(false);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [customCopyCounts, setCustomCopyCounts] = useState({});

  // Categories for tabs with icons and colors
  const categories = [
    { id: "All Documents", icon: <LayersIcon />, color: "primary" },
    { id: "Intake Paperwork", icon: <AssignmentIcon />, color: "secondary" },
    { id: "Shelter Bed Documents", icon: <HomeIcon />, color: "info" },
    { id: "In House Move", icon: <MoveToInboxIcon />, color: "success" },
  ];

  // Update document title when intakeForm data loads
  useEffect(() => {
    document.title = intakeForm
      ? `${
          intakeForm.name || "Unknown Client"
        } Documents | Pathway Foster Agency`
      : "View Documents | Pathway Foster Agency";
  }, [intakeForm]);

  // Fetch documents on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch intake form
        const formResponse = await getIntakeForm(id);
        setIntakeForm(formResponse.data);

        // Fetch documents
        const documentsResponse = await getDocumentsByIntakeForm(id);
        setDocuments(documentsResponse.data);

        // If no documents found, prompt to generate
        if (documentsResponse.data.length === 0) {
          setOpenGenerateDialog(true);
        }
      } catch (err) {
        setError(
          "Error loading data: " + (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  // Generate documents
  const handleGenerateDocuments = async () => {
    try {
      setGenerating(true);
      setError("");

      const response = await generateDocuments(id);
      setDocuments(response.data);
      setOpenGenerateDialog(false);
      setSuccessMessage("Documents generated successfully!");
    } catch (err) {
      setError(
        "Error generating documents: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setGenerating(false);
    }
  };

  // Regenerate documents
  const handleRegenerateDocuments = async () => {
    try {
      setOpenRegenerateDialog(false);
      setGenerating(true);
      setError("");

      const response = await generateDocuments(id);
      setDocuments(response.data);
      setSuccessMessage("Documents regenerated successfully!");
    } catch (err) {
      setError(
        "Error regenerating documents: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setGenerating(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset selections when changing tabs
    if (selectMode) {
      setSelectedDocuments([]);
    }
  };

  // Toggle document selection
  const handleToggleDocumentSelection = (documentId) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(documentId)) {
        return prev.filter((id) => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  // Handle select all toggle
  const handleSelectAllToggle = () => {
    if (areAllSelected()) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(getFilteredDocuments().map((doc) => doc._id));
    }
  };

  // View document
  const handleViewDocument = (documentId) => {
    navigate(`/view-document/${documentId}`);
  };

  // Edit document
  const handleEditDocument = (documentId) => {
    navigate(`/edit-document/${documentId}`);
  };

  // Toggle sort direction
  const handleToggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Menu handling functions
  const handleOpenMenu = (event, document) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setActionDocument(document);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setActionDocument(null);
  };

  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Export a single document to PDF
  const handleExportSingleToPDF = async (documentId) => {
    try {
      setGeneratingPDF(true);
      setGeneratingDocumentCount(1);
      setPdfProgress(0);
      setError("");
      setSuccessMessage("");

      // Phase 1: Fetching (0-20%)
      setPdfPhase("Fetching document...");
      setPdfProgress(5);

      // Fetch the complete document data including signatures
      const response = await getDocument(documentId);
      const fullDocData = response.data;

      setPdfProgress(20);
      setCurrentDocName(fullDocData.formData.template || "Document");

      // Phase 2: Preparing (20-40%)
      setPdfPhase("Preparing document...");
      setPdfProgress(25);

      // Create a temporary container in the DOM
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);

      // Create a ref for the document content
      const tempDocumentRef = { current: null };

      // Create a temporary component that uses the ref
      const TempDocumentComponent = () => {
        // Extract signatures if they exist
        let signatures = {};
        if (fullDocData.signatures) {
          for (const [key, value] of Object.entries(fullDocData.signatures)) {
            signatures[key] = value.signature;
          }
        }

        // Create the document component with signatures
        const documentComponent = React.cloneElement(
          getDocumentComponent(
            fullDocData.formData.template,
            fullDocData.formData
          ),
          { signatures }
        );

        return (
          <div ref={(el) => (tempDocumentRef.current = el)}>
            {documentComponent}
          </div>
        );
      };

      setPdfProgress(35);

      // Phase 3: Rendering (40-60%)
      setPdfPhase("Rendering content...");
      setPdfProgress(45);

      // Render the temporary component
      const root = ReactDOM.createRoot(tempContainer);
      root.render(<TempDocumentComponent />);

      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPdfProgress(60);

      // Phase 4: Generating PDF (60-95%)
      setPdfPhase("Generating PDF...");
      setPdfProgress(70);

      // Generate PDF
      if (tempDocumentRef.current) {
        await generatePDF(
          tempDocumentRef.current,
          `document-${documentId}.pdf`
        );
      }

      setPdfProgress(90);

      // Phase 5: Finalizing (95-100%)
      setPdfPhase("Finalizing...");

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      setPdfProgress(100);
      setPdfPhase("Complete!");

      setSuccessMessage("Document exported successfully!");
    } catch (err) {
      console.error("Error exporting document:", err);
      setError("Error exporting document: " + err.message);
    } finally {
      // Let animation complete before hiding
      setTimeout(() => setGeneratingPDF(false), 500);
    }
  };

  // Export selected documents to PDF with custom copies
  const handleExportWithCustomCopies = async () => {
    setOpenCopyDialog(false);

    if (selectedDocuments.length === 0) return;

    try {
      // Calculate total document count including copies
      let totalDocs = 0;
      for (const docId of selectedDocuments) {
        const copies = customCopyCounts[docId] || 1;
        totalDocs += copies;
      }

      setGeneratingPDF(true);
      setGeneratingDocumentCount(totalDocs);
      setPdfProgress(0);
      setPdfPhase("Starting export...");
      setError("");
      setSuccessMessage("");

      // Array to store PDF blobs
      const pdfBlobs = [];

      // Track total pages for progress indication
      let totalPages = 0;
      let processedPages = 0;

      // First pass - calculate total pages based on custom copy counts
      for (const docId of selectedDocuments) {
        try {
          // Get required copies from custom counts
          const copies = customCopyCounts[docId] || 1;
          // Add to total (assuming 1 page per document for simplicity)
          totalPages += copies;
        } catch (error) {
          console.error(
            `Error calculating copies for document ${docId}:`,
            error
          );
        }
      }

      // Process each document
      for (const docId of selectedDocuments) {
        try {
          setPdfPhase("Fetching document...");

          // Fetch document data
          const response = await getDocument(docId);
          const fullDocData = response.data;

          // Get document info
          const docInfo = documents.find((doc) => doc._id === docId);
          const activeCategory = categories[tabValue].id;

          // Use custom copy count if available
          const copies = customCopyCounts[docId] || 1;

          // Set current document name
          setCurrentDocName(fullDocData.formData.template || fullDocData.title || "Document");
          setPdfPhase("Processing document...");

          // Extract signatures
          let signatures = {};
          if (fullDocData.signatures) {
            for (const [key, value] of Object.entries(fullDocData.signatures)) {
              signatures[key] = value.signature;
            }
          }

          // Create temporary container
          const tempContainer = document.createElement("div");
          tempContainer.style.position = "absolute";
          tempContainer.style.left = "-9999px";
          document.body.appendChild(tempContainer);

          // Create a ref for the document content
          const tempDocumentRef = { current: null };

          // Create a temporary component
          const TempDocumentComponent = () => {
            const documentComponent = React.cloneElement(
              getDocumentComponent(
                fullDocData.formData.template,
                fullDocData.formData
              ),
              { signatures }
            );
            return (
              <div ref={(el) => (tempDocumentRef.current = el)}>
                {documentComponent}
              </div>
            );
          };

          // Render the component
          const root = ReactDOM.createRoot(tempContainer);
          root.render(<TempDocumentComponent />);

          // Wait for rendering to complete
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Generate PDF blob
          if (tempDocumentRef.current) {
            const pdfBlob = await generatePDFBlob(tempDocumentRef.current);

            // Add the blob multiple times based on custom copy count
            for (let i = 0; i < copies; i++) {
              pdfBlobs.push({
                blob: pdfBlob,
                title: fullDocData.title,
                category: activeCategory,
              });
              processedPages++;

              // Update progress (both for animation and backdrop)
              const progress = (processedPages / totalPages) * 100;
              setPdfProgress(progress); // Feed to animation
              setDownloadProgress(progress); // Existing Backdrop progress
            }
          }

          // Clean up
          root.unmount();
          document.body.removeChild(tempContainer);
        } catch (error) {
          console.error(`Error processing document ${docId}:`, error);
        }
      }

      // Merge PDFs if we have any
      if (pdfBlobs.length > 0) {
        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        // Set metadata
        mergedPdf.setTitle(`${intakeForm?.name || "Client"} - Documents`);
        mergedPdf.setAuthor("Pathway Foster Agency");
        mergedPdf.setCreator("Pathway Intake System");

        // Add pages from each PDF
        for (const { blob, title } of pdfBlobs) {
          const pdfBytes = await blob.arrayBuffer();
          const pdf = await PDFDocument.load(pdfBytes);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

          // Add the document pages
          pages.forEach((page) => mergedPdf.addPage(page));
        }

        // Save the merged PDF
        const mergedBytes = await mergedPdf.save();
        const mergedBlob = new Blob([mergedBytes], { type: "application/pdf" });

        // Download the merged PDF
        const link = document.createElement("a");
        link.href = URL.createObjectURL(mergedBlob);
        link.download = `${
          intakeForm?.name || "client"
        }-documents-${new Date().getTime()}.pdf`;
        link.click();
      }

      setSuccessMessage(`Documents exported successfully with custom copies!`);

      // Exit selection mode and clear selections after successful export
      setTimeout(() => {
        setSelectMode(false);
        setSelectedDocuments([]);
      }, 500);
    } catch (err) {
      console.error("Error exporting documents:", err);
      setError("Error exporting documents: " + err.message);
    } finally {
      setGeneratingPDF(false);
    }
  };


  // Handle copy count change
  const handleCopyCountChange = (docId, value) => {
    // Ensure value is between 1 and 10
    const copyCount = Math.max(1, Math.min(10, parseInt(value) || 1));

    setCustomCopyCounts((prev) => ({
      ...prev,
      [docId]: copyCount,
    }));
  };

  // Calculate total custom copies
  const calculateTotalCustomCopies = () => {
    return Object.values(customCopyCounts).reduce(
      (sum, count) => sum + count,
      0
    );
  };

  // Function to open the copies dialog
  const handleOpenCopyDialog = () => {
    // Initialize with default copy counts
    const initialCounts = {};
    selectedDocuments.forEach((docId) => {
      const doc = documents.find((d) => d._id === docId);
      if (doc) {
        initialCounts[docId] = getDocumentCopies(doc, categories[tabValue].id);
      }
    });

    setCustomCopyCounts(initialCounts);
    setOpenCopyDialog(true);
  };

  // Filter documents by category and search term with multi-category support
  const getFilteredDocuments = () => {
    let filtered = [...documents];

    // Filter by category
    if (tabValue !== 0) {
      const categoryId = categories[tabValue].id;
      filtered = filtered.filter(
        (doc) =>
          doc.category === categoryId ||
          (doc.additionalCategories &&
            doc.additionalCategories.includes(categoryId))
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(term) ||
          doc.category.toLowerCase().includes(term) ||
          (doc.additionalCategories &&
            doc.additionalCategories.some((cat) =>
              cat.toLowerCase().includes(term)
            ))
      );
    }

    // Sort documents alphabetically by title
    filtered.sort((a, b) => {
      if (sortDirection === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    return filtered;
  };

  // Check if all documents in the current view are selected
  const areAllSelected = () => {
    const filteredDocs = getFilteredDocuments();
    return (
      filteredDocs.length > 0 &&
      filteredDocs.every((doc) => selectedDocuments.includes(doc._id))
    );
  };


  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: "text.secondary" }}>
            Loading documents...
          </Typography>
        </Paper>
      </Container>
    );
  }

  const filteredDocuments = getFilteredDocuments();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

      {/* Simplified Header with 3-row mobile layout */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
          transition: "all 0.2s ease",
        }}
      >
        {/* Row 1: Title, back icon and chips (on mobile) */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Left side: Back + Client info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", md: "auto" },
            }}
          >
            <IconButton
              onClick={() => navigate("/")}
              sx={{ color: "text.secondary", mr: 1.5 }}
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h6"
                component="h1"
                fontWeight="medium"
                color="text.primary"
              >
                {intakeForm?.name || "Unknown Client"}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Chip
                  icon={<FingerprintIcon sx={{ color: "primary.main" }} />}
                  label={`${intakeForm?.caseNumber || "Unknown"}`}
                  size="small"
                  sx={{
                    height: 24,
                    "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
                    "& .MuiChip-icon": { fontSize: "0.875rem" },
                  }}
                />
                <Chip
                  icon={<LayersIcon sx={{ color: "primary.main" }} />}
                  label={`${filteredDocuments.length} file${
                    filteredDocuments.length !== 1 ? "s" : ""
                  }`}
                  size="small"
                  sx={{
                    height: 24,
                    "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
                    "& .MuiChip-icon": { fontSize: "0.875rem" },
                  }}
                />
              </Stack>
            </Box>
          </Box>

          {/* For non-mobile: Search + Export buttons */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "space-between", md: "flex-end" },
                flexWrap: "wrap",
              }}
            >
              <TextField
                placeholder="Search documents..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  minWidth: { xs: "calc(100% - 180px)", sm: 200 },
                  "& .MuiOutlinedInput-root": {
                    height: 36,
                    fontSize: "0.875rem",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm("")}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={1}>
                {documents.length > 0 && (
                  <Tooltip title="Regenerate all documents">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AssignmentIcon />}
                      onClick={() => setOpenRegenerateDialog(true)}
                      sx={{ height: 36, fontSize: "0.875rem" }}
                    >
                      Regenerate
                    </Button>
                  </Tooltip>
                )}

                <Button
                  variant="contained"
                  disableElevation
                  size="small"
                  color="primary"
                  startIcon={
                    documents.length === 0 ? (
                      <AssignmentIcon />
                    ) : (
                      <CloudDownloadIcon />
                    )
                  }
                  onClick={() =>
                    documents.length === 0
                      ? setOpenGenerateDialog(true)
                      : selectedDocuments.length > 0
                      ? handleOpenCopyDialog()
                      : null
                  }
                  disabled={
                    documents.length > 0 && selectedDocuments.length === 0
                  }
                  sx={{
                    height: 36,
                    fontSize: "0.875rem",
                    "&.Mui-disabled": {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: alpha(theme.palette.primary.contrastText, 0.5),
                    },
                  }}
                >
                  {documents.length === 0
                    ? "Generate"
                    : selectedDocuments.length > 0
                    ? `Export (${selectedDocuments.length})`
                    : "Export"}
                </Button>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Row 2: Search bar on mobile */}
        {isMobile && (
          <Box
            sx={{
              px: 2,
              pb: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              width: "100%",
            }}
          >
            <TextField
              placeholder="Search documents..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 36,
                  fontSize: "0.875rem",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* Row 3: Buttons on mobile */}
        {isMobile && (
          <Box
            sx={{
              px: 2,
              pb: 2,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            {documents.length > 0 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AssignmentIcon />}
                onClick={() => setOpenRegenerateDialog(true)}
                sx={{ height: 36, fontSize: "0.875rem" }}
              >
                Regenerate
              </Button>
            )}

            <Button
              variant="contained"
              disableElevation
              size="small"
              color="primary"
              startIcon={
                documents.length === 0 ? (
                  <AssignmentIcon />
                ) : (
                  <CloudDownloadIcon />
                )
              }
              onClick={() =>
                documents.length === 0
                  ? setOpenGenerateDialog(true)
                  : selectedDocuments.length > 0
                  ? handleOpenCopyDialog()
                  : null
              }
              disabled={documents.length > 0 && selectedDocuments.length === 0}
              sx={{
                height: 36,
                fontSize: "0.875rem",
                "&.Mui-disabled": {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  color: alpha(theme.palette.primary.contrastText, 0.5),
                },
              }}
            >
              {documents.length === 0
                ? "Generate"
                : selectedDocuments.length > 0
                ? `Export (${selectedDocuments.length})`
                : "Export"}
            </Button>
          </Box>
        )}

        {/* Tabs & Controls Row */}
        <Box sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  minHeight: 48,
                  textTransform: "none",
                  py: 1,
                  px: { xs: 1, sm: 2 },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                },
                "& .MuiTabs-scrollButtons": {
                  color: "primary.main",
                },
                width: { xs: "100%", sm: "auto" },
                maxWidth: "850px",
              }}
            >
              {categories.map((category, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="span"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: alpha(
                            theme.palette[category.color].main,
                            0.1
                          ),
                          color: `${category.color}.main`,
                          mr: 1,
                        }}
                      >
                        {React.cloneElement(category.icon, {
                          sx: { fontSize: 16 },
                        })}
                      </Box>
                      <Box component="span" sx={{ fontSize: "0.875rem" }}>
                        {category.id}
                      </Box>
                      {index === 0 && documents.length > 0 && (
                        <Chip
                          label={documents.length}
                          size="small"
                          sx={{
                            ml: 0.5,
                            height: 20,
                            "& .MuiChip-label": { px: 1, fontSize: "0.7rem" },
                          }}
                          color="primary"
                        />
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>

            {/* Action buttons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 2,
                pb: { xs: 1, sm: 0 },
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "space-between", sm: "flex-end" },
              }}
            >
              {/* Show these controls only when NOT in select mode */}
              {!selectMode && (
                <>
                  <Tooltip title="Show tips">
                    <IconButton
                      size="small"
                      onClick={() => setShowTips(!showTips)}
                      color={showTips ? "primary" : "default"}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Sort button with A-Z/Z-A label */}
                  <Button
                    size="small"
                    variant="text"
                    onClick={handleToggleSort}
                    startIcon={
                      sortDirection === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    }
                    sx={{
                      minWidth: "65px",
                      px: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    {sortDirection === "asc" ? "A-Z" : "Z-A"}
                  </Button>

                  {/* View toggle group */}
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    size="small"
                    aria-label="view mode"
                    sx={{ height: 36 }}
                  >
                    <ToggleButton value="list" aria-label="list view">
                      <Tooltip title="List view">
                        <ViewListIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="grid" aria-label="grid view">
                      <Tooltip title="Grid view">
                        <ViewModuleIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </>
              )}

              {/* Select mode controls */}
              {selectMode ? (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelectMode(false);
                      setSelectedDocuments([]);
                    }}
                    sx={{
                      height: 36,
                      width: 36,
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={handleSelectAllToggle}
                    startIcon={
                      areAllSelected() ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
                    }
                    sx={{
                      height: 36,
                      fontSize: "0.75rem",
                      fontWeight: "medium",
                      px: 1.5,
                    }}
                  >
                    {areAllSelected() ? "Deselect All" : "Select All"}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  onClick={() => setSelectMode(true)}
                  startIcon={<CheckBoxOutlineBlankIcon />}
                  sx={{
                    height: 36,
                    fontSize: "0.75rem",
                    fontWeight: "medium",
                    px: 1.5,
                  }}
                >
                  Select
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Collapsible Quick Tips Section */}
        <Collapse in={showTips}>
          <Box
            sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}
          >
            <Typography
              variant="subtitle2"
              color="info.main"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <InfoIcon fontSize="small" sx={{ mr: 1 }} />
              Quick Tips:
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <SearchIcon
                    sx={{ mt: 0.3, color: "info.main" }}
                    fontSize="small"
                  />
                  <Typography variant="body2">
                    Use the search bar to find documents by title or category
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <CheckBoxIcon
                    sx={{ mt: 0.3, color: "info.main" }}
                    fontSize="small"
                  />
                  <Typography variant="body2">
                    Select multiple documents to export them together as a
                    single PDF file
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <EditIcon
                    sx={{ mt: 0.3, color: "info.main" }}
                    fontSize="small"
                  />
                  <Typography variant="body2">
                    Click on a document to view details, or use the edit button
                    to make changes
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Selection mode indicator */}
        {selectMode && filteredDocuments.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 3,
              py: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderTop: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CheckBoxIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="body2" fontWeight="medium" color="primary">
              {selectedDocuments.length === 0
                ? "Click on documents to select them"
                : `${selectedDocuments.length} of ${filteredDocuments.length} document${filteredDocuments.length !== 1 ? "s" : ""} selected`}
            </Typography>
          </Box>
        )}
      </Card>

      {/* Signature Status Card */}
      {intakeForm && (() => {
        const sigStatus = calculateSignatureStatus(intakeForm);
        const hasAllSignatures = sigStatus.collected === sigStatus.total;
        const hasSomeSignatures = sigStatus.collected > 0 && sigStatus.collected < sigStatus.total;
        const hasNoSignatures = sigStatus.collected === 0;

        return (
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: 2,
              overflow: "hidden",
              borderColor: hasAllSignatures
                ? "success.main"
                : hasSomeSignatures
                ? "warning.main"
                : "info.main",
              borderWidth: 1,
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                bgcolor: hasAllSignatures
                  ? alpha(theme.palette.success.main, 0.05)
                  : hasSomeSignatures
                  ? alpha(theme.palette.warning.main, 0.05)
                  : alpha(theme.palette.info.main, 0.05),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: hasAllSignatures
                      ? alpha(theme.palette.success.main, 0.1)
                      : hasSomeSignatures
                      ? alpha(theme.palette.warning.main, 0.1)
                      : alpha(theme.palette.info.main, 0.1),
                  }}
                >
                  {hasAllSignatures ? (
                    <CheckCircleIcon sx={{ fontSize: 28, color: "success.main" }} />
                  ) : hasSomeSignatures ? (
                    <WarningIcon sx={{ fontSize: 28, color: "warning.main" }} />
                  ) : (
                    <DrawIcon sx={{ fontSize: 28, color: "info.main" }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="medium" gutterBottom sx={{ mb: 0.5 }}>
                    {hasAllSignatures
                      ? "All Signatures Collected"
                      : hasSomeSignatures
                      ? "Signatures Incomplete"
                      : "No Signatures Collected"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Chip
                      size="small"
                      label={`${sigStatus.collected} of ${sigStatus.total} signatures`}
                      color={hasAllSignatures ? "success" : hasSomeSignatures ? "warning" : "default"}
                      sx={{ fontWeight: "medium" }}
                    />
                    {sigStatus.missing > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        {sigStatus.missing} signature{sigStatus.missing !== 1 ? "s" : ""} missing
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
              <Button
                variant={hasAllSignatures ? "outlined" : "contained"}
                color={hasAllSignatures ? "success" : hasSomeSignatures ? "warning" : "primary"}
                startIcon={<DrawIcon />}
                onClick={() => navigate(`/collect-signatures/${id}`)}
                sx={{
                  minWidth: { xs: "100%", sm: 200 },
                  whiteSpace: "nowrap",
                }}
              >
                {hasAllSignatures
                  ? "Review Signatures"
                  : hasSomeSignatures
                  ? "Collect Missing Signatures"
                  : "Collect Signatures"}
              </Button>
            </Box>
          </Card>
        );
      })()}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          variant="filled"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Document Content */}
      {filteredDocuments.length === 0 ? (
        <Paper
          sx={{
            py: 8,
            px: 3,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: "background.paper",
            height: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          elevation={0}
          variant="outlined"
        >
          {searchTerm ? (
            // No search results
            <React.Fragment>
              <SearchIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                No matching documents found
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Try adjusting your search criteria or check your spelling
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSearchTerm("")}
                startIcon={<ClearIcon />}
              >
                Clear Search
              </Button>
            </React.Fragment>
          ) : documents.length === 0 ? (
            // No documents at all
            <React.Fragment>
              <AssignmentIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                No documents have been generated yet
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Click the button below to generate all required documents for
                this intake form
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenGenerateDialog(true)}
                startIcon={<AssignmentIcon />}
              >
                Generate Documents
              </Button>
            </React.Fragment>
          ) : (
            // No documents in this category
            <React.Fragment>
              <FolderIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                No documents in this category
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                This intake form doesn't have any documents in the "
                {categories[tabValue].id}" category
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setTabValue(0)}
                startIcon={<FolderIcon />}
              >
                View All Documents
              </Button>
            </React.Fragment>
          )}
        </Paper>
      ) : (
        <Box sx={{ mt: 3 }}>
          {viewMode === "list" ? (
            // List view
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden" }}
            >
              <List dense>
                {filteredDocuments.map((document, index) => {
                  // Get primary category for color
                  const docColor = getDocumentColor(document.category);

                  return (
                    <React.Fragment key={document._id}>
                      {index > 0 && <Divider />}
                      <ListItem
                        disablePadding
                        secondaryAction={
                          selectMode ? null : (
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              {getDocumentCopies(
                                document,
                                categories[tabValue].id
                              ) > 1 && (
                                <Chip
                                  label={`${getDocumentCopies(
                                    document,
                                    categories[tabValue].id
                                  )}x`}
                                  size="small"
                                  color="secondary"
                                  sx={{
                                    height: 22,
                                    minWidth: 32,
                                    fontWeight: "bold",
                                    mr: 1,
                                    "& .MuiChip-label": {
                                      px: 1,
                                      fontSize: "0.7rem",
                                    },
                                  }}
                                />
                              )}
                              <Tooltip title="Edit document">
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditDocument(document._id);
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Export to PDF">
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExportSingleToPDF(document._id);
                                  }}
                                >
                                  <PdfIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="More options">
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={(event) =>
                                    handleOpenMenu(event, document)
                                  }
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )
                        }
                        sx={{
                          transition: "all 0.2s ease",
                          bgcolor: selectMode && selectedDocuments.includes(document._id)
                            ? alpha(theme.palette.primary.main, 0.08)
                            : "transparent",
                          borderLeft: selectMode && selectedDocuments.includes(document._id)
                            ? "3px solid"
                            : "3px solid transparent",
                          borderColor: "primary.main",
                          "&:hover": {
                            bgcolor: selectMode
                              ? alpha(theme.palette.primary.main, 0.12)
                              : alpha(theme.palette[docColor].main, 0.05),
                          },
                        }}
                      >
                        <ListItemButton
                          onClick={
                            selectMode
                              ? () =>
                                  handleToggleDocumentSelection(document._id)
                              : () => handleViewDocument(document._id)
                          }
                          dense
                          sx={{
                            py: 1,
                            cursor: selectMode ? "pointer" : "default",
                          }}
                        >
                          {selectMode && (
                            <ListItemIcon sx={{ minWidth: 48 }}>
                              <Checkbox
                                edge="start"
                                checked={selectedDocuments.includes(
                                  document._id
                                )}
                                tabIndex={-1}
                                disableRipple
                                size="medium"
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 24,
                                  },
                                }}
                              />
                            </ListItemIcon>
                          )}
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 28,
                                height: 28,
                                borderRadius: 1,
                                bgcolor: alpha(
                                  theme.palette[docColor].main,
                                  0.1
                                ),
                                color: `${docColor}.main`,
                              }}
                            >
                              {React.cloneElement(
                                getDocumentIcon(document.category),
                                {
                                  sx: { fontSize: 16 },
                                }
                              )}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight="medium">
                                {document.title}
                              </Typography>
                            }
                            secondary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  gap: 1,
                                  mt: 0.5,
                                }}
                              >
                                {renderCategoryChips(document, "small", 2)}
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {getFormattedDate(document.createdAt)}
                                </Typography>
                              </Box>
                            }
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: { fontWeight: "medium" },
                            }}
                            secondaryTypographyProps={{
                              variant: "caption",
                              sx: { fontSize: "0.75rem" },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>
          ) : (
            // Grid view
            <Grid container spacing={1.5}>
              {filteredDocuments.map((document) => {
                // Get primary category for color
                const docColor = getDocumentColor(document.category);

                return (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={document._id}>
                    <Card
                      elevation={selectMode && selectedDocuments.includes(document._id) ? 4 : 1}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: selectMode ? "scale(1.02)" : "translateY(-2px)",
                          boxShadow: selectMode ? 4 : 2,
                          borderColor: selectMode
                            ? "primary.main"
                            : alpha(theme.palette[docColor].main, 0.4),
                        },
                        position: "relative",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        border: "2px solid",
                        borderColor: selectMode && selectedDocuments.includes(document._id)
                          ? "primary.main"
                          : selectMode
                          ? alpha(theme.palette.primary.main, 0.3)
                          : alpha(theme.palette[docColor].main, 0.2),
                        bgcolor: selectMode && selectedDocuments.includes(document._id)
                          ? alpha(theme.palette.primary.main, 0.08)
                          : "background.paper",
                        maxWidth: "100%",
                      }}
                      onClick={
                        selectMode
                          ? () => handleToggleDocumentSelection(document._id)
                          : () => handleViewDocument(document._id)
                      }
                    >
                      {getDocumentCopies(document, categories[tabValue].id) >
                        1 && (
                        <Chip
                          label={`${getDocumentCopies(
                            document,
                            categories[tabValue].id
                          )}x`}
                          size="small"
                          color="secondary"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            height: 22,
                            minWidth: 32,
                            fontWeight: "bold",
                            "& .MuiChip-label": {
                              px: 1,
                              fontSize: "0.7rem",
                            },
                            zIndex: 10,
                          }}
                        />
                      )}
                      {selectMode && (
                        <Checkbox
                          checked={selectedDocuments.includes(document._id)}
                          sx={{
                            position: "absolute",
                            top: 6,
                            left: 6,
                            bgcolor: "background.paper",
                            borderRadius: "50%",
                            p: 0.5,
                            zIndex: 10,
                            boxShadow: 2,
                            "& .MuiSvgIcon-root": {
                              fontSize: 26,
                            },
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                          size="medium"
                        />
                      )}

                      <Box
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          borderBottom: "1px solid",
                          borderColor: alpha(theme.palette[docColor].main, 0.1),
                          bgcolor: alpha(theme.palette[docColor].main, 0.05),
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette[docColor].main, 0.1),
                            color: `${docColor}.main`,
                            mr: 1,
                          }}
                        >
                          {React.cloneElement(
                            getDocumentIcon(document.category),
                            {
                              sx: { fontSize: 16 },
                            }
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.2,
                            fontSize: "0.8125rem",
                          }}
                        >
                          {document.title}
                        </Typography>
                      </Box>

                      <CardContent
                        sx={{ p: 1.5, flexGrow: 1, pb: "8px !important" }}
                      >
                        <Box sx={{ mb: 1 }}>
                          {renderCategoryChips(document, "small", 1)}

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {getFormattedDate(document.createdAt)}
                          </Typography>
                        </Box>
                      </CardContent>

                      <Box
                        sx={{
                          p: 0.5,
                          display: "flex",
                          justifyContent: "space-around",
                          borderTop: "1px solid",
                          borderColor: alpha(theme.palette[docColor].main, 0.1),
                          bgcolor: alpha(theme.palette[docColor].main, 0.03),
                        }}
                      >
                        <Tooltip title="Edit document">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDocument(document._id);
                            }}
                            sx={{
                              p: 0.5,
                              "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export to PDF">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportSingleToPDF(document._id);
                            }}
                            disabled={generatingPDF}
                            sx={{
                              p: 0.5,
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.secondary.main,
                                  0.1
                                ),
                              },
                            }}
                          >
                            <PdfIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More options">
                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenMenu(e, document)}
                            sx={{
                              p: 0.5,
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.text.primary,
                                  0.05
                                ),
                              },
                            }}
                          >
                            <MoreVertIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* Document Actions Menu */}
      <DocumentActionsMenu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        document={actionDocument}
        onView={handleViewDocument}
        onEdit={handleEditDocument}
        onExport={handleExportSingleToPDF}
      />

      {/* Generate Documents Dialog */}
      <GenerateDocumentsDialog
        open={openGenerateDialog}
        onClose={() => setOpenGenerateDialog(false)}
        onGenerate={handleGenerateDocuments}
        isGenerating={generating}
        clientName={intakeForm?.name}
      />

      {/* Regenerate Documents Dialog */}
      <RegenerateDocumentsDialog
        open={openRegenerateDialog}
        onClose={() => setOpenRegenerateDialog(false)}
        onRegenerate={handleRegenerateDocuments}
        isGenerating={generating}
      />

      {/* Success message */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <CustomCopiesDialog
        open={openCopyDialog}
        onClose={() => setOpenCopyDialog(false)}
        selectedDocuments={selectedDocuments}
        documents={documents}
        categories={categories}
        tabValue={tabValue}
        customCopyCounts={customCopyCounts}
        onCopyCountChange={handleCopyCountChange}
        onExport={handleExportWithCustomCopies}
        calculateTotalCopies={calculateTotalCustomCopies}
        renderCategoryChips={renderCategoryChips}
      />

      {/* Document generation animation */}
      <DocumentGenerationAnimation
        isGenerating={generatingPDF}
        documentCount={generatingDocumentCount}
        realProgress={pdfProgress}
        currentPhaseText={pdfPhase}
        currentDocumentName={currentDocName}
      />
    </Container>
  );
};

export default ViewDocuments;
