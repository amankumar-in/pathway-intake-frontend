import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// ConfirmTBTest component using proper field mapping
const ConfirmTBTest = ({
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
                borderBottom: "1px solid #ccc",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
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
                height: "50px",
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
            <span style={{ fontSize: "13px" }}>{title}</span>
          </div>
        )}
      </div>
    );
  };

  // Parse TB test date into day, month, year
  const parseTestDate = () => {
    if (!data?.tbTestDate)
      return { day: "_______", month: "_______", year: "_______" };
    const date = new Date(data.tbTestDate);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1, // JavaScript months are 0-indexed
      year: date.getFullYear(),
    };
  };

  const tbDate = parseTestDate();

  return (
    <div
      style={{
        padding: "5px",
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
            height: "35px",
            marginBottom: "8px",
            display: "block",
            margin: "0 auto",
          }}
        />
        <h3
          style={{
            margin: "8px 0",
            color: "#3a3a3a",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Confirmation of T.B. Test
        </h3>
        <p
          style={{
            margin: "15px 0 5px 0",
            fontSize: "13px",
            fontStyle: "italic",
          }}
        >
          (Required by State of California)
        </p>
      </div>

      {/* Client information section */}
      <div style={{ margin: "20px 0" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "15%", fontSize: "13px", fontWeight: "bold" }}
              >
                CHILD'S NAME:
              </td>
              <td
                style={{
                  width: "35%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                }}
              >
                {data?.name || ""}
              </td>
              <td style={{ width: "5%" }}></td>
              <td
                style={{ width: "10%", fontSize: "13px", fontWeight: "bold" }}
              >
                DOB:
              </td>
              <td
                style={{
                  width: "35%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                }}
              >
                {formatDate(data?.dateOfBirth) || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TB Test certification */}
      <div style={{ margin: "30px 0" }}>
        <p style={{ fontSize: "13px", textAlign: "left" }}>
          This is to certify that the above named child was tested for active
          Tuberculosis by me on
        </p>
        <p style={{ fontSize: "13px", margin: "10px 0", textAlign: "left" }}>
          {tbDate.month} / {tbDate.day} / {tbDate.year}
        </p>
      </div>

      {/* Certificate notice */}
      <div style={{ margin: "40px 0", textAlign: "left" }}>
        <p style={{ fontSize: "13px", fontWeight: "bold" }}>
          THIS CERTIFICATE MUST BE SIGNED BY A MEDICAL PROFESSIONAL LICENSED IN
          THE STATE OF CALIFORNIA.
        </p>
      </div>

      {/* Medical professional information */}
      <div style={{ margin: "30px 0" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                <p style={{ fontSize: "9px", fontWeight: "bold" }}>
                  Name of Medical Professional (Please Print)
                </p>
                <p
                  style={{
                    borderBottom: "1px solid #000",
                    height: "18px",
                    fontSize: "13px",
                  }}
                >
                  {data?.medicalProfessionalName || ""}
                </p>
              </td>
              <td style={{ width: "10%" }}></td>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                <p style={{ fontSize: "9px", fontWeight: "bold" }}>
                  Signature of Licensed Medical Professional
                </p>
                {renderSignatureArea("", "medicalProfessionalSignature")}
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: "20px", verticalAlign: "top" }}>
                <p style={{ fontSize: "9px", fontWeight: "bold" }}>Address</p>
                <p
                  style={{
                    borderBottom: "1px solid #000",
                    height: "18px",
                    fontSize: "13px",
                  }}
                >
                  {data?.medicalAddress || ""}
                </p>
              </td>
              <td></td>
              <td style={{ paddingTop: "20px", verticalAlign: "top" }}>
                <p style={{ fontSize: "9px", fontWeight: "bold" }}>
                  California License Number
                </p>
                <p
                  style={{
                    borderBottom: "1px solid #000",
                    height: "18px",
                    fontSize: "13px",
                  }}
                >
                  {data?.licenseNumber || ""}
                </p>
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: "20px", verticalAlign: "top" }}>
                <p style={{ fontSize: "9px", fontWeight: "bold" }}>
                  City Zip Code
                </p>
                <p
                  style={{
                    borderBottom: "1px solid #000",
                    height: "18px",
                    fontSize: "13px",
                  }}
                >
                  {data?.medicalCity ? `${data.medicalCity}, ` : ""}
                  {data?.medicalZip || ""}
                </p>
              </td>
              <td></td>
              <td style={{ paddingTop: "20px", verticalAlign: "top" }}>
                <p style={{ fontSize: "9px", fontWeight: "bold" }}>
                  Phone Number
                </p>
                <p
                  style={{
                    borderBottom: "1px solid #000",
                    height: "18px",
                    fontSize: "13px",
                  }}
                >
                  {data?.medicalPhone || ""}
                </p>
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

export default ConfirmTBTest;
