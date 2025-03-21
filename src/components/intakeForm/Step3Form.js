import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  ChildCare as ChildIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from "@mui/icons-material";

const Step3Form = ({ formData, goToStep }) => {
  const [expandedSection, setExpandedSection] = useState("office");

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Sections definitions for the accordion
  const sections = [
    {
      id: "office",
      title: "Office Information",
      icon: <BusinessIcon />,
      color: "primary.main",
      fields: [
        { label: "Your Name", value: formData.yourName },
        { label: "Office", value: formData.office },
        { label: "Date Submitted", value: formatDate(formData.dateSubmitted) },
        {
          label: "Placement Date",
          value: formatDate(formData.transactionDate),
        },
        { label: "Type of Placement", value: formData.typeOfTransaction },
      ],
    },
    {
      id: "representative",
      title: "Case Assigned To",
      icon: <PersonIcon />,
      color: "secondary.main",
      fields: [
        {
          label: "Pathway Representative",
          value: formData.pathwayRepresentative,
        },
        { label: "Position/Job Title", value: formData.positionJobTitle },
        {
          label: "Intake Representative",
          value: formData.intakeRepresentative,
        },
        { label: "Office #", value: formData.officeNumber },
        { label: "Phone Number", value: formData.phoneNumber },
      ],
    },
    {
      id: "client",
      title: "Client Information",
      icon: <ChildIcon />,
      color: "info.main",
      fields: [
        { label: "Case Number", value: formData.caseNumber },
        { label: "Name", value: formData.name },
        { label: "Age", value: formData.age },
        { label: "Date of Birth", value: formatDate(formData.dateOfBirth) },
        { label: "Ethnicity", value: formData.ethnicity },
        { label: "Gender", value: formData.gender },
        { label: "Status", value: formData.clientStatus },
        { label: "Prior Placement", value: formData.priorPlacement },
        { label: "Reason for Placement", value: formData.reasonForPlacement },
        { label: "Level of Care", value: formData.levelOfCare },
      ],
    },
    {
      id: "mother-baby",
      title: "Mother/Baby Information",
      icon: <ChildIcon />,
      color: "warning.main",
      fields: [
        { label: "Infant Full Name", value: formData.infantFullName || "-" },
        {
          label: "Infant Date of Birth",
          value: formatDate(formData.infantDateOfBirth) || "-",
        },
        { label: "Infant Age", value: formData.infantAge || "-" },
        {
          label: "Infant Intake Date",
          value: formatDate(formData.infantIntakeDate) || "-",
        },
        { label: "Infant Gender", value: formData.infantGender || "-" },
        { label: "Infant Ethnicity", value: formData.infantEthnicity || "-" },
      ],
      condition: !!formData.infantFullName,
    },
    {
      id: "Resource-home",
      title: "Resource Home Information",
      icon: <HomeIcon />,
      color: "success.main",
      fields: [
        {
          label: "Resource Parents Payment",
          value: formData.ResourceParentsPayment,
        },
        {
          label: "Name of Resource Parents",
          value: formData.nameOfResourceParents,
        },
        { label: "Telephone Number", value: formData.ResourceParentsTelephone },
        { label: "Address", value: formData.ResourceParentsAddress },
        {
          label: "Mailing Address",
          value: formData.ResourceParentsMailingAddress || "Same as above",
        },
        { label: "City", value: formData.ResourceParentsCity },
        { label: "State", value: formData.ResourceParentsState },
        { label: "Zip", value: formData.ResourceParentsZip },
      ],
    },
    {
      id: "county-worker",
      title: "County Worker Information",
      icon: <WorkIcon />,
      color: "error.main",
      fields: [
        { label: "County Will Pay", value: formData.countyWillPay },
        { label: "County Worker Name", value: formData.countyWorkerName },
        { label: "County Worker Title", value: formData.countyWorkerTitle },
        { label: "Name of County", value: formData.nameOfCounty },
        { label: "Name of Department", value: formData.nameOfDepartment },
        { label: "Telephone Number", value: formData.countyWorkerTelephone },
        { label: "Address", value: formData.countyWorkerAddress },
        { label: "City", value: formData.countyWorkerCity },
        { label: "State", value: formData.countyWorkerState },
        { label: "Zip", value: formData.countyWorkerZip },
      ],
    },
  ];

  // Filter sections that should be shown
  const sectionsToShow = sections.filter(
    (section) => !section.condition || section.condition === true
  );

  // Check for required fields that aren't filled
  const requiredFields = [
    { name: "yourName", label: "Your Name", section: "office" },
    { name: "transactionDate", label: "Placement Date", section: "office" },
    {
      name: "typeOfTransaction",
      label: "Type of Placement",
      section: "office",
    },
    { name: "caseNumber", label: "Case Number", section: "client" },
    { name: "name", label: "Client Name", section: "client" },
    { name: "dateOfBirth", label: "Date of Birth", section: "client" },
    { name: "gender", label: "Gender", section: "client" },
    {
      name: "reasonForPlacement",
      label: "Reason for Placement",
      section: "client",
    },
    { name: "levelOfCare", label: "Level of Care", section: "client" },
    {
      name: "countyWorkerName",
      label: "County Worker Name",
      section: "county-worker",
    },
  ];

  const missingFields = requiredFields.filter(
    (field) => !formData[field.name] || formData[field.name] === ""
  );

  // Group missing fields by section
  const missingFieldsBySection = missingFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {});

  // Function to handle edit button clicks
  const handleEdit = (sectionIndex) => {
    // This would navigate back to the appropriate step
    if (goToStep) {
      if (sectionIndex <= 1) {
        goToStep(0);
      } else if (sectionIndex >= 4) {
        goToStep(1);
      }
    }
  };

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{
          mb: 4,
          borderRadius: 2,
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Review Intake Form
          </Typography>
          <Typography variant="body1">
            Please review all information below before submitting. You can edit
            by clicking on the edit button in each section.
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {missingFields.length > 0 && (
            <Alert
              severity="warning"
              variant="filled"
              sx={{
                mb: 3,
                borderRadius: 1,
                fontWeight: "medium",
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                There are {missingFields.length} required fields that need to be
                completed:
              </Typography>
              <Box sx={{ mt: 1 }}>
                {Object.entries(missingFieldsBySection).map(
                  ([section, fields]) => {
                    const sectionData = sections.find((s) => s.id === section);
                    return (
                      <Box key={section} sx={{ mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {sectionData?.title}:
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            sx={{
                              ml: 1,
                              fontSize: "0.7rem",
                              borderColor: "rgba(255,255,255,0.5)",
                            }}
                            onClick={() => {
                              const sectionIndex = sections.findIndex(
                                (s) => s.id === section
                              );
                              handleEdit(sectionIndex);
                            }}
                          >
                            Complete Section
                          </Button>
                        </Box>
                        <Box sx={{ pl: 2 }}>
                          {fields.map((field, index) => (
                            <Box
                              key={field.name}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <ArrowRightIcon sx={{ fontSize: 16, mr: 1 }} />
                              <Typography variant="body2">
                                {field.label}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    );
                  }
                )}
              </Box>
            </Alert>
          )}

          {/* Summary chips for quick reference */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            <Chip
              icon={<PersonIcon />}
              label={`Client: ${formData.name || "Not specified"}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<BusinessIcon />}
              label={`Case #: ${formData.caseNumber || "Not specified"}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={formData.typeOfTransaction || "No transaction type"}
              variant="outlined"
            />
            <Chip
              label={`LOC: ${formData.levelOfCare || "Not specified"}`}
              variant="outlined"
            />
          </Box>

          {/* Accordion sections */}
          {sectionsToShow.map((section, index) => (
            <Accordion
              key={section.id}
              expanded={expandedSection === section.id}
              onChange={handleAccordionChange(section.id)}
              sx={{
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                borderRadius: "8px !important",
                overflow: "hidden",
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  boxShadow: 2,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor:
                    expandedSection === section.id
                      ? `${section.color}15`
                      : "transparent",
                  borderBottom:
                    expandedSection === section.id ? "1px solid" : "none",
                  borderBottomColor: "divider",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      bgcolor: section.color,
                      color: "white",
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {section.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {section.fields.length} items
                    </Typography>
                  </Box>

                  {/* If the section has missing fields, show a warning */}
                  {missingFieldsBySection[section.id] && (
                    <Chip
                      icon={<ErrorIcon />}
                      label={`${
                        missingFieldsBySection[section.id].length
                      } required fields missing`}
                      color="error"
                      size="small"
                      variant="outlined"
                      sx={{ mr: 2 }}
                    />
                  )}

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                    sx={{
                      mr: 1,
                      bgcolor: `${section.color}20`,
                      "&:hover": {
                        bgcolor: `${section.color}40`,
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  {section.fields.map((field, fIndex) => {
                    const isRequired = requiredFields.some(
                      (reqField) =>
                        reqField.name ===
                        Object.keys(formData).find(
                          (key) =>
                            formData[key] === field.value && key !== "status"
                        )
                    );

                    const isMissing = missingFields.some(
                      (missingField) => missingField.label === field.label
                    );

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={`${section.id}-field-${fIndex}`}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            component="div"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            {isRequired && (
                              <Box
                                component="span"
                                sx={{
                                  color: isMissing
                                    ? "error.main"
                                    : "primary.main",
                                  mr: 0.5,
                                }}
                              >
                                *
                              </Box>
                            )}
                            {field.label}
                          </Typography>
                          <Box
                            sx={{
                              p: 1.5,
                              border: "1px solid",
                              borderColor: isMissing ? "error.main" : "divider",
                              borderRadius: 1,
                              backgroundColor: isMissing
                                ? "error.light"
                                : field.value
                                ? "background.default"
                                : "#f5f5f5",
                              minHeight: "28px",
                              wordBreak: "break-word",
                            }}
                          >
                            <Typography
                              variant="body2"
                              color={
                                isMissing
                                  ? "error.main"
                                  : field.value
                                  ? "text.primary"
                                  : "text.secondary"
                              }
                              sx={{
                                fontStyle: field.value ? "normal" : "italic",
                              }}
                            >
                              {field.value || "Not provided"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Next Steps:
        </Typography>
        <List>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Submit this form to create the intake record"
              secondary="You'll be able to edit this information later if needed"
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Collect required signatures"
              secondary="You'll be prompted to collect signatures after submission"
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Generate documentation"
              secondary="All required documents will be automatically generated"
            />
          </ListItem>
        </List>

        <Alert severity="info" sx={{ mt: 2, borderRadius: 1 }}>
          When you click Submit, this information will be saved and you'll be
          prompted to collect necessary signatures.
        </Alert>
      </Paper>
    </Box>
  );
};

export default Step3Form;
