import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// ConfirmAmbulatoryStatus component using proper field mapping
const ConfirmAmbulatoryStatus = ({
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
            <span style={{ fontSize: "9px" }}>{title}</span>
          </div>
        )}
      </div>
    );
  };

  // Format examination date or use blank placeholders
  const formatExaminationDate = () => {
    if (data?.examinationDate) {
      const date = new Date(data.examinationDate);
      return `${
        date.getMonth() + 1
      } / ${date.getDate()} / ${date.getFullYear()}`;
    }
    return "_______ / _______ / _______";
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        lineHeight: "1.4",
        pageBreakInside: "avoid",
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
            height: "50px",
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
            fontSize: "18px",
          }}
        >
          Confirmation of Ambulatory Status
        </h3>
      </div>

      {/* Client information section */}
      <div style={{ marginBottom: "30px" }}>
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
                CHILD'S NAME:
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
                  width: "10%",
                  fontSize: "12px",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                DOB:
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
          </tbody>
        </table>
      </div>

      {/* Certification statement and date */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>
          This is to certify that the above named child was examined by the
          undersigned on
        </p>
        <p style={{ fontSize: "14px", fontWeight: "bold", margin: "10px 0" }}>
          {formatExaminationDate()}
        </p>
      </div>

      {/* Certificate requirements */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", fontWeight: "bold", margin: "0" }}>
          THIS CERTIFICATE MUST BE SIGNED BY A MEDICAL PROFESSIONAL
        </p>
        <p
          style={{ fontSize: "14px", fontWeight: "bold", margin: "5px 0 0 0" }}
        >
          LICENSED IN THE STATE OF CALIFORNIA.
        </p>
      </div>

      {/* Medical Professional Information */}
      <div style={{ marginTop: "40px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: "50%",
                  paddingRight: "15px",
                  verticalAlign: "bottom",
                }}
                colSpan="2"
              >
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    fontSize: "13px",
                    height: "20px",
                    paddingTop: "5px",
                    paddingBottom: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {data?.medicalProfessionalName || ""}
                </div>
                <div style={{ fontSize: "11px", paddingTop: "5px" }}>
                  Name of Medical Professional
                </div>
              </td>
              <td style={{ width: "50%", verticalAlign: "bottom" }} colSpan="2">
                {renderSignatureArea("", "medicalProfessionalSignature")}
                <div style={{ fontSize: "11px", paddingTop: "5px" }}>
                  Signature of Licensed Medical Professional
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="4" style={{ height: "20px" }}></td>
            </tr>
            <tr>
              <td
                style={{
                  width: "50%",
                  paddingRight: "15px",
                  verticalAlign: "top",
                }}
                colSpan="2"
              >
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    fontSize: "12px",
                    height: "20px",
                    paddingTop: "5px",
                  }}
                >
                  {data?.medicalProfessionalAddress || ""}
                </div>
                <div style={{ fontSize: "11px", paddingTop: "5px" }}>
                  Address
                </div>
              </td>
              <td style={{ width: "50%", verticalAlign: "top" }} colSpan="2">
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    fontSize: "12px",
                    height: "20px",
                    paddingTop: "5px",
                  }}
                >
                  {data?.licenseNumber || ""}
                </div>
                <div style={{ fontSize: "11px", paddingTop: "5px" }}>
                  California License Number
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="4" style={{ height: "20px" }}></td>
            </tr>
            <tr>
              <td
                style={{
                  width: "50%",
                  paddingRight: "15px",
                  verticalAlign: "top",
                }}
                colSpan="2"
              >
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    fontSize: "12px",
                    height: "20px",
                    paddingTop: "5px",
                  }}
                >
                  {data?.medicalProfessionalCity || ""}
                </div>
                <div style={{ fontSize: "11px", paddingTop: "5px" }}>City</div>
              </td>
              <td
                style={{
                  width: "25%",
                  paddingRight: "15px",
                  verticalAlign: "top",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    fontSize: "12px",
                    height: "20px",
                    paddingTop: "5px",
                  }}
                >
                  {data?.medicalProfessionalZip || ""}
                </div>
                <div style={{ fontSize: "11px", paddingTop: "5px" }}>
                  Zip Code
                </div>
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    fontSize: "12px",
                    height: "20px",
                    paddingTop: "5px",
                  }}
                >
                  {data?.medicalProfessionalPhone || ""}
                </div>
                <div style={{ fontSize: "11px", paddingTop: "5px" }}>
                  Phone Number
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

export default ConfirmAmbulatoryStatus;
