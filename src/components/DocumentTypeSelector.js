import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  LocalHospital as MedicalIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  Gavel as GavelIcon,
  Logout as LogoutIcon,
  History as HistoryIcon,
  ListAlt as ListAltIcon,
  ContactEmergency as ContactEmergencyIcon,
  EmojiEmotions as DentalIcon,
} from "@mui/icons-material";

// todo Document templates from documentMapper- id is for frontend use, get actual template from controller
const documentTemplates = [
  {
    id: "noa",
    title: "Notice of Action",
    template: "N.O.A.",
    category: "Intake Paperwork",
    icon: <AssignmentIcon />,
    description: "Official notice of action or decision regarding a case",
  },
  {
    id: "id-emergency",
    title: "ID-Emergency Information",
    template: "ID-Emergency Info",
    category: "Intake Paperwork",
    icon: <MedicalIcon />,
    description: "Contains important emergency contact and medical information",
  },
  {
    id: "agency-agency",
    title: "Agency to Agency Agreement",
    template: "Agency to Agency Agreement",
    category: "Intake Paperwork",
    icon: <HomeIcon />,
    description: "Agreement between two agencies regarding case management",
  },
  {
    id: "agency-foster",
    title: "Agency to Foster Parent",
    template: "Agency to Foster Parent",
    category: "Shelter Bed Documents",
    icon: <PersonIcon />,
    description: "Agreement between agency and foster parents for placement",
  },
  {
    id: "client-grievance",
    title: "Client Grievance Guidelines",
    template: "Client Grievance Guidelines",
    category: "In House Move",
    icon: <DescriptionIcon />,
    description: "Guidelines for handling client grievances and complaints",
  },
  {
    id: "county-grievance",
    title: "County Worker Grievance Guidelines",
    template: "County Worker Grievance Guidelines",
    category: "Intake Paperwork",
    icon: <DescriptionIcon />,
    description: "Guidelines for handling county worker grievances",
  },
  {
    id: "chpd",
    title: "CHDP Form",
    template: "CHPD",
    category: "Intake Paperwork",
    icon: <MedicalIcon />,
    description: "Child Health and Disability Prevention program form",
  },
  {
    id: "medical-treatment",
    title: "Consent For Medical Treatment",
    template: "Medical Treatment",
    category: "In House Move",
    icon: <MedicalIcon />,
    description: "Consent form for medical treatment of a minor",
  },
  {
    id: "prn-auth-letter",
    title: "PRN Authorization Letter",
    template: "PRN Authorization Letter",
    category: "Intake Paperwork",
    icon: <MedicalIcon />,
    description:
      "Authorization letter for PRN medications from medical professional",
  },
  {
    id: "prn-page-2",
    title: "PRN Page 2",
    template: "PRN Page 2",
    category: "Intake Paperwork",
    icon: <MedicalIcon />,
    description:
      "Medical professional's checklist of recommended OTC medications for PRN administration",
  },
  {
    id: "client-personal-rights",
    title: "Client Personal Rights",
    template: "Client Personal Rights",
    category: "Intake Paperwork",
    icon: <DescriptionIcon />,
    description:
      "Document outlining the personal rights of a client as required by California regulations",
  },
  {
    id: "confirm-tb-test",
    title: "Confirmation of T.B. Test",
    template: "Confirm TB Test",
    category: "Intake Paperwork",
    icon: <MedicalIcon />,
    description: "Required TB test certification for a child",
  },
  {
    id: "ambulatory-status",
    title: "Confirmation of Ambulatory Status",
    template: "Confirm Ambulatory Status",
    category: "Intake Paperwork",
    icon: <MedicalIcon />,
    description:
      "Certificate confirming ambulatory status examination by a medical professional",
  },
  {
    id: "client-cash-resources",
    title: "Record of Client Cash Resources",
    template: "Record of Client Cash Resources",
    category: "Intake Paperwork",
    icon: <AttachMoneyIcon />,
    description:
      "Tracks client's cash transactions and resources while in foster care",
  },
  {
    id: "client-initial-care-plan",
    title: "Client Initial Care Plan",
    template: "Client Initial Care Plan",
    category: "In House Move",
    icon: <AssignmentIcon />,
    description:
      "Documents the initial care plan, needs assessment, and scheduled appointments for the client",
  },
  {
    id: "client-disciplinary",
    title: "Client Disciplinary Policy & Procedures",
    template: "Client Disciplinary P. & P.",
    category: "Shelter Bed Documents",
    icon: <GavelIcon />,
    description:
      "Outlines disciplinary policies and procedures for clients in foster care",
  },
  {
    id: "client-discharge",
    title: "Client Discharge",
    template: "Client Discharge",
    category: "Shelter Bed Documents",
    icon: <LogoutIcon />,
    description:
      "Policies and procedures regarding client discharge or removal",
  },
  {
    id: "acknowledgement-prior-info",
    title: "Acknowledgement of Prior Information",
    template: "Acknowledgement of Prior Info",
    category: "Shelter Bed Documents",
    icon: <HistoryIcon />,
    description:
      "Statement accepting responsibility for child placement without reviewing complete history",
  },
  {
    id: "home-placement-log",
    title: "Home Placement Log",
    template: "Home Placement Log",
    category: "In House Move",
    icon: <ListAltIcon />,
    description:
      "Log tracking all client placements in the home with dates of intake and termination",
  },
  {
    id: "emergency-information-log",
    title: "Emergency Information Log",
    template: "Emergency Information Log",
    category: "Intake Paperwork",
    icon: <ContactEmergencyIcon />,
    description: "Comprehensive emergency contact information for the client",
  },
  {
    id: "medication-record",
    title: "Monthly Medication Record",
    template: "Monthly Medication Record",
    category: "Intake Paperwork",
    icon: <MedicalIcon />,
    description: "Monthly record to track medication administration",
  },
  {
    id: "medication-destruction",
    title: "Medication & Destruction Record",
    template: "Medication & Destruction Record",
    category: "Intake Paperwork",
    icon: <MedicalIcon />,
    description: "Records centrally stored medications and proper destruction",
  },
  {
    id: "dental-treatment",
    title: "Dental Treatment Record",
    template: "Dental Treatment Record",
    category: "Intake Paperwork",
    icon: <DentalIcon />,
    description: "Record of dental examinations and treatments for a client",
  },
  {
    id: "ca-form",
    title: "Quarterly Clothing Allowance",
    template: "CA Form",
    category: "In House Move",
    icon: <AttachMoneyIcon />,
    description: "Track clothing allowance funds on a quarterly basis",
  },
  {
    id: "sa-form",
    title: "Quarterly Spending Allowance",
    template: "Spending Allowance",
    category: "In House Move",
    icon: <AttachMoneyIcon />,
    description: "Track spending allowance funds on a quarterly basis",
  },
  {
    id: "crmcia",
    title: "Consent to Release Medical/Confidential Information Authorization",
    template: "CRMCIA",
    category: "Shelter Bed Documents",
    icon: <DescriptionIcon />,
    description:
      "Authorization for releasing medical and confidential information of the client",
  },
  {
    id: "placement-application",
    title: "Placement Application",
    template: "Placement Application",
    category: "Intake Paperwork",
    icon: <DescriptionIcon />,
    description:
      "Detailed application for client placement with relevant history and needs",
  },
  {
    id: "checklist",
    title: "Foster Parent Checklist",
    template: "Checklist",
    category: "Intake Paperwork",
    icon: <AssignmentIcon />,
    description:
      "Checklist of required tasks for foster parents after new placement",
  },
];

