import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

const DEFAULT_CLOTHING_ITEMS = [
  { description: "T-Shirts or Dress Shirts" },
  { description: "Jeans or Slacks" },
  { description: "Belts" },
  { description: "Underpants/Panties" },
  { description: "Socks" },
  { description: "Shoes" },
  { description: "Hats" },
  { description: "Coats" },
  { description: "Sweaters" },
  { description: "Other:" },
];

const DEFAULT_PERSONAL_ITEMS_LEFT = [
  { description: "Hair Dryer" },
  { description: "Curling Iron" },
  { description: "Barrettes/Hair Clips" },
  { description: "Earrings" },
  { description: "Glasses/Sunglasses" },
  { description: "Necklaces" },
  { description: "Rings" },
  { description: "Bracelets" },
  { description: "Dolls" },
  { description: "Doll's Clothing" },
  { description: "Video Games" },
  { description: "Video Tapes" },
  { description: "DVD's" },
  { description: "Stereo" },
  { description: "Radio" },
  { description: "XBOX or other gaming system" },
  { description: "Audio Cassettes" },
  { description: "CD Player" },
  { description: "CD's" },
  { description: "Gameboy or PSP" },
  { description: "IPOD" },
  { description: "Computer" },
  { description: "Books" },
  { description: "CD-Rom's - (software)" },
  { description: "Bicycle" },
];

const DEFAULT_PERSONAL_ITEMS_RIGHT = [
  { description: "Scooter" },
  { description: "Protection: Helmet, Pads" },
  { description: "Rollerblades" },
  { description: "Backpack" },
  { description: "Purse" },
  { description: "Wallet" },
  { description: "Watch" },
  { description: "Keychain" },
  { description: "Headphones" },
  { description: "Baseball Glove" },
  { description: "Baseball Bat" },
  { description: "Soccer Ball" },
  { description: "Football" },
  { description: "Basketball" },
  { description: "Stuffed Toys" },
  { description: "Pillows" },
  { description: "Linens" },
  { description: "Bedspread or Comforter" },
  { description: "Sleeping Bag" },
  { description: "Video Games" },
  { description: "Box Games" },
];

