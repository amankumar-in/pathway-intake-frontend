import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// Logo placeholder

const CAForm = ({
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

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
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

  // Handle signature icon click - works with both standalone and regular documents
  const handleSignatureClick = (event, signatureArea) => {
    if (isStandalone) {
      // For standalone documents, call onAddSignature directly
      if (onAddSignature) {
        onAddSignature("standaloneSignature", signatureArea, event);
      }
    } else {
      // For regular documents, show the signature selection menu
      setSignatureMenuAnchor(event.currentTarget);
      setCurrentSignatureArea(signatureArea);
    }
  };

  // Handle menu close
  const handleMenuClose = () => {
    setSignatureMenuAnchor(null);
    setCurrentSignatureArea("");
  };

  // Handle signature selection
  const handleSignatureSelect = (signatureType) => {
    if (onAddSignature) {
      onAddSignature(signatureType, currentSignatureArea);
    }
    handleMenuClose();
  };

  // Handle signature removal
  const handleRemoveSignature = (signatureArea) => {
    if (onRemoveSignature) {
      onRemoveSignature(signatureArea);
    }
  };

  // Check if a signature is placed
  const hasSignature = (signatureArea) => {
    return signatures && signatures[signatureArea];
  };

  // Render signature area
  const renderSignatureArea = (title, signatureArea) => {
    const signaturePlaced = hasSignature(signatureArea);
    const inPrintMode = isPrintMode();

    return (
      <div
        className={signatureAreaClass || "signature-area"}
        style={{ marginTop: "8px" }}
      >
        {signaturePlaced ? (
          <div>
            <div
              style={{
                height: "35px",
                backgroundImage: `url(${signatures[signatureArea]})`,
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
                fontSize: "11px",
              }}
            >
              <span>{title}</span>
              {!inPrintMode && (
                <Tooltip title="Remove Signature">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveSignature(signatureArea)}
                    className={deleteButtonClass || "delete-button"}
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
                height: "35px",
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
                    onClick={(e) => handleSignatureClick(e, signatureArea)}
                    className={placeholderClass || "signature-placeholder"}
                    size="small"
                  >
                    <AddCircleOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <span style={{ fontSize: "11px" }}>{title}</span>
          </div>
        )}
      </div>
    );
  };

  // Helper function to render rows in the quarterly section
  const renderQuarterlyRow = (data) => {
    return (
      <tr>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            width: "12%",
            backgroundColor: "#e0f2e0",
          }}
        >
          {data.from || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            width: "12%",
            backgroundColor: "#e0f2e0",
          }}
        >
          {data.to || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            width: "8%",
          }}
        >
          {data.age || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            width: "8%",
          }}
        >
          {data.days || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            width: "12%",
          }}
        >
          {data.amtDue ? `$ ${data.amtDue}` : "$ -"}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            width: "8%",
          }}
        >
          {data.dated || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            width: "8%",
            backgroundColor: "#e0f2e0",
          }}
        >
          {data.amtSpent || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            width: "12%",
          }}
        >
          {data.balance || ""}
        </td>
      </tr>
    );
  };

  // Helper function to render receipt rows
  const renderReceiptRow = (data, rowNum) => {
    return (
      <tr>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            backgroundColor: "#e0f2e0",
            height: "20px",
          }}
        >
          {data[`receipt${rowNum}Date`] || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            backgroundColor: "#e0f2e0",
            height: "20px",
          }}
        >
          {data[`receipt${rowNum}Amount`] || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            backgroundColor: "#e0f2e0",
            height: "20px",
          }}
        >
          {data[`receipt${rowNum}Spent`] || ""}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            height: "20px",
          }}
        >
          {data[`receipt${rowNum}Balance`]
            ? `$ ${data[`receipt${rowNum}Balance`]}`
            : "$ -"}
        </td>
        <td
          style={{
            padding: "2px 5px",
            fontSize: "11px",
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #ccc",
            backgroundColor: "#e0f2e0",
            height: "20px",
          }}
        >
          {data[`receipt${rowNum}DateSubmitted`] || ""}
        </td>
      </tr>
    );
  };

  // Create quarterly section component
  const QuarterlySection = ({quarterNumber, startingBalance,
  signatureLabels = {},
  collectedSignatures = {},
}) => {
    const quarterTitle = `${quarterNumber}${
      quarterNumber === "1"
        ? "st"
        : quarterNumber === "2"
        ? "nd"
        : quarterNumber === "3"
        ? "rd"
        : "th"
    } QUARTER`;
    const dataPrefix = `${
      quarterNumber === "1"
        ? "first"
        : quarterNumber === "2"
        ? "second"
        : quarterNumber === "3"
        ? "third"
        : "fourth"
    }Quarter`;
    const showStartingBalance = quarterNumber !== "1";

    return (
      <div style={{ marginBottom: "20px", pageBreakInside: "avoid" }}>
        {/* Receipt Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "10px",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                style={{
                  padding: "3px 5px",
                  fontSize: "11px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                Date Received
              </th>
              <th
                style={{
                  padding: "3px 5px",
                  fontSize: "11px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                Amount Received
              </th>
              <th
                style={{
                  padding: "3px 5px",
                  fontSize: "11px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                Amount Spent
              </th>
              <th
                style={{
                  padding: "3px 5px",
                  fontSize: "11px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                Balance
              </th>
              <th
                style={{
                  padding: "3px 5px",
                  fontSize: "11px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                Date Sub. To CSW/AP
              </th>
            </tr>
          </thead>
          <tbody>{renderReceiptRow(data, quarterNumber)}</tbody>
        </table>

        {/* Container div with flexbox for Quarter Title and Starting Balance */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          {/* Quarter Title */}
          <div
            style={{
              width: "25%",
              border: "2px solid #ccc",
              padding: "2px 5px",
              fontSize: "11px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            {quarterTitle}
          </div>

          {/* Starting Balance (if needed) */}
          {showStartingBalance && (
            <div
              style={{
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "10px" }}>
                <strong>Starting Balance:</strong>
              </div>
              <div
                style={{
                  width: "80px",
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                }}
              >
                {data[`${dataPrefix}StartingBalance`] || ""}
              </div>
            </div>
          )}
        </div>

        {/* Quarter Data Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "15px",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr>
              <th
                colSpan="2"
                style={{
                  fontSize: "11px",
                  padding: "3px 5px",
                  textAlign: "center",
                  backgroundColor: "#f2f2f2",
                  border: "1px solid #ccc",
                }}
              >
                PERIOD
              </th>
              <th
                colSpan="3"
                style={{
                  fontSize: "11px",
                  padding: "3px 5px",
                  textAlign: "center",
                  backgroundColor: "#f2f2f2",
                  border: "1px solid #ccc",
                }}
              >
                AMOUNT
              </th>
              <th
                colSpan="3"
                style={{
                  fontSize: "11px",
                  padding: "3px 5px",
                  textAlign: "center",
                  backgroundColor: "#f2f2f2",
                  border: "1px solid #ccc",
                }}
              >
                QUARTERLY BALANCE
              </th>
            </tr>
            <tr>
              <th
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "12%",
                }}
              >
                from:
              </th>
              <th
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "12%",
                }}
              >
                to:
              </th>
              <th
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "8%",
                }}
              >
                Age
              </th>
              <th
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "8%",
                }}
              >
                Days
              </th>
              <th
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "12%",
                }}
              >
                Amt Due
              </th>
              <th
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "8%",
                }}
              >
                Date
              </th>
              <th
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "8%",
                }}
              >
                SPENT
              </th>
              <th
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "12%",
                }}
              >
                BALANCE
              </th>
            </tr>
          </thead>
          <tbody>
            {renderQuarterlyRow({
              from: data[`${dataPrefix}From`] || "",
              to: data[`${dataPrefix}To`] || "",
              age: data[`${dataPrefix}Age`] || "",
              days: data[`${dataPrefix}Days`] || "",
              amtDue: data[`${dataPrefix}AmtDue`] || "",
              dated: data[`${dataPrefix}Dated`] || "",
              amtSpent: data[`${dataPrefix}AmtSpent`] || "",
              balance: data[`${dataPrefix}Balance`] || "",
            })}
            {renderQuarterlyRow({
              from: data[`${dataPrefix}From2`] || "",
              to: data[`${dataPrefix}To2`] || "",
              age: data[`${dataPrefix}Age2`] || "",
              days: data[`${dataPrefix}Days2`] || "",
              amtDue: data[`${dataPrefix}AmtDue2`] || "",
              dated: data[`${dataPrefix}Dated2`] || "",
              amtSpent: data[`${dataPrefix}AmtSpent2`] || "",
              balance: data[`${dataPrefix}Balance2`] || "",
            })}
            {renderQuarterlyRow({
              from: data[`${dataPrefix}From3`] || "",
              to: data[`${dataPrefix}To3`] || "",
              age: data[`${dataPrefix}Age3`] || "",
              days: data[`${dataPrefix}Days3`] || "",
              amtDue: data[`${dataPrefix}AmtDue3`] || "",
              dated: data[`${dataPrefix}Dated3`] || "",
              amtSpent: data[`${dataPrefix}AmtSpent3`] || "",
              balance: data[`${dataPrefix}Balance3`] || "",
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        fontFamily: "Arial, sans-serif",
        fontSize: "10px",
        lineHeight: "1.2",
        pageBreakInside: "avoid",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header section with logo */}
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "40px",
            marginBottom: "8px",
            display: "block",
            margin: "0 auto",
          }}
        />
        <h2
          style={{
            margin: "8px 0",
            color: "#4285F4",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          PATHWAY FAMILY SERVICES
        </h2>
        <h3
          style={{
            margin: "8px 0",
            color: "#4285F4",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          QUARTERLY CLOTHING ALLOWANCE
        </h3>
      </div>

      {/* Client Information */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "15px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "12%", fontSize: "11px", padding: "5px 0" }}>
              <strong>CLIENT NAME:</strong>
            </td>
            <td
              style={{
                width: "38%",
                borderBottom: "1px solid #000",
                padding: "5px 0",
                fontSize: "11px",
                backgroundColor: "#e0f2e0",
              }}
            >
              {data?.name || ""}
            </td>
            <td style={{ width: "30%", textAlign: "right", fontSize: "11px" }}>
              <strong>DOI:</strong>
            </td>
            <td
              style={{
                width: "20%",
                borderBottom: "1px solid #000",
                padding: "5px 0",
                fontSize: "11px",
              }}
            >
              {formatDate(data?.transactionDate) || ""}
            </td>
          </tr>
          <tr>
            <td style={{ width: "12%", fontSize: "11px", padding: "5px 0" }}>
              <strong>FOSTER HOME:</strong>
            </td>
            <td
              style={{
                width: "38%",
                borderBottom: "1px solid #000",
                padding: "5px 0",
                fontSize: "11px",
                backgroundColor: "#e0f2e0",
              }}
            >
              {data?.nameOfFosterParents || ""}
            </td>
            <td style={{ width: "30%", textAlign: "right", fontSize: "11px" }}>
              <strong>DOB:</strong>
            </td>
            <td
              style={{
                width: "20%",
                borderBottom: "1px solid #000",
                padding: "5px 0",
                fontSize: "11px",
              }}
            >
              {formatDate(data?.dateOfBirth) || ""}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Quarterly Sections */}
      <QuarterlySection quarterNumber="1" />
      <QuarterlySection quarterNumber="2" startingBalance={true} />
      <QuarterlySection quarterNumber="3" startingBalance={true} />
      <QuarterlySection quarterNumber="4" startingBalance={true} />

      {/* Signature section */}
      <div style={{ marginTop: "30px", pageBreakInside: "avoid" }}>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {renderSignatureArea(
                  "FOSTER PARENT SIGNATURE",
                  "fosterParentSignature"
                )}
              </td>
              <td style={{ width: "10%" }}></td>
              <td
                style={{
                  width: "45%",
                  verticalAlign: "bottom",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    height: "25px",
                    marginBottom: "5px",
                  }}
                >
                  {data?.fosterParentSignatureDate || ""}
                </div>
                <div style={{ fontSize: "11px", textAlign: "center" }}>
                  DATE
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ height: "30px" }}></td>
            </tr>
            <tr>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {renderSignatureArea(
                  "SOCIAL WORKER SIGNATURE",
                  "socialWorkerSignature"
                )}
              </td>
              <td style={{ width: "10%" }}></td>
              <td
                style={{
                  width: "45%",
                  verticalAlign: "bottom",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    height: "25px",
                    marginBottom: "5px",
                  }}
                >
                  {data?.socialWorkerSignatureDate || ""}
                </div>
                <div style={{ fontSize: "11px", textAlign: "center" }}>
                  DATE
                </div>
              </td>
            </tr>
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

export default CAForm;
