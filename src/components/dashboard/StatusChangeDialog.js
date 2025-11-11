import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const StatusChangeDialog = ({
  open,
  onClose,
  newStatus,
  onStatusChange,
  onStatusUpdate,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Form Status</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select a new status for this form:
        </DialogContentText>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            value={newStatus}
            label="Status"
            onChange={onStatusChange}
          >
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Needs Review">Needs Review</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onStatusUpdate} variant="contained">
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusChangeDialog;
