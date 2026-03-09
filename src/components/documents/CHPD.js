import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// CHPD component using proper field mapping
const CHPD = ({
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

  // Helper function to render checkbox
  const renderCheckbox = (isChecked) => {
    return (
      <div
        style={{
          width: "10px",
          height: "10px",
          border: "1px solid #000",
          display: "inline-block",
          marginRight: "4px",
          backgroundColor: isChecked ? "#000" : "transparent",
        }}
      />
    );
  };

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
      {/* Header section with logo and titles in one row */}
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: "10px",
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
          <h3
            style={{
              margin: "0",
              color: "#3a3a3a",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Pathway Family Services, Inc.
          </h3>
          <h4
            style={{
              margin: "2px 0 0 0",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            CHDP Form
          </h4>
        </div>
      </div>

      {/* Client information section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "10px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "10%", fontSize: "9px" }}>
              <strong>Name:</strong>
            </td>
            <td
              style={{
                width: "30%",
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {data?.name || ""}
            </td>
            <td style={{ width: "5%" }}></td>
            <td style={{ width: "20%", fontSize: "9px" }}>
              <strong>Date of Birth:</strong>
            </td>
            <td
              style={{
                width: "20%",
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {formatDate(data?.dateOfBirth) || ""}
            </td>
            <td style={{ width: "5%", fontSize: "9px" }}>
              <strong>Age:</strong>
            </td>
            <td
              style={{
                width: "5%",
                borderBottom: "1px solid #000",
                fontSize: "9px",
                textAlign: "center",
              }}
            >
              {data?.age || ""}
            </td>
            <td style={{ width: "5%" }}></td>
            <td style={{ width: "10%", fontSize: "9px", textAlign: "right" }}>
              <strong>Gender:</strong>
            </td>
            <td
              style={{
                width: "10%",
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {data?.gender || ""}
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              <strong>Patient's County of Residence:</strong>
            </td>
            <td
              colSpan="4"
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              {data?.countyOfResidence || ""}
            </td>
            <td
              colSpan="2"
              style={{
                fontSize: "9px",
                paddingTop: "10px",
                textAlign: "right",
              }}
            >
              <strong>Phone:</strong>
            </td>
            <td
              colSpan="3"
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              {data?.phone || ""}
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              <strong>Person Responsible:</strong>
            </td>
            <td
              colSpan="2"
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              {data?.personResponsible || ""}
            </td>
            <td
              colSpan="2"
              style={{
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              <strong>Address:</strong>
            </td>
            <td
              colSpan="3"
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              {data?.address || ""}
            </td>
            <td
              style={{
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              <strong>Zip:</strong>
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
                paddingTop: "10px",
              }}
            >
              {data?.zipCode || ""}
            </td>
          </tr>
        </tbody>
      </table>

      {/* CHDP Assessment Section */}
      <div style={{ marginBottom: "10px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th
                colSpan="10"
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "3px",
                  textAlign: "left",
                  borderBottom: "1px solid #000",
                }}
              >
                CHDP ASSESSMENT
              </th>
            </tr>
            <tr>
              <th
                style={{
                  fontSize: "8px",
                  padding: "3px",
                  width: "25%",
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                }}
              >
                Indicate outcome for each screening procedure
              </th>
              <th
                style={{
                  fontSize: "8px",
                  padding: "3px",
                  width: "10%",
                  textAlign: "center",
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                }}
              >
                NO PROBLEM
              </th>
              <th
                style={{
                  fontSize: "8px",
                  padding: "3px",
                  width: "10%",
                  textAlign: "center",
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                }}
              >
                REFUSED CONTRA-INDICATED NOT NEEDED
              </th>
              <th
                style={{
                  fontSize: "8px",
                  padding: "3px",
                  width: "8%",
                  textAlign: "center",
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                }}
              >
                PROBLEM SUSPECTED NEW
              </th>
              <th
                style={{
                  fontSize: "8px",
                  padding: "3px",
                  width: "8%",
                  textAlign: "center",
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                }}
              >
                KNOWN
              </th>
              <th
                style={{
                  fontSize: "8px",
                  padding: "3px",
                  width: "25%",
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                }}
              >
                Comments/Problem
              </th>
              <th
                style={{
                  fontSize: "8px",
                  padding: "3px",
                  width: "14%",
                  borderBottom: "1px solid #000",
                }}
              >
                FOLLOW UP CODES
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Screening Procedures */}
            {[
              "HISTORY & PHYSICAL EXAM",
              "DENTAL ASSESSMENT/REFERRAL",
              "NUTRITIONAL ASSESSMENT",
              "ANTICIPATORY GUIDANCE",
              "HEALTH EDUCATION",
              "DEVELOPMENT ASSESSMENT",
              "SNELLEN OR EQUIVALENT",
              "AUDIOMETRIC",
              "HEMOGLOBIN OR HEMATOCRIT",
              "URINE DIPSTICK",
              "COMPLETE URINALYSIS",
              "TB - MANTOUX",
            ].map((procedure, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                <td
                  style={{
                    fontSize: "8px",
                    padding: "3px",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  {procedure}
                </td>
                <td
                  style={{
                    fontSize: "8px",
                    padding: "3px",
                    textAlign: "center",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  {renderCheckbox(
                    data?.[
                      `${procedure.replace(/\s+/g, "_").toLowerCase()}_noProb`
                    ]
                  )}
                </td>
                <td
                  style={{
                    fontSize: "8px",
                    padding: "3px",
                    textAlign: "center",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  {renderCheckbox(
                    data?.[
                      `${procedure.replace(/\s+/g, "_").toLowerCase()}_refused`
                    ]
                  )}
                </td>
                <td
                  style={{
                    fontSize: "8px",
                    padding: "3px",
                    textAlign: "center",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  {renderCheckbox(
                    data?.[
                      `${procedure.replace(/\s+/g, "_").toLowerCase()}_new`
                    ]
                  )}
                </td>
                <td
                  style={{
                    fontSize: "8px",
                    padding: "3px",
                    textAlign: "center",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  {renderCheckbox(
                    data?.[
                      `${procedure.replace(/\s+/g, "_").toLowerCase()}_known`
                    ]
                  )}
                </td>
                <td
                  style={{
                    fontSize: "8px",
                    padding: "3px",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  {data?.[
                    `${procedure.replace(/\s+/g, "_").toLowerCase()}_comments`
                  ] || ""}
                </td>
                <td style={{ fontSize: "8px", padding: "3px" }}>
                  {data?.[
                    `${procedure.replace(/\s+/g, "_").toLowerCase()}_followup`
                  ] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other Tests */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "10px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "10%", fontSize: "9px" }}>
              <strong>CODE</strong>
            </td>
            <td style={{ width: "30%", fontSize: "9px" }}>
              <strong>OTHER TESTS</strong>
            </td>
            <td style={{ width: "10%", fontSize: "9px" }}>
              <strong>CODE</strong>
            </td>
            <td style={{ width: "30%", fontSize: "9px" }}>
              <strong>OTHER TESTS</strong>
            </td>
            <td style={{ width: "20%", fontSize: "9px", textAlign: "right" }}>
              <strong>ROUTINE REFERRAL(S)</strong>
            </td>
          </tr>
          <tr>
            <td
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {data?.otherTest1Code || ""}
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {data?.otherTest1Desc || ""}
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {data?.otherTest2Code || ""}
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {data?.otherTest2Desc || ""}
            </td>
            <td style={{ fontSize: "9px" }}>
              {renderCheckbox(data?.bloodLeadTest)} BLOOD LEAD
            </td>
          </tr>
          <tr>
            <td colSpan="4"></td>
            <td style={{ fontSize: "9px" }}>
              {renderCheckbox(data?.dentalReferral)} DENTAL
            </td>
          </tr>
          <tr>
            <td
              colSpan="2"
              style={{
                fontSize: "9px",
                paddingTop: "5px",
              }}
            >
              <strong>HEIGHT:</strong> {data?.height || ""}
            </td>
            <td
              colSpan="2"
              style={{
                fontSize: "9px",
                paddingTop: "5px",
              }}
            >
              <strong>WEIGHT:</strong> {data?.weight || ""}
            </td>
            <td
              style={{
                fontSize: "9px",
                paddingTop: "5px",
              }}
            >
              <strong>PATIENT IS A</strong>
            </td>
          </tr>
          <tr>
            <td
              colSpan="4"
              style={{
                fontSize: "9px",
              }}
            >
              <strong>BLOOD PRESSURE:</strong> {data?.bloodPressure || ""}
            </td>
            <td style={{ fontSize: "9px" }}>
              {renderCheckbox(data?.isFosterChild)} Resource Child
            </td>
          </tr>
          <tr>
            <td
              colSpan="2"
              style={{
                fontSize: "9px",
                paddingTop: "5px",
              }}
            >
              <strong>HEMOGLOBIN:</strong> {data?.hemoglobin || ""}
            </td>
            <td
              colSpan="2"
              style={{
                fontSize: "9px",
                paddingTop: "5px",
              }}
            >
              <strong>HEMATOCRIT:</strong> {data?.hematocrit || ""}
            </td>
            <td style={{ fontSize: "9px" }}></td>
          </tr>
          <tr>
            <td
              colSpan="4"
              style={{
                fontSize: "9px",
              }}
            >
              <strong>AMBULATORY STATUS:</strong>{" "}
              {renderCheckbox(data?.isAmbulatory)} YES{" "}
              {renderCheckbox(data?.isNotAmbulatory)} NO
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Tobacco Questions */}
      <div style={{ marginBottom: "10px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <tbody>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <td
                colSpan="5"
                style={{
                  fontSize: "9px",
                  fontWeight: "bold",
                  padding: "3px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                THE QUESTIONS BELOW MUST BE ANSWERED
              </td>
            </tr>
            <tr>
              <td
                colSpan="3"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                1. Patient is Exposed to Passive (second hand) Tobacco Smoke.
              </td>
              <td
                style={{
                  fontSize: "9px",
                  padding: "3px",
                  width: "10%",
                }}
              >
                {renderCheckbox(data?.passiveSmokeExposure === "yes")} YES
              </td>
              <td
                style={{
                  fontSize: "9px",
                  padding: "3px",
                  width: "10%",
                }}
              >
                {renderCheckbox(data?.passiveSmokeExposure === "no")} NO
              </td>
            </tr>
            <tr>
              <td
                colSpan="3"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                2. Tobacco Used by Patient
              </td>
              <td
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                {renderCheckbox(data?.patientUsesTobacco === "yes")} YES
              </td>
              <td
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                {renderCheckbox(data?.patientUsesTobacco === "no")} NO
              </td>
            </tr>
            <tr>
              <td
                colSpan="3"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                3. Counseled about/Referred for Tobacco Use Prevention
                Cessation.
              </td>
              <td
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                {renderCheckbox(data?.counseledForTobacco === "yes")} YES
              </td>
              <td
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                {renderCheckbox(data?.counseledForTobacco === "no")} NO
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Immunizations */}
      <div style={{ marginBottom: "10px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <tbody>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <td
                colSpan="6"
                style={{
                  fontSize: "9px",
                  fontWeight: "bold",
                  padding: "3px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                IMMUNIZATIONS
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                  height: "40px",
                  verticalAlign: "top",
                }}
              >
                {data?.immunizationNotes || ""}
              </td>
            </tr>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <td
                colSpan="6"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                  borderTop: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                }}
              >
                (To be completed by Social Worker)
              </td>
            </tr>
            <tr>
              <td
                colSpan="3"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                CHDP brochure / explanation given
              </td>
              <td
                colSpan="3"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                  borderBottom: "1px dotted #000",
                }}
              >
                {formatDate(data?.brochureGivenDate) || ""}
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                CHDP Services Requested (circle one)
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                  }}
                >
                  <div>
                    {data?.servicesRequested === "01" ? "●" : "○"} 01 -
                    Information only
                  </div>
                  <div>
                    {data?.servicesRequested === "02" ? "●" : "○"} 02 - Medical
                    and Dental
                  </div>
                  <div>
                    {data?.servicesRequested === "03" ? "●" : "○"} 03 - Medical
                    only
                  </div>
                  <div>
                    {data?.servicesRequested === "04" ? "●" : "○"} 04 - Dental
                    only
                  </div>
                  <div>
                    {data?.servicesRequested === "05" ? "●" : "○"} 05 - No
                    referral made; child under care
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Referral Information */}
      <div style={{ marginBottom: "10px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: "20%",
                  fontSize: "9px",
                  fontWeight: "bold",
                }}
              >
                REFERRED TO:
              </td>
              <td
                colSpan="5"
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "9px",
                }}
              >
                {data?.referredTo1 || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "9px",
                  paddingTop: "5px",
                  fontWeight: "bold",
                }}
              >
                PHONE:
              </td>
              <td
                colSpan="5"
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "9px",
                  paddingTop: "5px",
                }}
              >
                {data?.referredTo1Phone || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "9px",
                  paddingTop: "5px",
                  fontWeight: "bold",
                }}
              >
                REFERRED TO:
              </td>
              <td
                colSpan="5"
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "9px",
                  paddingTop: "5px",
                }}
              >
                {data?.referredTo2 || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "9px",
                  paddingTop: "5px",
                  fontWeight: "bold",
                }}
              >
                PHONE:
              </td>
              <td
                colSpan="5"
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "9px",
                  paddingTop: "5px",
                }}
              >
                {data?.referredTo2Phone || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Patient Visit Information */}
      <div style={{ marginBottom: "10px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <tbody>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <td
                colSpan="2"
                style={{
                  fontSize: "9px",
                  fontWeight: "bold",
                  padding: "3px",
                  borderBottom: "1px solid #ccc",
                  width: "40%",
                }}
              >
                PATIENT VISIT
              </td>
              <td
                colSpan="2"
                style={{
                  fontSize: "9px",
                  fontWeight: "bold",
                  padding: "3px",
                  borderBottom: "1px solid #ccc",
                  width: "30%",
                }}
              >
                TYPE OF SCREEN
              </td>
              <td
                colSpan="2"
                style={{
                  fontSize: "9px",
                  fontWeight: "bold",
                  padding: "3px",
                  borderBottom: "1px solid #ccc",
                  width: "30%",
                }}
              >
                IDENTIFICATION NUMBER
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px", padding: "3px" }}>
                {renderCheckbox(data?.isNewPatient)} NEW PATIENT OR
              </td>
              <td style={{ fontSize: "9px", padding: "3px" }}>
                {renderCheckbox(data?.isRoutineVisit)} ROUTINE VISIT
              </td>
              <td style={{ fontSize: "9px", padding: "3px" }}>
                {renderCheckbox(data?.isInitialScreen)} INITIAL
              </td>
              <td style={{ fontSize: "9px", padding: "3px" }}>
                {renderCheckbox(data?.isPeriodicScreen)} PERIODIC
              </td>
              <td
                colSpan="2"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                <strong>Medi-Cal #:</strong> {data?.mediCalNumber || ""}
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                EXTENDED VISIT
              </td>
              <td
                colSpan="4"
                style={{
                  fontSize: "9px",
                  padding: "3px",
                }}
              >
                {renderCheckbox(data?.coveredByMediCal)} Covered by Medi-Cal
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Provider Information */}
      <div style={{ marginBottom: "10px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                colSpan="6"
                style={{
                  fontSize: "9px",
                  fontWeight: "bold",
                }}
              >
                Order of Service: Name, Address, Phone Number
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "9px",
                  height: "20px",
                }}
              >
                {data?.orderOfService || ""}
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                style={{
                  fontSize: "9px",
                  paddingTop: "5px",
                  fontWeight: "bold",
                }}
              >
                Provider Number:
              </td>
              <td
                colSpan="4"
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "9px",
                  paddingTop: "5px",
                }}
              >
                {data?.providerNumber || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Certification */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{ fontSize: "9px", margin: "5px 0" }}>
          I certify that the screening information is true and complete, and the
          results explained to the child or his/her resource parent or guardian.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                {renderSignatureArea("Signature", "providerSignature")}
              </td>
              <td style={{ width: "50%" }}>
                <div
                  style={{
                    height: "35px",
                    borderBottom: "1px solid #000",
                    fontSize: "9px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {formatDate(data?.certificationDate) || ""}
                </div>
                <div style={{ fontSize: "9px", textAlign: "center" }}>Date</div>
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

export default CHPD;
