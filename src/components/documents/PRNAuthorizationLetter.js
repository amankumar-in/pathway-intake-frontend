import React, { useState } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

const PRNAuthorizationLetter = ({
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
                borderBottom: "1px solid #000",
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

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        lineHeight: "1.2",
        pageBreakInside: "avoid",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header section with logo */}
      <div
        style={{
          marginBottom: "16px",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #000",
        }}
      >
        <div style={{ width: "120px", height: "60px" }}>
          <img
            src={LOGO_BASE64}
            alt="Pathway Family Services Logo"
            style={{
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <h2
            style={{
              margin: "4px 0",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Pathway Family Services, Inc.
          </h2>
          <h3
            style={{
              margin: "4px 0",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            PRN Authorization Letter
          </h3>
        </div>
      </div>

      {/* Doctor Greeting */}
      <div style={{ marginBottom: "10px", fontSize: "13px" }}>
        <p style={{ margin: "5px 0" }}>
          Dear Dr. {data?.doctorName || "________________________"}
        </p>
      </div>

      {/* Patient Information */}
      <div style={{ marginBottom: "10px", fontSize: "13px" }}>
        <p style={{ margin: "5px 0" }}>
          Re: Your Patient: {data?.name || "________________________"}
        </p>
        <p style={{ margin: "5px 0" }}>
          A resident of : Pathway Family Services, Inc.
        </p>
      </div>

      {/* PRN Requirements */}
      <div style={{ marginBottom: "10px", fontSize: "13px" }}>
        <p style={{ margin: "5px 0" }}>
          To receive nonprescription and prescription PRN medications, state
          licensing requires that either:
        </p>
        <p style={{ margin: "5px 0 5px 20px" }}>
          1) your patient be capable of determining his/her own need for the
          medication, <strong>or,</strong>
        </p>
        <p style={{ margin: "5px 0 5px 20px" }}>
          2) for nonprescription medication only, be able to clearly communicate
          his/her symptoms.
        </p>
      </div>

      {/* Patient Capability Explanation */}
      <div style={{ marginBottom: "10px", fontSize: "13px" }}>
        <p style={{ margin: "5px 0" }}>
          If your patient cannot determine his/her need for a medication, or,
          clearly communicate the symptoms for a nonprescription medication then
          you, the medical professional, must be contacted before the PRN
          medication can be given. Your completion of this form will serve to
          document your patient's current ability to determine his/her own need
          for these medications.
        </p>
      </div>

      {/* Care Provider Responsibility */}
      <div style={{ marginBottom: "10px", fontSize: "13px" }}>
        <p style={{ margin: "5px 0" }}>
          As a licensed care provider, it is my responsibility to monitor your
          patient's continued ability to determine his/her own need for PRN
          medications and inform you of any changes which indicate he/she can no
          longer make these decisions.
        </p>
      </div>

      {/* Closing */}
      <div style={{ marginBottom: "10px", fontSize: "13px" }}>
        <p style={{ margin: "5px 0" }}>Thank you for your assistance.</p>
        <p style={{ margin: "5px 0" }}>Sincerely,</p>
      </div>

      {/* Signature section - Smaller signature area to match medical professional signature */}
      <div style={{ marginBottom: "15px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: "20%",
                  paddingTop: "10px",
                  verticalAlign: "top",
                }}
              >
                Signature:
              </td>
              <td style={{ width: "80%", paddingTop: "10px" }}>
                <div style={{ maxWidth: "250px" }}>
                  {renderSignatureArea("", "socialWorkerSignature")}
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: "10px" }}>Title:</td>
              <td style={{ paddingTop: "10px" }}>
                {data?.positionJobTitle || "Social Worker"}
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: "10px" }}>Telephone #:</td>
              <td style={{ paddingTop: "10px" }}>
                {data?.phoneNumber || "(805) 739-1111"}
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: "10px" }}>Date:</td>
              <td style={{ paddingTop: "10px" }}>
                {formatDate(data?.signatureDate || data?.transactionDate || "")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Checkboxes Section - Consistent checkbox styling */}
      <div style={{ marginBottom: "15px", fontSize: "13px" }}>
        <p style={{ fontWeight: "bold", margin: "5px 0" }}>
          Please check which circumstance describes your patient:
        </p>
        <div style={{ margin: "10px 0" }}>
          {/* Made all checkboxes consistent size and styling */}
          <div style={{ display: "flex", margin: "8px 0" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                border: "1px solid #000",
                marginRight: "10px",
                marginTop: "1px",
                fontSize: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {data?.canDetermineMedication ? "✓" : ""}
            </div>
            <div style={{ flex: 1 }}>
              My patient can determine and clearly communicate his/her need for
              prescription and nonprescription medication on a PRN basis.
            </div>
          </div>
          <div style={{ display: "flex", margin: "8px 0" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                border: "1px solid #000",
                marginRight: "10px",
                marginTop: "1px",
                fontSize: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {data?.cannotDeterminePrescription ? "✓" : ""}
            </div>
            <div style={{ flex: 1 }}>
              My patient cannot determine his/her own need for nonprescription
              PRN medication, but can clearly communicate his/her symptoms
              indicating a need for nonprescription medication.
            </div>
          </div>
          <div style={{ display: "flex", margin: "8px 0" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                border: "1px solid #000",
                marginRight: "10px",
                marginTop: "1px",
                fontSize: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {data?.cannotDetermineOrCommunicate ? "✓" : ""}
            </div>
            <div style={{ flex: 1 }}>
              My patient cannot determine his/her need for prescription and/or
              nonprescription PRN medication and cannot clearly communicate
              his/her symptoms indicating a need for nonprescription PRN
              medication. (Licensee must contact physician before each dose.)
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div style={{ marginBottom: "15px", fontSize: "13px" }}>
        <p style={{ fontWeight: "bold", margin: "5px 0" }}>
          Additional Information:
        </p>
        <div
          style={{
            border: "1px solid #000",
            minHeight: "60px",
            padding: "5px",
            marginTop: "5px",
            whiteSpace: "pre-wrap",
          }}
        >
          {data?.additionalInfo || ""}
        </div>
      </div>

      {/* Medical Professional Signature */}
      <div style={{ marginTop: "40px", fontSize: "13px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                <div>Medical Professional's Signature:</div>
                {renderSignatureArea("", "medicalProfessionalSignature")}
              </td>
              <td style={{ width: "50%" }}>
                <div>Date:</div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    height: "25px",
                    padding: "5px 0",
                  }}
                >
                  {formatDate(data?.medicalProfessionalSignatureDate || "")}
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

export default PRNAuthorizationLetter;
