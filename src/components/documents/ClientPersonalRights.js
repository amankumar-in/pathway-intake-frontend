import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";

// Base64 encoded logo (actual logo would replace this)
const LOGO_BASE64 = "image-placeholder";

// ClientPersonalRights component using proper field mapping
const ClientPersonalRights = ({
  data,
  signatures = {},
  onAddSignature,
  onRemoveSignature,
  signatureAreaClass,
  deleteButtonClass,
  placeholderClass,
  isStandalone = false,
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

  // Get office address based on the office field
  const getOfficeAddress = (office) => {
    switch (office) {
      case "Bakersfield":
        return "P.O. Box 511, Bakersfield, CA 93302";
      case "Atascadero":
        return "P.O. Box 8119 San Luis Obispo, CA 93403";
      case "Riverside":
        return "547 N San Jacinto St., Hemet, CA 92544";
      case "Santa Maria":
        return "2125 S. Centerpoint Prkwy, Santa Maria, CA 93455";
      case "Visalia":
        return "26500 S Mooney Blvd, Visalia, CA 93277-9311";
      default:
        return "";
    }
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
                height: "60px",
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
                height: "60px",
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
        fontSize: "10px",
        lineHeight: "1.2",
        pageBreakInside: "avoid",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header with no logo */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h1
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            margin: "5px 0",
            textTransform: "uppercase",
          }}
        >
          PERSONAL RIGHTS
        </h1>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "normal",
            margin: "5px 0",
            marginBottom: "10px",
          }}
        >
          Children's Residential Facilities
        </h2>
      </div>

      {/* Explanation section */}
      <div style={{ marginBottom: "15px" }}>
        <p
          style={{
            margin: "0 0 5px 0",
            textAlign: "justify",
            fontSize: "13px",
          }}
        >
          <strong>EXPLANATION:</strong> The California Code of Regulations,
          Title 22 requires that any child admitted to a home/ facility must be
          advised of his/her personal rights. Home/Facilities are also required
          to post these rights in areas accessible to the public.
          Consequetially, this form is designed to meet both the needs of the
          children admitted to homes/facilities and the home/facility owners who
          are required to post these rights.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <p
          style={{
            margin: "0 0 5px 0",
            textAlign: "justify",
            fontSize: "13px",
          }}
        >
          This form describes the personal rights to be afforded each child
          admitted to a home/facility. This form also provides the complaint
          procedures for the child and authorized representative.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <p
          style={{
            margin: "0 0 5px 0",
            textAlign: "justify",
            fontSize: "13px",
          }}
        >
          This form is to be reviewed, completed and signed by each child and/or
          each authorized representative upon admission to the home/facility.
          The child and/or authorized representative also has the right to
          receive a completed copy of the originally signed form. The original
          signed copy shall be retained in the child's file which is maintained
          by the home/facility.
        </p>
      </div>

      {/* To section */}
      <div style={{ marginBottom: "15px" }}>
        <p
          style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "13px" }}
        >
          TO: CHILD OR AUTHORIZED REPRESENTATIVE:
        </p>
      </div>

      {/* Acknowledgment section */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ margin: "0 0 5px 0", fontSize: "13px" }}>
          Upon satisfactory and full disclosure of the personal rights as
          explained, completed the following acknowledgment:
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <p
          style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "13px" }}
        >
          ACKNOWLEDGMENT: I/We have been personally advised of, and have
          received a copy of the personal rights contained in the California
          Code of Regulations, Title 22, at the time of admission to.
        </p>
      </div>

      {/* Facility info */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "13px" }}>
            Pathway Family Services
          </div>
          <div style={{ fontSize: "13px" }}>
            {data?.officeAddress ||
              getOfficeAddress(data?.office) ||
              "2125 S. Centerpoint Prkwy, Santa Maria, CA 93455"}
          </div>
        </div>
      </div>

      {/* Signature Section - Standardized and properly aligned */}
      <div style={{ marginBottom: "20px" }}>
        {/* Child Signature Row */}
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "60%" }}>
            {renderSignatureArea("", "childSignature")}
            <div style={{ fontSize: "9px" }}>(SIGNATURE OF THE CHILD)</div>
          </div>
          <div style={{ width: "30%" }}>
            <div
              style={{
                borderBottom: "1px solid #000",
                height: "35px",
                paddingTop: "15px",
                fontSize: "13px",
              }}
            >
              {formatDate(data?.childSignatureDate || data?.transactionDate) ||
                ""}
            </div>
            <div style={{ fontSize: "9px" }}>(DATE)</div>
          </div>
        </div>

        {/* Authorized Representative Signature Row - Made consistent with child signature row */}
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "60%" }}>
            {renderSignatureArea("", "authorizedRepSignature")}
            <div style={{ fontSize: "9px" }}>
              (SIGNATURE OF THE AUTHORIZED REPRESENTATIVE)
            </div>
          </div>
          <div style={{ width: "30%" }}>
            <div
              style={{
                borderBottom: "1px solid #000",
                height: "35px",
                paddingTop: "15px",
                fontSize: "13px",
              }}
            >
              {formatDate(data?.signatureDate || data?.transactionDate) || ""}
            </div>
            <div style={{ fontSize: "9px" }}>(DATE)</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "5px",
          }}
        >
          <div style={{ width: "60%" }}>
            <div style={{ fontSize: "13px" }}>
              {data?.countyWorkerTitle || "CSW"}
            </div>
            <div style={{ fontSize: "9px" }}>
              (TITLE OF THE AUTHORIZED REPRESENTATIVE)
            </div>
          </div>
        </div>
      </div>

      {/* Licensing info section */}
      <div style={{ marginBottom: "15px" }}>
        <p
          style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "13px" }}
        >
          THE CHILD AND/OR THE AUTHORIZED REPRESENTATIVE HAS THE RIGHT TO BE
          INFORMED OF THE APPROPRIATE LICENSING AGENCY TO CONTACT REGARDING
          COMPLAINTS, WHICH IS:
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "5px" }}>
          <div style={{ fontWeight: "bold", fontSize: "9px" }}>NAME</div>
          <div style={{ fontSize: "13px" }}>
            {data?.licensingAgencyName || "Community Care Licensing"}
          </div>
        </div>

        <div style={{ marginBottom: "5px" }}>
          <div style={{ fontWeight: "bold", fontSize: "9px" }}>ADDRESS</div>
          <div style={{ fontSize: "13px" }}>
            {data?.licensingAgencyAddress ||
              "1000 Corporate Center Drive  Ste 200A"}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "40%" }}>
            <div style={{ fontWeight: "bold", fontSize: "9px" }}>CITY</div>
            <div style={{ fontSize: "13px" }}>
              {data?.licensingAgencyCity || "Monterey Park, CA"}
            </div>
          </div>
          <div style={{ width: "20%" }}>
            <div style={{ fontWeight: "bold", fontSize: "9px" }}>ZIP CODE</div>
            <div style={{ fontSize: "13px" }}>
              {data?.licensingAgencyZip || "91754"}
            </div>
          </div>
          <div style={{ width: "30%" }}>
            <div style={{ fontWeight: "bold", fontSize: "9px" }}>
              AREA CODE/TELEPHONE NUMBER
            </div>
            <div style={{ fontSize: "13px" }}>
              {data?.licensingAgencyPhone || "323-981-3300"}
            </div>
          </div>
        </div>
      </div>

      {/* Signature selection menu */}
      <Menu
        anchorEl={signatureMenuAnchor}
        open={Boolean(signatureMenuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Select a signature:</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("childSignature")}>
          Foster Child Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("parentSignature")}>
          Resource Mother Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("caseworkerSignature")}>
          Resource Father Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("supervisorSignature")}>
          Pathway Social Worker Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("agencyRepSignature")}>
          County Social Worker Signature
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ClientPersonalRights;
