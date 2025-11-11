import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ArchiveConfirmationDialog = ({
  open,
  onClose,
  archiveAction,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {archiveAction === "archive" ? "Archive Form" : "Unarchive Form"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {archiveAction === "archive"
            ? "Are you sure you want to archive this form? Archived forms will be moved to the Archive tab."
            : "Are you sure you want to unarchive this form? It will be restored to its original location."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={archiveAction === "archive" ? "warning" : "primary"}
        >
          {archiveAction === "archive" ? "Archive" : "Unarchive"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArchiveConfirmationDialog;
