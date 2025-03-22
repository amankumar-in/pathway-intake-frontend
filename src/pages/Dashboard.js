import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Tooltip,
  Zoom,
  Divider,
  Badge,
  IconButton,
  Collapse,
  TextField,
  InputAdornment,
  Menu,
  MenuItem as MenuItemMUI,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Snackbar,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ClearIcon from "@mui/icons-material/Clear";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getIntakeForms,
  updateFormStatus,
  toggleFormArchive,
  getStandaloneDocuments,
  getDocument,
  permanentlyDeleteForm,
  permanentlyDeleteDocument,
  bulkDeleteForms,
  bulkDeleteDocuments,
} from "../utils/api";
import DocumentTypeSelector from "../components/DocumentTypeSelector";

const Dashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [activeTab, setActiveTab] = useState(0);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateSort, setDateSort] = useState("desc"); // desc = newest first
  const [statusFilterAnchorEl, setStatusFilterAnchorEl] = useState(null);

  // Add state for standalone documents
  const [standaloneDocuments, setStandaloneDocuments] = useState([]);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);

  // For form actions menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  // For status change dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // For archive confirmation dialog
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveAction, setArchiveAction] = useState(null);

  // For multi-select and permanent delete
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState(null); // 'form' or 'document'
  const [permanentDeleteItem, setPermanentDeleteItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.title = "Dashboard | Pathway Foster Agency";
  }, []);

  // Fetch intake forms and standalone documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both intake forms and standalone documents
        const [formsResponse, standaloneDocsResponse] = await Promise.all([
          getIntakeForms(),
          getStandaloneDocuments(),
        ]);

        console.log("Intake forms:", formsResponse);
        console.log("Standalone documents:", standaloneDocsResponse);

        // Sort forms by createdAt date in descending order (newest first)
        const sortedForms = [...formsResponse.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setForms(sortedForms);

        // Set standalone documents
        setStandaloneDocuments(standaloneDocsResponse.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear any status filter when changing tabs
    setStatusFilter("");
    // Clear selections when changing tabs
    setSelectedItems([]);
  };

  const handleStartNewForm = () => {
    // If we're on the single documents tab, show document selector
    if (activeTab === 2) {
      setShowDocumentSelector(true);
    } else {
      navigate("/intake-form");
    }
  };

  const handleViewForm = (formId) => {
    navigate(`/view-documents/${formId}`);
  };

  const handleViewDocument = (documentId) => {
    navigate(`/view-document/${documentId}`);
  };

  // Add edit form handler
  const handleEditForm = (formId) => {
    navigate(`/edit-form/${formId}`);
  };

  // Add edit document handler
  const handleEditDocument = async (documentId, isStandalone = false) => {
    if (isStandalone) {
      try {
        // For standalone documents, fetch the document data first
        setLoading(true);
        const response = await getDocument(documentId);
        const document = response.data;

        // Create document data object for the standalone document form
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
      } catch (err) {
        console.error("Error fetching document for edit:", err);
        setError("Error preparing document for edit. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // For regular documents, use the existing path
      navigate(`/edit-document/${documentId}`);
    }
  };

  const handleUserManagement = () => {
    navigate("/user-management");
  };

  const toggleHelp = () => {
    setHelpOpen(!helpOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle document selection
  const handleSelectDocument = (documentData) => {
    setShowDocumentSelector(false);

    // Encode document data and navigate to standalone form
    const encodedData = encodeURIComponent(JSON.stringify(documentData));
    navigate(`/standalone-document?documentData=${encodedData}`);
  };

  // Form actions menu handlers
  const handleMenuOpen = (event, form) => {
    setAnchorEl(event.currentTarget);
    setSelectedForm(form);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Status change handlers
  const handleStatusDialogOpen = () => {
    if (selectedForm) {
      setNewStatus(selectedForm.status);
      setStatusDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleStatusUpdate = async () => {
    if (selectedForm && newStatus) {
      try {
        await updateFormStatus(selectedForm._id, newStatus);
        // Update the form in the local state
        const updatedForms = forms.map((form) =>
          form._id === selectedForm._id ? { ...form, status: newStatus } : form
        );
        setForms(updatedForms);
        setStatusDialogOpen(false);
      } catch (err) {
        console.error("Error updating status:", err);
        setError("Failed to update form status. Please try again.");
      }
    }
  };

  // Archive handlers
  const handleArchiveDialogOpen = (archive) => {
    setArchiveAction(archive);
    setArchiveDialogOpen(true);
    handleMenuClose();
  };

  const handleArchiveDialogClose = () => {
    setArchiveDialogOpen(false);
  };

  const handleToggleArchive = async () => {
    if (selectedForm) {
      try {
        const shouldArchive = archiveAction === "archive";
        await toggleFormArchive(selectedForm._id, shouldArchive);

        // Update the form in the local state
        const updatedForms = forms.map((form) =>
          form._id === selectedForm._id
            ? { ...form, archived: shouldArchive }
            : form
        );
        setForms(updatedForms);
        setArchiveDialogOpen(false);
      } catch (err) {
        console.error("Error toggling archive status:", err);
        setError(`Failed to ${archiveAction} form. Please try again.`);
      }
    }
  };

  // Multi-select handlers
  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSelectAll = (items) => {
    if (selectedItems.length === items.length) {
      // Deselect all if all are already selected
      setSelectedItems([]);
    } else {
      // Select all items
      setSelectedItems(items.map((item) => item._id));
    }
  };

  // Permanent delete handlers
  const handlePermanentDeleteDialog = (item, type) => {
    setPermanentDeleteItem(item);
    setSelectedItemType(type);
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const handleBulkDeleteDialog = (type) => {
    setPermanentDeleteItem(null); // No single item for bulk delete
    setSelectedItemType(type);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);

      // Single item delete
      if (permanentDeleteItem) {
        if (selectedItemType === "form") {
          await permanentlyDeleteForm(permanentDeleteItem._id);
          setForms(
            forms.filter((form) => form._id !== permanentDeleteItem._id)
          );
        } else {
          await permanentlyDeleteDocument(permanentDeleteItem._id);
          setStandaloneDocuments(
            standaloneDocuments.filter(
              (doc) => doc._id !== permanentDeleteItem._id
            )
          );
        }
      }
      // Bulk delete
      else if (selectedItems.length > 0) {
        if (selectedItemType === "form") {
          await bulkDeleteForms(selectedItems);
          setForms(forms.filter((form) => !selectedItems.includes(form._id)));
        } else {
          await bulkDeleteDocuments(selectedItems);
          setStandaloneDocuments(
            standaloneDocuments.filter(
              (doc) => !selectedItems.includes(doc._id)
            )
          );
        }
        setSelectedItems([]); // Clear selection after bulk delete
      }

      setSuccessMessage(
        `Successfully deleted ${
          permanentDeleteItem ? "item" : "selected items"
        }`
      );
    } catch (err) {
      console.error("Error deleting items:", err);
      setError(`Error deleting items: ${err.message}`);
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setPermanentDeleteItem(null);
    }
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  // Date sorting handler
  const handleToggleDateSort = () => {
    setDateSort(dateSort === "asc" ? "desc" : "asc");
  };

  // Status filter handlers
  const handleOpenStatusFilter = (event) => {
    setStatusFilterAnchorEl(event.currentTarget);
  };

  const handleCloseStatusFilter = () => {
    setStatusFilterAnchorEl(null);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    handleCloseStatusFilter();
  };

  const handleClearStatusFilter = () => {
    setStatusFilter("");
    handleCloseStatusFilter();
  };

  // Handle card click to filter by status
  const handleStatusCardClick = (status) => {
    setStatusFilter(status);
    // Also ensure we're on the right tab for viewing these forms
    setActiveTab(0); // Switch to My Forms tab
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isMobile
      ? date.toLocaleDateString("en-US")
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  // Get status chip color based on status
  const getStatusChip = (status) => {
    let color = "default";
    let label = status || "Unknown";

    switch (status) {
      case "Completed":
        color = "success";
        break;
      case "In Progress":
        color = "primary";
        break;
      case "Pending":
        color = "warning";
        break;
      case "Needs Review":
        color = "error";
        break;
      case "Archived":
        color = "default";
        break;
      default:
        color = "default";
    }

    return <Chip label={label} color={color} size="small" variant="outlined" />;
  };

  // Filter forms based on the active tab and search term
  const getFilteredForms = () => {
    if (!user) return [];

    let filtered = forms;

    // First filter by tab selection
    if (activeTab === 0) {
      // My Forms tab - show only forms created by current user and not archived
      filtered = forms.filter((form) => {
        // Handle different ID formats by converting both to strings
        const formCreatorId =
          typeof form.createdBy === "object"
            ? form.createdBy._id || form.createdBy.id
            : form.createdBy;

        const userId = user._id || user.id;

        return String(formCreatorId) === String(userId) && !form.archived;
      });
    } else if (activeTab === 1 && isAdmin()) {
      // All Forms tab (admin only) - show all non-archived forms
      filtered = forms.filter((form) => !form.archived);
    } else if (activeTab === 3) {
      // Archived Forms tab - show user's archived forms (or all for admin)
      if (isAdmin()) {
        // Admin sees all archived forms
        filtered = forms.filter((form) => form.archived);
      } else {
        // Non-admin sees only their archived forms
        filtered = forms.filter((form) => {
          const formCreatorId =
            typeof form.createdBy === "object"
              ? form.createdBy._id || form.createdBy.id
              : form.createdBy;

          const userId = user._id || user.id;

          return String(formCreatorId) === String(userId) && form.archived;
        });
      }
    }

    // Apply status filter if set
    if (statusFilter) {
      filtered = filtered.filter((form) => form.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm !== "") {
      filtered = filtered.filter(
        (form) =>
          (form.name &&
            form.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (form.caseNumber &&
            form.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (form.status &&
            form.status.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply date sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateSort === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  };

  // Get filtered standalone documents
  const getFilteredStandaloneDocuments = () => {
    if (!user) return [];

    let filtered = standaloneDocuments;

    // Filter by user if not admin
    if (!isAdmin()) {
      filtered = filtered.filter((doc) => {
        const docCreatorId =
          typeof doc.createdBy === "object"
            ? doc.createdBy._id || doc.createdBy.id
            : doc.createdBy;

        const userId = user._id || user.id;

        return String(docCreatorId) === String(userId);
      });
    }

    // Apply search filter
    if (searchTerm !== "") {
      filtered = filtered.filter(
        (doc) =>
          (doc.title &&
            doc.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (doc.createdFor &&
            doc.createdFor.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (doc.formData?.template &&
            doc.formData.template
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply date sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateSort === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  };

  // Calculate dashboard stats
  const calculateStats = () => {
    // Filter forms based on active tab selection but without status filter
    let filteredForTab = forms;
    if (activeTab === 0) {
      // My Forms tab
      filteredForTab = forms.filter((form) => {
        const formCreatorId =
          typeof form.createdBy === "object"
            ? form.createdBy._id || form.createdBy.id
            : form.createdBy;
        const userId = user._id || user.id;
        return String(formCreatorId) === String(userId) && !form.archived;
      });
    } else if (activeTab === 1 && isAdmin()) {
      // All Forms tab (admin only)
      filteredForTab = forms.filter((form) => !form.archived);
    } else if (activeTab === 3) {
      // Archived Forms tab
      if (isAdmin()) {
        filteredForTab = forms.filter((form) => form.archived);
      } else {
        filteredForTab = forms.filter((form) => {
          const formCreatorId =
            typeof form.createdBy === "object"
              ? form.createdBy._id || form.createdBy.id
              : form.createdBy;
          const userId = user._id || user.id;
          return String(formCreatorId) === String(userId) && form.archived;
        });
      }
    }

    // Calculate counts by status
    return {
      totalForms: filteredForTab.length,
      inProgressForms: filteredForTab.filter(
        (form) => form.status === "In Progress"
      ).length,
      pendingForms: filteredForTab.filter((form) => form.status === "Pending")
        .length,
      needsReviewForms: filteredForTab.filter(
        (form) => form.status === "Needs Review"
      ).length,
    };
  };

  const stats = calculateStats();
  const filteredForms = getFilteredForms();
  const filteredStandaloneDocuments = getFilteredStandaloneDocuments();

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 8, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Welcome Header */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: { xs: "nowrap", sm: "nowrap" },
        }}
      >
        {/* Welcome text */}
        <Box>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom={false}
            color="primary"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1.25rem", md: "1.5rem" },
              mb: 0,
            }}
          >
            Welcome, {user?.name ? user.name.split(" ")[0] : "User"}!
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" },
              display: { xs: "none", sm: "block" },
            }}
          >
            Foster Care Intake Management
          </Typography>
        </Box>

        {/* Action buttons */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            ml: { xs: 1, sm: 2 },
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleStartNewForm}
            size="small"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
            }}
          >
            {isMobile ? "New Intake" : "New Intake"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setShowDocumentSelector(true)}
            size="small"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
            }}
          >
            {isMobile ? "New Doc" : "New Single Doc"}
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards - Only show on intake form tabs (0,1,2) and make responsive for mobile */}
      {activeTab < 3 && (
        <Grid container spacing={1} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Grid item xs={3} sm={3}>
            <Card
              elevation={statusFilter === "" ? 6 : 2}
              onClick={() => handleStatusCardClick("")}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                borderLeft: "4px solid",
                borderColor: "primary.main",
                ...(statusFilter === "" && {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  bgcolor: "rgba(25, 118, 210, 0.04)",
                }),
                "&::after":
                  statusFilter === ""
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 16px 16px 0",
                        borderColor:
                          "transparent #1976D2 transparent transparent",
                      }
                    : {},
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  py: { xs: 1, sm: 3 },
                  px: { xs: 0.5, sm: 2 },
                }}
              >
                <Typography
                  variant="subtitle2"
                  color={statusFilter === "" ? "primary" : "textSecondary"}
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1rem" } }}
                >
                  All Forms
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  color="primary"
                  sx={{ fontSize: { xs: "1.2rem", sm: "2.125rem" } }}
                >
                  {stats.totalForms}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Card
              elevation={statusFilter === "In Progress" ? 6 : 2}
              onClick={() => handleStatusCardClick("In Progress")}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                bgcolor:
                  statusFilter === "In Progress"
                    ? "rgba(25, 118, 210, 0.12)"
                    : "rgba(25, 118, 210, 0.04)",
                borderLeft: "4px solid",
                borderColor: "primary.main",
                ...(statusFilter === "In Progress" && {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                }),
                "&::after":
                  statusFilter === "In Progress"
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 16px 16px 0",
                        borderColor:
                          "transparent #1976D2 transparent transparent",
                      }
                    : {},
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  py: { xs: 0.5, sm: 3 },
                  px: { xs: 0.5, sm: 2 },
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="primary.dark"
                  gutterBottom
                  fontWeight={
                    statusFilter === "In Progress" ? "bold" : "medium"
                  }
                  sx={{ fontSize: { xs: "1rem", sm: "1rem" } }}
                >
                  In Progress
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  color="primary.dark"
                  sx={{ fontSize: { xs: "1.2rem", sm: "2.125rem" } }}
                >
                  {stats.inProgressForms}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Card
              elevation={statusFilter === "Pending" ? 6 : 2}
              onClick={() => handleStatusCardClick("Pending")}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                bgcolor:
                  statusFilter === "Pending"
                    ? "rgba(237, 108, 2, 0.12)"
                    : "rgba(237, 108, 2, 0.04)",
                borderLeft: "4px solid",
                borderColor: "warning.main",
                ...(statusFilter === "Pending" && {
                  outline: "2px solid",
                  outlineColor: "warning.main",
                }),
                "&::after":
                  statusFilter === "Pending"
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 16px 16px 0",
                        borderColor:
                          "transparent #ED6C02 transparent transparent",
                      }
                    : {},
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  py: { xs: 1, sm: 3 },
                  px: { xs: 0.5, sm: 2 },
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="warning.dark"
                  gutterBottom
                  fontWeight={statusFilter === "Pending" ? "bold" : "medium"}
                  sx={{ fontSize: { xs: "1rem", sm: "1rem" } }}
                >
                  Pending
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  color="warning.dark"
                  sx={{ fontSize: { xs: "1.2rem", sm: "2.125rem" } }}
                >
                  {stats.pendingForms}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Card
              elevation={statusFilter === "Needs Review" ? 6 : 3}
              onClick={() => handleStatusCardClick("Needs Review")}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                bgcolor:
                  statusFilter === "Needs Review"
                    ? "rgba(211, 47, 47, 0.12)"
                    : "rgba(211, 47, 47, 0.04)",
                borderLeft: "4px solid",
                borderColor: "error.main",
                ...(statusFilter === "Needs Review" && {
                  outline: "2px solid",
                  outlineColor: "error.main",
                }),
                animation:
                  stats.needsReviewForms > 0 && statusFilter !== "Needs Review"
                    ? "pulse 2s infinite"
                    : "none",
                "@keyframes pulse": {
                  "0%": {
                    boxShadow: "0 0 0 0 rgba(211, 47, 47, 0.4)",
                  },
                  "70%": {
                    boxShadow: "0 0 0 10px rgba(211, 47, 47, 0)",
                  },
                  "100%": {
                    boxShadow: "0 0 0 0 rgba(211, 47, 47, 0)",
                  },
                },
                "&::after":
                  statusFilter === "Needs Review"
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 16px 16px 0",
                        borderColor:
                          "transparent #D32F2F transparent transparent",
                      }
                    : {},
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  py: { xs: 1, sm: 3 },
                  px: { xs: 0.5, sm: 2 },
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="error.dark"
                  gutterBottom
                  fontWeight={
                    statusFilter === "Needs Review" ? "bold" : "medium"
                  }
                  sx={{ fontSize: { xs: "1rem", sm: "1rem" } }}
                >
                  Review
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  color="error.dark"
                  sx={{ fontSize: { xs: "1.2rem", sm: "2.125rem" } }}
                >
                  {stats.needsReviewForms}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Help Section */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            color="textSecondary"
            sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
          >
            Need help with{" "}
            {activeTab === 2 ? "standalone documents" : "intake forms"}?
          </Typography>
          <IconButton onClick={toggleHelp} color="primary" size="small">
            <HelpOutlineIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
        <Collapse in={helpOpen}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              paragraph
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              <strong>Quick Guide:</strong>
            </Typography>
            {activeTab === 2 ? (
              <Typography
                variant="body2"
                component="div"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                • Click the <strong>+ New Doc</strong> button to create a
                standalone document
                <br />
                • Standalone documents don't require going through the full
                intake process
                <br />
                • Use the search feature to find specific documents
                <br />• Click <strong>View</strong> to see document details or{" "}
                <strong>Edit</strong> to modify it
              </Typography>
            ) : (
              <Typography
                variant="body2"
                component="div"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                • Click the <strong>+ New Form</strong> button to create a new
                intake form
                <br />
                • Use the tabs to switch between your forms, all forms, and
                archived forms
                <br />
                • Click on the top cards to filter by form status
                <br />
                • Use the sort and filter icons in the table headers to organize
                your view
                <br />• Click <strong>View</strong> to see form details or{" "}
                <strong>Edit</strong> to modify it
                <br />• Use the actions menu (three dots) to change status or
                archive/unarchive forms
              </Typography>
            )}
          </Alert>
        </Collapse>
      </Box>

      {/* Forms Table */}
      <Paper
        elevation={3}
        sx={{
          p: 0,
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, bgcolor: "background.paper" }}>
          {/* Tabs integrated with table */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {activeTab === 2 ? "Documents" : "Intake Forms"}
              {statusFilter && activeTab !== 2 && (
                <Chip
                  label={`Filtered: ${statusFilter}`}
                  size="small"
                  color="primary"
                  onDelete={() => setStatusFilter("")}
                />
              )}
            </Typography>

            <Box
              sx={{
                overflow: "auto",
                flexGrow: 1,
                maxWidth: { sm: "75%", md: "80%" },
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant={isMobile || isTablet ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  minHeight: { xs: 36, sm: 48 },
                  "& .MuiTab-root": {
                    minHeight: { xs: 36, sm: 48 },
                    py: 0.5,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    px: { xs: 1, sm: 1.5, md: 2 },
                  },
                  maxWidth: "100%",
                }}
              >
                <Tab
                  label="My Forms"
                  icon={
                    <AssignmentIcon fontSize={isMobile ? "small" : "medium"} />
                  }
                  iconPosition="start"
                />
                {isAdmin() && (
                  <Tab
                    label="All Forms"
                    icon={
                      <PeopleIcon fontSize={isMobile ? "small" : "medium"} />
                    }
                    iconPosition="start"
                  />
                )}
                <Tab
                  label="Single Docs"
                  icon={
                    <DescriptionIcon fontSize={isMobile ? "small" : "medium"} />
                  }
                  iconPosition="start"
                />
                <Tab
                  label={
                    <Badge
                      badgeContent={
                        forms.filter((form) => form.archived).length
                      }
                      color="default"
                    >
                      Archived
                    </Badge>
                  }
                  icon={
                    <ArchiveIcon fontSize={isMobile ? "small" : "medium"} />
                  }
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Search field */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={
                activeTab === 2
                  ? "Search documents..."
                  : "Search by name, case number..."
              }
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      color="action"
                      fontSize={isMobile ? "small" : "medium"}
                    />
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
              size={isMobile ? "small" : "medium"}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Selected items action bar */}
          {selectedItems.length > 0 && (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                bgcolor: "primary.light",
                color: "white",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                {selectedItems.length} item
                {selectedItems.length !== 1 ? "s" : ""} selected
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() =>
                  handleBulkDeleteDialog(activeTab === 2 ? "document" : "form")
                }
                size={isMobile ? "small" : "medium"}
              >
                Delete Selected
              </Button>
            </Box>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    {activeTab === 2 ? (
                      // Standalone Documents Table Headers
                      <>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={
                              selectedItems.length > 0 &&
                              selectedItems.length <
                                filteredStandaloneDocuments.length
                            }
                            checked={
                              filteredStandaloneDocuments.length > 0 &&
                              selectedItems.length ===
                                filteredStandaloneDocuments.length
                            }
                            onChange={() =>
                              handleSelectAll(filteredStandaloneDocuments)
                            }
                            inputProps={{
                              "aria-label": "select all documents",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                        >
                          Document Title
                        </TableCell>
                        {!isMobile && (
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Created For
                          </TableCell>
                        )}
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                          onClick={handleToggleDateSort}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            Date
                            {dateSort === "asc" ? (
                              <ArrowUpwardIcon
                                fontSize="small"
                                sx={{ ml: 0.5 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                fontSize="small"
                                sx={{ ml: 0.5 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        {!isMobile && (
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Created By
                          </TableCell>
                        )}
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </>
                    ) : (
                      // Intake Forms Table Headers
                      <>
                        {activeTab === 3 && isAdmin() && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={
                                selectedItems.length > 0 &&
                                selectedItems.length < filteredForms.length
                              }
                              checked={
                                filteredForms.length > 0 &&
                                selectedItems.length === filteredForms.length
                              }
                              onChange={() => handleSelectAll(filteredForms)}
                              inputProps={{ "aria-label": "select all forms" }}
                            />
                          </TableCell>
                        )}
                        <TableCell
                          sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                        >
                          Client Name
                        </TableCell>
                        {!isMobile && (
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Case #
                          </TableCell>
                        )}
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                          onClick={handleToggleDateSort}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            Date
                            {dateSort === "asc" ? (
                              <ArrowUpwardIcon
                                fontSize="small"
                                sx={{ ml: 0.5 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                fontSize="small"
                                sx={{ ml: 0.5 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={handleOpenStatusFilter}
                          >
                            Status
                            <FilterListIcon
                              fontSize="small"
                              sx={{
                                ml: 0.5,
                                color: statusFilter
                                  ? "primary.main"
                                  : "inherit",
                              }}
                            />
                          </Box>
                          {/* Status Filter Popover */}
                          <Popover
                            open={Boolean(statusFilterAnchorEl)}
                            anchorEl={statusFilterAnchorEl}
                            onClose={handleCloseStatusFilter}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <Box sx={{ p: 1 }}>
                              <List dense sx={{ minWidth: 180 }}>
                                <ListItem
                                  button
                                  onClick={handleClearStatusFilter}
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={statusFilter === ""}
                                      disableRipple
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary="All Statuses" />
                                </ListItem>
                                <ListItem
                                  button
                                  onClick={() =>
                                    handleStatusFilterChange("In Progress")
                                  }
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={statusFilter === "In Progress"}
                                      disableRipple
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary="In Progress" />
                                </ListItem>
                                <ListItem
                                  button
                                  onClick={() =>
                                    handleStatusFilterChange("Pending")
                                  }
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={statusFilter === "Pending"}
                                      disableRipple
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary="Pending" />
                                </ListItem>
                                <ListItem
                                  button
                                  onClick={() =>
                                    handleStatusFilterChange("Needs Review")
                                  }
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={statusFilter === "Needs Review"}
                                      disableRipple
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary="Needs Review" />
                                </ListItem>
                                <ListItem
                                  button
                                  onClick={() =>
                                    handleStatusFilterChange("Completed")
                                  }
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={statusFilter === "Completed"}
                                      disableRipple
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary="Completed" />
                                </ListItem>
                              </List>
                            </Box>
                          </Popover>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeTab === 2 ? (
                    // Standalone Documents Table Body
                    filteredStandaloneDocuments.length > 0 ? (
                      filteredStandaloneDocuments.map((doc) => (
                        <TableRow
                          key={doc._id}
                          hover
                          onClick={(e) => {
                            // Prevent row click if clicking on checkbox or actions
                            if (
                              e.target.closest('input[type="checkbox"]') ||
                              e.target.closest("button")
                            ) {
                              return;
                            }
                            handleViewDocument(doc._id);
                          }}
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.04)",
                              cursor: "pointer",
                            },
                          }}
                        >
                          <TableCell
                            padding="checkbox"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={selectedItems.includes(doc._id)}
                              onChange={() => handleSelectItem(doc._id)}
                              inputProps={{ "aria-label": "select document" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <DescriptionIcon
                                color="action"
                                fontSize="small"
                                sx={{
                                  mr: 1,
                                  opacity: 0.7,
                                  display: { xs: "none", sm: "block" },
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                }}
                              >
                                {doc.title || "Untitled Document"}
                              </Typography>
                            </Box>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              {doc.createdFor || "Not specified"}
                            </TableCell>
                          )}
                          <TableCell>{formatDate(doc.createdAt)}</TableCell>
                          {!isMobile && (
                            <TableCell>
                              {doc.createdBy?.name || "Unknown"}
                            </TableCell>
                          )}
                          <TableCell
                            align="right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                flexWrap: "nowrap",
                                gap: 0.5,
                              }}
                            >
                              {!(isMobile || isTablet) && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  onClick={() => handleViewDocument(doc._id)}
                                >
                                  View
                                </Button>
                              )}
                              {isMobile || isTablet ? (
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    handleEditDocument(doc._id, true)
                                  }
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="primary"
                                  startIcon={<EditIcon />}
                                  onClick={() =>
                                    handleEditDocument(doc._id, true)
                                  }
                                >
                                  Edit
                                </Button>
                              )}
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handlePermanentDeleteDialog(doc, "document")
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={isMobile ? 4 : 6}
                          sx={{ py: 4, textAlign: "center" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              p: 3,
                            }}
                          >
                            <DescriptionIcon
                              color="action"
                              sx={{ fontSize: 60, mb: 2, opacity: 0.3 }}
                            />
                            <Typography variant="h6" gutterBottom>
                              No standalone documents found
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mb: 2 }}
                            >
                              Create standalone documents without going through
                              the full intake process
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => setShowDocumentSelector(true)}
                              size={isMobile ? "small" : "medium"}
                            >
                              Create Document
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  ) : // Intake Forms Table Body
                  filteredForms.length > 0 ? (
                    filteredForms.map((form) => (
                      <TableRow
                        key={form._id}
                        hover
                        onClick={(e) => {
                          // Prevent row click if clicking on checkbox or actions
                          if (
                            e.target.closest('input[type="checkbox"]') ||
                            e.target.closest("button")
                          ) {
                            return;
                          }
                          handleViewForm(form._id);
                        }}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                            cursor: "pointer",
                          },
                          bgcolor: form.archived
                            ? "rgba(0, 0, 0, 0.04)"
                            : "inherit",
                        }}
                      >
                        {activeTab === 3 && isAdmin() && (
                          <TableCell
                            padding="checkbox"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={selectedItems.includes(form._id)}
                              onChange={() => handleSelectItem(form._id)}
                              inputProps={{ "aria-label": "select form" }}
                            />
                          </TableCell>
                        )}
                        <TableCell
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          {form.name}
                        </TableCell>
                        {!isMobile && <TableCell>{form.caseNumber}</TableCell>}
                        <TableCell
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(form.createdAt)}
                        </TableCell>
                        <TableCell>{getStatusChip(form.status)}</TableCell>
                        <TableCell
                          align="right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              flexWrap: "nowrap",
                              gap: 0.5,
                            }}
                          >
                            {!(isMobile || isTablet) && (
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => handleViewForm(form._id)}
                              >
                                View
                              </Button>
                            )}
                            {isMobile || isTablet ? (
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditForm(form._id)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditForm(form._id)}
                              >
                                Edit
                              </Button>
                            )}
                            <IconButton
                              size="small"
                              onClick={(event) => handleMenuOpen(event, form)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : searchTerm || statusFilter ? (
                    <TableRow>
                      <TableCell
                        colSpan={activeTab === 3 && isAdmin() ? 6 : 5}
                        sx={{ py: 4, textAlign: "center" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            p: 3,
                          }}
                        >
                          <SearchIcon
                            color="action"
                            sx={{ fontSize: 60, mb: 2, opacity: 0.3 }}
                          />
                          <Typography variant="h6" gutterBottom>
                            No matching forms found
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 2 }}
                          >
                            Try adjusting your search criteria or filters
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              flexWrap: "wrap",
                              justifyContent: "center",
                            }}
                          >
                            {searchTerm && (
                              <Button
                                variant="outlined"
                                onClick={() => setSearchTerm("")}
                                startIcon={<ClearIcon />}
                                size={isMobile ? "small" : "medium"}
                              >
                                Clear Search
                              </Button>
                            )}
                            {statusFilter && (
                              <Button
                                variant="outlined"
                                onClick={() => setStatusFilter("")}
                                startIcon={<ClearIcon />}
                                size={isMobile ? "small" : "medium"}
                              >
                                Clear Filter
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={
                          isMobile ? 4 : activeTab === 3 && isAdmin() ? 6 : 5
                        }
                        sx={{ py: 4, textAlign: "center" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            p: 3,
                          }}
                        >
                          {activeTab === 3 ? (
                            <>
                              <ArchiveIcon
                                color="action"
                                sx={{ fontSize: 60, mb: 2, opacity: 0.3 }}
                              />
                              <Typography variant="h6" gutterBottom>
                                No archived forms found
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mb: 2 }}
                              >
                                Archived forms will appear here
                              </Typography>
                            </>
                          ) : (
                            <>
                              <AssignmentIcon
                                color="action"
                                sx={{ fontSize: 60, mb: 2, opacity: 0.3 }}
                              />
                              <Typography variant="h6" gutterBottom>
                                No forms found
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mb: 2 }}
                              >
                                Get started by creating your first intake form
                              </Typography>
                              <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleStartNewForm}
                                size={isMobile ? "small" : "medium"}
                              >
                                Create New Form
                              </Button>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Floating Action Button for new form */}
        <Zoom
          in={true}
          style={{
            transitionDelay: "300ms",
          }}
          unmountOnExit
        >
          <Fab
            color="secondary"
            aria-label={activeTab === 2 ? "add new document" : "add new form"}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              boxShadow: 3,
            }}
            onClick={
              activeTab === 2
                ? () => setShowDocumentSelector(true)
                : handleStartNewForm
            }
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </Paper>

      {/* Form Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemMUI onClick={handleStatusDialogOpen}>
          Change Status
        </MenuItemMUI>
        {selectedForm && !selectedForm.archived ? (
          <MenuItemMUI onClick={() => handleArchiveDialogOpen("archive")}>
            <ArchiveIcon fontSize="small" sx={{ mr: 1 }} />
            Archive Form
          </MenuItemMUI>
        ) : (
          <MenuItemMUI onClick={() => handleArchiveDialogOpen("unarchive")}>
            <UnarchiveIcon fontSize="small" sx={{ mr: 1 }} />
            Unarchive Form
          </MenuItemMUI>
        )}
        {selectedForm && selectedForm.archived && isAdmin() && (
          <MenuItemMUI
            onClick={() => handlePermanentDeleteDialog(selectedForm, "form")}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary="Permanently Delete" />
          </MenuItemMUI>
        )}
      </Menu>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose}>
        <DialogTitle>Update Form Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a new status for this form:
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Needs Review">Needs Review</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={archiveDialogOpen} onClose={handleArchiveDialogClose}>
        <DialogTitle>
          {archiveAction === "archive" ? "Archive Form" : "Unarchive Form"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {archiveAction === "archive"
              ? "Are you sure you want to archive this form? Archived forms will be moved to the Archive tab."
              : "Are you sure you want to unarchive this form? It will be restored to its original location."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleArchiveDialogClose}>Cancel</Button>
          <Button
            onClick={handleToggleArchive}
            variant="contained"
            color={archiveAction === "archive" ? "warning" : "primary"}
          >
            {archiveAction === "archive" ? "Archive" : "Unarchive"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle sx={{ color: "error.main" }}>
          {permanentDeleteItem
            ? "Permanently Delete Item"
            : "Permanently Delete Selected Items"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {permanentDeleteItem
              ? `Are you sure you want to permanently delete ${
                  selectedItemType === "form" ? "this form" : "this document"
                }? This action cannot be undone.`
              : `Are you sure you want to permanently delete ${
                  selectedItems.length
                } selected ${
                  selectedItemType === "form" ? "forms" : "documents"
                }? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Type Selector Dialog */}
      <DocumentTypeSelector
        open={showDocumentSelector}
        onClose={() => setShowDocumentSelector(false)}
        onSelectDocument={handleSelectDocument}
      />

      {/* Success Message Snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        message={successMessage}
      />
    </Container>
  );
};

export default Dashboard;
