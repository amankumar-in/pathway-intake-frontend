import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// ClientDisciplinaryPP component using proper field mapping
const ClientDisciplinaryPP = ({
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

  return (
    <div
      style={{
        padding: "5px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        lineHeight: "1.2",
        pageBreakInside: "avoid",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header section with logo */}
      <div
        style={{
          marginBottom: "16px",
          borderBottom: "1px solid #000",
          position: "relative",
          paddingBottom: "8px",
        }}
      >
        <div style={{ position: "absolute", top: 0, right: 0, height: "35px" }}>
          <img
            src={LOGO_BASE64}
            alt="Pathway Family Services Logo"
            style={{ width: "100%", height: "50px" }}
          />
        </div>
        <h1
          style={{
            margin: "0",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Pathway Family Services, Inc.
        </h1>
        <h2
          style={{
            margin: "5px 0",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Client Disciplinary Policy & Procedures
        </h2>
      </div>

      {/* Main content */}
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            margin: "8px 0",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "12px",
            textTransform: "uppercase",
          }}
        >
          CLIENT DISCIPLINARY POLICY & PROCEDURES
        </h3>
        <p style={{ margin: "8px 0", fontSize: "12px" }}>
          Pathway Family Services Discipline Policy will adhere strictly to the
          regulations as set forth in the paragraph below:
        </p>

        <p style={{ margin: "8px 0 8px 20px", fontSize: "12px" }}>
          Each resource child is to be free from corporal or unusual punishment,
          infliction of pain, humiliation, intimidation, ridicule, coercion,
          threat, mental abuse, or other actions of a punitive nature, including
          but not limited to: interference with the daily living functions,
          including eating, sleeping, or toileting; or withholding of shelter,
          clothing, medication or aids to physical functioning.
        </p>

        <p style={{ margin: "8px 0 8px 20px", fontSize: "12px" }}>
          The purpose of discipline is to educate, train and stop negative
          behaviors. No discipline shall be employed or sanctioned which shall
          be construed as punitive in nature, demeaning to the child, or which
          violates a child's personal rights.
        </p>
      </div>

      {/* Discipline versus Punishment Section */}
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            margin: "16px 0 8px 0",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          Discipline versus Punishment – Pathway Resource Parent Directives
        </h3>
        <p style={{ margin: "8px 0", fontSize: "12px" }}>
          Pathway resource parents are instructed to know and model the difference
          between discipline and punishment. Training materials include focus on
          how discipline teaches children how to develop self-control and be
          responsible for their own actions.
        </p>
        <p style={{ margin: "8px 0", fontSize: "12px" }}>
          State regulations and Pathway policy, explicitly forbids the use of
          corporal punishment for any child in care. Resource parent are taught
          that corporal punishment means the use of any physical force that may
          inflict pain, such as spanking, slapping or hitting.
        </p>
      </div>

      {/* Inappropriate Punishments Section */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ margin: "8px 0", fontSize: "12px" }}>
          Pathway Resource parents are instructed about other inappropriate
          punishments include but are not limited to:
        </p>
        <p style={{ margin: "8px 0 8px 20px", fontSize: "12px" }}>
          Depriving a child of basic rights or needs like food, clothing,
          shelter, bedding, or access to their parents or guardians denying
          visits, or phone or mail contacts, with family members not identified
          in the child's Treatment Plan. Other inappropriate punishment
          includes; threats of removal from the resource home, assignment of
          inappropriate or excessive exercise or work, undue influence over the
          child's religious or personal beliefs, physical punishment including
          shaking or forcefully pushing the child, degrading actions including
          humiliation, ridicule or abuse, being punished by another child,
          physical restraint, and seclusion or confinement other than for the
          immediate safety of the child or another person.
        </p>
      </div>

      {/* Discipline and Parenting Methods Section */}
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            margin: "16px 0 8px 0",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          Discipline and Parenting Methods
        </h3>
        <p style={{ margin: "8px 0", fontSize: "12px" }}>
          Pathway resource parents are provided training regarding appropriate
          discipline techniques include:
        </p>

        <p style={{ margin: "8px 0 8px 20px", fontSize: "12px" }}>
          Talking through issues, praising and encouraging, modeling rules,
          establishing clear and consistent expectations, removing issue-related
          privileges, allowing children to experience the logical consequences
          of their actions.
        </p>

        <p style={{ margin: "12px 0", fontSize: "12px" }}>
          Resource parents are encouraged to talk to their assigned Agency social
          workers about discipline techniques, training needs or any other
          issues relating to the care of resource child(ren) placed in their home.
        </p>

        <p style={{ margin: "12px 0", fontSize: "12px" }}>
          Resource parents must report all discipline techniques used toward a
          resource child(ren) and include the circumstances, which, resulted in
          disciplinary consequences. The assigned Pathway social worker will
          regularly review disciplinary actions during home visits. Discipline
          techniques that are not in alignment with agency guidelines and
          policies are reviewed by the Supervisor or Supervisor's designee.
          Discipline techniques used that are contrary to Agency policy are
          reported to Community Care Licensing. Depending on the severity of the
          infraction, Pathway could also place the resource parent on a
          probationary status or de-certify the resource home.
        </p>
      </div>

      {/* Signature section */}
      <div
        style={{
          marginTop: "20px",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <p
          style={{ margin: "16px 0 8px 0", fontSize: "12px", lineHeight: "2" }}
        >
          I,{" "}
          <span
            style={{
              borderBottom: "1px solid #000",
              fontSize: "12px",
              marginLeft: "5px",
              marginRight: "5px",
              display: "inline-block",
              minWidth: "200px",
              fontStyle: "italic",
            }}
          >
            {data?.name || ""}
          </span>
          , have read and understood and have had explained to me any questions
          I had regarding the above policies and procedures.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
            alignItems: "end",
          }}
        >
          <div style={{ width: "45%" }}>
            {renderSignatureArea("", "clientSignature")}
            <p
              style={{
                borderTop: "1px solid #000",
                fontSize: "12px",
                paddingTop: "5px",
              }}
            >
              Client Signature
            </p>
          </div>
          <div style={{ width: "30%" }}>
            <p
              style={{
                borderBottom: "1px solid #000",
                height: "20px",
                fontSize: "12px",
              }}
            >
              {data?.clientSignatureDate
                ? formatDate(data.clientSignatureDate)
                : ""}
            </p>
            <p style={{ fontSize: "12px", paddingTop: "5px" }}>Date</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "32px",
            alignItems: "end",
          }}
        >
          <div style={{ width: "45%" }}>
            {renderSignatureArea("", "countyWorkerSignature")}
            <p
              style={{
                borderTop: "1px solid #000",
                fontSize: "12px",
                paddingTop: "5px",
              }}
            >
              County Worker / Authorized Representative Signature
            </p>
          </div>
          <div style={{ width: "30%" }}>
            <p
              style={{
                borderBottom: "1px solid #000",
                height: "20px",
                fontSize: "12px",
              }}
            >
              {data?.countyWorkerSignatureDate
                ? formatDate(data.countyWorkerSignatureDate)
                : ""}
            </p>
            <p style={{ fontSize: "12px", paddingTop: "5px" }}>Date</p>
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

export default ClientDisciplinaryPP;
