// This page is most likely not used.
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { getDocument, exportDocumentToPDF } from "../utils/api";

const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        console.log("Fetching document with ID:", id);
        const response = await getDocument(id);
        console.log("Document data:", response);
        setDocument(response.data);
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

  // Export document as PDF
  const handleExportPDF = async () => {
    try {
      await exportDocumentToPDF(id);
    } catch (err) {
      setError("Error exporting PDF: " + err.message);
    }
  };

  // Navigate to edit document form
  const handleEditDocument = () => {
    navigate(`/edit-document/${id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading document...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Alert severity="error">{error}</Alert>
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
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">Document not found</Typography>
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header with back button */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {document.title}
            </Typography>
            <Typography variant="body1">
              {intakeForm.name ? `Client: ${intakeForm.name}` : ""}{" "}
              {intakeForm.caseNumber ? `| Case: ${intakeForm.caseNumber}` : ""}
            </Typography>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditDocument}
          >
            Edit Document
          </Button>
          <Button
            variant="outlined"
            startIcon={<PdfIcon />}
            onClick={handleExportPDF}
          >
            Export as PDF
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Document content - Replace this with your actual document template rendering */}
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {document.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Category: {document.category}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* This is a placeholder for the actual document content */}
          {/* You'll replace this with your document-specific template rendering */}
          <Typography variant="body1" paragraph>
            This is where the specific document content will be rendered based
            on the template type: <strong>{formData.template}</strong>
          </Typography>

          <Typography variant="body1" paragraph>
            For each document type, you'll need to create a specific component
            that formats the data according to the document template.
          </Typography>

          {/* Example of how to display form data */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Form Data Preview:
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Client Name:</Typography>
                <Typography variant="body2">{formData.name}</Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Case Number:</Typography>
                <Typography variant="body2">{formData.caseNumber}</Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Placement Date:</Typography>
                <Typography variant="body2">
                  {formData.transactionDate &&
                    new Date(formData.transactionDate).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Placeholder for signature area */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Signatures
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              This area will display signatures placed on the document. You'll
              need to implement a UI for adding/viewing signatures.
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewDocument;
