import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Info as InfoIcon,
  CalculateOutlined as CalculateIcon,
} from "@mui/icons-material";

const CAFormForm = ({ data, handleInputChange, isStandalone = false }) => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Handle invalid dates
    return date.toISOString().split("T")[0];
  };

  // Calculate "to date" based on "from date"
  const calculateToDate = (fromDate) => {
    if (!fromDate) return "";

    const date = new Date(fromDate);
    if (isNaN(date.getTime())) return ""; // Handle invalid dates

    // Get last day of the same month (similar to DATE(YEAR(C16),MONTH(C16)+1,0))
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based

    // Create a date for the first day of the next month, then subtract 1 day
    const lastDayOfMonth = new Date(year, month + 1, 0);
    return lastDayOfMonth.toISOString().split("T")[0];
  };

  // Calculate age based on DOB and to date
  const calculateAge = (dob, toDate) => {
    if (!dob || !toDate) return "";

    const dobDate = new Date(dob);
    const toDateTime = new Date(toDate);

    if (isNaN(dobDate.getTime()) || isNaN(toDateTime.getTime())) return "";

    // DATEDIF($L$7,D16,"Y") equivalent
    const dobYear = dobDate.getFullYear();
    const toYear = toDateTime.getFullYear();
    let age = toYear - dobYear;

    // Adjust age if birthday hasn't occurred yet in the year
    const dobMonth = dobDate.getMonth();
    const toMonth = toDateTime.getMonth();
    const dobDay = dobDate.getDate();
    const toDay = toDateTime.getDate();

    if (toMonth < dobMonth || (toMonth === dobMonth && toDay < dobDay)) {
      age--;
    }

    return age < 0 ? "" : age.toString();
  };

  // Calculate days between from date and to date
  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "";

    const fromDateTime = new Date(fromDate);
    const toDateTime = new Date(toDate);

    if (isNaN(fromDateTime.getTime()) || isNaN(toDateTime.getTime())) return "";

    // Calculate days: (D16-C16)+(DATE(YEAR(D16),MONTH(D16)+1,0)=D16)
    const daysDiff = Math.round(
      (toDateTime - fromDateTime) / (24 * 60 * 60 * 1000)
    );

    // Check if to date is the last day of the month
    const lastDayOfMonth = new Date(
      toDateTime.getFullYear(),
      toDateTime.getMonth() + 1,
      0
    );
    const isLastDayOfMonth = toDateTime.getDate() === lastDayOfMonth.getDate();

    return (daysDiff + (isLastDayOfMonth ? 1 : 0)).toString();
  };

  // Calculate amount based on days (G16*1.66667)
  const calculateAmount = (days) => {
    if (!days || isNaN(Number(days))) return "";
    return (Number(days) * 1.66667).toString();
  };

  // Calculate amount due (apply caps)
  const calculateAmountDue = (amount, isFirstRow) => {
    if (!amount || isNaN(Number(amount))) return "";

    // For first row in first quarter, cap at 60 (IF(I16>=60,60,I16))
    // For all other rows, cap at 50 (IF(I17>=50,50,I17))
    const cap = isFirstRow ? 60 : 50;
    const value = Number(amount);
    return value >= cap ? cap.toString() : value.toFixed(2);
  };

  // Calculate balance (SUM(H16,-K16,G11))
  const calculateBalance = (amountDue, amountSpent, previousBalance) => {
    if (!amountDue || isNaN(Number(amountDue))) return "";

    let balance = Number(amountDue);

    // Subtract amount spent if provided
    if (amountSpent && !isNaN(Number(amountSpent))) {
      balance -= Number(amountSpent);
    }

    // Add previous balance if provided
    if (previousBalance && !isNaN(Number(previousBalance))) {
      balance += Number(previousBalance);
    }

    return balance.toFixed(2);
  };

  // Calculate starting balance for next quarter
  const calculateStartingBalance = (lastBalance, receiptBalance) => {
    if (!lastBalance || isNaN(Number(lastBalance))) return "";

    if (!receiptBalance || isNaN(Number(receiptBalance))) {
      return lastBalance;
    }

    // IF(L18="","",IF(G22="",L18,IF(L18<>0,G22+L18,"")))
    return (Number(lastBalance) + Number(receiptBalance)).toFixed(2);
  };

  // Calculate receipt balance
  const calculateReceiptBalance = (received, spent) => {
    if (!received || !spent || isNaN(Number(received)) || isNaN(Number(spent)))
      return "";
    return (Number(received) - Number(spent)).toString();
  };

  // Helper to render the quarters' form sections
  const renderQuarterSection = (quarter, index) => {
    // Determine key prefixes for the current quarter
    const fromPrefix = `${quarter}QuarterFrom`;
    const toPrefix = `${quarter}QuarterTo`;
    const agePrefix = `${quarter}QuarterAge`;
    const daysPrefix = `${quarter}QuarterDays`;
    const amountPrefix = `${quarter}QuarterAmount`;
    const amtDuePrefix = `${quarter}QuarterAmtDue`;
    const amtSpentPrefix = `${quarter}QuarterAmtSpent`;
    const balancePrefix = `${quarter}QuarterBalance`;
    const startingBalanceField = `${quarter}QuarterStartingBalance`;

    // Receipt fields
    const receiptDateField = `receipt${index}Date`;
    const receiptAmountField = `receipt${index}Amount`;
    const receiptSpentField = `receipt${index}Spent`;
    const receiptBalanceField = `receipt${index}Balance`;
    const receiptSubmitDateField = `receipt${index}DateSubmitted`;

    // Calculate dependent fields when from date changes
    const handleFromDateChange = (e, rowIndex = "") => {
      const { name, value } = e.target;

      // First update the state with the new from date
      handleInputChange(e);

      // Then calculate dependent fields
      const fromDateValue = value;
      const rowSuffix = rowIndex || ""; // For rows 2 and 3

      // Calculate to date
      const toDate = calculateToDate(fromDateValue);
      const calculatedToDate = {
        target: {
          name: `${toPrefix}${rowSuffix}`,
          value: toDate,
        },
      };
      handleInputChange(calculatedToDate);

      // Calculate age (need dob)
      const age = calculateAge(data?.dateOfBirth, toDate);
      const calculatedAge = {
        target: {
          name: `${agePrefix}${rowSuffix}`,
          value: age,
        },
      };
      handleInputChange(calculatedAge);

      // Calculate days
      const days = calculateDays(fromDateValue, toDate);
      const calculatedDays = {
        target: {
          name: `${daysPrefix}${rowSuffix}`,
          value: days,
        },
      };
      handleInputChange(calculatedDays);

      // Calculate amount
      const amount = calculateAmount(days);
      const calculatedAmount = {
        target: {
          name: `${amountPrefix}${rowSuffix}`,
          value: amount,
        },
      };
      handleInputChange(calculatedAmount);

      // Calculate amount due (first row of first quarter gets special cap)
      const isFirstRow = index === 1 && rowSuffix === "";
      const amtDue = calculateAmountDue(amount, isFirstRow);
      const calculatedAmtDue = {
        target: {
          name: `${amtDuePrefix}${rowSuffix}`,
          value: amtDue,
        },
      };
      handleInputChange(calculatedAmtDue);
    };

    // Handle amount spent change to update balance
    const handleAmountSpentChange = (
      e,
      rowIndex = "",
      previousBalanceField = ""
    ) => {
      const { name, value } = e.target;

      // First update the state with the new amount spent
      handleInputChange(e);

      // Get the previous balance
      let previousBalance = "";
      if (previousBalanceField) {
        previousBalance = data?.[previousBalanceField] || "";
      } else if (index === 1 && rowIndex === "") {
        // First row of first quarter - use receipt balance
        previousBalance = data?.[receiptBalanceField] || "";
      }

      // Get amount due
      const rowSuffix = rowIndex || "";
      const amtDue = data?.[`${amtDuePrefix}${rowSuffix}`] || "";

      // Calculate balance
      const balance = calculateBalance(amtDue, value, previousBalance);
      const calculatedBalance = {
        target: {
          name: `${balancePrefix}${rowSuffix}`,
          value: balance,
        },
      };
      handleInputChange(calculatedBalance);
    };

    // Handle receipt amount changes
    const handleReceiptAmountChange = (e) => {
      const { name, value } = e.target;

      // First update the state
      handleInputChange(e);

      // Calculate receipt balance only if both received and spent exist
      const received =
        name === receiptAmountField ? value : data?.[receiptAmountField] || "";
      const spent =
        name === receiptSpentField ? value : data?.[receiptSpentField] || "";

      if (received && spent) {
        const balance = calculateReceiptBalance(received, spent);
        const calculatedBalance = {
          target: {
            name: receiptBalanceField,
            value: balance,
          },
        };
        handleInputChange(calculatedBalance);
      }
    };

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {index === 1
              ? "First"
              : index === 2
              ? "Second"
              : index === 3
              ? "Third"
              : "Fourth"}{" "}
            Quarter
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        {/* Receipt Row */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Receipts
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Date Received"
            type="date"
            name={receiptDateField}
            value={data?.[receiptDateField] || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Amount Received"
            name={receiptAmountField}
            value={data?.[receiptAmountField] || ""}
            onChange={handleReceiptAmountChange}
            helperText="Enter dollar amount"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Amount Spent"
            name={receiptSpentField}
            value={data?.[receiptSpentField] || ""}
            onChange={handleReceiptAmountChange}
            helperText="Enter dollar amount"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Date Submitted"
            type="date"
            name={receiptSubmitDateField}
            value={data?.[receiptSubmitDateField] || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Receipt Balance"
            name={receiptBalanceField}
            value={data?.[receiptBalanceField] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated from Amount Received - Amount Spent">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>

        {/* Starting Balance - only for quarters 2-4 */}
        {index > 1 && (
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Starting Balance"
              name={startingBalanceField}
              value={data?.[startingBalanceField] || ""}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Tooltip title="Auto-calculated from previous quarter's ending balance">
                    <CalculateIcon color="action" sx={{ mr: 1 }} />
                  </Tooltip>
                ),
              }}
              helperText="Auto-calculated (not editable)"
              disabled
            />
          </Grid>
        )}

        {/* Period Rows for each Quarter */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Period Details - Row 1
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            name={`${fromPrefix}`}
            value={data?.[`${fromPrefix}`] || ""}
            onChange={(e) => handleFromDateChange(e)}
            InputLabelProps={{ shrink: true }}
            helperText="Enter start date of period"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="To Date"
            type="date"
            name={`${toPrefix}`}
            value={data?.[`${toPrefix}`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Auto-calculated as last day of month from the From Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Age"
            name={`${agePrefix}`}
            value={data?.[`${agePrefix}`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated based on DOB and To Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Days"
            name={`${daysPrefix}`}
            value={data?.[`${daysPrefix}`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated from From Date to To Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Amount Due"
            name={`${amtDuePrefix}`}
            value={data?.[`${amtDuePrefix}`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated from Days (capped at 60/50)">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Amount Spent"
            name={`${amtSpentPrefix}`}
            value={data?.[`${amtSpentPrefix}`] || ""}
            onChange={(e) =>
              handleAmountSpentChange(e, "", receiptBalanceField)
            }
            helperText="Enter amount spent for this period"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Balance"
            name={`${balancePrefix}`}
            value={data?.[`${balancePrefix}`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated as Amount Due - Amount Spent + Previous Balance">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>

        {/* Additional rows for periods */}
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Period Details - Row 2
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            name={`${fromPrefix}2`}
            value={data?.[`${fromPrefix}2`] || ""}
            onChange={(e) => handleFromDateChange(e, "2")}
            InputLabelProps={{ shrink: true }}
            helperText="Enter start date of period"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="To Date"
            type="date"
            name={`${toPrefix}2`}
            value={data?.[`${toPrefix}2`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Auto-calculated as last day of month from the From Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Age"
            name={`${agePrefix}2`}
            value={data?.[`${agePrefix}2`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated based on DOB and To Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Days"
            name={`${daysPrefix}2`}
            value={data?.[`${daysPrefix}2`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated from From Date to To Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Amount Due"
            name={`${amtDuePrefix}2`}
            value={data?.[`${amtDuePrefix}2`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated from Days (capped at 50)">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Amount Spent"
            name={`${amtSpentPrefix}2`}
            value={data?.[`${amtSpentPrefix}2`] || ""}
            onChange={(e) =>
              handleAmountSpentChange(e, "2", `${balancePrefix}`)
            }
            helperText="Enter amount spent for this period"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Balance"
            name={`${balancePrefix}2`}
            value={data?.[`${balancePrefix}2`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated as Amount Due - Amount Spent + Previous Balance">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>

        <Grid item xs={12} sx={{ mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Period Details - Row 3
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            name={`${fromPrefix}3`}
            value={data?.[`${fromPrefix}3`] || ""}
            onChange={(e) => handleFromDateChange(e, "3")}
            InputLabelProps={{ shrink: true }}
            helperText="Enter start date of period"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="To Date"
            type="date"
            name={`${toPrefix}3`}
            value={data?.[`${toPrefix}3`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Auto-calculated as last day of month from the From Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Age"
            name={`${agePrefix}3`}
            value={data?.[`${agePrefix}3`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated based on DOB and To Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Days"
            name={`${daysPrefix}3`}
            value={data?.[`${daysPrefix}3`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated from From Date to To Date">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Amount Due"
            name={`${amtDuePrefix}3`}
            value={data?.[`${amtDuePrefix}3`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated from Days (capped at 50)">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Amount Spent"
            name={`${amtSpentPrefix}3`}
            value={data?.[`${amtSpentPrefix}3`] || ""}
            onChange={(e) =>
              handleAmountSpentChange(e, "3", `${balancePrefix}2`)
            }
            helperText="Enter amount spent for this period"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Balance"
            name={`${balancePrefix}3`}
            value={data?.[`${balancePrefix}3`] || ""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Tooltip title="Calculated as Amount Due - Amount Spent + Previous Balance">
                  <CalculateIcon color="action" sx={{ mr: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Auto-calculated (not editable)"
            disabled
          />
        </Grid>
      </Grid>
    );
  };

  // Update starting balances when dependent fields change
  useEffect(() => {
    // Calculate starting balance for second quarter
    if (data?.firstQuarterBalance3 && data?.receipt1Balance) {
      const secondQuarterStartingBalance = calculateStartingBalance(
        data.firstQuarterBalance3,
        data.receipt1Balance
      );

      if (secondQuarterStartingBalance !== data?.secondQuarterStartingBalance) {
        handleInputChange({
          target: {
            name: "secondQuarterStartingBalance",
            value: secondQuarterStartingBalance,
          },
        });
      }
    }

    // Calculate starting balance for third quarter
    if (data?.secondQuarterBalance3 && data?.receipt2Balance) {
      const thirdQuarterStartingBalance = calculateStartingBalance(
        data.secondQuarterBalance3,
        data.receipt2Balance
      );

      if (thirdQuarterStartingBalance !== data?.thirdQuarterStartingBalance) {
        handleInputChange({
          target: {
            name: "thirdQuarterStartingBalance",
            value: thirdQuarterStartingBalance,
          },
        });
      }
    }

    // Calculate starting balance for fourth quarter
    if (data?.thirdQuarterBalance3 && data?.receipt3Balance) {
      const fourthQuarterStartingBalance = calculateStartingBalance(
        data.thirdQuarterBalance3,
        data.receipt3Balance
      );

      if (fourthQuarterStartingBalance !== data?.fourthQuarterStartingBalance) {
        handleInputChange({
          target: {
            name: "fourthQuarterStartingBalance",
            value: fourthQuarterStartingBalance,
          },
        });
      }
    }
  }, [
    data?.firstQuarterBalance3,
    data?.receipt1Balance,
    data?.secondQuarterBalance3,
    data?.receipt2Balance,
    data?.thirdQuarterBalance3,
    data?.receipt3Balance,
  ]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Quarterly Clothing Allowance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Form to track clothing allowance funds for foster children on a
        quarterly basis.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Client name, date of birth, transaction date,
          and foster parent fields are automatically populated from the intake
          form and are read-only. Fields that are calculated from other entries
          (like To Date, Age, Days, Amount Due, and Balance) are also read-only.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 3 }} />

      {/* Client Information - READ ONLY fields from intake */}
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
            helperText={!isStandalone ? "Auto-populated from intake form" : ""}
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Intake (DOI)"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={
              !isStandalone ? "Auto-populated from transaction date" : ""
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
            helperText={!isStandalone ? "Auto-populated from intake form" : ""}
            disabled={!isStandalone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Birth (DOB)"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth)}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={!isStandalone ? "Auto-populated from intake form" : ""}
            disabled={!isStandalone}
          />
        </Grid>
      </Grid>

      {/* First Quarter */}
      {renderQuarterSection("first", 1)}

      {/* Second Quarter */}
      {renderQuarterSection("second", 2)}

      {/* Third Quarter */}
      {renderQuarterSection("third", 3)}

      {/* Fourth Quarter */}
      {renderQuarterSection("fourth", 4)}

      {/* Signature Information */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Signature Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Foster Parent Signature Date"
            name="fosterParentSignatureDate"
            type="date"
            value={data?.fosterParentSignatureDate || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Social Worker Signature Date"
            name="socialWorkerSignatureDate"
            type="date"
            value={data?.socialWorkerSignatureDate || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CAFormForm;
