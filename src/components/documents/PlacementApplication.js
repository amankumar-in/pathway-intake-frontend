import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// PlacementApplication component using proper field mapping
const PlacementApplication = ({
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

  // Helper to display checkbox
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
        fontSize: "10px",
        lineHeight: "1.2",
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
          Placement Application
        </h2>
      </div>

      {/* REFERRAL SOURCE Section */}
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: "20%",
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                REFERRAL SOURCE:
              </td>
              <td style={{ width: "40%" }}></td>
              <td
                style={{
                  width: "10%",
                  fontWeight: "bold",
                  fontSize: "10px",
                  textAlign: "right",
                }}
              >
                Date:
              </td>
              <td
                style={{
                  width: "30%",
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {formatDate(data?.transactionDate) || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Referred by:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.nameOfCounty || ""}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  textAlign: "right",
                }}
              >
                County
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(true)} Yes &nbsp; {renderCheckbox(false)} No
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              ></td>
              <td></td>
              <td></td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.clientStatus === 300)} 300 &nbsp;
                {renderCheckbox(
                  data?.clientStatus === 601 || data?.clientStatus === 602
                )}{" "}
                601/602
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Placing Agency Representative:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.countyWorkerName || ""}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  textAlign: "right",
                }}
              >
                Phone:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.countyWorkerTelephone || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* CLIENT INFORMATION Section */}
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: "30%",
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                CLIENT INFORMATION:
              </td>
              <td style={{ width: "20%" }}></td>
              <td
                style={{
                  width: "20%",
                  fontWeight: "bold",
                  fontSize: "10px",
                }}
              >
                Level of Care:
              </td>
              <td
                style={{
                  width: "30%",
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.levelOfCare || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Client Name:
              </td>
              <td
                colSpan={2}
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.name || ""}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                }}
              >
                Ethnicity:
                <span
                  style={{
                    borderBottom: "1px solid #000",
                    paddingLeft: "5px",
                    fontSize: "10px",
                  }}
                >
                  {data?.ethnicity || ""}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Age:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.age || ""}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                }}
              >
                Sex:
                <span
                  style={{
                    borderBottom: "1px solid #000",
                    paddingLeft: "5px",
                    fontSize: "10px",
                  }}
                >
                  {data?.gender || ""}
                </span>
              </td>
              <td>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "10px",
                  }}
                >
                  DOB:
                </span>
                <span
                  style={{
                    borderBottom: "1px solid #000",
                    paddingLeft: "5px",
                    fontSize: "10px",
                  }}
                >
                  {formatDate(data?.dateOfBirth) || ""}
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    paddingLeft: "10px",
                    fontSize: "10px",
                  }}
                >
                  Language:
                </span>
                <span
                  style={{
                    borderBottom: "1px solid #000",
                    paddingLeft: "5px",
                    fontSize: "10px",
                  }}
                >
                  {data?.language || ""}
                </span>
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                  verticalAlign: "top",
                }}
              >
                Reason for Resource Placement:
              </td>
              <td
                colSpan={3}
                style={{
                  borderBottom: "1px solid #000",
                  minHeight: "20px",
                  fontSize: "10px",
                }}
              >
                {data?.reasonForPlacement || ""}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                }}
              >
                Current Court Status:
              </td>
              <td colSpan={3} style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.courtStatusReunification)} Reunification
                &nbsp;&nbsp;
                {renderCheckbox(data?.courtStatusPermanent)} Permanent
                &nbsp;&nbsp;
                {renderCheckbox(data?.courtStatusAdoption)} Adoption
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Number of previous placements
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.previousPlacements || ""}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                }}
              >
                Length of Placement needed:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.placementLength || ""}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                  verticalAlign: "top",
                }}
              >
                Client Behavioral problems:
              </td>
              <td
                colSpan={3}
                style={{
                  borderBottom: "1px solid #000",
                  minHeight: "40px",
                  fontSize: "10px",
                }}
              >
                {data?.behavioralProblems || ""}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                  verticalAlign: "top",
                }}
              >
                Special needs/services:
              </td>
              <td
                colSpan={3}
                style={{
                  borderBottom: "1px solid #000",
                  minHeight: "30px",
                  fontSize: "10px",
                }}
              >
                {data?.specialNeeds || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* MEDICAL HISTORY Section */}
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
        }}
      >
        <h3
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          MEDICAL HISTORY/CONDITIONS/NEEDS
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: "50%",
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Exposed to communicable diseases:
              </td>
              <td style={{ width: "50%", fontSize: "10px" }}>
                {renderCheckbox(data?.exposedToCommunicableDiseases === "No")}{" "}
                No &nbsp;&nbsp;
                {renderCheckbox(
                  data?.exposedToCommunicableDiseases === "Yes"
                )}{" "}
                Yes
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                  verticalAlign: "top",
                }}
              >
                Current Medications:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  minHeight: "30px",
                  fontSize: "10px",
                }}
              >
                {data?.currentMedications || ""}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                If Psychotropic, is there a current court order?
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.hasPsychotropicCourtOrder === "Yes")} Yes
                &nbsp;&nbsp;
                {renderCheckbox(data?.hasPsychotropicCourtOrder === "No")} No
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Does client have at least a 30 day supply of medication?
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.has30DayMedication === "Yes")} Yes
                &nbsp;&nbsp;
                {renderCheckbox(data?.has30DayMedication === "No")} No
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Does client need a CHDP completed?
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.needsCHDP === "Yes")} Yes &nbsp;&nbsp;
                {renderCheckbox(data?.needsCHDP === "No")} No
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Does client have any Special Health Care Needs/Conditions?
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.hasSpecialHealthNeeds === "Yes")} Yes
                &nbsp;&nbsp;
                {renderCheckbox(data?.hasSpecialHealthNeeds === "No")} No
              </td>
            </tr>
          </tbody>
        </table>

        {data?.hasSpecialHealthNeeds === "Yes" && (
          <div
            style={{
              borderBottom: "1px solid #000",
              minHeight: "30px",
              margin: "5px 0 10px 0",
              fontSize: "10px",
            }}
          >
            {data?.specialHealthConditions || ""}
          </div>
        )}
      </div>

      {/* BEHAVIOR ASSESSMENT SECTION */}
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Does client currently demonstrate or have a history of
                inappropriate sexual conduct?
              </td>
              <td style={{ width: "20%", fontSize: "10px" }}>
                {renderCheckbox(data?.hasInappropriateSexualConduct === "Yes")}{" "}
                Yes &nbsp;&nbsp;
                {renderCheckbox(
                  data?.hasInappropriateSexualConduct === "No"
                )}{" "}
                No
              </td>
            </tr>
          </tbody>
        </table>

        {data?.hasInappropriateSexualConduct === "Yes" && (
          <div
            style={{
              borderBottom: "1px solid #000",
              minHeight: "30px",
              margin: "5px 0 10px 0",
              fontSize: "10px",
            }}
          >
            {data?.sexualConductDetails || ""}
          </div>
        )}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Does client currently demonstrate or have a history of being a
                danger to self?
              </td>
              <td style={{ width: "20%", fontSize: "10px" }}>
                {renderCheckbox(data?.hasDangerToSelf === "Yes")} Yes
                &nbsp;&nbsp;
                {renderCheckbox(data?.hasDangerToSelf === "No")} No
              </td>
            </tr>
          </tbody>
        </table>

        {data?.hasDangerToSelf === "Yes" && (
          <div
            style={{
              borderBottom: "1px solid #000",
              minHeight: "30px",
              margin: "5px 0 10px 0",
              fontSize: "10px",
            }}
          >
            {data?.dangerToSelfDetails || ""}
          </div>
        )}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Does client currently demonstrate or have a history of being a
                danger to others?
              </td>
              <td style={{ width: "20%", fontSize: "10px" }}>
                {renderCheckbox(data?.hasDangerToOthers === "Yes")} Yes
                &nbsp;&nbsp;
                {renderCheckbox(data?.hasDangerToOthers === "No")} No
              </td>
            </tr>
          </tbody>
        </table>

        {data?.hasDangerToOthers === "Yes" && (
          <div
            style={{
              borderBottom: "1px solid #000",
              minHeight: "30px",
              margin: "5px 0 10px 0",
              fontSize: "10px",
            }}
          >
            {data?.dangerToOthersDetails || ""}
          </div>
        )}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Does client currently demonstrate or have a history of being
                destructive to property?
              </td>
              <td style={{ width: "20%", fontSize: "10px" }}>
                {renderCheckbox(data?.hasDestructiveToProperty === "Yes")} Yes
                &nbsp;&nbsp;
                {renderCheckbox(data?.hasDestructiveToProperty === "No")} No
              </td>
            </tr>
          </tbody>
        </table>

        {data?.hasDestructiveToProperty === "Yes" && (
          <div
            style={{
              borderBottom: "1px solid #000",
              minHeight: "30px",
              margin: "5px 0 10px 0",
              fontSize: "10px",
            }}
          >
            {data?.destructiveToPropertyDetails || ""}
          </div>
        )}
      </div>

      {/* PLACEMENT NEEDS */}
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
        }}
      >
        <h3
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          PLACEMENT NEEDS
        </h3>

        <p style={{ fontSize: "10px", marginBottom: "8px" }}>
          Please 'mark' which conditions apply to this placement:
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Family Dynamics
              </td>
              <td colSpan={3}></td>
            </tr>
            <tr>
              <td colSpan={4} style={{ fontSize: "10px", paddingLeft: "20px" }}>
                {renderCheckbox(data?.needsIndividualAttention)} Needs
                individual attention &nbsp;&nbsp;
                {renderCheckbox(data?.needsStructure)} Needs structure
                &nbsp;&nbsp;
                {renderCheckbox(data?.needsFemaleRoleModel)} Needs female role
                model
                <br />
                {renderCheckbox(data?.needsMaleRoleModel)} Needs male role model
                &nbsp;&nbsp;
                {renderCheckbox(data?.needsReligiousUpbringing)} Needs religious
                upbringing
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  width: "25%",
                }}
              >
                Client needs professional counseling for:
              </td>
              <td
                colSpan={3}
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                  width: "75%",
                }}
              >
                {data?.counselingNeeds || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                  width: "25%",
                }}
              >
                Client is currently in counseling with:
              </td>
              <td
                colSpan={3}
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                  width: "75%",
                }}
              >
                {data?.currentCounselor || ""}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                }}
              >
                Educational Needs
              </td>
              <td colSpan={3}></td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                  width: "25%",
                }}
              >
                Client is currently enrolled in:
              </td>
              <td
                colSpan={3}
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                  width: "75%",
                }}
              >
                {data?.currentSchool || ""}
              </td>
            </tr>
            <tr>
              <td
                colSpan={4}
                style={{ fontSize: "10px", paddingBottom: "8px" }}
              >
                Client {renderCheckbox(data?.hasIEP === true)} has /{" "}
                {renderCheckbox(data?.hasIEP === false)} does not have an IEP. Client{" "}
                {renderCheckbox(data?.isInSpecialEd === true)} is /{" "}
                {renderCheckbox(data?.isInSpecialEd === false)} is not in special ed
                class.
              </td>
            </tr>

            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                }}
              >
                Family Visitation
              </td>
              <td colSpan={3}></td>
            </tr>
            <tr>
              <td
                colSpan={4}
                style={{ fontSize: "10px", paddingBottom: "8px" }}
              >
                Client {renderCheckbox(data?.hasVisitation === true)} does /{" "}
                {renderCheckbox(data?.hasVisitation === false)} does not have visitation
                with natural family members.
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                  width: "25%",
                }}
              >
                The visits are with:
              </td>
              <td
                colSpan={3}
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                  width: "75%",
                }}
              >
                {data?.visitsWithWho || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PLACEMENT SERVICES INFORMATION */}
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
        }}
      >
        <h3
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          PLACEMENT SERVICES INFORMATION
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                  width: "30%",
                }}
              >
                Information from previous placements?
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                  width: "70%",
                }}
              >
                {data?.previousPlacementsInfo || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Medical insurance is provided by:
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                {data?.medicalInsuranceProvider || ""}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Is there a medical card available?
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.hasMedicalCard === true)} Yes
                {renderCheckbox(data?.hasMedicalCard === false)} No
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Medical Records?
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.hasMedicalRecords === true)} Yes
                {renderCheckbox(data?.hasMedicalRecords === false)} No
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Is the client's Social Security # available?
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.hasSocialSecurityNumber === true)} Yes
                {renderCheckbox(data?.hasSocialSecurityNumber === false)} No
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  paddingBottom: "8px",
                }}
              >
                Is there a clothing allowance available for this client?
              </td>
              <td style={{ fontSize: "10px" }}>
                {renderCheckbox(data?.hasClothingAllowance === true)} Yes
                {renderCheckbox(data?.hasClothingAllowance === false)} No
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: "10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    fontSize: "10px",
                    paddingBottom: "8px",
                    width: "30%",
                  }}
                >
                  Client will be placed into the home of:
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #000",
                    fontSize: "10px",
                    width: "70%",
                  }}
                >
                  {data?.placementHome || data?.nameOfFosterParents || ""}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    fontSize: "10px",
                    paddingBottom: "8px",
                  }}
                >
                  There:
                </td>
                <td style={{ fontSize: "10px" }}>
                  {renderCheckbox(data?.wasPrePlacementVisit === true)} was /
                  {renderCheckbox(data?.wasPrePlacementVisit === false)} was not a
                  pre-placement visit.
                  {data?.wasPrePlacementVisit &&
                    data?.prePlacementVisitDate && (
                      <span>
                        Visit occurred on{" "}
                        {formatDate(data?.prePlacementVisitDate)}
                      </span>
                    )}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    fontSize: "10px",
                    paddingBottom: "8px",
                  }}
                >
                  Client will be placed into the home on:
                </td>
                <td style={{ fontSize: "10px" }}>
                  {formatDate(data?.placementDate)}
                  <span style={{ marginLeft: "20px" }}>
                    Approved by:
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        width: "200px",
                        paddingLeft: "5px",
                      }}
                    >
                      {data?.approvedBy || ""}
                    </span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PLACEMENT AGREEMENT */}
      <div
        style={{
          marginBottom: "15px",
        }}
      >
        <h3
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          PLACEMENT AGREEMENT
        </h3>

        <p style={{ fontSize: "10px", marginBottom: "15px" }}>
          Based upon the information provided within the application as being
          true and complete, the client will be accepted into Pathway Family
          Services. Any other discovery of relevant history (behavior, health,
          etc) will be promptly provided to Pathway Family Services to ensure
          appropriate and effective services are provided for the client.
        </p>

        <div style={{ marginTop: "30px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "45%", verticalAlign: "top" }}>
                  {renderSignatureArea(
                    "Placing Agency Representative",
                    "placingAgencySignature"
                  )}
                </td>
                <td style={{ width: "10%" }}></td>
                <td style={{ width: "45%", verticalAlign: "top" }}>
                  {renderSignatureArea(
                    "Agency Administrator",
                    "agencyAdminSignature"
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "10px", paddingTop: "5px" }}>
                  Date:{" "}
                  {formatDate(data?.signatureDate || data?.transactionDate) ||
                    ""}
                </td>
                <td></td>
                <td style={{ fontSize: "10px", paddingTop: "5px" }}>
                  Date:{" "}
                  {formatDate(data?.signatureDate || data?.transactionDate) ||
                    ""}
                </td>
              </tr>
            </tbody>
          </table>
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

export default PlacementApplication;
