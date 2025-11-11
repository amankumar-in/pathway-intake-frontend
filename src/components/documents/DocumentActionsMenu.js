import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  FileCopy as FileCopyIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const DocumentActionsMenu = ({
  anchorEl,
  open,
  onClose,
  document,
  onView,
  onEdit,
  onExport,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 200, borderRadius: 2, overflow: "hidden" },
        elevation: 3,
      }}
    >
      <MenuItem
        onClick={() => {
          onView(document?._id);
          onClose();
        }}
      >
        <ListItemIcon>
          <DescriptionIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>View</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onEdit(document?._id);
          onClose();
        }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onExport(document?._id);
          onClose();
        }}
      >
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Download PDF</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemIcon>
          <FileCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Duplicate</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <ArchiveIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Archive</ListItemText>
      </MenuItem>
      <MenuItem sx={{ color: "error.main" }}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default DocumentActionsMenu;
