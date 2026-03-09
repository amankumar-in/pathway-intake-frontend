import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// NoticeOfAction component using proper field mapping
const NoticeOfAction = ({
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
  // In standalone mode, all fields should be editable
  // State for signature menu
  const [signatureMenuAnchor, setSignatureMenuAnchor] = useState(null);
  const [currentSignatureArea, setCurrentSignatureArea] = useState("");

  // Format dates for display
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

  return (
    <div
      style={{
        padding: "20px",
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
      {/* Header with logo */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "35px",
            marginBottom: "5px",
            display: "block",
            margin: "0 auto",
          }}
        />
        <h2
          style={{
            margin: "5px 0",
            color: "#000000",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Notice of Action
        </h2>
      </div>

      {/* Submission Information */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
        }}
      >
        <div style={{ display: "flex", width: "50%" }}>
          <div style={{ width: "100px", fontSize: "9px" }}>
            <strong>Submitted by:</strong>
          </div>
          <div style={{ flex: "1", fontSize: "9px" }}>
            {data?.yourName || ""}
          </div>
        </div>
        <div style={{ display: "flex", width: "50%" }}>
          <div style={{ width: "100px", fontSize: "9px" }}>
            <strong>Office Location:</strong>
          </div>
          <div style={{ flex: "1", fontSize: "9px" }}>{data?.office || ""}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", width: "50%" }}>
          <div style={{ width: "100px", fontSize: "9px" }}>
            <strong>Date Submitted:</strong>
          </div>
          <div style={{ flex: "1", fontSize: "9px" }}>
            {formatDate(data?.dateSubmitted) || ""}
          </div>
        </div>
        <div style={{ display: "flex", width: "50%" }}>
          <div style={{ width: "100px", fontSize: "9px" }}>
            <strong>Date of Action:</strong>
          </div>
          <div style={{ flex: "1", fontSize: "9px" }}>
            {formatDate(data?.transactionDate) || ""}
          </div>
        </div>
      </div>

      {/* Transaction and Client Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <div style={{ width: "45%" }}>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold" }}>
              Placement Type
            </div>
            <div
              style={{
                border: "1px solid #000",
                padding: "5px",
                marginTop: "5px",
                fontSize: "11px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {data?.typeOfTransaction || ""}
            </div>
          </div>
        </div>

        <div style={{ width: "45%" }}>
          <div
            style={{
              marginBottom: "10px",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            Client Information
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ fontSize: "9px", width: "100px" }}>
                  <strong>Case Number:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {data?.caseNumber || ""}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "9px" }}>
                  <strong>Client Name:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {data?.name || ""}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "9px" }}>
                  <strong>D.O.B.:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {formatDate(data?.dateOfBirth) || ""}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "9px" }}>
                  <strong>Gender:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {data?.gender || ""}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "9px" }}>
                  <strong>Ethnicity:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {data?.ethnicity || ""}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "9px" }}>
                  <strong>Level of Care:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {data?.levelOfCare || ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", marginBottom: "15px" }}>
        <div style={{ width: "45%" }}>
          <div style={{ fontSize: "9px" }}>
            <strong>Prior Placement:</strong> {data?.priorPlacement || ""}
          </div>
        </div>
        <div style={{ width: "10%" }}></div>
        <div style={{ width: "45%" }}>
          <div style={{ fontSize: "9px" }}>
            <strong>Reason for Placement:</strong>{" "}
            {data?.reasonForPlacement || ""}
          </div>
        </div>
      </div>

      {/* Resource Home Information */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "5px",
            borderBottom: "1px solid #000",
          }}
        >
          Resource Home Information
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ fontSize: "9px", width: "150px" }}>
                <strong>Name of Resource Parents:</strong>
              </td>
              <td style={{ fontSize: "9px", borderBottom: "1px solid #000" }}>
                {data?.nameOfFosterParents || ""}
              </td>
              <td style={{ width: "20px" }}></td>
              <td style={{ fontSize: "9px", width: "100px" }}>
                <strong>Telephone #:</strong>
              </td>
              <td style={{ fontSize: "9px", borderBottom: "1px solid #000" }}>
                {data?.fosterParentsTelephone || ""}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: "10px" }}>
          <div style={{ fontSize: "9px" }}>
            <strong>Address of Resource Home:</strong>
          </div>
          <div
            style={{
              marginTop: "5px",
              fontSize: "9px",
              borderBottom: "1px solid #000",
            }}
          >
            {data?.fosterParentsAddress || ""}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "5px",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                borderBottom: "1px solid #000",
                width: "40%",
              }}
            >
              {data?.fosterParentsCity || ""}
            </span>
            <span
              style={{
                fontSize: "9px",
                borderBottom: "1px solid #000",
                width: "20%",
              }}
            >
              {data?.fosterParentsState || "California"}
            </span>
            <span
              style={{
                fontSize: "9px",
                borderBottom: "1px solid #000",
                width: "20%",
              }}
            >
              {data?.fosterParentsZip || ""}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <div style={{ fontSize: "9px" }}>
            <strong>Mailing Address (if different from above):</strong>
          </div>
          <div
            style={{
              marginTop: "5px",
              fontSize: "9px",
              borderBottom: "1px solid #000",
            }}
          >
            {data?.fosterParentsMailingAddress || ""}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "5px",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                borderBottom: "1px solid #000",
                width: "40%",
              }}
            >
              {data?.fosterParentsCity || ""}
            </span>
            <span
              style={{
                fontSize: "9px",
                borderBottom: "1px solid #000",
                width: "20%",
              }}
            >
              {data?.fosterParentsState || "California"}
            </span>
            <span
              style={{
                fontSize: "9px",
                borderBottom: "1px solid #000",
                width: "20%",
              }}
            >
              {data?.fosterParentsZip || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Bed Capacity and Certification */}
      <div style={{ marginBottom: "15px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontSize: "9px",
                  width: "150px",
                  paddingBottom: "5px",
                }}
              >
                <strong>Bed Capacity:</strong>
              </td>
              <td
                style={{
                  fontSize: "9px",
                  borderBottom: "1px solid #000",
                  paddingBottom: "5px",
                  width: "100px",
                }}
              >
                {data?.bedCapacity || ""}
              </td>
              <td style={{ width: "30px" }}></td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "9px",
                  width: "150px",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                <strong>Certified ages of care:</strong>
              </td>
              <td
                style={{
                  fontSize: "9px",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                <strong>From:</strong>
              </td>
              <td
                style={{
                  fontSize: "9px",
                  borderBottom: "1px solid #000",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                {data?.certifiedAgesFrom || ""}
              </td>
              <td
                style={{
                  fontSize: "9px",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                <strong>To:</strong>
              </td>
              <td
                style={{
                  fontSize: "9px",
                  borderBottom: "1px solid #000",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                {data?.certifiedAgesTo || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "9px",
                  width: "150px",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                <strong>Certification dates:</strong>
              </td>
              <td
                style={{
                  fontSize: "9px",
                  paddingBottom: "5px",

                  paddingTop: "5px",
                }}
              >
                <strong>From:</strong>
              </td>
              <td
                style={{
                  fontSize: "9px",
                  borderBottom: "1px solid #000",
                  paddingBottom: "5px",
                  width: "150px",
                  paddingTop: "5px",
                }}
              >
                {formatDate(data?.certificationDateFrom) || ""}
              </td>
              <td
                style={{
                  fontSize: "9px",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                <strong>To:</strong>
              </td>
              <td
                style={{
                  fontSize: "9px",
                  borderBottom: "1px solid #000",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                {formatDate(data?.certificationDateTo) || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Approved Section with Signature */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "5px",
            borderBottom: "1px solid #000",
          }}
        >
          Action Approved
        </div>

        <div style={{ marginTop: "15px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "60%" }}>
              <div style={{ fontSize: "9px" }}>
                <strong>Actions Approved By:</strong>{" "}
                {data?.actionsApprovedBy || "_________________________"}
              </div>
            </div>
            <div style={{ width: "30%" }}>
              <div style={{ fontSize: "9px" }}>
                <strong>Date:</strong>{" "}
                {formatDate(data?.approvalDate) || "______________"}
              </div>
            </div>
          </div>
          <div
            style={{
              width: "35%",
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderSignatureArea("Supervisor's Signature", "approvalSignature")}
          </div>
        </div>
      </div>

      {/* County Worker Information */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "5px",
            borderBottom: "1px solid #000",
          }}
        >
          County Worker Information
        </div>

        <div style={{ marginTop: "15px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ fontSize: "9px", width: "150px" }}>
                  <strong>County Worker (name & title):</strong>
                </td>
                <td style={{ fontSize: "9px", borderBottom: "1px solid #000" }}>
                  {data?.countyWorkerName || ""}{" "}
                  {data?.countyWorkerTitle ? `(${data.countyWorkerTitle})` : ""}
                </td>
              </tr>
              <tr>
                <td
                  style={{ fontSize: "9px", width: "150px", paddingTop: "5px" }}
                >
                  <strong>Address of county worker:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                    paddingTop: "5px",
                  }}
                >
                  {data?.countyWorkerAddress || ""}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "9px", width: "150px" }}></td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {data?.countyWorkerCity || ""},{" "}
                  {data?.countyWorkerState || "CA"}{" "}
                  {data?.countyWorkerZip || ""}
                </td>
              </tr>
              <tr>
                <td
                  style={{ fontSize: "9px", width: "150px", paddingTop: "5px" }}
                >
                  <strong>Telephone #:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                    paddingTop: "5px",
                  }}
                >
                  {data?.countyWorkerTelephone || ""}
                </td>
              </tr>
              <tr>
                <td
                  style={{ fontSize: "9px", width: "150px", paddingTop: "5px" }}
                >
                  <strong>County & Department:</strong>
                </td>
                <td
                  style={{
                    fontSize: "9px",
                    borderBottom: "1px solid #000",
                    paddingTop: "5px",
                  }}
                >
                  {data?.nameOfCounty || ""} {data?.nameOfDepartment || ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Assigned */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "5px",
            borderBottom: "1px solid #000",
          }}
        >
          Case Assigned to:
        </div>

        <div style={{ marginTop: "15px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "60%" }}>
              <div style={{ fontSize: "9px" }}>
                <strong>Pathway Social Worker:</strong>{" "}
                {data?.pathwayRepresentative || ""}
              </div>
            </div>
            <div style={{ width: "30%" }}>
              <div style={{ fontSize: "9px" }}>
                <strong>Office #:</strong> {data?.officeNumber || ""}
              </div>
            </div>
          </div>
          <div
            style={{
              width: "35%",
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderSignatureArea(
              "Social Worker Signature",
              "socialWorkerSignature"
            )}
          </div>
          <div
            style={{
              width: "35%",
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              left: "65%",
            }}
          ></div>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "5px",
            borderBottom: "1px solid #000",
          }}
        >
          Notes / Comments:
        </div>
        <div
          style={{
            minHeight: "60px",
            border: "1px solid #ccc",
            padding: "5px",
            fontSize: "9px",
          }}
        >
          {data?.notes || ""}
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

export default NoticeOfAction;
