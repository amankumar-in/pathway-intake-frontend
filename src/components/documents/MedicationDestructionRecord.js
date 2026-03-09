import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// MedicationDestructionRecord component using proper field mapping from Excel
const MedicationDestructionRecord = ({
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
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [currentTableId, setCurrentTableId] = useState(null);

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
  const handleSignatureClick = (event, signatureArea, rowIndex, tableId) => {
    if (isStandalone) {
      // For standalone documents, call onAddSignature directly with the event
      if (onAddSignature) {
        // Use the standalone signature format but include the row index in the target area
        onAddSignature(
          "standaloneSignature",
          `${signatureArea}-${tableId}-${rowIndex}`,
          event
        );
      }
    } else {
      // For regular documents, show the signature selection menu
      setSignatureMenuAnchor(event.currentTarget);
      setCurrentSignatureArea(signatureArea);
      setCurrentRowIndex(rowIndex);
      setCurrentTableId(tableId);
    }
  };

  // Handle menu close
  const handleMenuClose = () => {
    setSignatureMenuAnchor(null);
    setCurrentSignatureArea("");
    setCurrentRowIndex(null);
    setCurrentTableId(null);
  };

  // Handle signature selection
  const handleSignatureSelect = (signatureType) => {
    if (onAddSignature) {
      // Include row index and table ID in the signature area to make it unique per row
      const uniqueSignatureArea = `${currentSignatureArea}-${currentTableId}-${currentRowIndex}`;
      onAddSignature(signatureType, uniqueSignatureArea);
    }
    handleMenuClose();
  };

  // Handle signature removal
  const handleRemoveSignature = (signatureArea, rowIndex, tableId) => {
    if (onRemoveSignature) {
      // Include row index and table ID in the signature area to make it unique per row
      const uniqueSignatureArea = `${signatureArea}-${tableId}-${rowIndex}`;
      onRemoveSignature(uniqueSignatureArea);
    }
  };

  // Check if a signature is placed
  const hasSignature = (signatureArea, rowIndex, tableId) => {
    const uniqueSignatureArea = `${signatureArea}-${tableId}-${rowIndex}`;
    return signatures && signatures[uniqueSignatureArea];
  };

  // Render signature area
  const renderSignatureArea = (title, signatureArea, rowIndex, tableId) => {
    const signaturePlaced = hasSignature(signatureArea, rowIndex, tableId);
    const inPrintMode = isPrintMode();
    const uniqueSignatureArea = `${signatureArea}-${tableId}-${rowIndex}`;

    return (
      <div
        className={signatureAreaClass || "signature-area"}
        style={{ marginTop: "0", height: "32px" }}
      >
        {signaturePlaced ? (
          <div>
            <div
              style={{
                height: "24px",
                backgroundImage: `url(${signatures[uniqueSignatureArea]})`,
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
                    onClick={() =>
                      handleRemoveSignature(signatureArea, rowIndex, tableId)
                    }
                    className={deleteButtonClass || "delete-button"}
                    style={{ padding: "2px" }}
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
                height: "24px",
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
                    onClick={(e) =>
                      handleSignatureClick(e, signatureArea, rowIndex, tableId)
                    }
                    className={placeholderClass || "signature-placeholder"}
                    size="small"
                    style={{ padding: "2px" }}
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

  // Get medication entries or use empty array if none
  const centralMedications = data?.centralMedications || [];
  const destructionEntries = data?.destructionEntries || [];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        fontFamily: "Arial, sans-serif",
        fontSize: "10px",
        lineHeight: "1.3",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header section with title and logo */}
      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        {/* Agency Logo */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={LOGO_BASE64}
            alt="Pathway Family Services Logo"
            style={{
              height: "40px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Pathway Family Services */}
        <div style={{ textAlign: "center", marginBottom: "5px" }}>
          <span style={{ fontWeight: "bold", fontSize: "12px" }}>
            Pathway Family Services, Inc.
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            margin: "5px 0",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            textDecoration: "underline",
          }}
        >
          Centrally Stored Medication and Destruction Record
        </h2>
      </div>

      {/* Section I: CENTRALLY STORED MEDICATION */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "65%" }}>
            <h3
              style={{
                margin: "0 0 5px 0",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              I. CENTRALLY STORED MEDICATION
            </h3>
            <p
              style={{
                margin: "5px 0 10px 0",
                fontSize: "11px",
                lineHeight: "1.3",
              }}
            >
              INSTRUCTIONS: Centrally stored medications shall be kept in a safe
              and locked place that is not accessible to any person(s) except
              authorized individuals. Medication records on each client shall be
              maintained for at least one year
            </p>
          </div>
          <div
            style={{
              width: "30%",
              border: "1px solid #000",
              padding: "5px",
            }}
          >
            <div style={{ marginBottom: "5px" }}>
              <div
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "9px",
                }}
              >
                FACILITY NAME:
              </div>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                  fontWeight: "normal",
                  fontSize: "10px",
                }}
              >
                Pathway Family Services, Inc.
              </div>
            </div>
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "9px",
                }}
              >
                FACILITY NUMBER:
              </div>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                  fontWeight: "normal",
                  fontSize: "10px",
                }}
              >
                {data?.officeNumber || "201"}
              </div>
            </div>
          </div>
        </div>

        {/* Client Information Row */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            border: "1px solid #000",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: "20%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "normal",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              >
                CLIENT NAME:
                <div
                  style={{
                    fontWeight: "bold",
                    minHeight: "12px",
                    fontSize: "11px",
                  }}
                >
                  {data?.name || ""}
                </div>
              </td>
              <td
                style={{
                  width: "18%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "normal",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              >
                DATE OF INTAKE:
                <div
                  style={{
                    fontWeight: "bold",
                    minHeight: "12px",
                    fontSize: "10px",
                  }}
                >
                  {formatDate(data?.transactionDate) || ""}
                </div>
              </td>
              <td
                style={{
                  width: "18%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "normal",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              >
                ADMISSION DATE:
                <div
                  style={{
                    fontWeight: "bold",
                    minHeight: "12px",
                    fontSize: "10px",
                  }}
                >
                  {formatDate(data?.admissionDate) || ""}
                </div>
              </td>
              <td
                style={{
                  width: "24%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "normal",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              >
                ATTENDING PHYSICIAN:
                <div
                  style={{
                    fontWeight: "bold",
                    minHeight: "12px",
                    fontSize: "10px",
                  }}
                >
                  {data?.attendingPhysician || ""}
                </div>
              </td>
              <td
                style={{
                  width: "20%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "normal",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              >
                ADMINISTRATOR:
                <div
                  style={{
                    fontWeight: "bold",
                    minHeight: "12px",
                    fontSize: "10px",
                  }}
                >
                  {data?.administrator || ""}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Gap between client info and medication table */}
        <div style={{ height: "15px" }}></div>

        {/* Medication Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "15%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>MEDICATION</div>
                <div>NAME</div>
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>STRENGTH</div>
                <div>QUANTITY</div>
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>INSTRUCTIONS</div>
                <div>CONTROL/CUSTODY</div>
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>EXPIRATION</div>
                <div>DATE</div>
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>DATE</div>
                <div>FILLED</div>
              </th>
              <th
                style={{
                  width: "15%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>PRESCRIBING</div>
                <div>PHYSICIAN</div>
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>PRESCRIPTION</div>
                <div>NUMBER</div>
              </th>
              <th
                style={{
                  width: "5%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>NO. OF</div>
                <div>REFILLS</div>
              </th>
              <th
                style={{
                  width: "15%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>NAME OF</div>
                <div>PHARMACY</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Always show existing medication rows first */}
            {centralMedications &&
              centralMedications.map((med, index) => (
                <tr key={med.id || `med-${index}`}>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {med.medicationName}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {med.strength}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {med.instructions}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                      textAlign: "center",
                    }}
                  >
                    {formatDate(med.expirationDate)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                      textAlign: "center",
                    }}
                  >
                    {formatDate(med.dateFilled)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {med.physician}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {med.prescriptionNumber}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                      textAlign: "center",
                    }}
                  >
                    {med.refills}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {med.pharmacy}
                  </td>
                </tr>
              ))}

            {/* Then add empty rows to ensure at least 12 rows total */}
            {Array.from({
              length: Math.max(
                0,
                12 - (centralMedications ? centralMedications.length : 0)
              ),
            }).map((_, index) => (
              <tr key={`central-empty-${index}`}>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    height: "32px",
                  }}
                ></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section II: MEDICATION DESTRUCTION RECORD */}
      <div style={{ marginTop: "30px", pageBreakInside: "avoid" }}>
        <h3
          style={{
            margin: "0 0 5px 0",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          II. MEDICATION DESTRUCTION RECORD
        </h3>
        <p
          style={{
            margin: "5px 0 10px 0",
            fontSize: "11px",

            lineHeight: "1.3",
          }}
        >
          INSTRUCTIONS: Prescription drugs not taken with the client upon
          termination of services or otherwise disposed of shall be destroyed in
          the facility by the Administrator or Designated Representative and
          witnessed by one other adult who is not a client. All facilities
          except Residential Care Facilities for the Elderly (RFE's) shall
          retain destruction records for at least one year. RFE's shall retain
          records for at least three years.
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "20%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "10px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>MEDICATION</div>
                <div>NAME</div>
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>DATE</div>
                <div>FILLED</div>
              </th>
              <th
                style={{
                  width: "20%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                }}
              >
                <div>COMMENT</div>
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>DISPOSAL</div>
                <div>DATE</div>
              </th>
              <th
                style={{
                  width: "15%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>NAME OF</div>
                <div>PHARMACY</div>
              </th>
              <th
                style={{
                  width: "10%",
                  border: "1px solid #000",
                  padding: "4px",
                }}
              ></th>
              <th
                style={{
                  width: "15%",
                  border: "1px solid #000",
                  padding: "4px",
                  fontWeight: "bold",
                  fontSize: "9px",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <div>Signature of witness,</div>
                <div>Adult Non-Client</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Always show existing destruction entries first */}
            {destructionEntries &&
              destructionEntries.map((entry, index) => (
                <tr key={entry.id || `entry-${index}`}>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {entry.medicationName}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                      textAlign: "center",
                    }}
                  >
                    {formatDate(entry.dateFilled)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {entry.comments}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                      textAlign: "center",
                    }}
                  >
                    {formatDate(entry.disposalDate)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                    }}
                  >
                    {entry.pharmacy}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      verticalAlign: "top",
                    }}
                  >
                    {renderSignatureArea(
                      "",
                      "adminSignature",
                      index,
                      "destruction"
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      verticalAlign: "top",
                    }}
                  >
                    {renderSignatureArea(
                      "",
                      "witnessSignature",
                      index,
                      "destruction"
                    )}
                  </td>
                </tr>
              ))}

            {/* Then add empty rows to ensure at least 12 rows total */}
            {Array.from({
              length: Math.max(
                0,
                12 - (destructionEntries ? destructionEntries.length : 0)
              ),
            }).map((_, index) => (
              <tr key={`destruction-empty-${index}`}>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    height: "32px",
                  }}
                ></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    verticalAlign: "top",
                  }}
                >
                  {renderSignatureArea(
                    "",
                    "adminSignature",
                    index +
                      (destructionEntries ? destructionEntries.length : 0),
                    "destruction"
                  )}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    verticalAlign: "top",
                  }}
                >
                  {renderSignatureArea(
                    "",
                    "witnessSignature",
                    index +
                      (destructionEntries ? destructionEntries.length : 0),
                    "destruction"
                  )}
                </td>
              </tr>
            ))}
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

export default MedicationDestructionRecord;
