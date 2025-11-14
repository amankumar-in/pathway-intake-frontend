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
import DashboardStatsCards from "../components/dashboard/DashboardStatsCards";
import StatusChangeDialog from "../components/dashboard/StatusChangeDialog";
import ArchiveConfirmationDialog from "../components/dashboard/ArchiveConfirmationDialog";
import DeleteConfirmationDialog from "../components/dashboard/DeleteConfirmationDialog";
import StandaloneDocumentsTableBody from "../components/dashboard/StandaloneDocumentsTableBody";
import IntakeFormsTableBody from "../components/dashboard/IntakeFormsTableBody";
import {
  formatDate,
  getStatusChip,
  calculateStats,
  getFilteredForms,
  getFilteredStandaloneDocuments,
} from "../utils/dashboardHelpers";

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

  const stats = calculateStats(forms, activeTab, user, isAdmin);
  const filteredForms = getFilteredForms(
    forms,
    activeTab,
    user,
    isAdmin,
    searchTerm,
    statusFilter,
    dateSort
  );
  const filteredStandaloneDocuments = getFilteredStandaloneDocuments(
    standaloneDocuments,
    user,
    isAdmin,
    searchTerm,
    dateSort
  );

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
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              mb: 0,
            }}
          >
            Welcome, {user?.name ? user.name.split(" ")[0] : "User"}!
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{
              fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
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
              fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.875rem" },
              px: { xs: 1, sm: 1.5 },
            }}
          >
            New Form
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setShowDocumentSelector(true)}
            size="small"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.875rem" },
              px: { xs: 1, sm: 1.5 },
            }}
          >
            {isMobile ? "Doc" : "New Doc"}
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <DashboardStatsCards
        stats={stats}
        statusFilter={statusFilter}
        onStatusCardClick={handleStatusCardClick}
        activeTab={activeTab}
      />

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
            sx={{ fontSize: { xs: "0.875rem", sm: "0.95rem" } }}
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
                  minHeight: { xs: 40, sm: 48 },
                  "& .MuiTab-root": {
                    minHeight: { xs: 40, sm: 48 },
                    py: { xs: 1, sm: 0.5 },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    px: { xs: 0.75, sm: 1.5, md: 2 },
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
                          sx={{ fontWeight: "bold", whiteSpace: "nowrap", fontSize: { xs: "0.875rem", sm: "1rem" } }}
                        >
                          Document Title
                        </TableCell>
                        {!isMobile && (
                          <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                            Created For
                          </TableCell>
                        )}
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
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
                          <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                            Created By
                          </TableCell>
                        )}
                        <TableCell align="right" sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
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
                          sx={{ fontWeight: "bold", whiteSpace: "nowrap", fontSize: { xs: "0.875rem", sm: "1rem" } }}
                        >
                          Client Name
                        </TableCell>
                        {!isMobile && (
                          <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                            Case #
                          </TableCell>
                        )}
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
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
                        <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
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
                        {isAdmin() && !isMobile && (
                          <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                            Created By
                          </TableCell>
                        )}
                        <TableCell align="right" sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Actions
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                {activeTab === 2 ? (
                  <StandaloneDocumentsTableBody
                    documents={filteredStandaloneDocuments}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    selectedItems={selectedItems}
                    formatDate={formatDate}
                    onViewDocument={handleViewDocument}
                    onEditDocument={handleEditDocument}
                    onSelectItem={handleSelectItem}
                    onPermanentDeleteDialog={handlePermanentDeleteDialog}
                    onCreateDocument={() => setShowDocumentSelector(true)}
                  />
                ) : (
                  <IntakeFormsTableBody
                    forms={filteredForms}
                    activeTab={activeTab}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isAdmin={isAdmin()}
                    selectedItems={selectedItems}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    formatDate={formatDate}
                    getStatusChip={getStatusChip}
                    onViewForm={handleViewForm}
                    onEditForm={handleEditForm}
                    onSelectItem={handleSelectItem}
                    onMenuOpen={handleMenuOpen}
                    onStartNewForm={handleStartNewForm}
                    onClearSearch={() => setSearchTerm("")}
                    onClearStatusFilter={() => setStatusFilter("")}
                  />
                )}
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
      <StatusChangeDialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
        newStatus={newStatus}
        onStatusChange={handleStatusChange}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Archive Confirmation Dialog */}
      <ArchiveConfirmationDialog
        open={archiveDialogOpen}
        onClose={handleArchiveDialogClose}
        archiveAction={archiveAction}
        onConfirm={handleToggleArchive}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        permanentDeleteItem={permanentDeleteItem}
        selectedItemType={selectedItemType}
        selectedItemsCount={selectedItems.length}
        onConfirm={handleConfirmDelete}
      />

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
