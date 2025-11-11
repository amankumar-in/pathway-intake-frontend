import React from "react";
import {
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  MoveToInbox as MoveToInboxIcon,
  BurstMode as BurstModeIcon,
} from "@mui/icons-material";
import { Chip, Stack, Tooltip } from "@mui/material";

// Get document icon based on category
export const getDocumentIcon = (category) => {
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
export const getDocumentColor = (category) => {
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

// Get document date display
export const getFormattedDate = (dateString) => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get all categories a document belongs to (primary + additional)
export const getAllDocumentCategories = (document) => {
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

// Calculate signature status
export const calculateSignatureStatus = (intakeForm) => {
  if (!intakeForm || !intakeForm.signatures) {
    return { collected: 0, total: 5, missing: 5 };
  }

  const signatureTypes = [
    "childSignature",
    "parentSignature",
    "caseworkerSignature",
    "supervisorSignature",
    "agencyRepSignature",
  ];

  let collected = 0;
  signatureTypes.forEach((type) => {
    if (intakeForm.signatures.get && intakeForm.signatures.get(type)) {
      collected++;
    } else if (intakeForm.signatures[type]) {
      collected++;
    }
  });

  return {
    collected,
    total: signatureTypes.length,
    missing: signatureTypes.length - collected,
  };
};

// Render document category chips
export const renderCategoryChips = (document, size = "small", max = 2) => {
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
