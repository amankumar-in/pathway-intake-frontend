import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// ClientInitialCarePlan component using proper field mapping
const ClientInitialCarePlan = ({
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
      month: "2-digit",
      day: "2-digit",
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

  // Format multiline text for display
  const formatMultilineText = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div
      style={{
        padding: "5px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        fontFamily: "Arial, sans-serif",
        fontSize: "10px",
        lineHeight: "1.4",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header section with logo */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
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
            color: "#3a3a3a",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Client Initial CARE Plan
        </h3>
      </div>

      {/* Client information section */}
      <div style={{ marginBottom: "10px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderSpacing: "0",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  fontSize: "10px",

                  width: "25%",
                }}
              >
                CLIENT'S NAME:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "13px",

                  fontWeight: "bold",
                  paddingBottom: "3px",
                  width: "40%",
                }}
              >
                {data?.name || ""}
              </td>
              <td
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  paddingRight: "10px",
                  paddingLeft: "15px",
                }}
              >
                DOB:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingLeft: "5px",
                  fontWeight: "bold",
                  paddingBottom: "3px",
                  width: "15%",
                }}
              >
                {formatDate(data?.dateOfBirth) || ""}
              </td>
              <td
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  paddingRight: "10px",
                  paddingLeft: "15px",
                }}
              >
                DOI:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingLeft: "5px",
                  paddingBottom: "3px",
                  width: "15%",
                }}
              >
                {formatDate(data?.transactionDate) || ""}
              </td>
              <td
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  paddingRight: "10px",
                  paddingLeft: "15px",
                }}
              >
                STATUS:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingLeft: "5px",
                  paddingBottom: "3px",
                  width: "10%",
                }}
              >
                {data?.clientStatus || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Placement Type */}
      <div style={{ marginBottom: "10px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "25%", fontSize: "10px" }}>
                <strong>Reunification:</strong>{" "}
                {data?.isReunification ? "✓" : "_____"}
              </td>
              <td style={{ width: "25%", fontSize: "10px" }}>
                <strong>or Placement:</strong>{" "}
                {data?.isPlacement ? "✓" : "_____"}
              </td>
              <td style={{ width: "25%", fontSize: "10px" }}>
                <strong>or Sibling placement:</strong>{" "}
                {data?.isSiblingPlacement ? "✓" : "_____"}
              </td>
              <td style={{ width: "25%", fontSize: "10px" }}>
                <strong>or Adoption:</strong> {data?.isAdoption ? "✓" : "_____"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 1: General Needs and Services */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>1.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>General Needs and Services:</strong> Brief description
                of client's emotional/behavioral and social problems; functional
                capabilities; ability to handle personal cash resources and
                perform simple homemaking tasks: client's likes and dislikes.
                <div
                  style={{
                    minHeight: "40px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "5px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {formatMultilineText(data?.generalNeeds)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 2: Physical/Health */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>2.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>Physical/Health:</strong> Difficulty with physical
                development and poor health habits regarding body functions and
                include allergies, medications, and physical restrictions;
                general medical dental needs.
                <div
                  style={{
                    minHeight: "40px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "5px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {formatMultilineText(data?.physicalHealth)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 3: Scheduled Client Dates */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>3.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>Scheduled Client Dates:</strong> Include medical,
                dental, counseling, testing, support groups, court, home visits,
                friends & reunification meetings.
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "5px",
                    border: "1px solid #ddd",
                  }}
                >
                  <tbody>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          width: "40%",
                        }}
                      >
                        Type Of Appointment:
                      </td>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          width: "30%",
                        }}
                      >
                        Date:
                      </td>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          width: "30%",
                        }}
                      >
                        Time:
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong>CHDP PHYSICAL</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {formatDate(data?.chdpPhysicalDate) || "WITHIN 30 DAYS"}
                      </td>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          border: "1px solid #ddd",
                        }}
                      ></td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong>CHDP DENTAL</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {formatDate(data?.chdpDentalDate) || "WITHIN 30 DAYS"}
                      </td>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          border: "1px solid #ddd",
                        }}
                      ></td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong>SOCIAL WORKER VISITS</strong>
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          padding: "6px",
                          fontSize: "11px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {data?.socialWorkerVisitSchedule ||
                          "WEEKLY & BI WEEKLY"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  style={{
                    minHeight: "20px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "8px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {formatMultilineText(data?.additionalAppointments)}
                  {data?.appointmentDetails && data?.additionalAppointments && (
                    <br />
                  )}
                  {formatMultilineText(data?.appointmentDetails)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 4: Client Contacts */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>4.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>Client Contacts:</strong> Frequency and time frames of
                home visits; phone calls to natural family or friends;
                reunification meetings.
                <div
                  style={{
                    minHeight: "40px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "5px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {formatMultilineText(data?.clientContacts)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 5: School/Educational/Developmental Needs */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>5.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>School / Educational / Developmental Needs:</strong>{" "}
                Goals, objectives, difficulties and limitations. Support child's
                educational needs. Enroll into school, daycare or Head Start as
                applicable.
                <div
                  style={{
                    minHeight: "40px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "5px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {formatMultilineText(data?.educationalNeeds)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 6: Counseling */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>6.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>Counseling, Testing, Support Group Agreements:</strong>{" "}
                Goals, objectives, difficulty with intellectual functioning.
                <div
                  style={{
                    minHeight: "40px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "5px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {formatMultilineText(data?.counselingAgreements)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 7: Independent Living Program */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>7.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>Independent Living Program:</strong>
                <div
                  style={{
                    minHeight: "20px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "5px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {formatMultilineText(data?.independentLivingProgram)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 8: Religious Preference */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>8.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>Religious Preference:</strong>
                <div
                  style={{
                    minHeight: "20px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "5px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {data?.religiousPreference || ""}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 9: Additional Information */}
      <div style={{ marginBottom: "5px", breakInside: "avoid" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "3%", verticalAlign: "top", fontSize: "10px" }}
              >
                <strong>9.</strong>
              </td>
              <td style={{ verticalAlign: "top", fontSize: "10px" }}>
                <strong>Additional Information:</strong>
                <div
                  style={{
                    minHeight: "40px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginTop: "5px",
                    fontSize: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {formatMultilineText(data?.additionalInformation)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Disclaimer and Signatures Section */}
      <div style={{ marginBottom: "10px", fontSize: "11px" }}>
        <p>
          I/We understand my/our responsibility for providing care, supervision
          and transportation as needed for the above named person and agree with
          the general plan. I/We further understand that this plan will be
          reviewed at least every 6 months.
        </p>

        {/* Signatures */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "60%" }}>
                <div>
                  {renderSignatureArea(
                    "Foster Parent Signature",
                    "fosterParentSignature"
                  )}
                </div>
              </td>
              <td style={{ width: "10%" }}></td>
              <td style={{ width: "30%", verticalAlign: "bottom" }}>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  {formatDate(data?.signatureDate) || formatDate(new Date())}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    paddingTop: "3px",
                  }}
                >
                  Date
                </div>
              </td>
            </tr>

            <tr>
              <td style={{ width: "60%" }}>
                <div>
                  {renderSignatureArea(
                    "Social Worker Signature",
                    "socialWorkerSignature"
                  )}
                </div>
              </td>
              <td style={{ width: "10%" }}></td>
              <td style={{ width: "30%", verticalAlign: "bottom" }}>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  {formatDate(data?.signatureDate) || formatDate(new Date())}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    paddingTop: "3px",
                  }}
                >
                  Date
                </div>
              </td>
            </tr>

            <tr>
              <td style={{ width: "60%" }}>
                <div>
                  {renderSignatureArea(
                    "County Social Worker Signature (if applicable)",
                    "countySocialWorkerSignature"
                  )}
                </div>
              </td>
              <td style={{ width: "10%" }}></td>
              <td style={{ width: "30%", verticalAlign: "bottom" }}>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  {formatDate(data?.signatureDate) || formatDate(new Date())}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    paddingTop: "3px",
                  }}
                >
                  Date
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

export default ClientInitialCarePlan;
