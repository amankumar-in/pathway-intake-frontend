import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// MedicalTreatment component using proper field mapping
const MedicalTreatment = ({
  data,
  signatures = {},
  onAddSignature,
  onRemoveSignature,
  signatureAreaClass,
  deleteButtonClass,
  placeholderClass,
  isStandalone = false, // Add this parameter
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
                borderBottom: "1px solid #000",
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
                height: "50px",
                borderBottom: "1px solid #000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Show add button for all document types, including standalone */}
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

  return (
    <div
      style={{
        padding: "15px",
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
      {/* Header section with logo and titles in one row to save space */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          borderBottom: "1px solid #000",
          paddingBottom: "5px",
        }}
      >
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "35px",
            marginRight: "10px",
          }}
        />
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              margin: "0",
              color: "#000",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Pathway Family Services, Inc.
          </div>
          <div
            style={{
              margin: "2px 0 0 0",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            Consent For Medical Treatment Of Client
          </div>
        </div>
      </div>

      {/* Client information section */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: "13px" }}>
          As the parent or authorized representative for{" "}
          <span
            style={{
              borderBottom: "1px solid #000",
              fontWeight: "bold",
              padding: "0 5px",
              minWidth: "150px",
              display: "inline-block",
            }}
          >
            {data?.name || ""}
          </span>
          , a minor placed in foster care by the county of{" "}
          <span
            style={{
              borderBottom: "1px solid #000",
              fontWeight: "bold",
              padding: "0 5px",
              minWidth: "150px",
              display: "inline-block",
            }}
          >
            {data?.nameOfCounty || ""}
          </span>{" "}
          I hereby give consent to Pathway Family Services, Inc. and their
          assigned certified foster parents who provide direct care for this
          client, to provide all medical and dental care prescribed by a duly
          licensed physician or other health care professional.
        </div>
      </div>

      {/* Authorization section - First paragraph */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: "13px" }}>
          This authorization by the undersigned consent to medical care that
          includes: medical examination, diagnosis, prescription, x-ray
          examination, dental treatment, eye care, emergency room treatment and
          hospital care.
        </div>
      </div>

      {/* Authorization section - Second paragraph */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ fontSize: "13px" }}>
          It is understood that this authorization is given in advance to any
          specific diagnosis, treatment or hospital care being required but is
          being given to provide authority to Pathway Family Services and their
          certified foster parent to seek and initiate the above described
          medical care and grant approval of care for which the attending
          physician(s), surgeon(s), dentist(s) and other licensed medical
          professional(s) deem appropriate for the well being of the above named
          child.
        </div>
      </div>

      {/* Allergies section */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "5px" }}
        >
          This child has the following medication allergies:
        </div>
        <div
          style={{
            minHeight: "80px",
            border: "1px solid #ccc",
            padding: "5px",
            fontSize: "13px",
          }}
        >
          {data?.medicationAllergies || ""}
        </div>
      </div>

      {/* Signature section */}
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "40%" }}>
                <div style={{ fontSize: "9px", paddingBottom: "3px" }}>
                  Date
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    height: "15px",
                    fontSize: "10px",
                    paddingTop: "2px",
                  }}
                >
                  {formatDate(data?.signatureDate) || ""}
                </div>
              </td>
              <td style={{ width: "60%" }}>
                {renderSignatureArea(
                  "Parent or Authorized Representative Signature",
                  "parentSignature"
                )}
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    marginTop: "20px",
                    marginBottom: "5px",
                    fontSize: "10px",
                    paddingTop: "2px",
                  }}
                >
                  {data?.parentAddress || ""}
                </div>
                <div style={{ fontSize: "9px", textAlign: "center" }}>
                  Address
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    marginTop: "20px",
                    marginBottom: "5px",
                    fontSize: "10px",
                    paddingTop: "2px",
                  }}
                >
                  {data?.parentPhone || ""}
                </div>
                <div style={{ fontSize: "9px", textAlign: "center" }}>
                  Phone #
                </div>
              </td>
              <td>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    marginTop: "20px",
                    marginBottom: "5px",
                    fontSize: "10px",
                    paddingTop: "2px",
                  }}
                >
                  {data?.parentFax || ""}
                </div>
                <div style={{ fontSize: "9px", textAlign: "center" }}>
                  Fax #
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    fontSize: "9px",
                    paddingTop: "20px",
                    paddingBottom: "3px",
                  }}
                >
                  Date
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    height: "15px",
                    fontSize: "10px",
                    paddingTop: "2px",
                  }}
                >
                  {formatDate(data?.signatureDate) || ""}
                </div>
              </td>
              <td>
                {renderSignatureArea(
                  "Witness/Pathway Representative",
                  "witnessSignature"
                )}
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

export default MedicalTreatment;
