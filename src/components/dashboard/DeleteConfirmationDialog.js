import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteConfirmationDialog = ({
  open,
  onClose,
  permanentDeleteItem,
  selectedItemType,
  selectedItemsCount,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: "error.main" }}>
        {permanentDeleteItem
          ? "Permanently Delete Item"
          : "Permanently Delete Selected Items"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {permanentDeleteItem
            ? `Are you sure you want to permanently delete ${
                selectedItemType === "form" ? "this form" : "this document"
              }? This action cannot be undone.`
            : `Are you sure you want to permanently delete ${selectedItemsCount} selected ${
                selectedItemType === "form" ? "forms" : "documents"
              }? This action cannot be undone.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
        >
          Permanently Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
