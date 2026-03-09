import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

const MonthlyMedicationRecord = ({
  data = {},
  signatures = {},
  onAddSignature,
  onRemoveSignature,
  signatureAreaClass,
  deleteButtonClass,
  placeholderClass,
  isStandalone = false,
  onUpdateData,
  signatureLabels = {},
  collectedSignatures = {},
}) => {
  // State to track checked cells
  const [checkedCells, setCheckedCells] = useState(data.checkedCells || {});

  // State for signature menu
  const [signatureMenuAnchor, setSignatureMenuAnchor] = useState(null);
  const [currentSignatureArea, setCurrentSignatureArea] = useState("");

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

  // Toggle checkbox function
  const toggleCheck = (medIndex, timeIndex, day) => {
    const cellKey = `med_${medIndex}_time_${timeIndex}_day_${day}`;
    const newCheckedCells = {
      ...checkedCells,
      [cellKey]: !checkedCells[cellKey],
    };

    setCheckedCells(newCheckedCells);

    // If parent provided update callback, send the updated data
    if (onUpdateData) {
      onUpdateData({
        ...data,
        checkedCells: newCheckedCells,
      });
    }
  };

  // Check if a cell is checked
  const isCellChecked = (medIndex, timeIndex, day) => {
    const cellKey = `med_${medIndex}_time_${timeIndex}_day_${day}`;
    return checkedCells[cellKey] === true;
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

  // Render signature area - standardized size and styling
  const renderSignatureArea = (title, signatureArea) => {
    const signaturePlaced = hasSignature(signatureArea);
    const inPrintMode = isPrintMode();

    return (
      <div
        className={signatureAreaClass || "signature-area"}
        style={{
          marginTop: "8px",
          width: "100%",
        }}
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
                height: "35px",
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

  // Get medications from props or use default empty ones
  const medications = data.medications || [
    { name: "", dosage: "", times: ["", "", "", ""] },
    { name: "", dosage: "", times: ["", "", "", ""] },
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "10px",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header with Logo */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{ height: "40px", marginBottom: "5px" }}
        />
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
          Pathway Family Services, Inc.
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            borderBottom: "3px double #000",
          }}
        >
          Monthly Medication Record
        </div>
      </div>

      {/* Client Info */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
          fontSize: "10px",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "12%",
                padding: "5px",
                fontWeight: "bold",
                border: "1px solid black",
              }}
            >
              CLIENT NAME:
            </td>
            <td
              style={{
                width: "38%",
                padding: "5px",
                border: "1px solid black",
                fontSize: "13px",
              }}
            >
              {data.name || ""}
            </td>
            <td
              style={{
                width: "15%",
                padding: "5px",
                fontWeight: "bold",
                border: "1px solid black",
              }}
            >
              ATTENDING PHYSICIAN:
            </td>
            <td
              style={{
                width: "35%",
                padding: "5px",
                border: "1px solid black",
                fontSize: "13px",
              }}
            >
              {data.attendingPhysician || ""}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "5px",
                fontWeight: "bold",
                border: "1px solid black",
              }}
            >
              MONTH:
            </td>
            <td
              style={{
                padding: "5px",
                border: "1px solid black",
                fontSize: "13px",
              }}
            >
              {data.month || ""}
            </td>
            <td
              style={{
                padding: "5px",
                fontWeight: "bold",
                border: "1px solid black",
              }}
            >
              YEAR:
            </td>
            <td
              style={{
                padding: "5px",
                border: "1px solid black",
                fontSize: "13px",
              }}
            >
              {data.year || ""}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Medication Calendar */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
          fontSize: "9px",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan="33"
              style={{
                padding: "5px",
                textAlign: "left",
                fontStyle: "italic",
                border: "1px solid black",
              }}
            >
              Days of the month: Please initial or use the codes below under the
              appropriate day each time a medication is given.
            </th>
          </tr>
          <tr>
            <th
              style={{
                border: "1px solid black",
                padding: "3px",
                textAlign: "center",
                width: "150px",
              }}
            >
              MEDICATION,
              <br />
              DOSAGE & INSTRUCTIONS
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "3px",
                textAlign: "center",
                width: "40px",
              }}
            >
              HOUR
            </th>
            {Array.from({ length: 31 }, (_, i) => (
              <th
                key={i + 1}
                style={{
                  border: "1px solid black",
                  padding: "3px",
                  textAlign: "center",
                  width: "18px",
                }}
              >
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {medications.map((medication, medIndex) =>
            medication.times.map((time, timeIndex) => (
              <tr key={`med-${medIndex}-time-${timeIndex}`}>
                {timeIndex === 0 ? (
                  <td
                    rowSpan={medication.times.length}
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      verticalAlign: "top",
                    }}
                  >
                    {medication.name}
                    <br />
                    {medication.dosage}
                  </td>
                ) : null}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "3px",
                    textAlign: "center",
                  }}
                >
                  {time}
                </td>
                {Array.from({ length: 31 }, (_, dayIndex) => (
                  <td
                    key={dayIndex}
                    onClick={() =>
                      toggleCheck(medIndex, timeIndex, dayIndex + 1)
                    }
                    style={{
                      border: "1px solid black",
                      padding: "0",
                      textAlign: "center",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  >
                    {/* Clickable cell with checkmark if checked */}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isCellChecked(medIndex, timeIndex, dayIndex + 1)
                        ? "✓"
                        : ""}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Legend */}
      <div
        style={{
          fontSize: "9px",
          marginTop: "5px",
          borderBottom: "1px solid black",
          padding: "3px",
        }}
      >
        R = Refused &nbsp;&nbsp; D/C = Discontinued &nbsp;&nbsp; N/A = Not
        Administered &nbsp;&nbsp; HP = Homepass &nbsp;&nbsp; S = School
        &nbsp;&nbsp; O = Ordered
      </div>

      {/* Signature Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          fontSize: "9px",
        }}
      >
        <div style={{ width: "45%" }}>
          {renderSignatureArea("Administrator Signature", "adminSignature")}
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

export default MonthlyMedicationRecord;
