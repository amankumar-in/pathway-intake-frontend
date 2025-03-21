import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

const SAFormForm = ({ data, handleInputChange, isStandalone = false }) => {
  // For focus management
  const [lastFocusedField, setLastFocusedField] = useState(null);
  const inputRefs = useRef({});

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Calculate "to" date based on "from" date (last day of month)
  const calculateToDate = (fromDate) => {
    if (!fromDate) return "";
    try {
      const from = new Date(fromDate);
      const to = new Date(from.getFullYear(), from.getMonth() + 1, 0);
      return to.toISOString().split("T")[0];
    } catch (e) {
      console.error("Error calculating to date:", e);
      return "";
    }
  };

  // Calculate age based on date of birth and to date
  const calculateAge = (dob, toDate) => {
    if (!dob || !toDate) return "";
    try {
      const dobDate = new Date(dob);
      const toDateTime = new Date(toDate);
      const ageInYears = Math.floor(
        (toDateTime - dobDate) / (365.25 * 24 * 60 * 60 * 1000)
      );
      return ageInYears;
    } catch (e) {
      console.error("Error calculating age:", e);
      return "";
    }
  };

  // Calculate days between from date and to date
  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "";
    try {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return Math.round((to - from) / (24 * 60 * 60 * 1000)) + 1;
    } catch (e) {
      console.error("Error calculating days:", e);
      return "";
    }
  };

  // Calculate amount due based on age and days
  const calculateAmountDue = (age, days) => {
    if (isNaN(age) || isNaN(days)) return "";
    let amountDue = 0;
    if (age < 5) {
      amountDue = (15 / 31) * days;
    } else if (age >= 5 && age < 9) {
      amountDue = (25 / 31) * days;
    } else if (age >= 9 && age < 12) {
      amountDue = (35 / 31) * days;
    } else if (age >= 12 && age < 15) {
      amountDue = (40 / 31) * days;
    } else if (age >= 15 && age < 20) {
      amountDue = (45 / 31) * days;
    }
    return amountDue.toFixed(2);
  };

  // Calculate quarter balance
  const calculateQuarterBalance = (amountReceived, amountSpent) => {
    const received = parseFloat(amountReceived || 0);
    const spent = parseFloat(amountSpent || 0);
    if (isNaN(received) || isNaN(spent)) return "";
    return (received - spent).toFixed(2);
  };

  // Calculate monthly balance
  const calculateMonthlyBalance = (amtDue, amtSpent, prevBalance) => {
    const due = parseFloat(amtDue || 0);
    const spent = parseFloat(amtSpent || 0);
    const prev = parseFloat(prevBalance || 0);

    if (isNaN(due)) return "";

    let balance = due;
    if (!isNaN(spent)) balance -= spent;
    if (!isNaN(prev)) balance += prev;

    return balance.toFixed(2);
  };

  // Handle from date changes - updates everything that depends on the from date
  const handleFromDateChange = (e, quarterNum, monthNum) => {
    // First update the from date field in parent
    handleInputChange(e);
    setLastFocusedField(e.target.name);

    const fromDate = e.target.value;
    if (!fromDate) return;

    const quarterPrefix = `q${quarterNum}_`;
    const monthPrefix = `${quarterPrefix}month${monthNum}_`;

    // Calculate and update "to" date
    const toDate = calculateToDate(fromDate);
    handleInputChange({
      target: {
        name: `${monthPrefix}to`,
        value: toDate,
      },
    });

    // Calculate age if we have DOB
    if (data?.dateOfBirth) {
      const age = calculateAge(data.dateOfBirth, toDate);
      handleInputChange({
        target: {
          name: `${monthPrefix}age`,
          value: age,
        },
      });

      // Calculate days
      const days = calculateDays(fromDate, toDate);
      handleInputChange({
        target: {
          name: `${monthPrefix}days`,
          value: days,
        },
      });

      // Calculate amount due
      const amtDue = calculateAmountDue(age, days);
      handleInputChange({
        target: {
          name: `${monthPrefix}amtDue`,
          value: amtDue,
        },
      });

      // Calculate balance (considering previous balance if applicable)
      updateBalance(quarterNum, monthNum, amtDue);
    }
  };

  // Handle amount spent changes - updates balances
  const handleAmountSpentChange = (e, quarterNum, monthNum) => {
    // First update the spent amount field in parent
    handleInputChange(e);
    setLastFocusedField(e.target.name);

    const quarterPrefix = `q${quarterNum}_`;
    const monthPrefix = `${quarterPrefix}month${monthNum}_`;

    // Get amount due for this month
    const amtDue = data?.[`${monthPrefix}amtDue`] || 0;

    // Update balance with new amount spent
    updateBalance(quarterNum, monthNum, amtDue, e.target.value);
  };

  // Handle quarter amount received/spent changes - updates quarter balance
  const handleQuarterAmountChange = (e, quarterNum) => {
    // First update the field in parent
    handleInputChange(e);
    setLastFocusedField(e.target.name);

    const quarterPrefix = `q${quarterNum}_`;
    const amountReceived =
      e.target.name === `${quarterPrefix}amountReceived`
        ? e.target.value
        : data?.[`${quarterPrefix}amountReceived`] || 0;
    const amountSpent =
      e.target.name === `${quarterPrefix}amountSpent`
        ? e.target.value
        : data?.[`${quarterPrefix}amountSpent`] || 0;

    // Calculate and update quarter balance
    const balance = calculateQuarterBalance(amountReceived, amountSpent);
    handleInputChange({
      target: {
        name: `${quarterPrefix}balance`,
        value: balance,
      },
    });
  };

  // Helper function to update balances in sequence
  const updateBalance = (quarterNum, monthNum, amtDue, amtSpent = null) => {
    const quarterPrefix = `q${quarterNum}_`;
    const monthPrefix = `${quarterPrefix}month${monthNum}_`;

    // Use new amount spent if provided, otherwise use existing
    const spentAmount =
      amtSpent !== null ? amtSpent : data?.[`${monthPrefix}spent`] || 0;

    // Get previous balance based on month/quarter
    let prevBalance = 0;

    if (monthNum > 1) {
      // Previous month in same quarter
      prevBalance = data?.[`${quarterPrefix}month${monthNum - 1}_balance`] || 0;
    } else if (quarterNum > 1 && monthNum === 1) {
      // First month of quarters 2-4, use starting balance
      prevBalance = data?.[`${quarterPrefix}startingBalance`] || 0;
    }

    // Calculate this month's balance
    const balance = calculateMonthlyBalance(amtDue, spentAmount, prevBalance);
    handleInputChange({
      target: {
        name: `${monthPrefix}balance`,
        value: balance,
      },
    });

    // If this is the last month of a quarter, update the next quarter's starting balance
    if (monthNum === 3 && quarterNum < 4) {
      handleInputChange({
        target: {
          name: `q${quarterNum + 1}_startingBalance`,
          value: balance,
        },
      });
    }
  };

  // Handle all regular input changes - maintains focus
  const handleFormInputChange = (e) => {
    handleInputChange(e);
    setLastFocusedField(e.target.name);
  };

  // Restore focus after renders
  useEffect(() => {
    if (lastFocusedField && inputRefs.current[lastFocusedField]) {
      const inputElement =
        inputRefs.current[lastFocusedField].querySelector("input");
      if (inputElement) {
        inputElement.focus();

        // Only set cursor position for text inputs, not date inputs
        if (inputElement.type !== "date") {
          try {
            const length = inputElement.value.length;
            inputElement.setSelectionRange(length, length);
          } catch (e) {
            console.log("Could not set selection range", e);
          }
        }
      }
    }
  }, [data, lastFocusedField]);

  // Calculate initial values when form first loads
  useEffect(() => {
    // Calculate starting balances for quarters 2-4
    if (data) {
      // Q2 starting balance (from Q1 month3 balance)
      const q1m3Balance = data?.q1_month3_balance;
      if (q1m3Balance && q1m3Balance !== data?.q2_startingBalance) {
        handleInputChange({
          target: {
            name: "q2_startingBalance",
            value: q1m3Balance,
          },
        });
      }

      // Q3 starting balance (from Q2 month3 balance)
      const q2m3Balance = data?.q2_month3_balance;
      if (q2m3Balance && q2m3Balance !== data?.q3_startingBalance) {
        handleInputChange({
          target: {
            name: "q3_startingBalance",
            value: q2m3Balance,
          },
        });
      }

      // Q4 starting balance (from Q3 month3 balance)
      const q3m3Balance = data?.q3_month3_balance;
      if (q3m3Balance && q3m3Balance !== data?.q4_startingBalance) {
        handleInputChange({
          target: {
            name: "q4_startingBalance",
            value: q3m3Balance,
          },
        });
      }

      // Recalculate all the quarter balances
      [1, 2, 3, 4].forEach((quarterNum) => {
        const quarterPrefix = `q${quarterNum}_`;
        const amountReceived = data[`${quarterPrefix}amountReceived`] || 0;
        const amountSpent = data[`${quarterPrefix}amountSpent`] || 0;

        if (amountReceived || amountSpent) {
          const balance = calculateQuarterBalance(amountReceived, amountSpent);
          if (balance !== data[`${quarterPrefix}balance`]) {
            handleInputChange({
              target: {
                name: `${quarterPrefix}balance`,
                value: balance,
              },
            });
          }
        }
      });

      // For each month in each quarter, recalculate if from date exists
      [1, 2, 3, 4].forEach((quarterNum) => {
        const quarterPrefix = `q${quarterNum}_`;

        [1, 2, 3].forEach((monthNum) => {
          const monthPrefix = `${quarterPrefix}month${monthNum}_`;
          const fromDate = data[`${monthPrefix}from`];

          if (fromDate) {
            const toDate = calculateToDate(fromDate);
            if (toDate !== data[`${monthPrefix}to`]) {
              handleInputChange({
                target: {
                  name: `${monthPrefix}to`,
                  value: toDate,
                },
              });

              if (data?.dateOfBirth) {
                const age = calculateAge(data.dateOfBirth, toDate);
                if (String(age) !== String(data[`${monthPrefix}age`])) {
                  handleInputChange({
                    target: {
                      name: `${monthPrefix}age`,
                      value: age,
                    },
                  });
                }

                const days = calculateDays(fromDate, toDate);
                if (String(days) !== String(data[`${monthPrefix}days`])) {
                  handleInputChange({
                    target: {
                      name: `${monthPrefix}days`,
                      value: days,
                    },
                  });
                }

                const amtDue = calculateAmountDue(age, days);
                if (amtDue !== data[`${monthPrefix}amtDue`]) {
                  handleInputChange({
                    target: {
                      name: `${monthPrefix}amtDue`,
                      value: amtDue,
                    },
                  });

                  // Also update balance
                  updateBalance(quarterNum, monthNum, amtDue);
                }
              }
            }
          }
        });
      });
    }
  }, []); // Run only once when component mounts

  // Quarter component
  const QuarterSection = ({ quarterNumber }) => {
    const quarterNum = parseInt(quarterNumber);
    const dataPrefix = `q${quarterNumber}_`;
    const quarterLabel = `${quarterNumber}${
      quarterNumber === "1"
        ? "st"
        : quarterNumber === "2"
        ? "nd"
        : quarterNumber === "3"
        ? "rd"
        : "th"
    } QUARTER`;
    const showStartingBalance = quarterNumber !== "1";

    return (
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardHeader
          title={quarterLabel}
          titleTypographyProps={{ variant: "h6" }}
          sx={{ bgcolor: "primary.light", color: "white", py: 1 }}
        />
        <CardContent>
          {/* Transaction Row */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Transaction Record
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Date Received"
                  name={`${dataPrefix}dateReceived`}
                  type="date"
                  size="small"
                  value={formatDateForInput(
                    data?.[`${dataPrefix}dateReceived`] || ""
                  )}
                  onChange={handleFormInputChange}
                  onFocus={(e) => setLastFocusedField(e.target.name)}
                  ref={(el) =>
                    (inputRefs.current[`${dataPrefix}dateReceived`] = el)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Amount Received"
                  name={`${dataPrefix}amountReceived`}
                  size="small"
                  value={data?.[`${dataPrefix}amountReceived`] || ""}
                  onChange={(e) => handleQuarterAmountChange(e, quarterNum)}
                  onFocus={(e) => setLastFocusedField(e.target.name)}
                  ref={(el) =>
                    (inputRefs.current[`${dataPrefix}amountReceived`] = el)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Amount Spent"
                  name={`${dataPrefix}amountSpent`}
                  size="small"
                  value={data?.[`${dataPrefix}amountSpent`] || ""}
                  onChange={(e) => handleQuarterAmountChange(e, quarterNum)}
                  onFocus={(e) => setLastFocusedField(e.target.name)}
                  ref={(el) =>
                    (inputRefs.current[`${dataPrefix}amountSpent`] = el)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Date Submitted"
                  name={`${dataPrefix}dateSubmitted`}
                  type="date"
                  size="small"
                  value={formatDateForInput(
                    data?.[`${dataPrefix}dateSubmitted`] || ""
                  )}
                  onChange={handleFormInputChange}
                  onFocus={(e) => setLastFocusedField(e.target.name)}
                  ref={(el) =>
                    (inputRefs.current[`${dataPrefix}dateSubmitted`] = el)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Transaction Balance"
                name={`${dataPrefix}balance`}
                value={data?.[`${dataPrefix}balance`] || ""}
                size="small"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                helperText="Auto-calculated (Amount Received - Amount Spent)"
                disabled={true}
              />
            </Box>
          </Box>

          {/* Month Periods */}
          {showStartingBalance && (
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <TextField
                label="Starting Balance"
                name={`${dataPrefix}startingBalance`}
                value={data?.[`${dataPrefix}startingBalance`] || ""}
                size="small"
                sx={{ width: "200px" }}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                helperText={`Auto-calculated from Q${
                  quarterNumber - 1
                } final balance`}
                disabled={true}
              />
            </Box>
          )}

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Period
                  </TableCell>
                  <TableCell align="center">Age</TableCell>
                  <TableCell align="center">Days</TableCell>
                  <TableCell align="center">Amt Due</TableCell>
                  <TableCell align="center">Amount Spent</TableCell>
                  <TableCell align="center">Balance</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((month) => (
                  <TableRow key={month}>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`${dataPrefix}month${month}_from`}
                        type="date"
                        value={formatDateForInput(
                          data?.[`${dataPrefix}month${month}_from`] || ""
                        )}
                        onChange={(e) =>
                          handleFromDateChange(e, quarterNum, month)
                        }
                        onFocus={(e) => setLastFocusedField(e.target.name)}
                        ref={(el) =>
                          (inputRefs.current[
                            `${dataPrefix}month${month}_from`
                          ] = el)
                        }
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`${dataPrefix}month${month}_to`}
                        type="date"
                        value={formatDateForInput(
                          data?.[`${dataPrefix}month${month}_to`] || ""
                        )}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        disabled={true}
                        helperText="Auto-calculated"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`${dataPrefix}month${month}_age`}
                        value={data?.[`${dataPrefix}month${month}_age`] || ""}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`${dataPrefix}month${month}_days`}
                        value={data?.[`${dataPrefix}month${month}_days`] || ""}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`${dataPrefix}month${month}_amtDue`}
                        value={
                          data?.[`${dataPrefix}month${month}_amtDue`] || ""
                        }
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`${dataPrefix}month${month}_spent`}
                        value={data?.[`${dataPrefix}month${month}_spent`] || ""}
                        onChange={(e) =>
                          handleAmountSpentChange(e, quarterNum, month)
                        }
                        onFocus={(e) => setLastFocusedField(e.target.name)}
                        ref={(el) =>
                          (inputRefs.current[
                            `${dataPrefix}month${month}_spent`
                          ] = el)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`${dataPrefix}month${month}_balance`}
                        value={
                          data?.[`${dataPrefix}month${month}_balance`] || ""
                        }
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        disabled={true}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Quarterly Spending Allowance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This form tracks the quarterly spending allowance for the foster child.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Several fields in this form are automatically
          populated from the intake form and cannot be edited. The "To" dates,
          ages, days, amounts due, and balances are all calculated
          automatically.
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
            onChange={handleFormInputChange}
            onFocus={(e) => setLastFocusedField(e.target.name)}
            ref={(el) => (inputRefs.current["name"] = el)}
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
            label="Date of Intake"
            name="transactionDate"
            type="date"
            value={formatDateForInput(data?.transactionDate)}
            onChange={handleFormInputChange}
            onFocus={(e) => setLastFocusedField(e.target.name)}
            ref={(el) => (inputRefs.current["transactionDate"] = el)}
            InputLabelProps={{
              shrink: true,
            }}
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
            label="Foster Home"
            name="nameOfFosterParents"
            value={data?.nameOfFosterParents || ""}
            onChange={handleFormInputChange}
            onFocus={(e) => setLastFocusedField(e.target.name)}
            ref={(el) => (inputRefs.current["nameOfFosterParents"] = el)}
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
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formatDateForInput(data?.dateOfBirth)}
            onChange={handleFormInputChange}
            onFocus={(e) => setLastFocusedField(e.target.name)}
            ref={(el) => (inputRefs.current["dateOfBirth"] = el)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: !isStandalone,
            }}
            helperText={!isStandalone ? "Auto-populated from intake form" : ""}
            disabled={!isStandalone}
          />
        </Grid>
      </Grid>

      {/* Quarterly Sections */}
      <QuarterSection quarterNumber="1" />
      <QuarterSection quarterNumber="2" />
      <QuarterSection quarterNumber="3" />
      <QuarterSection quarterNumber="4" />

      {/* Signature Date */}
      <Typography variant="h6" gutterBottom>
        Signature Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Signature Date"
            name="signatureDate"
            type="date"
            value={formatDateForInput(data?.signatureDate || new Date())}
            onChange={handleFormInputChange}
            onFocus={(e) => setLastFocusedField(e.target.name)}
            ref={(el) => (inputRefs.current["signatureDate"] = el)}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Date when signatures are collected"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SAFormForm;
