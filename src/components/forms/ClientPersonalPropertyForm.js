import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";

const DEFAULT_CLOTHING_ITEMS = [
  { quantity: "", description: "T-Shirts or Dress Shirts" },
  { quantity: "", description: "Jeans or Slacks" },
  { quantity: "", description: "Belts" },
  { quantity: "", description: "Underpants/Panties" },
  { quantity: "", description: "Socks" },
  { quantity: "", description: "Shoes" },
  { quantity: "", description: "Hats" },
  { quantity: "", description: "Coats" },
  { quantity: "", description: "Sweaters" },
  { quantity: "", description: "Other:" },
];

const DEFAULT_PERSONAL_ITEMS_LEFT = [
  { quantity: "", description: "Hair Dryer" },
  { quantity: "", description: "Curling Iron" },
  { quantity: "", description: "Barrettes/Hair Clips" },
  { quantity: "", description: "Earrings" },
  { quantity: "", description: "Glasses/Sunglasses" },
  { quantity: "", description: "Necklaces" },
  { quantity: "", description: "Rings" },
  { quantity: "", description: "Bracelets" },
  { quantity: "", description: "Dolls" },
  { quantity: "", description: "Doll's Clothing" },
  { quantity: "", description: "Video Games" },
  { quantity: "", description: "Video Tapes" },
  { quantity: "", description: "DVD's" },
  { quantity: "", description: "Stereo" },
  { quantity: "", description: "Radio" },
  { quantity: "", description: "XBOX or other gaming system" },
  { quantity: "", description: "Audio Cassettes" },
  { quantity: "", description: "CD Player" },
  { quantity: "", description: "CD's" },
  { quantity: "", description: "Gameboy or PSP" },
  { quantity: "", description: "IPOD" },
  { quantity: "", description: "Computer" },
  { quantity: "", description: "Books" },
  { quantity: "", description: "CD-Rom's - (software)" },
  { quantity: "", description: "Bicycle" },
];

const DEFAULT_PERSONAL_ITEMS_RIGHT = [
  { quantity: "", description: "Scooter" },
  { quantity: "", description: "Protection: Helmet, Pads" },
  { quantity: "", description: "Rollerblades" },
  { quantity: "", description: "Backpack" },
  { quantity: "", description: "Purse" },
  { quantity: "", description: "Wallet" },
  { quantity: "", description: "Watch" },
  { quantity: "", description: "Keychain" },
  { quantity: "", description: "Headphones" },
  { quantity: "", description: "Baseball Glove" },
  { quantity: "", description: "Baseball Bat" },
  { quantity: "", description: "Soccer Ball" },
  { quantity: "", description: "Football" },
  { quantity: "", description: "Basketball" },
  { quantity: "", description: "Stuffed Toys" },
  { quantity: "", description: "Pillows" },
  { quantity: "", description: "Linens" },
  { quantity: "", description: "Bedspread or Comforter" },
  { quantity: "", description: "Sleeping Bag" },
  { quantity: "", description: "Video Games" },
  { quantity: "", description: "Box Games" },
];

const ClientPersonalPropertyForm = ({ data, handleInputChange }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const clothingItems = data?.clothingItems || DEFAULT_CLOTHING_ITEMS;
  const personalItemsLeft = data?.personalItemsLeft || DEFAULT_PERSONAL_ITEMS_LEFT;
  const personalItemsRight = data?.personalItemsRight || DEFAULT_PERSONAL_ITEMS_RIGHT;

  const updateArrayField = (fieldName, index, key, value) => {
    const items = data?.[fieldName] || [];
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    handleInputChange({ target: { name: fieldName, value: updated } });
  };

  const addItem = (fieldName) => {
    const items = data?.[fieldName] || [];
    const updated = [...items, { quantity: "", description: "" }];
    handleInputChange({ target: { name: fieldName, value: updated } });
  };

  const removeItem = (fieldName, index) => {
    const items = data?.[fieldName] || [];
    const updated = items.filter((_, i) => i !== index);
    handleInputChange({ target: { name: fieldName, value: updated } });
  };

  // Initialize default arrays if not present
  if (!data?.clothingItems) {
    handleInputChange({ target: { name: "clothingItems", value: DEFAULT_CLOTHING_ITEMS } });
  }
  if (!data?.personalItemsLeft) {
    handleInputChange({ target: { name: "personalItemsLeft", value: DEFAULT_PERSONAL_ITEMS_LEFT } });
  }
  if (!data?.personalItemsRight) {
    handleInputChange({ target: { name: "personalItemsRight", value: DEFAULT_PERSONAL_ITEMS_RIGHT } });
  }

  const renderItemList = (items, fieldName, label) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      {items.map((item, index) => (
        <Grid container spacing={1} key={`${fieldName}-${index}`} sx={{ mb: 0.5 }} alignItems="center">
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              label="Qty"
              value={item.quantity || ""}
              onChange={(e) => updateArrayField(fieldName, index, "quantity", e.target.value)}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              size="small"
              label="Description"
              value={item.description || ""}
              onChange={(e) => updateArrayField(fieldName, index, "description", e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton size="small" onClick={() => removeItem(fieldName, index)} color="error">
              <Delete fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        size="small"
        startIcon={<Add />}
        onClick={() => addItem(fieldName)}
        sx={{ mt: 1 }}
      >
        Add Item
      </Button>
    </Box>
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Client Personal Property
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Inventory of personal property for the client.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Client name, resource parent, date, and type are
          automatically populated from the intake form.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client Info - Read Only */}
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
            InputProps={{ readOnly: true }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Resource Parent"
            name="nameOfFosterParents"
            value={data?.nameOfFosterParents || ""}
            onChange={handleInputChange}
            InputProps={{ readOnly: true }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Type of Transaction"
            name="typeOfTransaction"
            value={data?.typeOfTransaction || ""}
            onChange={handleInputChange}
            InputProps={{ readOnly: true }}
            helperText="Auto-populated from intake form"
            disabled
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Clothing Items */}
      <Typography variant="h6" gutterBottom>
        Clothing Items
      </Typography>
      {renderItemList(clothingItems, "clothingItems", "")}

      <Divider sx={{ mb: 3 }} />

      {/* Personal Items */}
      <Typography variant="h6" gutterBottom>
        Personal Items
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderItemList(personalItemsLeft, "personalItemsLeft", "Left Column")}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderItemList(personalItemsRight, "personalItemsRight", "Right Column")}
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Allowance */}
      <Typography variant="h6" gutterBottom>
        Allowance Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }} alignItems="center">
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Allowance Owed ($)"
            name="allowanceOwed"
            value={data?.isNA ? "N/A" : (data?.allowanceOwed || "")}
            onChange={handleInputChange}
            disabled={data?.isNA || false}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Clothing Allowance Owed ($)"
            name="clothingAllowanceOwed"
            value={data?.isNA ? "N/A" : (data?.clothingAllowanceOwed || "")}
            onChange={handleInputChange}
            disabled={data?.isNA || false}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data?.isNA || false}
                onChange={(e) =>
                  handleInputChange({ target: { name: "isNA", value: e.target.checked } })
                }
                name="isNA"
              />
            }
            label="N/A"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientPersonalPropertyForm;
