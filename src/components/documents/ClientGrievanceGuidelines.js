import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

const ClientGrievanceGuidelines = ({
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
      month: "numeric",
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
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        lineHeight: "1.4",
        pageBreakInside: "avoid",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header section with title and logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #000",
          paddingBottom: "5px",
          marginBottom: "10px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              padding: 0,
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Pathway Family Services, Inc.
          </h1>
          <h2
            style={{
              margin: 0,
              padding: 0,
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Client Grievance Guidelines
          </h2>
        </div>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "50px",
          }}
        />
      </div>

      {/* Main content area */}
      <div style={{ margin: "15px 0", fontSize: "11px" }}>
        <p style={{ textAlign: "justify", lineHeight: "1.5" }}>
          Pathway is very interested in and committed to maintaining
          professional, effective and accountable relationships regarding
          clients placed in PFS homes. If a child, resource family member or
          county representative has a concern they need to address, they may
          initiate action in the following way:
        </p>

        <div style={{ margin: "15px 0 15px 50px" }}>
          <p style={{ margin: "12px 0" }}>
            Address the concern with the Pathway resource parent. If the matter is
            not resolved then:
          </p>
          <p style={{ margin: "12px 0" }}>
            Address the concern with the assigned Pathway social worker. If the
            matter is not resolved then:
          </p>
          <p style={{ margin: "12px 0" }}>
            Address the concer with the Supervising social worker. If the matter
            is not resolved then:
          </p>
          <p style={{ margin: "12px 0" }}>
            Address the concer with the County social worker. Contact
            information will be provided by your Pathway social worker upon
            request. If the matter is not resolved then:
          </p>
          <p style={{ margin: "12px 0" }}>
            Addres the concern with the Department of Health & Social Service
            representative. The phone number for the agency's contact is listed
            below.
          </p>
        </div>
      </div>

      {/* Agencies to Contact Section */}
      <div style={{ margin: "20px 0", fontSize: "11px" }}>
        <h4
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            margin: "15px 0",
          }}
        >
          AGENCY TO CONTACT FOR GRIEVANCE IN CALIFORNIA IS:
        </h4>

        <div style={{ marginLeft: "30px", lineHeight: "1.4" }}>
          <p style={{ margin: "3px 0" }}>Community Care Licensing</p>
          <p style={{ margin: "3px 0" }}>1000 Corporate Center Drive</p>
          <p style={{ margin: "3px 0" }}>Suite 200A,</p>
          <p style={{ margin: "3px 0" }}>Monterey Park, CA 91754</p>
          <p style={{ margin: "3px 0" }}>Ph. 323-981-3300</p>
        </div>

        <h4
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            margin: "15px 0",
          }}
        >
          FOR MORE INFORMATION AND ASSISTANCE CONTACT:
        </h4>

        <div style={{ marginLeft: "30px", lineHeight: "1.4" }}>
          <p style={{ margin: "3px 0" }}>Pathway Family Services:</p>
          <p style={{ margin: "3px 0" }}>State Program Director -</p>
          <p style={{ margin: "3px 0" }}>P.O. Box 888,</p>
          <p style={{ margin: "3px 0" }}>Bakersfield, CA 93302</p>
          <p style={{ margin: "3px 0" }}>Ph. 661-325-2570</p>
        </div>
      </div>

      {/* Signature section */}
      <div
        style={{
          margin: "30px 0 10px 0",
          fontSize: "14px",
        }}
      >
        <p>
          I,{" "}
          {data?.name ? (
            <span style={{ borderBottom: "1px solid #000", padding: "0 5px" }}>
              {data.name}
            </span>
          ) : (
            <span
              style={{
                borderBottom: "1px solid #000",
                width: "300px",
                display: "inline-block",
              }}
            >
              &nbsp;
            </span>
          )}
          , have read and understand Pathway's Grievance Guidelines procedures.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <div style={{ width: "45%" }}>
            {renderSignatureArea("", "clientSignature")}
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <div style={{ fontWeight: "normal" }}>Client Signature</div>
              <div style={{ marginTop: "8px" }}>
                {formatDate(data?.clientSignatureDate) || "________________"}
              </div>
              <div style={{ marginTop: "5px" }}>Date</div>
            </div>
          </div>

          <div style={{ width: "45%" }}>
            {renderSignatureArea("", "countyRepSignature")}
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <div style={{ fontWeight: "normal" }}>
                County Worker / Authorized Representative Signature
              </div>
              <div style={{ marginTop: "8px" }}>
                {formatDate(data?.countyRepSignatureDate) || "________________"}
              </div>
              <div style={{ marginTop: "5px" }}>Date</div>
            </div>
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

export default ClientGrievanceGuidelines;
