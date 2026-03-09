import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// DentalTreatmentRecord component using proper field mapping
const DentalTreatmentRecord = ({
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
        style={{ marginTop: "12px" }}
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
                fontSize: "13px",
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
            <span style={{ fontSize: "13px" }}>{title}</span>
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
      {/* Header section with logo and title */}
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
            margin: "20px 0",
            color: "#3a3a3a",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Dental Treatment Record
        </h2>
        <hr></hr>
      </div>

      {/* Client information section */}
      <div style={{ marginBottom: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "15%", fontSize: "13px" }}>
                <strong>Client Name:</strong>
              </td>
              <td
                style={{
                  width: "45%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                }}
              >
                {data?.name || ""}
              </td>
              <td
                style={{ width: "15%", fontSize: "13px", paddingLeft: "10px" }}
              >
                <strong>Date of Birth:</strong>
              </td>
              <td
                style={{
                  width: "25%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                }}
              >
                {formatDate(data?.dateOfBirth) || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Examination type section */}
      <div style={{ marginBottom: "20px" }}>
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
                  width: "33.3%",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    border: "1px solid #000",
                    marginRight: "4px",
                    verticalAlign: "middle",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {data?.examinationType === "initial" && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-3px",
                        left: "1px",
                        fontSize: "14px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ verticalAlign: "middle" }}>INITIAL EXAM</span>
              </td>
              <td
                style={{
                  width: "33.3%",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    border: "1px solid #000",
                    marginRight: "4px",
                    verticalAlign: "middle",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {data?.examinationType === "annual" && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-3px",
                        left: "1px",
                        fontSize: "14px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ verticalAlign: "middle" }}>ANNUAL EXAM</span>
              </td>
              <td
                style={{
                  width: "33.3%",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    border: "1px solid #000",
                    marginRight: "4px",
                    verticalAlign: "middle",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {data?.examinationType === "followUp" && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-3px",
                        left: "1px",
                        fontSize: "14px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ verticalAlign: "middle" }}>FOLLOW-UP EXAM</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Dental office information section */}
      <div style={{ marginBottom: "8px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "25%", fontSize: "13px" }}>
                <strong>Name of Dental Office:</strong>
              </td>
              <td
                style={{
                  width: "75%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                }}
              >
                {data?.dentalOfficeName || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "25%", fontSize: "13px" }}>
                <strong>Name of Dentist:</strong>
              </td>
              <td
                style={{
                  width: "75%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                }}
              >
                {data?.dentistName || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "15%", fontSize: "13px" }}>
                <strong>Address:</strong>
              </td>
              <td
                style={{
                  width: "85%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                }}
              >
                {data?.dentalOfficeAddress || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "15%", fontSize: "13px" }}>
                <strong>Phone:</strong>
              </td>
              <td
                style={{
                  width: "85%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                }}
              >
                {data?.dentalOfficePhone || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Treatment information section */}
      <div style={{ marginBottom: "8px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "25%", fontSize: "13px" }}>
                <strong>Date of Treatment:</strong>
              </td>
              <td
                style={{
                  width: "75%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                }}
              >
                {formatDate(data?.treatmentDate) || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "25%", fontSize: "13px", verticalAlign: "top" }}
              >
                <strong>Type of Treatment:</strong>
              </td>
              <td
                style={{
                  width: "75%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                }}
              >
                {data?.treatmentType || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "8px" }}>
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
                  width: "100%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                  height: "20px",
                }}
              >
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "20px" }}>
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
                  width: "100%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                  height: "20px",
                }}
              >
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Follow-up information section */}
      <div style={{ marginBottom: "8px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "30%", fontSize: "13px" }}>
                <strong>Follow-up treatment needed:</strong>
              </td>
              <td
                style={{ width: "10%", fontSize: "13px", textAlign: "center" }}
              >
                <div
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    border: "1px solid #000",
                    marginRight: "4px",
                    verticalAlign: "middle",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {data?.followupNeeded === "yes" && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-3px",
                        left: "1px",
                        fontSize: "14px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ verticalAlign: "middle" }}>YES</span>
              </td>
              <td
                style={{ width: "10%", fontSize: "13px", textAlign: "center" }}
              >
                <div
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    border: "1px solid #000",
                    marginRight: "4px",
                    verticalAlign: "middle",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {data?.followupNeeded === "no" && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-3px",
                        left: "1px",
                        fontSize: "14px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ verticalAlign: "middle" }}>NO</span>
              </td>
              <td style={{ width: "50%" }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ width: "25%", fontSize: "13px", verticalAlign: "top" }}
              >
                <strong>If yes please explain:</strong>
              </td>
              <td style={{ width: "75%" }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "8px" }}>
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
                  width: "100%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                  minHeight: "20px",
                }}
              >
                {data?.followupNeeded === "yes"
                  ? data?.followupExplanation || ""
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "8px" }}>
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
                  width: "100%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                  minHeight: "20px",
                }}
              >
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "20px" }}>
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
                  width: "100%",
                  borderBottom: "1px solid #000",
                  fontSize: "13px",
                  paddingBottom: "4px",
                  minHeight: "20px",
                }}
              >
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature section */}
      <div
        style={{
          marginTop: "40px",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", verticalAlign: "top" }}>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>
                  {renderSignatureArea("Dentist Signature", "dentistSignature")}
                </div>
              </td>
              <td style={{ width: "50%", verticalAlign: "top" }}>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    height: "20px",
                    marginTop: "30px",
                    fontSize: "13px",
                    paddingBottom: "4px",
                  }}
                >
                  {formatDate(data?.signatureDate) || ""}
                </div>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>Date</div>
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

export default DentalTreatmentRecord;
