import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import logo from "../../logo.svg";
import { LOGO_BASE64 } from "../../constants/logo";

// NoticeOfAction component using only HTML and CSS styling (no MUI sx props or Box components)
const NoticeOfAction = ({
  data,
  signatures = {},
  onAddSignature,
  onRemoveSignature,
  signatureAreaClass,
  deleteButtonClass,
  placeholderClass,
  isStandalone = false, // Add this parameter
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
        padding: "5px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        pageBreakInside: "avoid",
      }}
    >
      {/* Header section with logo */}
      <div style={{ textAlign: "center" }}>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "35px",

            display: "block",
            margin: "0 auto",
          }}
        />
        <h3 style={{ margin: "8px 0", color: "#3a3a3a", fontWeight: 500 }}>
          Pathway Family Services, Inc.
        </h3>
        <h2 style={{ margin: "8px 0", fontWeight: "bold", color: "#334155" }}>
          Notice of Action
        </h2>
        <hr
          style={{
            width: "100%",
            border: "none",
            borderTop: "1px solid #e0e0e0",
          }}
        />
      </div>

      {/* Submission Info Section */}
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ flex: "1 0 20%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Submitted by:
            </small>
            <span style={{ fontWeight: 500 }}>
              {data?.yourName || "Not specified"}
            </span>
          </div>
          <div style={{ flex: "1 0 20%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Office Location:
            </small>
            <span style={{ fontWeight: 500 }}>
              {data?.office || "Santa Maria"}
            </span>
          </div>
          <div style={{ flex: "1 0 20%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Date Submitted:
            </small>
            <span style={{ fontWeight: 500 }}>
              {formatDate(data?.dateSubmitted) || "Not specified"}
            </span>
          </div>
          <div style={{ flex: "1 0 20%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Date of Action:
            </small>
            <span style={{ fontWeight: 500 }}>
              {formatDate(data?.transactionDate) || "Not specified"}
            </span>
          </div>
        </div>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e0e0e0",
        }}
      />

      {/* Transaction Type and Client Info Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div style={{ flex: "1 0 40%" }}>
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          >
            <h4
              style={{ color: "#334155", fontWeight: 600, margin: "0 0 8px 0" }}
            >
              TRANSACTION TYPE
            </h4>
            <p style={{ margin: "8px 0" }}>
              {data?.typeOfTransaction || "Shelter Placement"}
            </p>
          </div>
        </div>

        <div style={{ flex: "1 0 55%" }}>
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          >
            <h4
              style={{ color: "#334155", fontWeight: 600, margin: "0 0 8px 0" }}
            >
              CLIENT INFORMATION
            </h4>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <div style={{ flex: "1 0 45%" }}>
                <small style={{ display: "block", color: "#64748b" }}>
                  Case Number:
                </small>
                <span style={{ fontWeight: 500 }}>
                  {data?.caseNumber || "Not specified"}
                </span>
              </div>
              <div style={{ flex: "1 0 45%" }}>
                <small style={{ display: "block", color: "#64748b" }}>
                  Client Name:
                </small>
                <span style={{ fontWeight: 500 }}>
                  {data?.name || "Not specified"}
                </span>
              </div>
              <div style={{ flex: "1 0 45%" }}>
                <small style={{ display: "block", color: "#64748b" }}>
                  D.O.B.:
                </small>
                <span style={{ fontWeight: 500 }}>
                  {formatDate(data?.dateOfBirth) || "Not specified"}
                </span>
              </div>
              <div style={{ flex: "1 0 45%" }}>
                <small style={{ display: "block", color: "#64748b" }}>
                  Gender:
                </small>
                <span style={{ fontWeight: 500 }}>
                  {data?.gender || "Not specified"}
                </span>
              </div>
              <div style={{ flex: "1 0 45%" }}>
                <small style={{ display: "block", color: "#64748b" }}>
                  Ethnicity:
                </small>
                <span style={{ fontWeight: 500 }}>
                  {data?.ethnicity || "Unknown"}
                </span>
              </div>
              <div style={{ flex: "1 0 45%" }}>
                <small style={{ display: "block", color: "#64748b" }}>
                  Level of Care:
                </small>
                <span style={{ fontWeight: 500 }}>
                  {data?.levelOfCare || "Level 1"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ flex: "1 0 45%" }}>
          <small style={{ display: "block", color: "#64748b" }}>
            Prior Placement:
          </small>
          <span style={{ fontWeight: 500 }}>
            {data?.priorPlacement || "Natural Parent"}
          </span>
        </div>
        <div style={{ flex: "1 0 45%" }}>
          <small style={{ display: "block", color: "#64748b" }}>
            Reason for Placement:
          </small>
          <span style={{ fontWeight: 500 }}>
            {data?.reasonForPlacement || "Neglect"}
          </span>
        </div>
      </div>

      <hr
        style={{
          margin: "16px 0",
          border: "none",
          borderTop: "1px solid #e0e0e0",
        }}
      />

      {/* Foster Home Information */}
      <div>
        <h3
          style={{
            marginBottom: "8px",
            color: "#334155",
            fontWeight: 600,
            borderLeft: "3px solid #94a3b8",
            paddingLeft: "8px",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}
        >
          Foster Home Information
        </h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ flex: "1 0 45%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Name of Foster Parents:
            </small>
            <span style={{ fontWeight: 500 }}>
              {data?.nameOfFosterParents || "Not specified"}
            </span>
          </div>
          <div style={{ flex: "1 0 45%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Telephone #:
            </small>
            <span style={{ fontWeight: 500 }}>
              {data?.fosterParentsTelephone || "Not specified"}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <small style={{ display: "block", color: "#64748b" }}>
            Address of Foster Home:
          </small>
          <span style={{ fontWeight: 500 }}>
            {data?.fosterParentsAddress || "Not specified"}
          </span>
          <span style={{ fontWeight: 500, display: "block" }}>
            {data?.fosterParentsCity
              ? `${data.fosterParentsCity}, ${
                  data.fosterParentsState || "California"
                } ${data.fosterParentsZip || ""}`
              : "City, State and ZIP not specified"}
          </span>
        </div>

        <div style={{ marginTop: "16px" }}>
          <small style={{ display: "block", color: "#64748b" }}>
            Mailing Address (if different from above):
          </small>
          <span style={{ fontWeight: 500 }}>
            {data?.fosterParentsMailingAddress &&
            data?.fosterParentsMailingAddress !== data?.fosterParentsAddress
              ? data?.fosterParentsMailingAddress
              : "Same as above"}
          </span>
        </div>
      </div>

      {/* Foster Home Certification Details */}
      <div>
        <h4
          style={{
            marginBottom: "8px",
            color: "#64748b",
            fontWeight: 600,
          }}
        >
          CERTIFICATION DETAILS
        </h4>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ flex: "1 0 30%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Supervisor's Initials:
            </small>
            <span style={{ fontWeight: 500 }}>
              {data?.supervisorsInitials || "Not specified"}
            </span>
          </div>
          <div style={{ flex: "1 0 30%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Bed Capacity:
            </small>
            <span style={{ fontWeight: 500 }}>
              {data?.bedCapacity || "Not specified"}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <small style={{ display: "block", color: "#64748b" }}>
            Certified ages of care:
          </small>
          <div style={{ display: "flex", gap: "16px" }}>
            <div>
              <span style={{ fontWeight: 500 }}>
                From: {data?.certifiedAgesFrom || "Not specified"}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 500 }}>
                To: {data?.certifiedAgesTo || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <small style={{ display: "block", color: "#64748b" }}>
            Certification dates:
          </small>
          <div style={{ display: "flex", gap: "16px" }}>
            <div>
              <span style={{ fontWeight: 500 }}>
                From:{" "}
                {formatDate(data?.certificationDateFrom) || "Not specified"}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 500 }}>
                To: {formatDate(data?.certificationDateTo) || "Not specified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr
        style={{
          margin: "16px 0",
          border: "none",
          borderTop: "1px solid #e0e0e0",
        }}
      />

      {/* Action Approved Section */}
      <div>
        <h3
          style={{
            marginBottom: "8px",
            color: "#334155",
            fontWeight: 600,
            borderLeft: "3px solid #22c55e",
            paddingLeft: "8px",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}
        >
          Action Approved
        </h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ flex: "1 0 45%" }}>
            <small style={{ display: "block", color: "#64748b" }}>
              Actions Approved By:
            </small>
            <span style={{ fontWeight: 500 }}>
              {data?.actionsApprovedBy || "Not specified"}
            </span>
          </div>
          <div style={{ flex: "1 0 45%" }}>
            <small style={{ display: "block", color: "#64748b" }}>Date:</small>
            <span style={{ fontWeight: 500 }}>
              {formatDate(data?.approvalDate) || "Not specified"}
            </span>
          </div>
        </div>
      </div>

      {/* Notes / Comments Section (if present) */}
      {data?.notes && (
        <>
          <hr
            style={{
              margin: "16px 0",
              border: "none",
              borderTop: "1px solid #e0e0e0",
            }}
          />
          <div>
            <h3
              style={{
                marginBottom: "8px",
                color: "#334155",
                fontWeight: 600,
                borderLeft: "3px solid #94a3b8",
                paddingLeft: "8px",
                paddingTop: "4px",
                paddingBottom: "4px",
              }}
            >
              Notes / Comments
            </h3>

            <p
              style={{
                whiteSpace: "pre-line",
                padding: "8px",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
              }}
            >
              {data.notes}
            </p>
          </div>
        </>
      )}

      <hr
        style={{
          margin: "16px 0",
          border: "none",
          borderTop: "1px solid #e0e0e0",
        }}
      />

      {/* County Worker Information */}
      <div>
        <h3
          style={{
            marginBottom: "8px",
            color: "#334155",
            fontWeight: 600,
            borderLeft: "3px solid #f59e0b",
            paddingLeft: "8px",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}
        >
          County Worker Information
        </h3>

        <div>
          <small style={{ display: "block", color: "#64748b" }}>
            County Worker Name:
          </small>
          <span style={{ fontWeight: 500 }}>
            {data?.countyWorkerName || "Not specified"}
          </span>
        </div>
      </div>

      {/* Signature areas */}
      <div
        style={{
          marginTop: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {renderSignatureArea("Authorized Signature", "authorizedSignature")}
          {renderSignatureArea("Date", "dateSignature")}
        </div>
      </div>

      {/* Signature selection menu */}
      <Menu
        anchorEl={signatureMenuAnchor}
        open={Boolean(signatureMenuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Select a signature:</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("childSignature")}>
          Foster Child Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("parentSignature")}>
          Resource Mother Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("caseworkerSignature")}>
          Resource Father Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("supervisorSignature")}>
          Pathway Social Worker Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("agencyRepSignature")}>
          County Social Worker Signature
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NoticeOfAction;