const ClientPersonalProperty = ({
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
  const [signatureMenuAnchor, setSignatureMenuAnchor] = useState(null);
  const [currentSignatureArea, setCurrentSignatureArea] = useState("");

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

  const isPrintMode = () => {
    return (
      document.body.classList.contains("print-mode") ||
      window.matchMedia("print").matches ||
      document.body.getAttribute("data-pdf-export") === "true"
    );
  };

  useEffect(() => {
    const beforePrintHandler = () => document.body.classList.add("print-mode");
    const afterPrintHandler = () => document.body.classList.remove("print-mode");
    window.addEventListener("beforeprint", beforePrintHandler);
    window.addEventListener("afterprint", afterPrintHandler);
    return () => {
      window.removeEventListener("beforeprint", beforePrintHandler);
      window.removeEventListener("afterprint", afterPrintHandler);
    };
  }, []);

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

  const handleMenuClose = () => {
    setSignatureMenuAnchor(null);
    setCurrentSignatureArea("");
  };

  const handleSignatureSelect = (signatureType) => {
    if (onAddSignature) {
      onAddSignature(signatureType, currentSignatureArea);
    }
    handleMenuClose();
  };

  const handleRemoveSignature = (signatureArea) => {
    if (onRemoveSignature) {
      onRemoveSignature(signatureArea);
    }
  };

  const hasSignature = (signatureArea) => {
    return signatures && signatures[signatureArea];
  };

  const renderSignatureArea = (title, signatureArea) => {
    const signaturePlaced = hasSignature(signatureArea);
    const inPrintMode = isPrintMode();

    return (
      <div
        className={signatureAreaClass || "signature-area"}
        style={{ marginTop: "8px", width: "100%" }}
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
            <div style={{ display: inPrintMode ? "none" : "flex", justifyContent: "flex-end" }}>
              <Tooltip title="Remove Signature">
                <IconButton
                  size="small"
                  className={deleteButtonClass || "delete-signature"}
                  onClick={() => handleRemoveSignature(signatureArea)}
                  sx={{ color: "error.main" }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                height: "60px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tooltip title={isStandalone ? "Place Signature" : "Add Signature"}>
                <IconButton
                  size="small"
                  onClick={(e) => handleSignatureClick(e, signatureArea)}
                  className={placeholderClass || "signature-placeholder"}
                  sx={{ display: inPrintMode ? "none" : "flex" }}
                >
                  <AddCircleOutline />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCheckbox = (isChecked) => (
    <span
      style={{
        display: "inline-block",
        width: "12px",
        height: "12px",
        border: "1px solid #000",
        textAlign: "center",
        lineHeight: "10px",
        marginRight: "3px",
        fontSize: "9px",
      }}
    >
      {isChecked ? "X" : ""}
    </span>
  );

  const typeOfTransaction = data?.typeOfTransaction || "";
  const typeChecked = (val) => typeOfTransaction === val;

  const clothingItems = data?.clothingItems || DEFAULT_CLOTHING_ITEMS.map((item) => ({ ...item, quantity: "" }));
  const personalItemsLeft = data?.personalItemsLeft || DEFAULT_PERSONAL_ITEMS_LEFT.map((item) => ({ ...item, quantity: "" }));
  const personalItemsRight = data?.personalItemsRight || DEFAULT_PERSONAL_ITEMS_RIGHT.map((item) => ({ ...item, quantity: "" }));

  const halfClothing = Math.ceil(clothingItems.length / 2);
  const clothingLeft = clothingItems.slice(0, halfClothing);
  const clothingRight = clothingItems.slice(halfClothing);
  const maxPersonalRows = Math.max(personalItemsLeft.length, personalItemsRight.length);

  const cellStyle = {
    fontSize: "9px",
    borderBottom: "1px solid #ccc",
    padding: "2px 4px",
    height: "16px",
  };

  const qtyStyle = {
    ...cellStyle,
    width: "40px",
    borderRight: "1px solid #ccc",
  };

  const descStyle = {
    ...cellStyle,
  };

  const headerStyle = {
    fontSize: "9px",
    fontWeight: "bold",
    padding: "2px 4px",
    borderBottom: "1px solid #000",
  };

  return (
    <div
      style={{
        padding: "15px 20px",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontSize: "10px",
        lineHeight: "1.2",
        maxWidth: "8.3in",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3px" }}>
        <div>
          <div style={{ fontSize: "10px", marginBottom: "2px" }}>
            Pathway Family Services, Inc.
          </div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            Client Personal Property
          </div>
        </div>
        <img
          src={LOGO_BASE64}
          alt="Pathway Family Services Logo"
          style={{ height: "35px" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", marginTop: "20px", marginBottom: "3px" }}>
        <div>
          {renderCheckbox(typeChecked("Intake"))} Intake &nbsp;
          {renderCheckbox(typeChecked("Placement"))} Placement &nbsp;
          {renderCheckbox(typeChecked("Annual"))} Annual &nbsp;
          {renderCheckbox(typeChecked("Transfer"))} Transfer &nbsp;
          {renderCheckbox(typeChecked("Discharge"))} Discharge &nbsp;
          {renderCheckbox(typeChecked("In House Move"))} In House Move &nbsp;
          {renderCheckbox(typeChecked("Termination"))} Termination &nbsp;
          {renderCheckbox(typeChecked("Shelter Placement"))} Shelter Placement &nbsp;
          {renderCheckbox(typeChecked("LOC Change"))} LOC Change
        </div>
        <div>
          <strong>Date:</strong> {formatDate(data?.transactionDate) || ""}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #000", margin: "3px 0" }} />

      {/* Client Info */}
      <div style={{ display: "flex", fontSize: "10px", marginBottom: "5px" }}>
        <div style={{ flex: 1 }}>
          <strong>Client Name:</strong>{" "}
          <span style={{ borderBottom: "1px solid #000", minWidth: "200px", display: "inline-block", paddingBottom: "1px" }}>
            {data?.name || ""}
          </span>
        </div>
        <div>
          <strong>Foster Parent:</strong>{" "}
          <span style={{ borderBottom: "1px solid #000", minWidth: "150px", display: "inline-block", paddingBottom: "1px" }}>
            {data?.nameOfFosterParents || ""}
          </span>
        </div>
      </div>

      {/* Clothing Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px", border: "1px solid #000" }}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, width: "40px" }}>Quantity</th>
            <th style={headerStyle}>Description</th>
            <th style={{ ...headerStyle, width: "40px" }}>Quantity</th>
            <th style={headerStyle}>Description</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(clothingLeft.length, clothingRight.length) }).map((_, i) => (
            <tr key={`clothing-${i}`}>
              <td style={qtyStyle}>{clothingLeft[i]?.quantity || ""}</td>
              <td style={descStyle}>{clothingLeft[i]?.description || ""}</td>
              <td style={qtyStyle}>{clothingRight[i]?.quantity || ""}</td>
              <td style={descStyle}>{clothingRight[i]?.description || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Personal Items Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px", border: "1px solid #000" }}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, width: "40px" }}>Quantity</th>
            <th style={headerStyle}>Description</th>
            <th style={{ ...headerStyle, width: "40px" }}>Quantity</th>
            <th style={headerStyle}>Description</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxPersonalRows }).map((_, i) => (
            <tr key={`personal-${i}`}>
              <td style={qtyStyle}>{personalItemsLeft[i]?.quantity || ""}</td>
              <td style={descStyle}>{personalItemsLeft[i]?.description || ""}</td>
              <td style={qtyStyle}>{personalItemsRight[i]?.quantity || ""}</td>
              <td style={descStyle}>{personalItemsRight[i]?.description || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Allowance section */}
      <div style={{ display: "flex", fontSize: "10px", marginBottom: "5px", gap: "30px" }}>
        <div>
          Allowance Owed: ${" "}
          <span style={{ borderBottom: "1px solid #000", minWidth: "60px", display: "inline-block" }}>
            {data?.isNA ? "N/A" : (data?.allowanceOwed || "")}
          </span>
        </div>
        <div>
          Clothing Allowance Owed: ${" "}
          <span style={{ borderBottom: "1px solid #000", minWidth: "60px", display: "inline-block" }}>
            {data?.isNA ? "N/A" : (data?.clothingAllowanceOwed || "")}
          </span>
        </div>
      </div>

      {/* Bottom type checkboxes */}
      <div style={{ fontSize: "9px", marginBottom: "8px" }}>
        {renderCheckbox(typeChecked("Intake"))} Intake &nbsp;
        {renderCheckbox(typeChecked("Placement"))} Placement &nbsp;
        {renderCheckbox(typeChecked("Annual"))} Annual &nbsp;
        {renderCheckbox(typeChecked("Transfer"))} Transfer &nbsp;
        {renderCheckbox(typeChecked("Discharge"))} Discharge &nbsp;
        {renderCheckbox(typeChecked("In House Move"))} In House Move &nbsp;
        {renderCheckbox(typeChecked("Termination"))} Termination &nbsp;
        {renderCheckbox(typeChecked("Shelter Placement"))} Shelter Placement &nbsp;
        {renderCheckbox(typeChecked("LOC Change"))} LOC Change
      </div>

      {/* Signatures */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "10px" }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          {renderSignatureArea("", "clientSignature")}
          <div style={{ fontSize: "9px", marginTop: "4px" }}>Client Signature</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          {renderSignatureArea("", "fosterParentSignature")}
          <div style={{ fontSize: "9px", marginTop: "4px" }}>Foster Parent Signature</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          {renderSignatureArea("", "socialWorkerSignature")}
          <div style={{ fontSize: "9px", marginTop: "4px" }}>Social Worker Signature</div>
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

export default ClientPersonalProperty;
