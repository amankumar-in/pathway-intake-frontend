import React from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  Button,
  IconButton,
  Checkbox,
} from "@mui/material";
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Archive as ArchiveIcon,
  Assignment as AssignmentIcon,
  Clear as ClearIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const IntakeFormsTableBody = ({
  forms,
  activeTab,
  isMobile,
  isTablet,
  isAdmin,
  selectedItems,
  searchTerm,
  statusFilter,
  formatDate,
  getStatusChip,
  onViewForm,
  onEditForm,
  onSelectItem,
  onMenuOpen,
  onStartNewForm,
  onClearSearch,
  onClearStatusFilter,
}) => {
  // No forms - different messages based on context
  if (forms.length === 0) {
    // Filtered but no results
    if (searchTerm || statusFilter) {
      return (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={activeTab === 3 && isAdmin ? 7 : isAdmin ? 6 : 5}
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
                      onClick={onClearSearch}
                      startIcon={<ClearIcon />}
                      size={isMobile ? "small" : "medium"}
                    >
                      Clear Search
                    </Button>
                  )}
                  {statusFilter && (
                    <Button
                      variant="outlined"
                      onClick={onClearStatusFilter}
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
        </TableBody>
      );
    }

    // No forms at all
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={isMobile ? 4 : activeTab === 3 && isAdmin ? 7 : isAdmin ? 6 : 5}
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
                    onClick={onStartNewForm}
                    size={isMobile ? "small" : "medium"}
                  >
                    Create New Form
                  </Button>
                </>
              )}
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // Forms exist - render rows
  return (
    <TableBody>
      {forms.map((form) => (
        <TableRow
          key={form._id}
          hover
          onClick={(e) => {
            if (
              e.target.closest('input[type="checkbox"]') ||
              e.target.closest("button")
            ) {
              return;
            }
            onViewForm(form._id);
          }}
          sx={{
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.04)",
              cursor: "pointer",
            },
            bgcolor: form.archived ? "rgba(0, 0, 0, 0.04)" : "inherit",
          }}
        >
          {activeTab === 3 && isAdmin && (
            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedItems.includes(form._id)}
                onChange={() => onSelectItem(form._id)}
                inputProps={{ "aria-label": "select form" }}
              />
            </TableCell>
          )}
          <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
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
          {isAdmin && !isMobile && (
            <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              {form.createdBy?.name || "Unknown"}
            </TableCell>
          )}
          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
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
                  onClick={() => onViewForm(form._id)}
                >
                  View
                </Button>
              )}
              {isMobile || isTablet ? (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEditForm(form._id)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => onEditForm(form._id)}
                >
                  Edit
                </Button>
              )}
              <IconButton
                size="small"
                onClick={(event) => onMenuOpen(event, form)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default IntakeFormsTableBody;
