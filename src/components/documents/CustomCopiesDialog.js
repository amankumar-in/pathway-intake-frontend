import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CloudDownload as CloudDownloadIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { getDocumentIcon, getDocumentColor } from "../../utils/documentHelpers";
import { getDocumentCopies } from "../../constants/documentCopiesConfig";

const CustomCopiesDialog = ({
  open,
  onClose,
  selectedDocuments,
  documents,
  categories,
  tabValue,
  customCopyCounts,
  onCopyCountChange,
  onExport,
  calculateTotalCopies,
  renderCategoryChips,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.1),
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
            <CloudDownloadIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography variant="h6">Custom Document Copies</Typography>
          </Box>
          <Chip
            label={`Total: ${calculateTotalCopies()} copies`}
            color="primary"
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" paragraph>
          Customize how many copies of each document to include in the PDF
          export:
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          The default copy counts are based on document type and category
          requirements.
        </Alert>

        <List sx={{ width: "100%" }}>
          {selectedDocuments.map((docId) => {
            const doc = documents.find((d) => d._id === docId);
            if (!doc) return null;

            const defaultCopies = getDocumentCopies(
              doc,
              categories[tabValue].id
            );
            const currentCopies = customCopyCounts[docId] || defaultCopies;

            return (
              <ListItem
                key={docId}
                divider
                secondaryAction={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      edge="end"
                      onClick={() =>
                        onCopyCountChange(docId, currentCopies - 1)
                      }
                      disabled={currentCopies <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={currentCopies}
                      onChange={(e) =>
                        onCopyCountChange(docId, e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      sx={{ width: 60 }}
                      inputProps={{
                        min: 1,
                        max: 10,
                        type: "number",
                        style: { textAlign: "center" },
                      }}
                    />
                    <IconButton
                      edge="end"
                      onClick={() =>
                        onCopyCountChange(docId, currentCopies + 1)
                      }
                      disabled={currentCopies >= 10}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: alpha(
                        theme.palette[getDocumentColor(doc.category)].main,
                        0.1
                      ),
                      color: `${getDocumentColor(doc.category)}.main`,
                    }}
                  >
                    {React.cloneElement(getDocumentIcon(doc.category), {
                      sx: { fontSize: 18 },
                    })}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={doc.title}
                  secondary={
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      {renderCategoryChips(doc, "small", 1)}
                      <Typography variant="caption" color="text.secondary">
                        Default: {defaultCopies}{" "}
                        {defaultCopies === 1 ? "copy" : "copies"}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button
          onClick={onExport}
          variant="contained"
          color="primary"
          startIcon={<CloudDownloadIcon />}
        >
          Export {calculateTotalCopies()} Copies
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomCopiesDialog;
