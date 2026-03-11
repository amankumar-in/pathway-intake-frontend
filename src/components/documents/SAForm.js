import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// SAForm component using proper field mapping
const SAForm = ({
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

  // Helper functions
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

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$     -";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
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

  // Handle signature icon click
  const handleSignatureClick = (event, signatureArea) => {
    if (isStandalone) {
      // For standalone documents, call onAddSignature directly with the event
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
                borderBottom: "1px solid #9c9c9c",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "9px",
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
                borderBottom: "1px solid #9c9c9c",
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
            <span style={{ fontSize: "9px" }}>{title}</span>
          </div>
        )}
      </div>
    );
  };

  // Create quarterly section component
  const QuarterlySection = ({quarterNumber, startRow,
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
    const dataPrefix = `q${quarterNumber}_`;
    const showStartingBalance = quarterNumber !== "1";

    return (
      <div style={{ marginBottom: "20px", pageBreakInside: "avoid" }}>
        {/* Transaction Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "10px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "15%",
                  backgroundColor: "#a8d1ff",
                  border: "1px solid #9c9c9c",
                  fontSize: "10px",
                  padding: "3px",
                  textAlign: "center",
                }}
              >
                Date Received
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#a8d1ff",
                  border: "1px solid #9c9c9c",
                  fontSize: "10px",
                  padding: "3px",
                  textAlign: "center",
                }}
              >
                Amount Received
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#a8d1ff",
                  border: "1px solid #9c9c9c",
                  fontSize: "10px",
                  padding: "3px",
                  textAlign: "center",
                }}
              >
                Amount Spent
              </th>
              <th
                style={{
                  width: "15%",
                  backgroundColor: "#a8d1ff",
                  border: "1px solid #9c9c9c",
                  fontSize: "10px",
                  padding: "3px",
                  textAlign: "center",
                }}
              >
                Balance
              </th>
              <th
                style={{
                  width: "30%",
                  backgroundColor: "#a8d1ff",
                  border: "1px solid #9c9c9c",
                  fontSize: "10px",
                  padding: "3px",
                  textAlign: "center",
                }}
              >
                Date Sub. To CSW/AP
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid #9c9c9c",
                  backgroundColor: "#a8d1ff",
                  padding: "3px",
                  fontSize: "10px",
                  height: "20px",
                  textAlign: "center",
                }}
              >
                {data[`${dataPrefix}dateReceived`] || ""}
              </td>
              <td
                style={{
                  border: "1px solid #9c9c9c",
                  backgroundColor: "#a8d1ff",
                  padding: "3px",
                  fontSize: "10px",
                  height: "20px",
                  textAlign: "center",
                }}
              >
                {formatCurrency(data[`${dataPrefix}amountReceived`])}
              </td>
              <td
                style={{
                  border: "1px solid #9c9c9c",
                  backgroundColor: "#a8d1ff",
                  padding: "3px",
                  fontSize: "10px",
                  height: "20px",
                  textAlign: "center",
                }}
              >
                {formatCurrency(data[`${dataPrefix}amountSpent`])}
              </td>
              <td
                style={{
                  border: "1px solid #9c9c9c",
                  backgroundColor: "#a8d1ff",
                  padding: "3px",
                  fontSize: "10px",
                  height: "20px",
                  textAlign: "center",
                }}
              >
                {formatCurrency(data[`${dataPrefix}balance`])}
              </td>
              <td
                style={{
                  border: "1px solid #9c9c9c",
                  backgroundColor: "#a8d1ff",
                  padding: "3px",
                  fontSize: "10px",
                  height: "20px",
                  textAlign: "center",
                }}
              >
                {data[`${dataPrefix}dateSubmitted`] || ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Container div with flexbox */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2px",
          }}
        >
          {/* Quarter Title */}
          <div
            style={{
              width: "25%",
              border: "2px solid #9c9c9c",
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
                fontSize: "10px",
              }}
            >
              Starting Balance:{" "}
              {formatCurrency(data[`${dataPrefix}startingBalance`])}
            </div>
          )}
        </div>

        {/* Unified Monthly Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                colSpan="2"
                style={{
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
              >
                PERIOD
              </th>
              <th
                style={{
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                Age
              </th>
              <th
                style={{
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                Days
              </th>
              <th
                style={{
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                Amt Due
              </th>
              <th
                style={{
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                AMOUNT SPENT
              </th>
              <th
                style={{
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                BALANCE
              </th>
            </tr>
            <tr>
              <th
                style={{
                  width: "12.5%",
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                from:
              </th>
              <th
                style={{
                  width: "12.5%",
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                to:
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                &nbsp;
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                &nbsp;
              </th>
              <th
                style={{
                  width: "20%",
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                &nbsp;
              </th>
              <th
                style={{
                  width: "17.5%",
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                &nbsp;
              </th>
              <th
                style={{
                  width: "17.5%",
                  border: "1px solid #9c9c9c",
                  padding: "2px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((month) => (
              <tr key={month}>
                <td
                  style={{
                    border: "1px solid #9c9c9c",
                    padding: "2px",
                    fontSize: "10px",
                    height: "22px",
                    backgroundColor: "#a8d1ff",
                    textAlign: "center",
                  }}
                >
                  {data[`${dataPrefix}month${month}_from`] || ""}
                </td>
                <td
                  style={{
                    border: "1px solid #9c9c9c",
                    padding: "2px",
                    fontSize: "10px",
                    height: "22px",
                    backgroundColor: "#a8d1ff",
                    textAlign: "center",
                  }}
                >
                  {data[`${dataPrefix}month${month}_to`] || ""}
                </td>
                <td
                  style={{
                    border: "1px solid #9c9c9c",
                    padding: "2px",
                    fontSize: "10px",
                    height: "22px",
                    textAlign: "center",
                  }}
                >
                  {data[`${dataPrefix}month${month}_age`] || ""}
                </td>
                <td
                  style={{
                    border: "1px solid #9c9c9c",
                    padding: "2px",
                    fontSize: "10px",
                    height: "22px",
                    textAlign: "center",
                  }}
                >
                  {data[`${dataPrefix}month${month}_days`] || "0"}
                </td>
                <td
                  style={{
                    border: "1px solid #9c9c9c",
                    padding: "2px",
                    fontSize: "10px",
                    height: "22px",
                    textAlign: "center",
                  }}
                >
                  {formatCurrency(data[`${dataPrefix}month${month}_amtDue`])}
                </td>
                <td
                  style={{
                    border: "1px solid #9c9c9c",
                    padding: "2px",
                    fontSize: "10px",
                    height: "22px",
                    backgroundColor: "#a8d1ff",
                    textAlign: "center",
                  }}
                >
                  {formatCurrency(data[`${dataPrefix}month${month}_spent`])}
                </td>
                <td
                  style={{
                    border: "1px solid #9c9c9c",
                    padding: "2px",
                    fontSize: "10px",
                    height: "22px",
                    textAlign: "center",
                  }}
                >
                  {formatCurrency(data[`${dataPrefix}month${month}_balance`])}
                </td>
              </tr>
            ))}
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
      {/* Header section with title */}
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "35px",
            marginBottom: "8px",
            display: "block",
            margin: "0 auto",
          }}
        />
        <h2
          style={{
            margin: "5px 0",
            color: "#4285f4",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          PATHWAY FAMILY SERVICES
        </h2>
        <h3
          style={{
            margin: "5px 0",
            color: "#4285f4",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          QUARTERLY SPENDING ALLOWANCE
        </h3>
      </div>

      {/* Client and resource home information */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "15px",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "12%",
                fontSize: "10px",
                padding: "3px",
                verticalAlign: "bottom",
              }}
            >
              CLIENT NAME:
            </td>
            <td
              style={{
                width: "38%",
                fontSize: "10px",
                padding: "3px 5px",
                borderBottom: "1px solid #9c9c9c",
                backgroundColor: "#a8d1ff",
                verticalAlign: "bottom",
              }}
            >
              {data?.name || ""}
            </td>
            <td style={{ width: "35%", fontSize: "10px" }}></td>
            <td
              style={{
                width: "5%",
                fontSize: "10px",
                padding: "3px",
                verticalAlign: "bottom",
              }}
            >
              DOI:
            </td>
            <td
              style={{
                width: "10%",
                fontSize: "10px",
                padding: "3px 5px",
                borderBottom: "1px solid #9c9c9c",
                verticalAlign: "bottom",
              }}
            >
              {formatDate(data?.transactionDate || "")}
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: "10px",
                padding: "3px",
                verticalAlign: "bottom",
              }}
            >
              FOSTER HOME:
            </td>
            <td
              style={{
                fontSize: "10px",
                padding: "3px 5px",
                borderBottom: "1px solid #9c9c9c",
                backgroundColor: "#a8d1ff",
                verticalAlign: "bottom",
              }}
            >
              {data?.nameOfFosterParents || ""}
            </td>
            <td></td>
            <td
              style={{
                fontSize: "10px",
                padding: "3px",
                verticalAlign: "bottom",
              }}
            >
              DOB:
            </td>
            <td
              style={{
                fontSize: "10px",
                padding: "3px 5px",
                borderBottom: "1px solid #9c9c9c",
                verticalAlign: "bottom",
              }}
            >
              {formatDate(data?.dateOfBirth || "")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Quarterly sections */}
      <QuarterlySection quarterNumber="1" startRow={16} />
      <QuarterlySection quarterNumber="2" startRow={27} />
      <QuarterlySection quarterNumber="3" startRow={38} />
      <QuarterlySection quarterNumber="4" startRow={49} />

      {/* Signature section */}
      <div style={{ marginTop: "30px", pageBreakInside: "avoid" }}>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {renderSignatureArea("", "fosterParentSignature")}
              </td>
              <td style={{ width: "10%" }}></td>
              <td
                style={{
                  width: "45%",
                  verticalAlign: "bottom",
                  textAlign: "center",
                }}
              >
                {data?.signatureDate || formatDate(new Date().toISOString())}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px", padding: "5px 0" }}>
                FOSTER PARENT SIGNATURE
              </td>
              <td></td>
              <td
                style={{
                  fontSize: "9px",
                  padding: "5px 0",
                  textAlign: "center",
                }}
              >
                DATE
              </td>
            </tr>
            <tr>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {renderSignatureArea("", "socialWorkerSignature")}
              </td>
              <td style={{ width: "10%" }}></td>
              <td
                style={{
                  width: "45%",
                  verticalAlign: "bottom",
                  textAlign: "center",
                }}
              >
                {data?.signatureDate || formatDate(new Date().toISOString())}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px", padding: "5px 0" }}>
                SOCIAL WORKER SIGNATURE
              </td>
              <td></td>
              <td
                style={{
                  fontSize: "9px",
                  padding: "5px 0",
                  textAlign: "center",
                }}
              >
                DATE
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

export default SAForm;
