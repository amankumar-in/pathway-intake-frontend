import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { getDocumentIcon, getDocumentColor, getFormattedDate } from "../../utils/documentHelpers";
import { getDocumentCopies } from "../../constants/documentCopiesConfig";

const DocumentListItem = ({
  document,
  index,
  selectMode,
  isSelected,
  activeCategory,
  onToggleSelection,
  onView,
  onEdit,
  onExport,
  onOpenMenu,
  renderCategoryChips,
}) => {
  const theme = useTheme();
  const docColor = getDocumentColor(document.category);
  const copyCount = getDocumentCopies(document, activeCategory);

  return (
    <React.Fragment key={document._id}>
      {index > 0 && <Divider />}
      <ListItem
        disablePadding
        secondaryAction={
          selectMode ? null : (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {copyCount > 1 && (
                <Chip
                  label={`${copyCount}x`}
                  size="small"
                  color="secondary"
                  sx={{
                    height: 22,
                    minWidth: 32,
                    fontWeight: "bold",
                    mr: 1,
                    "& .MuiChip-label": {
                      px: 1,
                      fontSize: "0.7rem",
                    },
                  }}
                />
              )}
              <Tooltip title="Edit document">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(document._id);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export to PDF">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(document._id);
                  }}
                >
                  <PdfIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="More options">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(event) => onOpenMenu(event, document)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
        sx={{
          transition: "all 0.2s ease",
          bgcolor: selectMode && isSelected
            ? alpha(theme.palette.primary.main, 0.08)
            : "transparent",
          borderLeft: selectMode && isSelected
            ? "3px solid"
            : "3px solid transparent",
          borderColor: "primary.main",
          "&:hover": {
            bgcolor: selectMode
              ? alpha(theme.palette.primary.main, 0.12)
              : alpha(theme.palette[docColor].main, 0.05),
          },
        }}
      >
        <ListItemButton
          onClick={
            selectMode
              ? () => onToggleSelection(document._id)
              : () => onView(document._id)
          }
          dense
          sx={{
            py: 1,
            cursor: selectMode ? "pointer" : "default",
          }}
        >
          {selectMode && (
            <ListItemIcon sx={{ minWidth: 48 }}>
              <Checkbox
                edge="start"
                checked={isSelected}
                tabIndex={-1}
                disableRipple
                size="medium"
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 24,
                  },
                }}
              />
            </ListItemIcon>
          )}
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 1,
                bgcolor: alpha(theme.palette[docColor].main, 0.1),
                color: `${docColor}.main`,
              }}
            >
              {React.cloneElement(getDocumentIcon(document.category), {
                sx: { fontSize: 16 },
              })}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight="medium">
                {document.title}
              </Typography>
            }
            secondary={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 0.5,
                }}
              >
                {renderCategoryChips(document, "small", 2)}
                <Typography variant="caption" color="text.secondary">
                  {getFormattedDate(document.createdAt)}
                </Typography>
              </Box>
            }
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: "medium" },
            }}
            secondaryTypographyProps={{
              variant: "caption",
              sx: { fontSize: "0.75rem" },
            }}
          />
        </ListItemButton>
      </ListItem>
    </React.Fragment>
  );
};

export default DocumentListItem;
