import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// Base64 encoded logo (placeholder - you'll need to replace this with your actual logo)

// PRNPage2 component with proper field mapping
const PRNPage2 = ({
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
      if (onAddSignature) {
        onAddSignature("standaloneSignature", signatureArea, event);
      }
    } else {
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
                height: "50px",
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
        padding: "10px",
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
      {/* Header section with logo */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{
            height: "35px",
            marginBottom: "5px",
            display: "block",
            margin: "0 auto",
          }}
        />
        <h3
          style={{
            margin: "5px 0",
            color: "#3a3a3a",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          PATHWAY FAMILY SERVICES, INC.
        </h3>
        <h4
          style={{
            margin: "3px 0",
            fontWeight: "normal",
            fontSize: "14px",
          }}
        >
          Medical Professional's Check List of
        </h4>
        <h4
          style={{
            margin: "3px 0",
            fontWeight: "normal",
            fontSize: "14px",
          }}
        >
          Recommended Over the Counter (OTC) Medications for PRN Administration.
        </h4>
      </div>

      {/* Regulations text */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{ margin: "0", fontSize: "13px" }}>
          Regulations preclude resource parents from administering medication on a
          PRN basis without prior approval and instruction from a medical
          professional. This includes Over The Counter (OTC) medications. The
          following form is provided to indicate those medications that are not
          appropriate for the child. Any category removed will require phone or
          office contact prior to administration.
        </p>
      </div>

      {/* Client information section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "10px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "15%", fontSize: "13px" }}>
              <strong>CHILD'S NAME:</strong>
            </td>
            <td
              style={{
                width: "35%",
                borderBottom: "1px solid #000",
                fontSize: "13px",
              }}
            >
              {data?.name || ""}
            </td>
            <td style={{ width: "5%" }}></td>
            <td style={{ width: "10%", fontSize: "13px" }}>
              <strong>AGE:</strong>
            </td>
            <td
              style={{
                width: "10%",
                borderBottom: "1px solid #000",
                fontSize: "13px",
              }}
            >
              {data?.age || ""}
            </td>
            <td style={{ width: "10%", fontSize: "13px" }}>
              <strong>D.O.B.:</strong>
            </td>
            <td
              style={{
                width: "15%",
                borderBottom: "1px solid #000",
                fontSize: "13px",
              }}
            >
              {formatDate(data?.dateOfBirth) || ""}
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "13px" }}>
              <strong>MEDICAL PROFESSIONAL'S NAME:</strong>
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                fontSize: "13px",
                colSpan: 6,
              }}
            >
              {data?.medicalProfessionalName || ""}
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "13px" }}>
              <strong>OFFICE PHONE:</strong>
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                fontSize: "13px",
              }}
            >
              {data?.officePhone || ""}
            </td>
            <td></td>
            <td colSpan={2} style={{ fontSize: "13px" }}>
              <strong>AFTER HOURS:</strong>
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #000",
                fontSize: "13px",
              }}
            >
              {data?.afterHoursPhone || ""}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Instructions */}
      <div
        style={{
          marginTop: "30px",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0", fontSize: "13px", fontStyle: "italic" }}>
          In each category, please CROSS OFF the medication that is{" "}
          <strong>NOT</strong> acceptable for this child.
        </p>
        <p style={{ margin: "3px 0", fontSize: "13px" }}>
          Please use medication per label instructions.
        </p>
      </div>

      {/* Medication Categories - Using a two-column layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          fontSize: "13px",
        }}
      >
        {/* Left Column */}
        <div style={{ width: "50%", paddingRight: "5px" }}>
          {/* Category I */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>I</strong>
              {"    "}
              <strong>
                Analgesics & Antipyretics for pain relief and fever control
              </strong>{" "}
              (Tylenol, Liquiprin, Panadol, Tempra)
            </div>
            <div style={{ marginLeft: "20px" }}>
              For menstrual cramps (Pamprin or Midol)
            </div>
            <div style={{ marginLeft: "20px" }}>
              IBUPROFEN (Motrin, Advil, or generic)
            </div>
          </div>

          {/* Category II */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>II</strong>
              {"    "}
              <strong>Cough Preparations</strong> (Vick's Pediatric Formula 44,
              Robitussin DM, or Triminicol)
            </div>
            <div style={{ marginLeft: "20px" }}>
              LONG-ACTING DEXTROMETHORPHAN (Delsym)
            </div>
          </div>

          {/* Category III */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>III</strong>
              {"    "}
              <strong>Decongestants: For congestion or stuffy nose</strong>
              -PSUEDOEPHEDRINE (Pediacare Infant Drops, Sudafed Liquid or
              Tablets)
            </div>
            <div style={{ marginLeft: "20px" }}>
              PHENYLPROPANOLAMINE (Allerest, Coricidin, Dimetapp, Naldecon,
              Robitussin CFR, St. Joseph's Cold Tablets, Triaminic, Triaminic
              DM)
            </div>
          </div>

          {/* Category IV */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>IV</strong>
              {"    "}
              <strong>Antihistamines: for skin and nasal symptoms</strong> -
              CHLORPHENIRAMINE (Allerest, Chlortrimeton, Comtrex, Contac,
              Dorcol, Pediacare Preparations, Tyna, Ryna-C-Sudafed-Plus,
              Triamenic Preparations, Children's Tylenol Cold Preparations,
              Vick's Children's Nyquil, Vick's Pediatric Formula 44
              Preparations)
            </div>
            <div style={{ marginLeft: "20px" }}>
              BROMPHENIRAMINE (Bromfed, Dimetane Preparations, Dimetapp
              Preparations, Dristan Preparations, Drixoral)
            </div>
            <div style={{ marginLeft: "20px" }}>
              DIPHENHYDRAMINE (Benadryl Preparations, Benylin)
            </div>
            <div style={{ marginLeft: "20px" }}>
              TRIPROLIDINE (Actifed Preparations)
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ width: "50%", paddingLeft: "5px" }}>
          {/* Category V */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>V</strong>
              {"    "}
              <strong>Sore Throat Preparation</strong>
            </div>
            <div style={{ marginLeft: "20px" }}>
              PHENOL AND SODIUM PHENOLATE (Cepacol, Cepastat, Chloraseptic,
              Halls, Lozenges, Sucrets)
            </div>
          </div>

          {/* Category VI */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>VI</strong>
              {"    "}
              <strong>Eye Drops For Irritation Due To Allergies</strong>
            </div>
            <div style={{ marginLeft: "20px" }}>
              TETRAHYDROZOLINE HYDROCHLORIDE (Alcon, Clear Eyes, Murine, Visine)
            </div>
          </div>

          {/* Category VII */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>VII</strong>
              {"    "}
              <strong>Topical Skin Preparations</strong>
            </div>
            <div style={{ marginLeft: "20px" }}>
              For itching CALAMINE OR CALADRYL LOTION
            </div>
            <div style={{ marginLeft: "20px" }}>
              0.5% or 1.0% HYDROCORTISONE CREAM (Caldecort, Cortaid, Cortezone
              5, Cortezone 10)
            </div>
            <div style={{ marginLeft: "20px" }}>
              Topical Antibiotics (Bactine, Mycitracin, Neosporine, Nupercainal,
              Polysporin)
            </div>
            <div style={{ marginLeft: "20px" }}>
              Fungicides for athlete's foot or yeast infection on the skin
              (Corex, Desenex, Lotrimin, Mycelex, Tinactin, Clotrimazole,
              Miconazole, Tolnaftate)
            </div>
            <div style={{ marginLeft: "20px" }}>
              Muscle Strain (Ben Gay, Icy Hot, Mineral Ice)
            </div>
            <div style={{ marginLeft: "20px" }}>
              Acne (Avon Clean & Clear, Clearskin 2, Noxema, Oxy 10)
            </div>
            <div style={{ marginLeft: "20px" }}>Lice Treatment (Nix, Rid)</div>
          </div>

          {/* Category VIII */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>VIII</strong>
              {"    "}
              <strong>Anti-diarrheal</strong> (Immodium, Immodium AD,
              Kaopectate, Pepto-Bismol)
            </div>
          </div>

          {/* Category IX */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>IX</strong>
              {"    "}
              <strong>Antiflatulent</strong> (Simenthicone)
            </div>
          </div>

          {/* Category X */}
          <div style={{ marginBottom: "5px" }}>
            <div>
              <strong>X</strong>
              {"    "}
              <strong>Vitamins</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <div style={{ width: "50%", paddingLeft: "10px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {renderSignatureArea(
              "Medical Professional's Signature",
              "medicalProfessionalSignature"
            )}
            <div style={{ marginTop: "5px", fontSize: "13px" }}>
              <strong>Date:</strong> {formatDate(data?.signatureDate) || ""}
            </div>
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

export default PRNPage2;
