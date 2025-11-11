import React from "react";
import { Chip } from "@mui/material";

// Format date for display
export const formatDate = (dateString, isMobile = false) => {
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

// Get status chip with appropriate color
export const getStatusChip = (status) => {
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

// Calculate dashboard statistics
export const calculateStats = (forms, activeTab, user, isAdmin) => {
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

// Filter forms based on tab, search, and status
export const getFilteredForms = (
  forms,
  activeTab,
  user,
  isAdmin,
  searchTerm,
  statusFilter,
  dateSort
) => {
  if (!user) return [];

  let filtered = forms;

  // Filter by tab
  if (activeTab === 0) {
    filtered = forms.filter((form) => {
      const formCreatorId =
        typeof form.createdBy === "object"
          ? form.createdBy._id || form.createdBy.id
          : form.createdBy;
      const userId = user._id || user.id;
      return String(formCreatorId) === String(userId) && !form.archived;
    });
  } else if (activeTab === 1 && isAdmin()) {
    filtered = forms.filter((form) => !form.archived);
  } else if (activeTab === 3) {
    if (isAdmin()) {
      filtered = forms.filter((form) => form.archived);
    } else {
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

  // Apply status filter
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

// Filter standalone documents
export const getFilteredStandaloneDocuments = (
  standaloneDocuments,
  user,
  isAdmin,
  searchTerm,
  dateSort
) => {
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
