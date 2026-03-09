import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

const CountyWorkerGrievanceGuidelines = ({
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
        lineHeight: "1.2",
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
        </div>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "50px",
          }}
        />
      </div>

      {/* Main Heading */}
      <div
        style={{
          textAlign: "center",
          margin: "10px 0",
          borderBottom: "1px solid #000",
          paddingBottom: "5px",
        }}
      >
        <h3
          style={{
            margin: 0,
            padding: 0,
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          COUNTY WORKER GRIEVANCE GUIDELINES
        </h3>
      </div>

      {/* Main content area */}
      <div style={{ margin: "20px 0" }}>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            margin: "15px 0",
            lineHeight: "1.4",
          }}
        >
          Pathway is very interested in and committed maintaining a professional
          and effective relationship with assigned CSWs. However, if a county
          social worker does have a grievance they wish to address, we request
          that they consider the following options:
        </p>

        <ul
          style={{
            listStyleType: "none",
            paddingLeft: "20px",
            fontSize: "12px",
            lineHeight: "1.6",
          }}
        >
          <li>• Address the concern with the Pathway social worker.</li>
          <li>&nbsp;&nbsp;If the matter is not resolved, then:</li>
          <li>
            • Address the concern with the district supervising social worker.
          </li>
          <li>&nbsp;&nbsp;If the matter is not resolved, then:</li>
          <li>• Address the concern with the State Program Director.</li>
          <li>&nbsp;&nbsp;If the matter is not resolved, then:</li>
          <li>
            • Request your supervisor to address the concern with the Agency
            Executive Director.
          </li>
          <li>&nbsp;&nbsp;If the matter is not resolved, then:</li>
          <li>
            • Address the concern with the Department of Health & Social Service
            representative.
          </li>
          <li>
            &nbsp;&nbsp;The phone number for the agency's government contact is
            listed below.
          </li>
        </ul>
      </div>

      {/* Agencies to Contact Section */}
      <div style={{ margin: "25px 0" }}>
        <h4
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "15px 0",
          }}
        >
          AGENCIES TO CONTACT FOR GRIEVANCE IN CALIFORNIA IS:
        </h4>

        <div
          style={{ marginLeft: "30px", fontSize: "12px", lineHeight: "1.4" }}
        >
          <p style={{ margin: "3px 0" }}>Community Care Licensing:</p>
          <p style={{ margin: "3px 0" }}>1000 Corporate Center Drive</p>
          <p style={{ margin: "3px 0" }}>Suite 200A</p>
          <p style={{ margin: "3px 0" }}>Monterey Park, CA 91754</p>
          <p style={{ margin: "3px 0" }}>Ph. 323-981-3300</p>
        </div>

        <h4
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "15px 0",
          }}
        >
          FOR MORE INFORMATION AND ASSISTANCE CONTACT:
        </h4>

        <div
          style={{ marginLeft: "30px", fontSize: "12px", lineHeight: "1.4" }}
        >
          <p style={{ margin: "3px 0" }}>Pathway Family Services:</p>
          <p style={{ margin: "3px 0" }}>State Program Director -</p>
          <p style={{ margin: "3px 0" }}>P.O. Box 888, Bakersfield, CA 93302</p>
          <p style={{ margin: "3px 0" }}>Ph. 661-325-2570</p>
        </div>
      </div>

      {/* Signature section */}
      <div
        style={{
          margin: "30px 20px 10px 20px",
          fontSize: "14px",
          lineHeight: "1.4",
        }}
      >
        <p>
          I,{" "}
          {data?.countyWorkerName ? (
            <span style={{ borderBottom: "1px solid #000", padding: "0 5px" }}>
              {data.countyWorkerName}
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
          , CSW, have read and understand Pathway's Grievance Guidelines
          procedures.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <div style={{ width: "45%" }}>
            {renderSignatureArea("", "countyWorkerSignature")}
            <div style={{ textAlign: "center", marginTop: "5px" }}>
              <div>County Social Worker</div>
              <div style={{ marginTop: "5px" }}>
                {formatDate(data?.countyWorkerSignatureDate) ||
                  "________________"}
              </div>
              <div style={{ marginTop: "5px" }}>Date</div>
            </div>
          </div>

          <div style={{ width: "45%" }}>
            {renderSignatureArea("", "pathwayRepSignature")}
            <div style={{ textAlign: "center", marginTop: "5px" }}>
              <div>Pathway Authorized representative</div>
              <div style={{ marginTop: "5px" }}>
                {formatDate(data?.pathwayRepSignatureDate) ||
                  "________________"}
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

export default CountyWorkerGrievanceGuidelines;
