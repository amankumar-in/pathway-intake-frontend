import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const HomePlacementLogForm = ({
  data,
  handleInputChange,
  isStandalone = false,
}) => {
  // Initialize entries from data or create empty array
  const [entries, setEntries] = useState([]);

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Initialize entries when data changes
  useEffect(() => {
    if (data?.entries && Array.isArray(data.entries)) {
      setEntries(data.entries);
    } else {
      // Initialize with empty entries if none exist
      setEntries([{ name: "", dateOfIntake: "", dateOfTermination: "" }]);
    }
  }, [data?.entries]);

  // Handle adding a new row
  const handleAddRow = () => {
    const newEntries = [
      ...entries,
      { name: "", dateOfIntake: "", dateOfTermination: "" },
    ];
    setEntries(newEntries);

    // Update the parent component's data
    handleInputChange({
      target: {
        name: "entries",
        value: newEntries,
      },
    });
  };

  // Handle removing a row
  const handleRemoveRow = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);

    // Update the parent component's data
    handleInputChange({
      target: {
        name: "entries",
        value: newEntries,
      },
    });
  };

  // Handle changes to entry fields
  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: value,
    };
    setEntries(newEntries);

    // Update the parent component's data
    handleInputChange({
      target: {
        name: "entries",
        value: newEntries,
      },
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Home Placement Log
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This document logs the placement history in the home.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Add as many rows as needed. You can leave rows
          blank if not needed.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Table for entries */}
      <Typography variant="h6" gutterBottom>
        Placement Entries
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Date of Intake (D.O.I.)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Date of Termination (D.O.T.)
              </TableCell>
              <TableCell align="center" sx={{ width: 50 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={entry.name || ""}
                    onChange={(e) =>
                      handleEntryChange(index, "name", e.target.value)
                    }
                    placeholder="Enter name"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    type="date"
                    value={formatDateForInput(entry.dateOfIntake) || ""}
                    onChange={(e) =>
                      handleEntryChange(index, "dateOfIntake", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    type="date"
                    value={formatDateForInput(entry.dateOfTermination) || ""}
                    onChange={(e) =>
                      handleEntryChange(
                        index,
                        "dateOfTermination",
                        e.target.value
                      )
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveRow(index)}
                    disabled={entries.length <= 1} // Prevent removing the last row
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddRow}
        sx={{ mb: 2 }}
      >
        Add Row
      </Button>

      <Typography variant="body2" color="text.secondary">
        You can add as many entries as needed. Empty rows will be included in
        the document.
      </Typography>
    </Box>
  );
};

export default HomePlacementLogForm;
