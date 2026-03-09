import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// Checklist component using proper field mapping
const Checklist = ({
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

  // Helper to render checkbox
  const renderCheckbox = (isChecked) => {
    return (
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          border: "1px solid #000",
          textAlign: "center",
          lineHeight: "10px",
          marginRight: "5px",
          fontSize: "9px",
        }}
      >
        {isChecked ? "✓" : ""}
      </span>
    );
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
            margin: "8px 0",
            color: "#3a3a3a",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Resource Parent Checklist
        </h2>
      </div>

      {/* Basic Information Section */}
      <div style={{ marginBottom: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{ width: "15%", fontSize: "12px", fontWeight: "bold" }}
              >
                Child's Name:
              </td>
              <td
                style={{
                  width: "30%",
                  borderBottom: "1px solid #000",
                  fontSize: "12px",
                  paddingBottom: "2px",
                }}
              >
                {data?.name || ""}
              </td>
              <td style={{ width: "5%" }}></td>
              <td
                style={{ width: "20%", fontSize: "12px", fontWeight: "bold" }}
              >
                Date of Placement:
              </td>
              <td
                style={{
                  width: "25%",
                  borderBottom: "1px solid #000",
                  fontSize: "12px",
                  paddingBottom: "2px",
                }}
              >
                {formatDate(data?.transactionDate) || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: "20px" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          TO BE COMPLETED WHEN YOU HAVE A NEW PLACEMENT
        </p>

        <p style={{ fontSize: "12px", marginBottom: "8px" }}>
          The following is a list of things that you must do immediately after
          placement.
        </p>

        <p style={{ fontSize: "12px", marginBottom: "16px" }}>
          Your social worker will ask for this form at the first weekly visit
          after placement.
        </p>
      </div>

      {/* Checklist Items */}
      <div style={{ marginBottom: "25px", paddingLeft: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "12px" }}>
            {renderCheckbox(data?.doctorAppointmentScheduled)} Schedule a
            doctor's appointment; Date Scheduled:
            <span
              style={{
                borderBottom: "1px solid #000",
                paddingLeft: "5px",
                paddingRight: "5px",
                marginLeft: "5px",
                fontSize: "12px",
              }}
            >
              {formatDate(data?.doctorAppointmentDate) || ""}
            </span>
          </p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "12px" }}>
            {renderCheckbox(data?.dentalAppointmentScheduled)} Schedule a dental
            appointment; Date Scheduled:
            <span
              style={{
                borderBottom: "1px solid #000",
                paddingLeft: "5px",
                paddingRight: "5px",
                marginLeft: "5px",
                fontSize: "12px",
              }}
            >
              {formatDate(data?.dentalAppointmentDate) || ""}
            </span>
          </p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "12px" }}>
            {renderCheckbox(data?.childEnrolledInSchool)} Enroll the child in
            school immediately if school is in session. If the child is staying
            in the same school, make sure to change the contact information at
            the school.
          </p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "12px" }}>
            {renderCheckbox(data?.inventoryCompleted)} Complete child's
            inventory on all of his/her belongings.
          </p>
        </div>
      </div>

      {/* Additional Information */}
      <div style={{ marginBottom: "20px" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          Visitation schedule and location, if known:
        </p>
        <div
          style={{
            minHeight: "50px",
            borderBottom: "1px solid #000",
            marginBottom: "15px",
            fontSize: "12px",
          }}
        >
          {data?.visitationSchedule || ""}
        </div>

        <p
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          Medications child is taking (name, dosage, and time of day to take
          it):
        </p>
        <div
          style={{
            minHeight: "70px",
            borderBottom: "1px solid #000",
            marginBottom: "15px",
            fontSize: "12px",
          }}
        >
          {data?.medications || ""}
        </div>

        <p
          style={{
            fontSize: "12px",
            marginBottom: "10px",
          }}
        >
          Date of first home visit (to be scheduled with Pathway Social Worker):
          <span
            style={{
              borderBottom: "1px solid #000",
              display: "inline-block",
              minWidth: "150px",
              paddingLeft: "5px",
              marginLeft: "5px",
              fontSize: "12px",
            }}
          >
            {formatDate(data?.firstHomeVisitDate) || ""}
          </span>
        </p>
      </div>

      {/* Form ID and Signatures */}
      <div style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "40%" }}>
            {renderSignatureArea(
              "Resource Parent Signature",
              "fosterParentSignature"
            )}
          </div>
        </div>
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

export default Checklist;
