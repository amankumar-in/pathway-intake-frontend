import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import ReactDOM from "react-dom/client";
import { PDFDocument } from "pdf-lib";

import {
  getIntakeForm,
  getDocumentsByIntakeForm,
  generateDocuments,
  getDocument,
} from "../utils/api";
import { getDocumentComponent } from "../utils/documentMapper";
import {
  generatePDF,
  generateMultiplePDF,
  generateMultiElementsPDF,
  createDocumentElement,
  generatePDFBlob,
} from "../utils/pdfUtils";
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
  Avatar,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Grid,
  Badge,
  useTheme,
  alpha,
  Backdrop,
  Fade,
  Menu,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  Paper,
  Stack,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Folder as FolderIcon,
  FolderSpecial as FolderSpecialIcon,
  Home as HomeIcon,
  MoveToInbox as MoveToInboxIcon,
  Sort as SortIcon,
  Archive as ArchiveIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  CloudDownload as CloudDownloadIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  FileDownload as FileDownloadIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Fingerprint as FingerprintIcon,
  Business as BusinessIcon,
  Layers as LayersIcon,
  Article as ArticleIcon,
  ContentPaste as ContentPasteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Clear as ClearIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  BurstMode as BurstModeIcon,
  Add as AddMuiIcon, // Add this
  Remove as RemoveMuiIcon, // Add this
} from "@mui/icons-material";

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
// todo Use title: "ID-Emergency Information" from document controller file
const documentCopiesConfig = {
  "Intake Paperwork": {
    "Notice of Action": 3,
    "ID-Emergency Information": 1,
    "Agency to Agency Agreement": 2,
    "Agency to Foster Parent": 3,
    "Client Grievance Guidelines": 2,
    "County Worker Grievance Guidelines": 2,
    "Consent For Medical Treatment": 2,
    "CHDP Form": 1,
    "PRN Authorization Letter": 1,
    "PRN Page 2": 1,
    "Client Personal Rights": 3,
    "Confirmation of T.B. Test": 1,
    "Confirmation of Ambulatory Status": 1,
    "Record of Client Cash Resources": 2,
    "Client Initial Care Plan": 2,
    "Client Disciplinary Policy & Procedures": 2,
    "Client Discharge": 2,
    "Acknowledgement of Prior Information": 3,
    "Home Placement Log": 1,
    "Monthly Medication Record": 2,
    "Medication & Destruction Record": 2,
    "Dental Treatment Record": 1,
    "Quarterly Clothing Allowance": 1,
    "Quarterly Spending Allowance": 2,
    "Consent to Release Medical/Confidential Information Authorization": 2,
    "Placement Application": 1,
    "Foster Parent Checklist": 1,
    default: 1,
  },
  "Shelter Bed Documents": {
    "Agency to Agency Agreement": 2,
    "Agency to Foster Parent": 2,
    "ID-Emergency Information": 1,
    "Client Grievance Guidelines": 1,
    "County Worker Grievance Guidelines": 1,
    "Consent For Medical Treatment": 1,
    "Client Personal Rights": 1,
    "Client Initial Care Plan": 2,
    "Client Disciplinary Policy & Procedures": 1,
    "Client Discharge": 1,
    "Acknowledgement of Prior Information": 2,
    "Consent to Release Medical/Confidential Information Authorization": 1,
    "Placement Application": 1,

    default: 2,
  },
  "In House Move": {
    "Agency to Foster Parent": 2,
    "Consent For Medical Treatment": 1,
    "Record of Client Cash Resources": 1,
    "Client Initial Care Plan": 1,
    "Acknowledgement of Prior Information": 2,
    "Home Placement Log": 1,
    "Emergency Information Log": 1,
    "Quarterly Clothing Allowance": 2,
    "Quarterly Spending Allowance": 2,

    default: 1,
  },
  default: 1,
};

const ViewDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("desc"); // desc = newest first
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [actionDocument, setActionDocument] = useState(null);
  const [showDownloadProgress, setShowDownloadProgress] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [showTips, setShowTips] = useState(false);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [customCopyCounts, setCustomCopyCounts] = useState({});

  // Categories for tabs with icons and colors
  const categories = [
    {
      id: "All Documents",
      icon: <LayersIcon />,
      color: "primary",
    },
    {
      id: "Intake Paperwork",
      icon: <AssignmentIcon />,
      color: "secondary",
    },
    {
      id: "Shelter Bed Documents",
      icon: <HomeIcon />,
      color: "info",
    },
    {
      id: "In House Move",
      icon: <MoveToInboxIcon />,
      color: "success",
    },
  ];

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

      // Call the same API endpoint as initial generation
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
  const handleSelectAllToggle = (event) => {
    if (event.target.checked) {
      setSelectedDocuments(getFilteredDocuments().map((doc) => doc._id));
    } else {
      setSelectedDocuments([]);
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

  // Open actions menu for a document
  const handleOpenMenu = (event, document) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setActionDocument(document);
  };

  // Close actions menu
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
      setError("");
      setSuccessMessage("");
      simulateDownloadProgress();

      // Fetch the complete document data including signatures
      const response = await getDocument(documentId);
      const fullDocData = response.data;

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

      // Render the temporary component
      const root = ReactDOM.createRoot(tempContainer);
      root.render(<TempDocumentComponent />);

      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate PDF using the exact same approach as ViewDocument.js
      if (tempDocumentRef.current) {
        await generatePDF(
          tempDocumentRef.current,
          `document-${documentId}.pdf`
        );
      }

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      setSuccessMessage("Document exported successfully!");
    } catch (err) {
      console.error("Error exporting document:", err);
      setError("Error exporting document: " + err.message);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Export selected documents to PDF
  // Replace the entire handleExportSelectedToPDF function with this one
  const handleExportSelectedToPDF = async () => {
    if (selectedDocuments.length === 0) return;

    try {
      setGeneratingPDF(true);
      setError("");
      setSuccessMessage("");
      simulateDownloadProgress();

      // Array to store PDF blobs
      const pdfBlobs = [];

      // Track total pages for progress indication
      let totalPages = 0;
      let processedPages = 0;

      // First pass - calculate total pages based on copy counts
      for (const docId of selectedDocuments) {
        try {
          // Get document from our documents array
          const docInfo = documents.find((doc) => doc._id === docId);
          // Get the active category (tab)
          const activeCategory = categories[tabValue].id;
          // Get required copies
          const copies = getDocumentCopies(docInfo, activeCategory);
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
          // Fetch document data
          const response = await getDocument(docId);
          const fullDocData = response.data;

          // Get document info for copy count
          const docInfo = documents.find((doc) => doc._id === docId);
          const activeCategory = categories[tabValue].id;
          const copies = getDocumentCopies(docInfo, activeCategory);

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

            // Add the blob multiple times based on copy count
            for (let i = 0; i < copies; i++) {
              pdfBlobs.push({
                blob: pdfBlob,
                title: fullDocData.title,
                category: activeCategory,
              });
              processedPages++;

              // Update progress
              setDownloadProgress((processedPages / totalPages) * 100);
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

        // Add pages from each PDF with a cover page for multiple copies
        let currentDoc = null;
        let copyCount = 1;

        for (const { blob, title, category } of pdfBlobs) {
          const pdfBytes = await blob.arrayBuffer();
          const pdf = await PDFDocument.load(pdfBytes);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

          // Add the document pages
          pages.forEach((page) => mergedPdf.addPage(page));

          // Update document tracking
          if (currentDoc === title) {
            copyCount++;
          } else {
            currentDoc = title;
            copyCount = 1;
          }
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

      setSuccessMessage(
        `Documents exported successfully with appropriate copies!`
      );
    } catch (err) {
      console.error("Error exporting documents:", err);
      setError("Error exporting documents: " + err.message);
    } finally {
      setGeneratingPDF(false);
    }
  };
  // =========================================
  // Add this function after handleExportSelectedToPDF
  const handleExportWithCustomCopies = async () => {
    setOpenCopyDialog(false);

    if (selectedDocuments.length === 0) return;

    try {
      setGeneratingPDF(true);
      setError("");
      setSuccessMessage("");
      simulateDownloadProgress();

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
          // Fetch document data
          const response = await getDocument(docId);
          const fullDocData = response.data;

          // Get document info
          const docInfo = documents.find((doc) => doc._id === docId);
          const activeCategory = categories[tabValue].id;

          // Use custom copy count if available
          const copies = customCopyCounts[docId] || 1;

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

              // Update progress
              setDownloadProgress((processedPages / totalPages) * 100);
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

        // Add pages from each PDF with a cover page for multiple copies
        let currentDoc = null;
        let copyCount = 1;

        for (const { blob, title, category } of pdfBlobs) {
          const pdfBytes = await blob.arrayBuffer();
          const pdf = await PDFDocument.load(pdfBytes);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

          // Add the document pages
          pages.forEach((page) => mergedPdf.addPage(page));

          // Update document tracking
          if (currentDoc === title) {
            copyCount++;
          } else {
            currentDoc = title;
            copyCount = 1;
          }
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
    } catch (err) {
      console.error("Error exporting documents:", err);
      setError("Error exporting documents: " + err.message);
    } finally {
      setGeneratingPDF(false);
    }
  };
  // =========================================
  // Function to get the number of copies needed for a document
  const getDocumentCopies = (document, activeCategory) => {
    // If "All Documents" tab is selected, always return 1 copy
    if (activeCategory === "All Documents") {
      return 1;
    }

    // For other tabs, use the selected category
    const category = activeCategory;

    // Check if we have a configuration for this category
    if (documentCopiesConfig[category]) {
      // Check if this specific document title has a configured copy count
      if (documentCopiesConfig[category][document.title]) {
        return documentCopiesConfig[category][document.title];
      }
      // Return the default for this category
      return documentCopiesConfig[category].default;
    }

    // Default fallback if no configuration exists
    return documentCopiesConfig.default;
  };

  // Calculate total copies
  const calculateTotalCopies = () => {
    if (selectedDocuments.length === 0) return 0;

    return selectedDocuments.reduce((total, docId) => {
      const doc = documents.find((d) => d._id === docId);
      if (!doc) return total;

      return total + getDocumentCopies(doc, categories[tabValue].id);
    }, 0);
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
  // ==========================================
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

    // Sort documents
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      if (sortDirection === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return filtered;
  };

  // Get all categories a document belongs to (primary + additional)
  const getAllDocumentCategories = (document) => {
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

  // Check if all documents in the current view are selected
  const areAllSelected = () => {
    const filteredDocs = getFilteredDocuments();
    return (
      filteredDocs.length > 0 &&
      filteredDocs.every((doc) => selectedDocuments.includes(doc._id))
    );
  };

  // Get document icon based on category
  const getDocumentIcon = (category) => {
    switch (category) {
      case "Intake Paperwork":
        return <AssignmentIcon color="secondary" />;
      case "Shelter Bed Documents":
        return <HomeIcon color="info" />;
      case "In House Move":
        return <MoveToInboxIcon color="success" />;
      default:
        return <DescriptionIcon color="primary" />;
    }
  };

  // Get document color based on category
  const getDocumentColor = (category) => {
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

  // Get document status chip
  const getDocumentStatusChip = (document) => {
    // This is a placeholder. In a real app, you'd have actual status data
    const status = document.status || "Completed";

    let chipProps = {
      label: status,
      size: "small",
      variant: "outlined",
    };

    switch (status) {
      case "Pending":
        chipProps.color = "warning";
        chipProps.icon = <AccessTimeIcon fontSize="small" />;
        break;
      case "Needs Review":
        chipProps.color = "error";
        chipProps.icon = <ErrorIcon fontSize="small" />;
        break;
      case "Completed":
      default:
        chipProps.color = "success";
        chipProps.icon = <CheckCircleIcon fontSize="small" />;
        break;
    }

    return <Chip {...chipProps} />;
  };

  // Get document date display
  const getFormattedDate = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render document category chips
  const renderCategoryChips = (document, size = "small", max = 2) => {
    const allCategories = getAllDocumentCategories(document);

    // Only show the first 'max' categories with a "+X more" chip if needed
    const visibleCategories = allCategories.slice(0, max);
    const hasMoreCategories = allCategories.length > max;

    return (
      <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
        {visibleCategories.map((category, index) => (
          <Chip
            key={index}
            label={category}
            size={size}
            color={getDocumentColor(category)}
            variant="outlined"
            sx={{
              height: size === "small" ? 20 : 24,
              "& .MuiChip-label": {
                px: 0.75,
                fontSize: size === "small" ? "0.65rem" : "0.75rem",
              },
              mb: 0.5,
              mr: 0.5,
            }}
          />
        ))}

        {hasMoreCategories && (
          <Tooltip title={allCategories.slice(max).join(", ")}>
            <Chip
              icon={<BurstModeIcon fontSize="small" />}
              label={`+${allCategories.length - max}`}
              size={size}
              variant="outlined"
              sx={{
                height: size === "small" ? 20 : 24,
                "& .MuiChip-label": {
                  px: 0.75,
                  fontSize: size === "small" ? "0.65rem" : "0.75rem",
                },
                mb: 0.5,
              }}
            />
          </Tooltip>
        )}
      </Stack>
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

  // Add this component right before the return statement
  // Custom Copies Dialog Component
  const CustomCopiesDialog = () => {
    return (
      <Dialog
        open={openCopyDialog}
        onClose={() => setOpenCopyDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CloudDownloadIcon color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6">Custom Document Copies</Typography>
            </Box>
            <Chip
              label={`Total: ${calculateTotalCustomCopies()} copies`}
              color="primary"
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" paragraph>
            Customize how many copies of each document to include in the PDF
            export:
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            The default copy counts are based on document type and category
            requirements.
          </Alert>

          <List sx={{ width: "100%" }}>
            {selectedDocuments.map((docId) => {
              const doc = documents.find((d) => d._id === docId);
              if (!doc) return null;

              const defaultCopies = getDocumentCopies(
                doc,
                categories[tabValue].id
              );
              const currentCopies = customCopyCounts[docId] || defaultCopies;

              return (
                <ListItem
                  key={docId}
                  divider
                  secondaryAction={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        edge="end"
                        onClick={() =>
                          handleCopyCountChange(docId, currentCopies - 1)
                        }
                        disabled={currentCopies <= 1}
                      >
                        <RemoveMuiIcon />
                      </IconButton>
                      <TextField
                        value={currentCopies}
                        onChange={(e) =>
                          handleCopyCountChange(docId, e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        sx={{ width: 60 }}
                        inputProps={{
                          min: 1,
                          max: 10,
                          type: "number",
                          style: { textAlign: "center" },
                        }}
                      />
                      <IconButton
                        edge="end"
                        onClick={() =>
                          handleCopyCountChange(docId, currentCopies + 1)
                        }
                        disabled={currentCopies >= 10}
                      >
                        <AddMuiIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: alpha(
                          theme.palette[getDocumentColor(doc.category)].main,
                          0.1
                        ),
                        color: `${getDocumentColor(doc.category)}.main`,
                      }}
                    >
                      {React.cloneElement(getDocumentIcon(doc.category), {
                        sx: { fontSize: 18 },
                      })}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.title}
                    secondary={
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        {renderCategoryChips(doc, "small", 1)}
                        <Typography variant="caption" color="text.secondary">
                          Default: {defaultCopies}{" "}
                          {defaultCopies === 1 ? "copy" : "copies"}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>

        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button onClick={() => setOpenCopyDialog(false)} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={handleExportWithCustomCopies}
            variant="contained"
            color="primary"
            startIcon={<CloudDownloadIcon />}
          >
            Export {calculateTotalCustomCopies()} Copies
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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

      {/* Simplified Header */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
          transition: "all 0.2s ease",
        }}
      >
        {/* Client info & Search row */}
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

          {/* Right side: Search + Export buttons */}
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
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
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
                    {isMobile ? "" : "Regenerate"}
                  </Button>
                </Tooltip>
              )}
              {/* We only need one export button that adapts based on selection state */}

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
                    ? handleOpenCopyDialog() // Changed to open the dialog instead of direct export
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
                  ? `Export (${selectedDocuments.length} docs)`
                  : "Export"}
              </Button>
            </Stack>
          </Box>
        </Box>

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
                maxWidth: "100%",
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
              <Tooltip title="Show tips">
                <IconButton
                  size="small"
                  onClick={() => setShowTips(!showTips)}
                  color={showTips ? "primary" : "default"}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Sort button with clear label */}
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
                  minWidth: "auto",
                  px: 1,
                  fontSize: "0.75rem",
                }}
              >
                {sortDirection === "asc" ? "Oldest" : "Newest"}
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

              {/* Improved select button */}
              <Button
                variant={selectMode ? "contained" : "outlined"}
                size="small"
                color={selectMode ? "primary" : "inherit"}
                onClick={() => {
                  setSelectMode(!selectMode);
                  if (selectMode) setSelectedDocuments([]);
                }}
                startIcon={
                  selectMode ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
                }
                sx={{
                  height: 36,
                  fontSize: "0.75rem",
                  fontWeight: "medium",
                  px: 1.5,
                }}
              >
                {selectMode ? `${selectedDocuments.length} Selected` : "Select"}
              </Button>
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

        {/* Selection controls when in select mode */}
        {selectMode && filteredDocuments.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 1.5,
              bgcolor: alpha(theme.palette.primary.light, 0.1),
              borderColor: alpha(theme.palette.primary.light, 0.2),
              borderBottomStyle: "solid",
              borderBottomWidth: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={areAllSelected()}
                  onChange={handleSelectAllToggle}
                  indeterminate={
                    selectedDocuments.length > 0 && !areAllSelected()
                  }
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {`Select All (${filteredDocuments.length})`}
                </Typography>
              }
              sx={{ mr: 2 }}
            />

            {/* We don't need this since we have the main export button */}
            {false && (
              <Tooltip title="Export selected documents as a merged PDF file">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={
                    generatingPDF ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <FileDownloadIcon />
                    )
                  }
                  disabled={selectedDocuments.length === 0 || generatingPDF}
                  onClick={handleExportSelectedToPDF}
                  sx={{
                    "&.Mui-disabled": {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: alpha(theme.palette.primary.contrastText, 0.5),
                    },
                  }}
                >
                  {generatingPDF
                    ? "Generating..."
                    : `Export (${selectedDocuments.length})`}
                </Button>
              </Tooltip>
            )}
          </Box>
        )}
      </Card>

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
            // List view - More compact
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
                              {/* In list view, inside the ListItem secondaryAction prop, add this before the other buttons */}
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
                          "&:hover": {
                            bgcolor: alpha(theme.palette[docColor].main, 0.05),
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
                          sx={{ py: 1 }}
                        >
                          {selectMode && (
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Checkbox
                                edge="start"
                                checked={selectedDocuments.includes(
                                  document._id
                                )}
                                tabIndex={-1}
                                disableRipple
                                size="small"
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
                                {/* Modified to show all categories - List View */}
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
            // Grid view - Smaller cards
            <Grid container spacing={1.5}>
              {filteredDocuments.map((document) => {
                // Get primary category for color
                const docColor = getDocumentColor(document.category);

                return (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={document._id}>
                    <Card
                      elevation={1}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 2,
                        },
                        position: "relative",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: alpha(theme.palette[docColor].main, 0.2),
                        maxWidth: "100%",
                      }}
                      onClick={
                        selectMode
                          ? () => handleToggleDocumentSelection(document._id)
                          : () => handleViewDocument(document._id)
                      }
                    >
                      {/* In grid view, inside each Card component, add this right after the Card opening tag */}
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
                            top: 4,
                            left: 4,
                            bgcolor: "background.paper",
                            borderRadius: "50%",
                            p: 0.25,
                            zIndex: 10,
                            "& .MuiSvgIcon-root": {
                              fontSize: 16,
                            },
                          }}
                          size="small"
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
                          {/* Modified to show all categories - Grid View */}
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
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { width: 200, borderRadius: 2, overflow: "hidden" },
          elevation: 3,
        }}
      >
        <MenuItem
          onClick={() => {
            handleViewDocument(actionDocument?._id);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleEditDocument(actionDocument?._id);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleExportSingleToPDF(actionDocument?._id);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
        <MenuItem sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Generate Documents Dialog */}
      <Dialog
        open={openGenerateDialog}
        onClose={() => !generating && setOpenGenerateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AssignmentIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography variant="h6">Generate Documents</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" paragraph>
            No documents have been generated for this intake form yet. Would you
            like to generate them now?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This will create all required documentation for {intakeForm?.name}'s
            case including:
          </Typography>
          <Box sx={{ ml: 2, mb: 2 }}>
            <Typography variant="body2" component="div">
              • Intake forms and assessments
              <br />
              • Consent and authorization documents
              <br />
              • Placement agreements
              <br />• Service plans
            </Typography>
          </Box>
          <Alert
            severity="info"
            variant="outlined"
            sx={{ mt: 2, borderRadius: 1 }}
          >
            You can edit all documents after they are generated.
          </Alert>
          {generating && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenGenerateDialog(false)}
            disabled={generating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateDocuments}
            variant="contained"
            disabled={generating}
            startIcon={
              generating ? <CircularProgress size={16} /> : <AssignmentIcon />
            }
          >
            {generating ? "Generating..." : "Generate Documents"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Regenerate Documents Dialog */}
      <Dialog
        open={openRegenerateDialog}
        onClose={() => !generating && setOpenRegenerateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: alpha(theme.palette.warning.main, 0.05),
            borderBottom: "1px solid",
            borderColor: alpha(theme.palette.warning.main, 0.1),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AssignmentIcon color="warning" sx={{ mr: 1.5 }} />
            <Typography variant="h6">Regenerate Documents</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" paragraph>
            Are you sure you want to regenerate all documents for this intake
            form?
          </Typography>
          <Alert
            severity="warning"
            variant="outlined"
            sx={{ mt: 2, borderRadius: 1 }}
          >
            <Typography variant="body2">
              <strong>Important:</strong> This will replace all existing
              documents with new ones based on the current form data. Any edits
              made directly to documents will be lost.
            </Typography>
          </Alert>
          {generating && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenRegenerateDialog(false)}
            disabled={generating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegenerateDocuments}
            variant="contained"
            color="warning"
            disabled={generating}
            startIcon={
              generating ? <CircularProgress size={16} /> : <AssignmentIcon />
            }
          >
            {generating ? "Regenerating..." : "Yes, Regenerate All"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success message */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <CustomCopiesDialog />
    </Container>
  );
};

export default ViewDocuments;
