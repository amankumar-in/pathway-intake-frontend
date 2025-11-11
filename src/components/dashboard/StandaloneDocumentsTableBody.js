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
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const StandaloneDocumentsTableBody = ({
  documents,
  isMobile,
  isTablet,
  selectedItems,
  formatDate,
  onViewDocument,
  onEditDocument,
  onSelectItem,
  onPermanentDeleteDialog,
  onCreateDocument,
}) => {
  if (documents.length === 0) {
    return (
      <TableBody>
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
                Create standalone documents without going through the full
                intake process
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreateDocument}
                size={isMobile ? "small" : "medium"}
              >
                Create Document
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {documents.map((doc) => (
        <TableRow
          key={doc._id}
          hover
          onClick={(e) => {
            if (
              e.target.closest('input[type="checkbox"]') ||
              e.target.closest("button")
            ) {
              return;
            }
            onViewDocument(doc._id);
          }}
          sx={{
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.04)",
              cursor: "pointer",
            },
          }}
        >
          <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selectedItems.includes(doc._id)}
              onChange={() => onSelectItem(doc._id)}
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
            <TableCell>{doc.createdFor || "Not specified"}</TableCell>
          )}
          <TableCell>{formatDate(doc.createdAt)}</TableCell>
          {!isMobile && (
            <TableCell>{doc.createdBy?.name || "Unknown"}</TableCell>
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
                  onClick={() => onViewDocument(doc._id)}
                >
                  View
                </Button>
              )}
              {isMobile || isTablet ? (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEditDocument(doc._id, true)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => onEditDocument(doc._id, true)}
                >
                  Edit
                </Button>
              )}
              <IconButton
                size="small"
                color="error"
                onClick={() => onPermanentDeleteDialog(doc, "document")}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default StandaloneDocumentsTableBody;
