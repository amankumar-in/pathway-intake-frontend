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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";

const ClientCashResourcesForm = ({
  data,
  handleInputChange,
  isStandalone = false,
}) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Initialize transactions from data or create a default empty one
  const [transactions, setTransactions] = useState(
    data?.transactions?.length > 0
      ? data.transactions
      : [
          {
            id: 1,
            date: "",
            description: "",
            amountReceived: "",
            amountSpent: "",
            balance: "",
            fosterParentSignature: null,
            clientSignature: null,
          },
        ]
  );

  // Update parent component data when transactions change
  useEffect(() => {
    // Create a modified version of the data object with updated transactions
    const updatedData = {
      ...data,
      transactions,
    };

    // Call the parent's handleInputChange with the updated data
    if (handleInputChange) {
      handleInputChange({
        target: {
          name: "transactions",
          value: transactions,
        },
      });
    }
  }, [transactions, data, handleInputChange]);

  // Add a new transaction row
  const handleAddTransaction = () => {
    // Generate a new unique ID
    const newId = Math.max(...transactions.map((t) => t.id), 0) + 1;

    // Create a new transaction with calculated starting balance
    const lastTransaction = transactions[transactions.length - 1];
    const previousBalance =
      lastTransaction && lastTransaction.balance
        ? parseFloat(lastTransaction.balance)
        : 0;

    const newTransaction = {
      id: newId,
      date: "",
      description: "",
      amountReceived: "",
      amountSpent: "",
      balance: previousBalance.toString(),
      fosterParentSignature: null,
      clientSignature: null,
    };

    setTransactions([...transactions, newTransaction]);
  };

  // Remove a transaction
  const handleRemoveTransaction = (id) => {
    // Filter out the transaction with the given id
    const updatedTransactions = transactions.filter((t) => t.id !== id);

    // Recalculate balances for all transactions after the removed one
    if (updatedTransactions.length > 0) {
      recalculateBalances(updatedTransactions);
    } else {
      // If all transactions were removed, add an empty one
      setTransactions([
        {
          id: 1,
          date: "",
          description: "",
          amountReceived: "",
          amountSpent: "",
          balance: "",
          fosterParentSignature: null,
          clientSignature: null,
        },
      ]);
    }
  };

  // Update a specific transaction field
  const handleTransactionChange = (id, field, value) => {
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction.id === id) {
        return { ...transaction, [field]: value };
      }
      return transaction;
    });

    // If the field was amountReceived or amountSpent, recalculate balances
    if (field === "amountReceived" || field === "amountSpent") {
      recalculateBalances(updatedTransactions);
    } else {
      setTransactions(updatedTransactions);
    }
  };

  // Recalculate balances for all transactions
  const recalculateBalances = (transactionsArray) => {
    let runningBalance = 0;

    const recalculated = transactionsArray.map((transaction, index) => {
      // For the first row, start with 0 or any initial balance
      if (index === 0) {
        // Calculate balance: previous balance + received - spent
        const received = transaction.amountReceived
          ? parseFloat(transaction.amountReceived)
          : 0;
        const spent = transaction.amountSpent
          ? parseFloat(transaction.amountSpent)
          : 0;

        runningBalance = received - spent;
      } else {
        // For subsequent rows, add received and subtract spent from running balance
        const received = transaction.amountReceived
          ? parseFloat(transaction.amountReceived)
          : 0;
        const spent = transaction.amountSpent
          ? parseFloat(transaction.amountSpent)
          : 0;

        runningBalance += received - spent;
      }

      // Update the transaction with the new balance
      return {
        ...transaction,
        balance: runningBalance.toFixed(2),
      };
    });

    setTransactions(recalculated);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Record of Client's Safeguarded Cash Resources
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form records all cash transactions and resources for the client
        while in care.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong>{" "}
          {isStandalone
            ? "All fields are editable in standalone document mode."
            : "Client name and DOB are automatically populated from the intake form. All transaction data needs to be entered manually."}
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client and Foster Home Information */}
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
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone
                ? "Enter client's date of birth"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Foster Home"
            name="nameOfFosterParents"
            value={data?.nameOfFosterParents || ""}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              isStandalone
                ? "Enter foster parent's name"
                : "Auto-populated from intake form"
            }
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
      </Grid>

      {/* Transaction Table */}
      <Typography variant="h6" gutterBottom>
        Cash Transactions
      </Typography>
      <Paper sx={{ width: "100%", mb: 2, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="cash transactions table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount Received ($)</TableCell>
                <TableCell>Amount Spent ($)</TableCell>
                <TableCell>Balance ($)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <TextField
                      type="date"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={transaction.date || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          transaction.id,
                          "date",
                          e.target.value
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={transaction.description || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          transaction.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter description"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={transaction.amountReceived || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          transaction.id,
                          "amountReceived",
                          e.target.value
                        )
                      }
                      placeholder="0.00"
                      type="number"
                      inputProps={{ step: "0.01", min: "0" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={transaction.amountSpent || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          transaction.id,
                          "amountSpent",
                          e.target.value
                        )
                      }
                      placeholder="0.00"
                      type="number"
                      inputProps={{ step: "0.01", min: "0" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={transaction.balance || ""}
                      disabled
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveTransaction(transaction.id)}
                      disabled={transactions.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddTransaction}
          >
            Add Transaction
          </Button>
        </Box>
      </Paper>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          Signatures for transactions will be collected in the document view.
          Each transaction can be signed by both the foster parent and the
          client or their representative.
        </Typography>
      </Alert>
    </Box>
  );
};

export default ClientCashResourcesForm;