// Document categories with colors
const categories = [
  {
    id: "all",
    label: "All Documents",
    color: "#5c6bc0",
  },
  {
    id: "Intake Paperwork",
    label: "Intake Paperwork",
    color: "#ec407a",
  },
  {
    id: "Shelter Bed Documents",
    label: "Shelter Bed Documents",
    color: "#26a69a",
  },
  {
    id: "In House Move",
    label: "In House Move",
    color: "#ffa726",
  },
];

const DocumentTypeSelector = ({ open, onClose, onSelectDocument }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdFor, setCreatedFor] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Reset state when dialog opens or closes - this fixes the loading state issue
  useEffect(() => {
    if (open) {
      // Reset states when dialog opens
      setLoading(false);
      setCreatedFor("");
      setSelectedDocument(null);
    }
  }, [open]);

  // Filter documents based on search term and active tab
  const filteredDocuments = documentTemplates.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === "all" || doc.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  // Handle document selection
  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle final document confirmation
  const handleConfirm = () => {
    if (!selectedDocument) {
      return;
    }

    if (!createdFor.trim()) {
      // You could add validation error handling here
      return;
    }

    setLoading(true);

    // Prepare document data
    const documentData = {
      title: selectedDocument.title,
      template: selectedDocument.template,
      category: selectedDocument.category,
      createdFor: createdFor,
      formData: {
        template: selectedDocument.template,
      },
    };

    // Call the parent function to handle document creation
    onSelectDocument(documentData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      {/* Title with search field on same row (horizontal layout) */}
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 2,
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
            <AddIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Create New Standalone Document</Typography>
          </Box>

          <TextField
            placeholder="Search Documents"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: "40%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "rgba(255,255,255,0.15)",
                color: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.5)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.7)",
                },
                "& .MuiInputAdornment-root": {
                  color: "rgba(255,255,255,0.7)",
                },
                "& input::placeholder": {
                  color: "rgba(255,255,255,0.7)",
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          height: "60vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* "Created For" field moved to top */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Who is this document for?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter information about who this document is being created for
            (e.g., client name, case number, or purpose). This will help
            identify the document later.
          </Typography>
          <TextField
            fullWidth
            label="Created For"
            variant="outlined"
            value={createdFor}
            onChange={(e) => setCreatedFor(e.target.value)}
            placeholder="e.g., John Smith, Case #12345, Emergency Placement"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="document categories"
          >
            {categories.map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                label={category.label}
                sx={{
                  "&.Mui-selected": {
                    color: category.color,
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Document Grid - smaller cards with fixed height scrollable container */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            mt: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <Card
                    variant={
                      selectedDocument && selectedDocument.id === doc.id
                        ? "elevation"
                        : "outlined"
                    }
                    sx={{
                      borderRadius: 1.5,
                      borderColor:
                        selectedDocument && selectedDocument.id === doc.id
                          ? "primary.main"
                          : "divider",
                      borderWidth:
                        selectedDocument && selectedDocument.id === doc.id
                          ? 2
                          : 1,
                      boxShadow:
                        selectedDocument && selectedDocument.id === doc.id
                          ? 4
                          : 0,
                      backgroundColor:
                        selectedDocument && selectedDocument.id === doc.id
                          ? "rgba(25, 118, 210, 0.07)"
                          : "background.paper",
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleSelectDocument(doc)}
                      sx={{ p: 1.5 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            color: "white",
                            bgcolor:
                              doc.category === "Intake Paperwork"
                                ? "#ec407a"
                                : doc.category === "Shelter Bed Documents"
                                ? "#26a69a"
                                : "#ffa726",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1,
                            "& svg": {
                              fontSize: "1rem",
                            },
                          }}
                        >
                          {doc.icon}
                        </Box>
                        <Typography
                          variant="subtitle2"
                          component="div"
                          fontWeight="medium"
                          sx={{
                            color:
                              selectedDocument && selectedDocument.id === doc.id
                                ? "primary.main"
                                : "text.primary",
                            fontSize: "0.875rem",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doc.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          fontSize: "0.75rem",
                          lineHeight: 1.3,
                          height: "2.6em",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {doc.description}
                      </Typography>
                      <Divider sx={{ my: 0.75 }} />
                      <Typography
                        variant="caption"
                        sx={{
                          display: "inline-block",
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 0.75,
                          bgcolor:
                            doc.category === "Intake Paperwork"
                              ? "#fce4ec"
                              : doc.category === "Shelter Bed Documents"
                              ? "#e0f2f1"
                              : "#fff3e0",
                          color:
                            doc.category === "Intake Paperwork"
                              ? "#c2185b"
                              : doc.category === "Shelter Bed Documents"
                              ? "#00796b"
                              : "#ef6c00",
                          fontSize: "0.7rem",
                        }}
                      >
                        {doc.category}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">
                  No documents found matching your search criteria.
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          disabled={!selectedDocument || !createdFor.trim() || loading}
        >
          {loading ? "Creating..." : "Create Document"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentTypeSelector;
