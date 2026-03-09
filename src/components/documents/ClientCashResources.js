import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// ClientCashResources component using proper field mapping
const ClientCashResources = ({
  data,
  signatures = {},
  onAddSignature,
  onRemoveSignature,
  signatureAreaClass,
  deleteButtonClass,
  placeholderClass,
  isStandalone = false,
  signatureLabels = {},
  collectedSignatures = {},
}) => {
  // State for signature menu
  const [signatureMenuAnchor, setSignatureMenuAnchor] = useState(null);
  const [currentSignatureArea, setCurrentSignatureArea] = useState("");
  const [currentRowIndex, setCurrentRowIndex] = useState(null);

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return "";
    return parseFloat(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Helper to determine if we're in print/export mode
  const isPrintMode = () => {
    return (
      document.body.classList.contains("print-mode") ||
      window.matchMedia("print").matches ||
      document.body.getAttribute("data-pdf-export") === "true"
    );
  };

  useEffect(() => {
    // Listen for print events to properly hide controls
    const beforePrintHandler = () => document.body.classList.add("print-mode");
    const afterPrintHandler = () =>
      document.body.classList.remove("print-mode");

    window.addEventListener("beforeprint", beforePrintHandler);
    window.addEventListener("afterprint", afterPrintHandler);

    return () => {
      window.removeEventListener("beforeprint", beforePrintHandler);
      window.removeEventListener("afterprint", afterPrintHandler);
    };
  }, []);

  // Handle signature icon click for transaction row
  const handleSignatureClick = (event, signatureArea, rowIndex) => {
    if (isStandalone) {
      // For standalone documents, call onAddSignature directly with the event
      if (onAddSignature) {
        // Use the standalone signature format but include the row index in the target area
        onAddSignature(
          "standaloneSignature",
          `${signatureArea}-${rowIndex}`,
          event
        );
      }
    } else {
      // For regular documents, show the signature selection menu
      setSignatureMenuAnchor(event.currentTarget);
      setCurrentSignatureArea(signatureArea);
      setCurrentRowIndex(rowIndex);
    }
  };

  // Handle menu close
  const handleMenuClose = () => {
    setSignatureMenuAnchor(null);
    setCurrentSignatureArea("");
    setCurrentRowIndex(null);
  };

  // Handle signature selection
  const handleSignatureSelect = (signatureType) => {
    if (onAddSignature) {
      // Include row index in the signature area to make it unique per row
      const uniqueSignatureArea = `${currentSignatureArea}-${currentRowIndex}`;
      onAddSignature(signatureType, uniqueSignatureArea);
    }
    handleMenuClose();
  };

  // Handle signature removal
  const handleRemoveSignature = (signatureArea, rowIndex) => {
    if (onRemoveSignature) {
      // Include row index in the signature area to make it unique per row
      const uniqueSignatureArea = `${signatureArea}-${rowIndex}`;
      onRemoveSignature(uniqueSignatureArea);
    }
  };

  // Check if a signature is placed
  const hasSignature = (signatureArea, rowIndex) => {
    const uniqueSignatureArea = `${signatureArea}-${rowIndex}`;
    return signatures && signatures[uniqueSignatureArea];
  };

  // Render signature area for a transaction row
  const renderSignatureArea = (title, signatureArea, rowIndex) => {
    const signaturePlaced = hasSignature(signatureArea, rowIndex);
    const inPrintMode = isPrintMode();
    const uniqueSignatureArea = `${signatureArea}-${rowIndex}`;

    return (
      <div
        className={signatureAreaClass || "signature-area"}
        style={{ marginTop: "0", height: "32px" }}
      >
        {signaturePlaced ? (
          <div>
            <div
              style={{
                height: "24px",
                backgroundImage: `url(${signatures[uniqueSignatureArea]})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                borderBottom: "1px solid #ccc",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "8px",
              }}
            >
              <span>{title}</span>
              {!inPrintMode && (
                <Tooltip title="Remove Signature">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() =>
                      handleRemoveSignature(signatureArea, rowIndex)
                    }
                    className={deleteButtonClass || "delete-button"}
                    style={{ padding: "2px" }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                height: "24px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!inPrintMode && (
                <Tooltip
                  title={isStandalone ? "Place Signature" : "Add Signature"}
                >
                  <IconButton
                    color="primary"
                    onClick={(e) =>
                      handleSignatureClick(e, signatureArea, rowIndex)
                    }
                    className={placeholderClass || "signature-placeholder"}
                    size="small"
                    style={{ padding: "2px" }}
                  >
                    <AddCircleOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <span style={{ fontSize: "8px" }}>{title}</span>
          </div>
        )}
      </div>
    );
  };

  // Get transactions data or use empty array if none
  const transactions = data?.transactions || [];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        lineHeight: "1.4",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header section with logo */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "45px",
            marginBottom: "10px",
            display: "block",
            margin: "0 auto",
          }}
        />
        <h3
          style={{
            margin: "10px 0",
            color: "#333333",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Record of Client's Safeguarded Cash Resources
        </h3>
      </div>

      {/* Client information section */}
      <div style={{ marginBottom: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: "15%",
                  fontSize: "12px",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                CLIENT NAME:
              </td>
              <td
                style={{
                  width: "35%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingLeft: "5px",
                  fontWeight: "bold",
                }}
              >
                {data?.name || ""}
              </td>
              <td
                style={{
                  width: "15%",
                  fontSize: "12px",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                Date of Birth:
              </td>
              <td
                style={{
                  width: "40%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingLeft: "5px",
                  fontWeight: "bold",
                }}
              >
                {formatDate(data?.dateOfBirth) || ""}
              </td>
            </tr>
            <tr>
              <td style={{ height: "15px" }}></td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "12px",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                FOSTER HOME:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingLeft: "5px",
                  fontWeight: "bold",
                }}
              >
                {data?.nameOfFosterParents || ""}
              </td>
              <td
                style={{
                  fontSize: "12px",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                Date of Intake:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingLeft: "5px",
                }}
              >
                {formatDate(data?.transactionDate) || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Transaction Table */}
      <div style={{ marginTop: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  fontSize: "11px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "10%",
                }}
                rowSpan="2"
              >
                DATE
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  fontSize: "11px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "20%",
                }}
                rowSpan="2"
              >
                DESCRIPTION
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  fontSize: "11px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "10%",
                }}
                rowSpan="2"
              >
                AMOUNT
                <br />
                RECEIVED
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  fontSize: "11px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "10%",
                }}
                rowSpan="2"
              >
                AMOUNT SPENT
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  fontSize: "11px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "10%",
                }}
                rowSpan="2"
              >
                BALANCE
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  fontSize: "11px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "40%",
                }}
                colSpan="2"
              >
                SIGNATURE FOR CASH TRANSACTIONS
              </th>
            </tr>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  fontSize: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "20%",
                }}
              >
                FOSTER PARENT
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  fontSize: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "20%",
                }}
              >
                CLIENT OR
                <br />
                REPRESENTATIVE
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0
              ? transactions.map((transaction, index) => (
                  <tr key={transaction.id || index}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "center",
                        fontSize: "11px",
                      }}
                    >
                      {formatDate(transaction.date)}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        fontSize: "11px",
                      }}
                    >
                      {transaction.description}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "right",
                        fontSize: "11px",
                      }}
                    >
                      {transaction.amountReceived
                        ? formatCurrency(transaction.amountReceived)
                        : ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "right",
                        fontSize: "11px",
                      }}
                    >
                      {transaction.amountSpent
                        ? formatCurrency(transaction.amountSpent)
                        : ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "right",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      {transaction.balance
                        ? formatCurrency(transaction.balance)
                        : ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px",
                        verticalAlign: "top",
                      }}
                    >
                      {renderSignatureArea("", "fosterParentSignature", index)}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px",
                        verticalAlign: "top",
                      }}
                    >
                      {renderSignatureArea("", "clientSignature", index)}
                    </td>
                  </tr>
                ))
              : // If no transactions, render at least 15 empty rows
                Array.from({ length: 15 }).map((_, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "26px",
                      }}
                    ></td>
                    <td
                      style={{ border: "1px solid #ddd", padding: "4px" }}
                    ></td>
                    <td
                      style={{ border: "1px solid #ddd", padding: "4px" }}
                    ></td>
                    <td
                      style={{ border: "1px solid #ddd", padding: "4px" }}
                    ></td>
                    <td
                      style={{ border: "1px solid #ddd", padding: "4px" }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px",
                        verticalAlign: "top",
                      }}
                    >
                      {renderSignatureArea("", "fosterParentSignature", index)}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px",
                        verticalAlign: "top",
                      }}
                    >
                      {renderSignatureArea("", "clientSignature", index)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Signature selection menu */}
      <SignatureMenu
        anchorEl={signatureMenuAnchor}
        open={Boolean(signatureMenuAnchor)}
        onClose={handleMenuClose}
        onSelect={handleSignatureSelect}
        signatureLabels={signatureLabels}
        collectedSignatures={collectedSignatures}
      />
    </div>
  );
};

export default ClientCashResources;
