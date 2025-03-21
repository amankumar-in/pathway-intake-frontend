import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MedicalServices as MedicationIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Numbers as NumberIcon,
  LocalPharmacy as LocalPharmacyIcon,
} from "@mui/icons-material";

const MedicationDestructionRecordForm = ({
  data,
  handleInputChange,
  isStandalone = false,
}) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Initialize central medications from data or create a default empty one
  const [centralMedications, setCentralMedications] = useState(
    data?.centralMedications?.length > 0
      ? data.centralMedications
      : [
          {
            id: 1,
            medicationName: "",
            strength: "",
            instructions: "",
            expirationDate: "",
            dateFilled: "",
            physician: "",
            prescriptionNumber: "",
            refills: "",
            pharmacy: "",
          },
        ]
  );

  // Initialize destruction entries from data or create a default empty one
  const [destructionEntries, setDestructionEntries] = useState(
    data?.destructionEntries?.length > 0
      ? data.destructionEntries
      : [
          {
            id: 1,
            medicationName: "",
            dateFilled: "",
            comments: "",
            disposalDate: "",
            pharmacy: "",
            adminSignature: null,
            witnessSignature: null,
          },
        ]
  );

  // Update parent component data when entries change
  useEffect(() => {
    // Update centralMedications in parent component
    if (handleInputChange) {
      handleInputChange({
        target: {
          name: "centralMedications",
          value: centralMedications,
        },
      });
    }
  }, [centralMedications, handleInputChange]);

  // Update parent component data when destruction entries change
  useEffect(() => {
    // Update destructionEntries in parent component
    if (handleInputChange) {
      handleInputChange({
        target: {
          name: "destructionEntries",
          value: destructionEntries,
        },
      });
    }
  }, [destructionEntries, handleInputChange]);

  // Add a new central medication row
  const handleAddCentralMedication = () => {
    // Generate a new unique ID
    const newId = Math.max(...centralMedications.map((m) => m.id), 0) + 1;

    const newMedication = {
      id: newId,
      medicationName: "",
      strength: "",
      instructions: "",
      expirationDate: "",
      dateFilled: "",
      physician: "",
      prescriptionNumber: "",
      refills: "",
      pharmacy: "",
    };

    setCentralMedications([...centralMedications, newMedication]);
  };

  // Remove a central medication
  const handleRemoveCentralMedication = (id) => {
    // Filter out the medication with the given id
    const updatedMedications = centralMedications.filter((m) => m.id !== id);

    if (updatedMedications.length > 0) {
      setCentralMedications(updatedMedications);
    } else {
      // If all medications were removed, add an empty one
      setCentralMedications([
        {
          id: 1,
          medicationName: "",
          strength: "",
          instructions: "",
          expirationDate: "",
          dateFilled: "",
          physician: "",
          prescriptionNumber: "",
          refills: "",
          pharmacy: "",
        },
      ]);
    }
  };

  // Update a specific central medication field
  const handleCentralMedicationChange = (id, field, value) => {
    const updatedMedications = centralMedications.map((medication) => {
      if (medication.id === id) {
        return { ...medication, [field]: value };
      }
      return medication;
    });

    setCentralMedications(updatedMedications);
  };

  // Add a new destruction entry row
  const handleAddDestructionEntry = () => {
    // Generate a new unique ID
    const newId = Math.max(...destructionEntries.map((e) => e.id), 0) + 1;

    const newEntry = {
      id: newId,
      medicationName: "",
      dateFilled: "",
      comments: "",
      disposalDate: "",
      pharmacy: "",
      adminSignature: null,
      witnessSignature: null,
    };

    setDestructionEntries([...destructionEntries, newEntry]);
  };

  // Remove a destruction entry
  const handleRemoveDestructionEntry = (id) => {
    // Filter out the entry with the given id
    const updatedEntries = destructionEntries.filter((e) => e.id !== id);

    if (updatedEntries.length > 0) {
      setDestructionEntries(updatedEntries);
    } else {
      // If all entries were removed, add an empty one
      setDestructionEntries([
        {
          id: 1,
          medicationName: "",
          dateFilled: "",
          comments: "",
          disposalDate: "",
          pharmacy: "",
          adminSignature: null,
          witnessSignature: null,
        },
      ]);
    }
  };

  // Update a specific destruction entry field
  const handleDestructionEntryChange = (id, field, value) => {
    const updatedEntries = destructionEntries.map((entry) => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });

    setDestructionEntries(updatedEntries);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Centrally Stored Medication and Destruction Record
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form documents centrally stored medications and records medication
        destruction.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong>{" "}
          {isStandalone
            ? "All fields are editable in standalone document mode."
            : "Client name, facility number, and date of intake are automatically populated from the intake form. All medication data needs to be entered manually."}
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client Information */}
      <Typography variant="h6" gutterBottom>
        Client Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Client Name"
            name="name"
            value={data?.name || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone
                ? "Enter client's full name"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Facility Number"
            name="officeNumber"
            value={data?.officeNumber || "201"}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone
                ? "Enter facility number"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Date of Intake"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone
                ? "Enter date of intake"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Admission Date"
            name="admissionDate"
            type="date"
            value={formatDateForInput(data?.admissionDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            helperText="Date client was admitted"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Administrator"
            name="administrator"
            value={data?.administrator || ""}
            onChange={handleInputChange}
            helperText="Name of facility administrator"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Attending Physician"
            name="attendingPhysician"
            value={data?.attendingPhysician || ""}
            onChange={handleInputChange}
            helperText="Client's primary physician"
          />
        </Grid>
      </Grid>

      {/* Section I: Centrally Stored Medication */}
      <Typography variant="h6" gutterBottom>
        I. Centrally Stored Medication
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Document all medications stored in the central storage area.
      </Typography>

      {/* Centrally Stored Medication Table - One row per medication with expandable cards */}
      {centralMedications.map((medication, index) => (
        <Card
          key={medication.id}
          variant="outlined"
          sx={{ mb: 2, position: "relative" }}
        >
          <CardContent>
            <Grid container spacing={2}>
              {/* Row 1: Basic medication info */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Medication Name"
                  value={medication.medicationName || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "medicationName",
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MedicationIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Strength/Quantity"
                  value={medication.strength || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "strength",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Prescription Number"
                  value={medication.prescriptionNumber || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "prescriptionNumber",
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumberIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Row 2: More details */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instructions/Control/Custody"
                  value={medication.instructions || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "instructions",
                      e.target.value
                    )
                  }
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prescribing Physician"
                  value={medication.physician || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "physician",
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Row 3: Dates and pharmacy */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Expiration Date"
                  type="date"
                  value={formatDateForInput(medication.expirationDate) || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "expirationDate",
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Date Filled"
                  type="date"
                  value={formatDateForInput(medication.dateFilled) || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "dateFilled",
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="No. of Refills"
                  value={medication.refills || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "refills",
                      e.target.value
                    )
                  }
                  type="number"
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Pharmacy Name"
                  value={medication.pharmacy || ""}
                  onChange={(e) =>
                    handleCentralMedicationChange(
                      medication.id,
                      "pharmacy",
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalPharmacyIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Delete button in top-right corner */}
            {centralMedications.length > 1 && (
              <IconButton
                color="error"
                onClick={() => handleRemoveCentralMedication(medication.id)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </CardContent>
        </Card>
      ))}

      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddCentralMedication}
        >
          Add Medication
        </Button>
      </Box>

      {/* Section II: Medication Destruction Record */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        II. Medication Destruction Record
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Document the proper destruction of medications that are discontinued,
        expired, or no longer needed.
      </Typography>

      {/* Medication Destruction Record with expandable cards */}
      {destructionEntries.map((entry, index) => (
        <Card
          key={entry.id}
          variant="outlined"
          sx={{ mb: 2, position: "relative" }}
        >
          <CardContent>
            <Grid container spacing={2}>
              {/* Row 1: Basic info */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Medication Name"
                  value={entry.medicationName || ""}
                  onChange={(e) =>
                    handleDestructionEntryChange(
                      entry.id,
                      "medicationName",
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MedicationIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Date Filled"
                  type="date"
                  value={formatDateForInput(entry.dateFilled) || ""}
                  onChange={(e) =>
                    handleDestructionEntryChange(
                      entry.id,
                      "dateFilled",
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Disposal Date"
                  type="date"
                  value={formatDateForInput(entry.disposalDate) || ""}
                  onChange={(e) =>
                    handleDestructionEntryChange(
                      entry.id,
                      "disposalDate",
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Row 2: Comments and pharmacy */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Comments"
                  value={entry.comments || ""}
                  onChange={(e) =>
                    handleDestructionEntryChange(
                      entry.id,
                      "comments",
                      e.target.value
                    )
                  }
                  multiline
                  rows={2}
                  placeholder="Add any comments about the destruction"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pharmacy Name"
                  value={entry.pharmacy || ""}
                  onChange={(e) =>
                    handleDestructionEntryChange(
                      entry.id,
                      "pharmacy",
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalPharmacyIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Delete button in top-right corner */}
            {destructionEntries.length > 1 && (
              <IconButton
                color="error"
                onClick={() => handleRemoveDestructionEntry(entry.id)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </CardContent>
        </Card>
      ))}

      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddDestructionEntry}
        >
          Add Destruction Entry
        </Button>
      </Box>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          Signatures for medication destruction will be collected in the
          document view. Each destruction record requires two signatures: the
          administrator/designated representative and an adult witness.
        </Typography>
      </Alert>
    </Box>
  );
};

export default MedicationDestructionRecordForm;
