import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// todo add isStandalone to the import
const IDEmergencyInfo = ({
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

  // todo Handle signature icon click (for standalone and main workflow)
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

  // todo Render signature area- for standalone and main workflow
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

  // Get county name based on office
  const getCountyName = (office) => {
    switch (office) {
      case "Bakersfield":
        return "KERN CO. DEPT. HUMAN SERVICES";
      case "San Bernardino":
        return "SAN BERNARDINO CO. DEPT. HUMAN SERVICES";
      case "Riverside":
        return "RIVERSIDE CO. DEPT. HUMAN SERVICES";
      case "Santa Maria":
        return "SANTA BARBARA CO. DEPT. HUMAN SERVICES";
      default:
        return "COUNTY DEPT. HUMAN SERVICES";
    }
  };

  // Get county address based on office
  const getCountyAddress = (office) => {
    switch (office) {
      case "Bakersfield":
        return "P.O. Box 511, Bakersfield, CA 93302";
      case "Riverside":
        return "547 N San Jacinto St., Hemet, CA 92544";
      case "Santa Maria":
        return "2125 S. Centerpoint Prkwy, Santa Maria, CA 93455";
      case "San Bernardino":
        return "150 S Lena Rd, San Bernardino, CA 92415";
      default:
        return "2125 S. Centerpoint Prkwy, Santa Maria, CA 93455";
    }
  };

  // Get county phone based on office
  const getCountyPhone = (office) => {
    switch (office) {
      case "Bakersfield":
        return "(661) 631-6005";
      case "Riverside":
        return "(951) 791-3200";
      case "Santa Maria":
        return "(805) 931-6150";
      case "San Bernardino":
        return "(909) 388-0245";
      default:
        return "(805) 931-6150";
    }
  };

  // Get hospital name based on office
  const getHospitalName = (office) => {
    switch (office) {
      case "Bakersfield":
        return "KERN MEDICAL CENTER";
      case "Riverside":
        return "HEMET VALLEY MEDICAL CENTER";
      case "Santa Maria":
        return "VALLEY COMMUNITY HOSPITAL";
      case "San Bernardino":
        return "SAN BERNARDINO COMMUNITY HOSPITAL";
      default:
        return "VALLEY COMMUNITY HOSPITAL";
    }
  };

  // Get hospital address based on office
  const getHospitalAddress = (office) => {
    switch (office) {
      case "Bakersfield":
        return "1830 Flower St, Bakersfield, CA 93305";
      case "Riverside":
        return "1117 E Devonshire Ave, Hemet, CA 92543";
      case "Santa Maria":
        return "505 Plaza Drive, Santa Maria, CA 93454";
      case "San Bernardino":
        return "1805 Medical Center Dr, San Bernardino, CA 92411";
      default:
        return "505 Plaza Drive, Santa Maria, CA 93454";
    }
  };

  // Get pathway address based on office
  const getPathwayAddress = (office) => {
    switch (office) {
      case "Bakersfield":
        return "5000 California Ave #209, Bakersfield, CA 93309";
      case "Riverside":
        return "1600 N Florida Ave #301, Hemet, CA 92544";
      case "Santa Maria":
        return "218 W Carmen Ln #208, Santa Maria, CA 93458";
      case "San Bernardino":
        return "1200 S Woodland St #D, San Bernardino, CA 92408";
      default:
        return "218 W Carmen Ln #208, Santa Maria, CA 93458";
    }
  };

  // Get pathway phone based on office
  const getPathwayPhone = (office) => {
    switch (office) {
      case "Bakersfield":
        return "(661) 325-2570";
      case "Riverside":
        return "(951) 530-4831";
      case "Santa Maria":
        return "(805) 739-1111";
      case "San Bernardino":
        return "(909) 890-5295";
      default:
        return "(805) 739-1111";
    }
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
            IDENTIFICATION AND EMERGENCY INFORMATION
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

      {/* A. ALL FACILITIES Section */}
      <div style={{ marginTop: "15px" }}>
        <h3
          style={{
            padding: "5px",
            backgroundColor: "#f1f5f9",
            marginBottom: "8px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          A. ALL FACILITIES
        </h3>

        {/* Client Information */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            1. NAME OF CLIENT OR CHILD
          </h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "45%" }}>
                  <span>{data?.name || "Not specified"}</span>
                </td>
                <td style={{ width: "25%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    DATE OF BIRTH:
                  </span>{" "}
                  {formatDate(data?.dateOfBirth) || "Not specified"}
                </td>
                <td style={{ width: "15%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>AGE:</span>{" "}
                  {data?.age || "Not specified"}
                </td>
                <td style={{ width: "15%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>SEX:</span>{" "}
                  {data?.gender || "Not specified"}
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>
              SOCIAL SECURITY NUMBER (OPTIONAL):
            </span>{" "}
            {data?.socialSecurityNumber || "Not specified"}
          </div>
        </div>

        {/* Responsible Person or Placement Agency */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            2. RESPONSIBLE PERSON OR PLACEMENT AGENCY
          </h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "45%" }}>
                  <span>{getCountyName(data?.office)}</span>
                </td>
                <td style={{ width: "55%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    ADDRESS:
                  </span>{" "}
                  {data?.countyWorkerAddress || getCountyAddress(data?.office)}
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    TELEPHONE:
                  </span>{" "}
                  {data?.countyWorkerTelephone || getCountyPhone(data?.office)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Nearest Relative */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            3. NAME OF NEAREST RELATIVE (OPTIONAL)
          </h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "25%" }}>
                  {data?.nearestRelativeName || "Not specified"}
                </td>
                <td style={{ width: "20%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    RELATIONSHIP:
                  </span>{" "}
                  {data?.nearestRelativeRelationship || "Not specified"}
                </td>
                <td style={{ width: "55%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    ADDRESS:
                  </span>{" "}
                  {data?.nearestRelativeAddress || "Not specified"}
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    TELEPHONE:
                  </span>{" "}
                  {data?.nearestRelativeTelephone || "Not specified"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Date Admitted and Address Prior / Date Left */}
        <div style={{ marginBottom: "8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", verticalAlign: "top" }}>
                  <h4
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      margin: "0 0 3px 0",
                    }}
                  >
                    4. DATE ADMITTED TO FACILITY
                  </h4>
                  <div>
                    {formatDate(data?.transactionDate) || "Not specified"}
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", color: "#444" }}>
                      ADDRESS PRIOR TO ADMISSION:
                    </span>{" "}
                    {data?.priorPlacement || "Not specified"}
                  </div>
                </td>
                <td style={{ width: "50%", verticalAlign: "top" }}>
                  <h4
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      margin: "0 0 3px 0",
                    }}
                  >
                    5. DATE LEFT
                  </h4>
                  <div>{formatDate(data?.dateLeft) || "Not specified"}</div>
                  <div>
                    <span style={{ fontSize: "10px", color: "#444" }}>
                      FORWARDING ADDRESS:
                    </span>{" "}
                    {data?.forwardingAddress || "Not specified"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reasons for Leaving */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            6. REASONS FOR LEAVING FACILITY
          </h4>
          <div>{data?.reasonsForLeaving || "Not specified"}</div>
        </div>

        {/* Person Responsible for Financial Affairs */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            7. PERSON(S) RESPONSIBLE FOR FINANCIAL AFFAIRS, PAYMENT FOR CARE,
            LEGAL GUARDIAN, IF ANY
          </h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "25%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>NAME:</span>{" "}
                  {getCountyName(data?.office)}
                </td>
                <td style={{ width: "45%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    ADDRESS:
                  </span>{" "}
                  {data?.countyWorkerAddress || getCountyAddress(data?.office)}
                </td>
                <td style={{ width: "30%" }}>
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    TELEPHONE:
                  </span>{" "}
                  {data?.countyWorkerTelephone || getCountyPhone(data?.office)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Emergency Contacts */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            8. OTHER PERSONS TO BE NOTIFIED IN EMERGENCY
          </h4>

          {/* Physician */}
          <div style={{ marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>
              a. PHYSICIAN:
            </span>{" "}
            <span>{data?.physicianName || "Not specified"}</span>
            <div>
              <span style={{ fontSize: "10px", color: "#444" }}>ADDRESS:</span>{" "}
              {data?.physicianAddress || "Not specified"}
              <span
                style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
              >
                TELEPHONE:
              </span>{" "}
              {data?.physicianTelephone || "Not specified"}
            </div>
          </div>

          {/* Mental Health Provider */}
          <div style={{ marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>
              b. MENTAL HEALTH PROVIDER, IF ANY:
            </span>{" "}
            <span>{data?.mentalHealthName || "Not specified"}</span>
            <div>
              <span style={{ fontSize: "10px", color: "#444" }}>ADDRESS:</span>{" "}
              {data?.mentalHealthAddress || "Not specified"}
              <span
                style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
              >
                TELEPHONE:
              </span>{" "}
              {data?.mentalHealthTelephone || "Not specified"}
            </div>
          </div>

          {/* Dentist */}
          <div style={{ marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>
              c. DENTIST:
            </span>{" "}
            <span>{data?.dentistName || "Not specified"}</span>
            <div>
              <span style={{ fontSize: "10px", color: "#444" }}>ADDRESS:</span>{" "}
              {data?.dentistAddress || "Not specified"}
              <span
                style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
              >
                TELEPHONE:
              </span>{" "}
              {data?.dentistTelephone || "Not specified"}
            </div>
          </div>

          {/* Relative */}
          <div style={{ marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>
              d. RELATIVE(S):
            </span>{" "}
            <span>{data?.relativeName || "Not specified"}</span>
            <div>
              <span style={{ fontSize: "10px", color: "#444" }}>ADDRESS:</span>{" "}
              {data?.relativeAddress || "Not specified"}
              <span
                style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
              >
                TELEPHONE:
              </span>{" "}
              {data?.relativeTelephone || "Not specified"}
            </div>
          </div>

          {/* Friends */}
          <div style={{ marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>
              e. FRIEND(S):
            </span>{" "}
            <span>{data?.friendName || "Not specified"}</span>
            <div>
              <span style={{ fontSize: "10px", color: "#444" }}>ADDRESS:</span>{" "}
              {data?.friendAddress || "Not specified"}
              <span
                style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
              >
                TELEPHONE:
              </span>{" "}
              {data?.friendTelephone || "Not specified"}
            </div>
          </div>
        </div>

        {/* Emergency Hospitalization Plan */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            9. EMERGENCY HOSPITALIZATION PLAN
          </h4>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>
              NAME OF HOSPITAL TO BE TAKEN IN AN EMERGENCY:
            </span>{" "}
            {data?.hospitalName || getHospitalName(data?.office)}
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>ADDRESS:</span>{" "}
            {data?.hospitalAddress || getHospitalAddress(data?.office)}
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>
              MEDICAL PLAN:
            </span>{" "}
            {data?.medicalPlan || "MEDI-CAL"}
            <span
              style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
            >
              NAME OF DENTAL PLAN (IF ANY):
            </span>{" "}
            {data?.dentalPlan || "MEDI-CAL"}
          </div>
        </div>

        {/* Other Required Information */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            10. OTHER REQUIRED INFORMATION
          </h4>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>
              AMBULATORY STATUS:
            </span>{" "}
            {data?.ambulatoryStatus || "AMBULATORY"}
            <span
              style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
            >
              RELIGIOUS PREFERENCE:
            </span>{" "}
            {data?.religiousPreference || "Not specified"}
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>COMMENTS:</span>{" "}
            {data?.comments || "Not specified"}
          </div>
        </div>

        {/* Signatures */}
        <div style={{ margin: "15px 0" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 10px 0",
              textAlign: "center",
            }}
          >
            SIGNATURES
          </h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "8px",
            }}
          >
            <div style={{ width: "45%" }}>
              {renderSignatureArea(
                "SIGNATURE OF RESIDENT",
                "residentSignature"
              )}
            </div>
            <div style={{ width: "45%" }}>
              {renderSignatureArea(
                "SIGNATURE OF PERSON COMPLETING FORM",
                "completingPersonSignature"
              )}
              <div style={{ marginTop: "5px", fontSize: "10px" }}>
                <span style={{ color: "#444" }}>TITLE:</span>{" "}
                {data?.yourName ? "Pathway Representative" : "Not specified"}
                <span style={{ marginLeft: "15px", color: "#444" }}>
                  DATE:
                </span>{" "}
                {formatDate(data?.transactionDate) ||
                  formatDate(new Date().toISOString())}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* B. RESIDENTIAL FACILITIES FOR CHILDREN */}
      <div style={{ marginTop: "15px" }}>
        <h3
          style={{
            padding: "5px",
            backgroundColor: "#f1f5f9",
            marginBottom: "8px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          B. RESIDENTIAL FACILITIES FOR CHILDREN
        </h3>
        <p
          style={{
            margin: "0 0 8px 0",
            fontStyle: "italic",
            fontSize: "10px",
            color: "#666",
          }}
        >
          (Additional information is required by regulation for residential
          facilities for children.)
        </p>

        {/* Child Name */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            1. NAME OF CHILD
          </h4>
          <div>{data?.name || "Not specified"}</div>
        </div>

        {/* Person to Contact */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            2. NAME AND ADDRESS OF PERSON TO CONTACT, IF AUTHORIZED
            REPRESENTATIVE IS NOT AVAILABLE
          </h4>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>NAME:</span>{" "}
            {data?.pathwayRepresentative || data?.yourName || "Not specified"}
            <span
              style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
            >
              ADDRESS:
            </span>{" "}
            {data?.pathwayAddress || getPathwayAddress(data?.office)}
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>TELEPHONE:</span>{" "}
            {data?.phoneNumber || getPathwayPhone(data?.office)}
          </div>
        </div>

        {/* Parents Info */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            3. NAME AND ADDRESS OF PARENT(S), IF KNOWN
          </h4>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>NAME:</span>{" "}
            {data?.parentName || "Not specified"}
            <span
              style={{ marginLeft: "15px", fontSize: "10px", color: "#444" }}
            >
              ADDRESS:
            </span>{" "}
            {data?.parentAddress || "Not specified"}
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>TELEPHONE:</span>{" "}
            {data?.parentTelephone || "Not specified"}
          </div>
        </div>

        {/* Child's Court Status */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            4. CHILD'S COURT STATUS
          </h4>
          <p
            style={{
              margin: "0 0 3px 0",
              fontStyle: "italic",
              fontSize: "10px",
              color: "#666",
            }}
          >
            (ATTACH CUSTODY ORDERS AND AGREEMENTS WITH PARENT(S) OR PERSON(S)
            HAVING LEGAL CUSTODY)
          </p>
          <div>
            {data?.clientStatus ? `${data.clientStatus}` : "Not specified"}
            {data?.courtStatusNotes ? ` - ${data.courtStatusNotes}` : ""}
          </div>
        </div>

        {/* Person Child Has Been Living With */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            5. PERSON(S) WITH WHOM CHILD HAS BEEN LIVING (IF KNOWN)
          </h4>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>
              NAME AND RELATIONSHIP:
            </span>{" "}
            {data?.priorGuardianName || data?.priorGuardianRelationship
              ? `${data?.priorGuardianName || ""} ${
                  data?.priorGuardianRelationship
                    ? `(${data?.priorGuardianRelationship})`
                    : ""
                }`
              : "Not specified"}
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>ADDRESS:</span>{" "}
            {data?.priorGuardianAddress || "Not specified"}
          </div>
        </div>

        {/* Visitation Restrictions */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            6. VISITATION RESTRICTIONS (BY COURT ORDER OR AUTHORIZED
            REPRESENTATIVE)
          </h4>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>
              PERSON(S) NOT AUTHORIZED TO VISIT CHILD:
            </span>{" "}
            {data?.visitationRestrictions || "None specified"}
          </div>
        </div>

        {/* Family Residence Visitation Restrictions */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            7. FAMILY RESIDENCE VISITATION RESTRICTIONS
          </h4>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>
              SPECIFY IF ANY:
            </span>{" "}
            {data?.familyVisitationRestrictions || "None specified"}
          </div>
        </div>

        {/* Persons Authorized to Remove Child */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            8. ALL PERSONS AUTHORIZED TO REMOVE CHILD FROM HOME
          </h4>
          <div>
            {data?.personsAuthorizedToRemove ||
              (data?.countyWorkerName
                ? `${data.countyWorkerName} - County Worker`
                : "Not specified")}
          </div>
        </div>

        {/* Telephone Access */}
        <div style={{ marginBottom: "8px" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 3px 0",
            }}
          >
            9. TELEPHONE ACCESS
          </h4>
          <div>
            <span style={{ fontSize: "10px", color: "#444" }}>
              MAKE AND RECEIVE CONFIDENTIAL CALLS:
            </span>{" "}
            {data?.telephoneAccess || "Allowed"}
          </div>
        </div>
      </div>

      {/* Signature menu */}
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

export default IDEmergencyInfo;
