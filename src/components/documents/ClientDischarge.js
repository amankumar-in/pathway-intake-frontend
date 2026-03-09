import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// ClientDischarge component using proper field mapping
const ClientDischarge = ({
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
      // For standalone documents, call onAddSignature directly
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
                fontSize: "12px",
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
            <span style={{ fontSize: "12px" }}>{title}</span>
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
      {/* Header section with logo */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "35px",
            marginBottom: "10px",
            display: "block",
            margin: "0 auto",
          }}
        />
        <h2
          style={{
            margin: "5px 0",
            color: "#3a3a3a",
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          Pathway Family Services, Inc.
        </h2>
        <h3
          style={{
            margin: "5px 0",
            color: "#3a3a3a",
            fontWeight: "bold",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Client Discharge
        </h3>
      </div>

      {/* Main content */}
      <div style={{ margin: "0 auto", maxWidth: "7.5in" }}>
        <h3
          style={{
            margin: "10px 0",
            color: "#3a3a3a",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "11px",
          }}
        >
          CLIENT MOVE/DISCHARGE/REMOVAL POLICIES & PROCEDURES
        </h3>

        <p
          style={{ fontSize: "12px", lineHeight: "1.3", textAlign: "justify" }}
        >
          Pathway Family Services operate by a standard of policies regarding
          planned and unplanned terminations. Pathway will endeavor to maintain
          a client in placement based on whether an appropriate placement is
          available and the client behavior is manageable and acceptable.
        </p>

        <h4
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            margin: "10px 0 5px 0",
          }}
        >
          Moving a Child in Placement to another Resource Home
        </h4>

        <p
          style={{ fontSize: "12px", lineHeight: "1.3", textAlign: "justify" }}
        >
          A child may be moved when it obvious the child is not benefiting from
          the placement due to being incompatible with the resource family; or the
          child is completely noncompliant with the resource family's structure or
          the child's health and safety are threatened. A child may also be
          moved, when it is requested by the Placing Agency to accommodate
          visitation/services which are apart of a plan to reunify the child to
          the natural family.
        </p>

        <h4
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            margin: "10px 0 5px 0",
          }}
        >
          Placement Discharge/Removal
        </h4>

        <p
          style={{ fontSize: "12px", lineHeight: "1.3", textAlign: "justify" }}
        >
          There are many reasons why a child might leave a resource home. They
          include:
        </p>

        <ul
          style={{
            fontSize: "12px",
            lineHeight: "1.3",
            marginLeft: "20px",
            paddingLeft: "10px",
          }}
        >
          <li style={{ marginBottom: "5px" }}>
            Achievement of Treatment Plan goals, reunification with family of
            origin, guardianship or adoption, These departures are planned well
            in advance, with the participation of all interested parties—
            children, resource family, natural family and social workers.
          </li>
          <li style={{ marginBottom: "5px" }}>
            Change in resource family circumstances. Many things can happen that
            affect a family's ability to provide care. Examples are serious illness or
            death, divorce or separation, or a transfer out of the community.
          </li>
          <li style={{ marginBottom: "5px" }}>
            The child in care requested. Children sometimes ask to be moved to
            another home, or run away from a resource family and refuse to go
            back. The child's Agency social worker discusses the situation with
            the child and resource parent before deciding what should be done.
          </li>
          <li style={{ marginBottom: "5px" }}>
            Request by the Placement Agency. A child may be moved for a variety
            of reasons, from concerns about the resource family to the preference
            for placing brothers and sisters together.
          </li>
          <li style={{ marginBottom: "5px" }}>
            Court ordered. The family court may order a child to be returned
            home.
          </li>
        </ul>

        <p
          style={{ fontSize: "12px", lineHeight: "1.3", textAlign: "justify" }}
        >
          Pathway reserves the right to terminate placements for several other
          reasons, such as serious emergency medical care, previously
          unidentified special health care needs about a child, emergency
          psychiatric care, a threat to the safety and health of other children
          in the home, physical or sexual abuse toward other members of the
          family, unapproved absences from the home, and continuous
          inappropriate conduct, and any natural or man-made disaster which
          threatens the well being of the family.
        </p>

        <p
          style={{ fontSize: "12px", lineHeight: "1.3", textAlign: "justify" }}
        >
          Pathway also recognizes that the child's authorized representative may
          terminate the placement at any time deem necessary.
        </p>

        <p
          style={{ fontSize: "12px", lineHeight: "1.3", textAlign: "justify" }}
        >
          Terminations are to be approved by an Agency Supervisor. The Agency
          Supervisor is immediately notified by the Agency social worker or
          resource parents when a removal is pending or has occurred. All
          terminations will be addressed with the Placement Agency. Other than
          in extreme emergency situations, the child's placement worker is
          offered the opportunity to participate in the termination process.
        </p>

        <p
          style={{ fontSize: "12px", lineHeight: "1.3", textAlign: "justify" }}
        >
          The Agency social worker will prepare a Termination report, which
          specifies the reason(s) for the termination or discharge and any
          services rendered since the last treatment plan report.
        </p>

        {/* Details of discharge reason if filled */}
        {data?.dischargeReason && (
          <div style={{ margin: "10px 0", fontSize: "12px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ fontWeight: "bold", width: "120px" }}>
                Discharge Reason:
              </div>
              <div>{data.dischargeReason}</div>
            </div>
            {data?.additionalDetails && (
              <div style={{ display: "flex", marginTop: "5px" }}>
                <div style={{ fontWeight: "bold", width: "120px" }}>
                  Additional Details:
                </div>
                <div style={{ flex: 1 }}>{data.additionalDetails}</div>
              </div>
            )}
            {data?.reportPreparedBy && (
              <div style={{ display: "flex", marginTop: "5px" }}>
                <div style={{ fontWeight: "bold", width: "120px" }}>
                  Report Prepared By:
                </div>
                <div>{data.reportPreparedBy}</div>
              </div>
            )}
            {data?.reportDate && (
              <div style={{ display: "flex", marginTop: "5px" }}>
                <div style={{ fontWeight: "bold", width: "120px" }}>
                  Report Date:
                </div>
                <div>{formatDate(data.reportDate)}</div>
              </div>
            )}
          </div>
        )}

        {/* Client acknowledgement */}
        <div style={{ marginTop: "20px", fontSize: "12px", lineHeight: "1.4" }}>
          <p>
            I,{" "}
            <span style={{ fontWeight: "bold" }}>
              {data?.name || "________________________"}
            </span>
            , have read and understood and have had explained to me any
            questions I had regarding the above policies and procedures.
          </p>
        </div>

        {/* Signature section */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "45%" }}>
            {renderSignatureArea("", "clientSignature")}
            <div style={{ fontSize: "12px" }}>Client Signature</div>
            {data?.clientSignatureDate && (
              <div style={{ fontSize: "12px", marginTop: "5px" }}>
                Date: {formatDate(data.clientSignatureDate)}
              </div>
            )}
          </div>

          <div style={{ width: "45%" }}>
            {renderSignatureArea("", "countyWorkerSignature")}
            <div style={{ fontSize: "12px" }}>
              County Worker / Authorized Representative Signature
            </div>
            {data?.countyWorkerName && (
              <div style={{ fontSize: "12px", marginTop: "5px" }}>
                Name: {data.countyWorkerName}
              </div>
            )}
            {data?.countyWorkerSignatureDate && (
              <div style={{ fontSize: "12px", marginTop: "5px" }}>
                Date: {formatDate(data.countyWorkerSignatureDate)}
              </div>
            )}
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

export default ClientDischarge;
