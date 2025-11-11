import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormComponent } from "../utils/documentMapper";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Snackbar,
  LinearProgress,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Check as CheckIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { getDocument, updateDocument } from "../utils/api";

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [document, setDocument] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await getDocument(id);
        console.log("Document data:", response.data);

        setDocument(response.data);

        // Initialize formData with ALL fields, both from the document and any manual fields
        // that might already exist or need to be added
        setFormData({
          ...response.data.formData,
          // Make sure these fields are initialized even if they don't exist yet
          bedCapacity: response.data.formData?.bedCapacity || "",
          certifiedAgesFrom: response.data.formData?.certifiedAgesFrom || "",
          certifiedAgesTo: response.data.formData?.certifiedAgesTo || "",
          certificationDateFrom:
            response.data.formData?.certificationDateFrom || "",
          certificationDateTo:
            response.data.formData?.certificationDateTo || "",
          actionsApprovedBy: response.data.formData?.actionsApprovedBy || "",
          approvalDate: response.data.formData?.approvalDate || "",
          notes: response.data.formData?.notes || "",
          supervisorsInitials:
            response.data.formData?.supervisorsInitials || "",
        });
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
  }, [id]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(`Field ${name} changed to:`, value);

    // Mark that changes have been made
    setHasChanges(true);

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

  // Save document changes
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaveMessage("Saving document...");

      console.log("Saving form data:", formData);
      console.log("Template before saving:", formData.template);

      // CRITICAL FIX: Make sure the template field is preserved
      // Without this, the document view won't know which template to use
      if (!formData.template && document?.formData?.template) {
        console.log("Preserving template:", document.formData.template);
        formData.template = document.formData.template;
      }

      // Make sure we're sending the data in the correct structure
      // The API expects { formData: {...} }
      await updateDocument(id, formData);

      setSaveSuccess(true);
      setSaveMessage("Document saved successfully!");
      setHasChanges(false);

      // Show success message before redirecting
      setTimeout(() => {
        // Navigate back to view document
        navigate(`/view-document/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error saving document:", err);
      setError(
        "Error saving document: " + (err.response?.data?.message || err.message)
      );
      setSaving(false);
      setSaveMessage("");
    }
  };

  // Handle cancel with confirmation if there are unsaved changes
  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        navigate(`/view-document/${id}`);
      }
    } else {
      navigate(`/view-document/${id}`);
    }
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

  // Get the template type from formData
  const templateType = formData.template || "";
  const documentTitle = document?.title || "Document";
  const intakeForm = document?.intakeForm || {};

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: isMobile ? 2 : 4,
        mb: isMobile ? 3 : 4,
        px: isMobile ? 1 : 2,
      }}
    >
      {/* Saving success message */}
      <Snackbar
        open={!!saveMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {saving ? (
              <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
            ) : saveSuccess ? (
              <CheckIcon fontSize="small" sx={{ mr: 1 }} />
            ) : null}
            {saveMessage}
          </Box>
        }
      />

      {isMobile ? (
        <Box>
          {/* Header - Mobile vs Desktop Layout */}
          <>
            {/* Mobile Header: Row 1 - Title and back button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                mt: 1,
              }}
            >
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  mr: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  padding: 1,
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="h6"
                component="h1"
                fontWeight="medium"
                color="primary.main"
                sx={{ fontSize: "1rem" }}
              >
                Editing: {documentTitle}
              </Typography>
            </Box>

            {/* Mobile Header: Row 2 - Chips */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                mb: 1.5,
                ml: 0.5,
              }}
            >
              {intakeForm.name && (
                <Chip
                  size="small"
                  icon={<PersonIcon fontSize="small" />}
                  label={`Client: ${intakeForm.name}`}
                  variant="outlined"
                  sx={{
                    height: 24,
                    "& .MuiChip-label": { fontSize: "0.7rem" },
                  }}
                />
              )}
              <Chip
                size="small"
                icon={<DescriptionIcon fontSize="small" />}
                label={`Type: ${templateType || "Standard"}`}
                variant="outlined"
                sx={{ height: 24, "& .MuiChip-label": { fontSize: "0.7rem" } }}
              />
              {document?.createdAt && (
                <Chip
                  size="small"
                  icon={<InfoIcon fontSize="small" />}
                  label={`Created: ${formatDate(document.createdAt)}`}
                  variant="outlined"
                  color="default"
                  sx={{
                    height: 24,
                    "& .MuiChip-label": { fontSize: "0.7rem" },
                  }}
                />
              )}
              {hasChanges && (
                <Chip
                  size="small"
                  icon={<EditIcon fontSize="small" />}
                  label="Unsaved changes"
                  color="warning"
                  variant="outlined"
                  sx={{
                    height: 24,
                    "& .MuiChip-label": { fontSize: "0.7rem" },
                  }}
                />
              )}
            </Box>

            {/* Mobile Header: Row 3 - Action buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleCancel}
                disabled={saving}
                size="small"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                color={hasChanges ? "primary" : "success"}
                size="small"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </Box>
          </>

          {/* Form content - Mobile */}
          <Box sx={{ p: 0, mt: 1 }}>
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{ mb: 3, borderRadius: 1 }}
              >
                {error}
              </Alert>
            )}

            {hasChanges && (
              <Alert
                severity="info"
                sx={{ mb: 3, borderRadius: 1 }}
                icon={<EditIcon />}
              >
                You have unsaved changes. Be sure to save before leaving this
                page.
              </Alert>
            )}

            {getFormComponent(templateType, formData, handleInputChange)}
          </Box>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 0,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Desktop Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  mr: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 0.5 }}>
                  Editing: {documentTitle}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {intakeForm.name && (
                    <Chip
                      size="small"
                      icon={<PersonIcon fontSize="small" />}
                      label={`Client: ${intakeForm.name}`}
                      variant="outlined"
                    />
                  )}
                  <Chip
                    size="small"
                    label={templateType}
                    color="primary"
                  />
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving || !hasChanges}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>

          {/* Form content - Desktop */}
          <Box sx={{ p: 3 }}>
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{ mb: 3, borderRadius: 1 }}
              >
                {error}
              </Alert>
            )}

            {hasChanges && (
              <Alert
                severity="info"
                sx={{ mb: 3, borderRadius: 1 }}
                icon={<EditIcon />}
              >
                You have unsaved changes. Be sure to save before leaving this
                page.
              </Alert>
            )}

            {getFormComponent(templateType, formData, handleInputChange)}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default EditDocument;
