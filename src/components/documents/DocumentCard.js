import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
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

const DocumentCard = ({
  document,
  selectMode,
  isSelected,
  activeCategory,
  onToggleSelection,
  onView,
  onEdit,
  onExport,
  onOpenMenu,
  renderCategoryChips,
  isGeneratingPDF,
}) => {
  const theme = useTheme();
  const docColor = getDocumentColor(document.category);
  const copyCount = getDocumentCopies(document, activeCategory);

  return (
    <Card
      elevation={selectMode && isSelected ? 4 : 1}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          transform: selectMode ? "scale(1.02)" : "translateY(-2px)",
          boxShadow: selectMode ? 4 : 2,
          borderColor: selectMode
            ? "primary.main"
            : alpha(theme.palette[docColor].main, 0.4),
        },
        position: "relative",
        borderRadius: 1.5,
        overflow: "hidden",
        border: "2px solid",
        borderColor: selectMode && isSelected
          ? "primary.main"
          : selectMode
          ? alpha(theme.palette.primary.main, 0.3)
          : alpha(theme.palette[docColor].main, 0.2),
        bgcolor: selectMode && isSelected
          ? alpha(theme.palette.primary.main, 0.08)
          : "background.paper",
        maxWidth: "100%",
      }}
      onClick={selectMode ? () => onToggleSelection(document._id) : () => onView(document._id)}
    >
      {copyCount > 1 && (
        <Chip
          label={`${copyCount}x`}
          size="small"
          color="secondary"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            height: 22,
            minWidth: 32,
            fontWeight: "bold",
            "& .MuiChip-label": {
              px: 1,
              fontSize: "0.7rem",
            },
            zIndex: 10,
          }}
        />
      )}

      {selectMode && (
        <Checkbox
          checked={isSelected}
          sx={{
            position: "absolute",
            top: 6,
            left: 6,
            bgcolor: "background.paper",
            borderRadius: "50%",
            p: 0.5,
            zIndex: 10,
            boxShadow: 2,
            "& .MuiSvgIcon-root": {
              fontSize: 26,
            },
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
          size="medium"
        />
      )}

      <Box
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: alpha(theme.palette[docColor].main, 0.1),
          bgcolor: alpha(theme.palette[docColor].main, 0.05),
        }}
      >
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
            mr: 1,
          }}
        >
          {React.cloneElement(getDocumentIcon(document.category), {
            sx: { fontSize: 16 },
          })}
        </Box>
        <Typography
          variant="body2"
          fontWeight="medium"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.2,
            fontSize: "0.8125rem",
          }}
        >
          {document.title}
        </Typography>
      </Box>

      <CardContent sx={{ p: 1.5, flexGrow: 1, pb: "8px !important" }}>
        <Box sx={{ mb: 1 }}>
          {renderCategoryChips(document, "small", 1)}

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ fontSize: "0.7rem" }}
          >
            {getFormattedDate(document.createdAt)}
          </Typography>
        </Box>
      </CardContent>

      <Box
        sx={{
          p: 0.5,
          display: "flex",
          justifyContent: "space-around",
          borderTop: "1px solid",
          borderColor: alpha(theme.palette[docColor].main, 0.1),
          bgcolor: alpha(theme.palette[docColor].main, 0.03),
        }}
      >
        <Tooltip title="Edit document">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(document._id);
            }}
            sx={{
              p: 0.5,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export to PDF">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onExport(document._id);
            }}
            disabled={isGeneratingPDF}
            sx={{
              p: 0.5,
              "&:hover": {
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
              },
            }}
          >
            <PdfIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="More options">
          <IconButton
            size="small"
            onClick={(e) => onOpenMenu(e, document)}
            sx={{
              p: 0.5,
              "&:hover": {
                bgcolor: alpha(theme.palette.text.primary, 0.05),
              },
            }}
          >
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default DocumentCard;
