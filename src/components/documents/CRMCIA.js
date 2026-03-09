import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

const CRMCIA = ({
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

  // Format dates - with proper handling of different date formats
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // First handle DD-MM-YYYY format explicitly
    if (
      typeof dateString === "string" &&
      dateString.match(/^\d{2}-\d{2}-\d{4}$/)
    ) {
      const [day, month, year] = dateString.split("-");
      return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Otherwise try standard parsing
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Return empty string for invalid dates

      return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
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

  // Checkbox style for display
  const renderCheckbox = (checked, label) => {
    return (
      <div style={{ display: "inline-block", marginRight: "15px" }}>
        <div
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            border: "1px solid #000",
            marginRight: "5px",
            position: "relative",
          }}
        >
          {checked && (
            <div
              style={{
                position: "absolute",
                top: "1px",
                left: "1px",
                right: "1px",
                bottom: "1px",
                backgroundColor: "#000",
              }}
            ></div>
          )}
        </div>
        <span style={{ fontSize: "12px" }}>{label}</span>
      </div>
    );
  };

  // Empty line placeholder
  const emptyLine = (width) => (
    <div
      style={{
        display: "inline-block",
        width: width || "200px",
        borderBottom: "1px solid #000",
        marginLeft: "5px",
        marginRight: "5px",
      }}
    ></div>
  );

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        lineHeight: "1.4",
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
          Consent to Release Medical/Confidential Information Authorization
        </h2>
      </div>

      {/* Client information section with 50%, 25%, 25% layout */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "15px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "12%", fontSize: "12px" }}>
              <strong>Child's Name:</strong>
            </td>
            <td
              style={{
                width: "38%",
                borderBottom: "1px solid #000",
                fontSize: "12px",
              }}
            >
              {data?.name || ""}
            </td>
            <td style={{ width: "7%", fontSize: "12px" }}>
              <strong>DOB:</strong>
            </td>
            <td
              style={{
                width: "18%",
                borderBottom: "1px solid #000",
                fontSize: "12px",
              }}
            >
              {formatDate(data?.dateOfBirth)}
            </td>
            <td style={{ width: "7%", fontSize: "12px" }}>
              <strong>DOI:</strong>
            </td>
            <td
              style={{
                width: "18%",
                borderBottom: "1px solid #000",
                fontSize: "12px",
              }}
            >
              {formatDate(data?.transactionDate)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Part 1 - Consent section */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{ fontSize: "12px", fontWeight: "bold" }}>
          Part 1- CONSENT TO ADMINISTER NON-PRESCRIPTION DRUGS
        </p>
        <p style={{ fontSize: "12px", textAlign: "justify" }}>
          I, the undersigned, hereby authorize Pathway Family Services, Inc., to
          administer non-prescription medication, as needed with the direct
          written or verbal permission of an authorized medical professional. It
          is understood that these authorizations are given in advance of any
          such actions but are given to provide permission for such action.
          These authorizations shall remain in effect until the discharge of the
          child from Pathway's care or revoked in writing by the undersigned.
        </p>

        {/* Signature section for Part 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div style={{ width: "45%" }}>
            {renderSignatureArea(
              "Signature of CSW/Minor's Representative",
              "representative1Signature"
            )}
          </div>

          <div style={{ width: "30%", textAlign: "right" }}>
            <div
              style={{
                borderBottom: "1px solid #000",
                height: "30px",
                paddingTop: "10px",
                fontSize: "12px",
              }}
            >
              {formatDate(data?.part1SignatureDate) || ""}
            </div>
            <div style={{ fontSize: "9px", marginTop: "4px" }}>Date</div>
          </div>
        </div>
      </div>

      {/* Part 2 - Authorization section */}
      <div style={{ marginTop: "10px" }}>
        <p style={{ fontSize: "12px", fontWeight: "bold" }}>
          Part 2- AUTHORIZATION FOR USE OR DISCLOSURE OF CONFIDENTIAL
          INFORMATION
        </p>
        <p style={{ fontSize: "12px" }}>
          (Please initial each area of approval that you are authorizing for the
          above named child)
        </p>
        <p style={{ fontSize: "12px" }}>
          I, the undersigned, authorize the use or disclosure of the following
          confidential information for the above named minor:
        </p>

        {/* Authorization checkboxes/initials */}
        <div
          style={{ marginLeft: "20px", marginBottom: "10px", fontSize: "12px" }}
        >
          <div style={{ marginBottom: "5px" }}>
            {renderCheckbox(
              data?.psychologicalInfo || false,
              "Psychological/Developmental Info."
            )}
            {renderCheckbox(
              data?.educationalInfo || false,
              "Educational Information"
            )}
            {renderCheckbox(
              data?.counselingReports || false,
              "Counseling Reports"
            )}
          </div>
          <div>
            {renderCheckbox(data?.medicalDental || false, "Medical/Dental")}
            {renderCheckbox(data?.otherInfo || false, "Other: (Explain)")}
            {data?.otherInfo && data?.otherInfoExplain ? (
              <span style={{ fontSize: "11px", textDecoration: "underline" }}>
                {data.otherInfoExplain}
              </span>
            ) : (
              emptyLine("200px")
            )}
          </div>
        </div>
      </div>

      {/* Legal text */}
      <div
        style={{ marginTop: "20px", fontSize: "12px", textAlign: "justify" }}
      >
        <p>
          <strong>NOTE:</strong> Exchange of information may take place by
          personal contact, telephone, email, and fax.
        </p>

        <p>
          <strong>
            - Persons or organizations authorized to use and disclose the
            minor's information:
          </strong>{" "}
          Pathway's staff, Certified resource parents and respite providers for
          the Minor (as needed).
        </p>

        <p>
          <strong>
            - Persons or organizations authorized to receive the Minor's
            information:
          </strong>{" "}
          Pathway staff, Certified resource parents and respite providers for the
          Minor, the Minor's health and mental health care providers, the
          Minor's school, day care providers for the Minor, and
          extra-curricular/recreational program providers for the Minor and
          state licensing agency.
        </p>

        <p>
          <strong>- Purpose of this authorization:</strong> To facilitate the
          Minor's care, safety and treatment plan, as well as, the Minor's
          education and recreational activities, and for compliance with
          auditing and follow-up with investigation findings.
        </p>

        <p>
          <strong>
            - This authorization applies to the following information (as
            necessary):
          </strong>{" "}
          the Minor's medical information, dental information, mental health
          information (except psychotherapy notes), education information,
          developmental information, and psycho-social information.
        </p>

        <p>
          <strong>- Expiration:</strong> This authorization expires upon the
          Minor's discharge or every 12 months from the date of intake of child
          into Pathway's care.
        </p>

        <p>
          The Minor's authorized "Representative" may refuse to sign this
          Authorization, and the services provided to the Minor by Pathway will
          not be conditioned on providing this authorization. However, the Minor
          may not be able to participate in certain activities, such as
          recreational programs or receive respite provider services without
          this Authorization. The Representative may revoke this authorization
          at any time but the revocation must be in writing, signed by the
          Representative and delivered to the Pathway's local office from which
          the Minor receives services. The revocation will be effective upon
          receipt, but will not be effective to the extent that Pathway or
          others have acted in reliance upon this Authorization. The person
          signing this form has a right to receive a copy of the form.
          Information disclosed pursuant to this authorization could be
          re-disclosed by the recipient and might no longer be protected by the
          federal confidentiality law. (HIPAA).
        </p>
      </div>

      {/* Final signature section */}
      <div
        style={{
          marginTop: "10px",
          fontSize: "12px",
          pageBreakInside: "avoid",
        }}
      >
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "30%", fontSize: "12px" }}>
                <strong>Signature of Minor Representative:</strong>
              </td>
              <td style={{ width: "40%" }}>
                {renderSignatureArea("", "minorRepresentativeSignature")}
              </td>
              <td
                style={{ width: "10%", fontSize: "12px", textAlign: "right" }}
              >
                <strong>Date:</strong>
              </td>
              <td
                style={{
                  width: "20%",
                  borderBottom: "1px solid #000",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                {formatDate(data?.minorRepresentativeDate) || ""}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "12px", paddingTop: "15px" }}>
                <strong>Minor's Representative Title:</strong>
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "12px",
                  paddingTop: "15px",
                }}
                colSpan={3}
              >
                {data?.minorRepresentativeTitle || ""}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "12px", paddingTop: "15px" }}>
                <strong>Minor's Signature (if applicable):</strong>
              </td>
              <td style={{ paddingTop: "15px" }}>
                {renderSignatureArea("", "minorSignature")}
              </td>
              <td
                style={{
                  fontSize: "12px",
                  paddingTop: "15px",
                  textAlign: "right",
                }}
              >
                <strong>Date:</strong>
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  fontSize: "12px",
                  paddingTop: "15px",
                  textAlign: "center",
                }}
              >
                {formatDate(data?.minorSignatureDate) || ""}
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

export default CRMCIA;
