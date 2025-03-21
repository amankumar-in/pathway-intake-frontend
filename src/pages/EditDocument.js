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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

      <Paper
        elevation={3}
        sx={{
          p: 0,
          borderRadius: 2,
          overflow: "hidden",
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
              <Typography
                variant="h5"
                component="h1"
                fontWeight="medium"
                color="primary.main"
              >
                Editing: {documentTitle}
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
                <Chip
                  size="small"
                  icon={<DescriptionIcon fontSize="small" />}
                  label={`Type: ${templateType || "Standard"}`}
                  variant="outlined"
                />
                {document?.createdAt && (
                  <Chip
                    size="small"
                    icon={<InfoIcon fontSize="small" />}
                    label={`Created: ${formatDate(document.createdAt)}`}
                    variant="outlined"
                    color="default"
                  />
                )}
                {hasChanges && (
                  <Chip
                    size="small"
                    icon={<EditIcon fontSize="small" />}
                    label="Unsaved changes"
                    color="warning"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              sx={{ mr: 2 }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              color={hasChanges ? "primary" : "success"}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>

        {/* Show saving progress if saving */}
        {saving && (
          <LinearProgress
            sx={{
              height: 4,
              borderRadius: 0,
            }}
          />
        )}

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

        {/* Form content */}
        <Box sx={{ p: 3 }}>
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

          <Card
            variant="outlined"
            sx={{
              mb: 4,
              borderRadius: 2,
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.light,
                color: "white",
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                Document Information
              </Typography>
            </Box>
            <CardContent>
              {/* Form for editing document */}
              <Box component="form">
                {formData &&
                  formData.template &&
                  getFormComponent(
                    formData.template,
                    formData,
                    handleInputChange
                  )}
              </Box>
            </CardContent>
          </Card>

          {/* Action buttons (bottom) */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                position: "relative",
                minWidth: "140px",
              }}
            >
              {saving ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  Saving...
                </Box>
              ) : (
                "Save Changes"
              )}

              {saving && (
                <LinearProgress
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                  }}
                />
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditDocument;
