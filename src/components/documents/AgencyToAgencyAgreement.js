import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete, Star } from "@mui/icons-material";
import SignatureMenu from "../shared/SignatureMenu";
import { LOGO_BASE64 } from "../../constants/logo";

// AgencyToAgencyAgreement component using only HTML and CSS styling
const AgencyToAgencyAgreement = ({
  data,
  signatures = {},
  onAddSignature,
  onRemoveSignature,
  onTouchSignatureArea,
  touchedArea,
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

  // Document styles
  const styles = {
    document: {
      padding: "15px",
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      lineHeight: "1.2",
      pageBreakInside: "avoid",
      maxWidth: "8.3in",
      margin: "0 auto",
    },
    title: {
      textAlign: "center",
      marginBottom: "10px",
    },
    mainTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      margin: "5px 0",
    },
    subtitle: {
      fontSize: "11px",
      fontStyle: "italic",
      margin: "5px 0",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 5px",
    },
    row: {
      verticalAlign: "top",
    },
    labelCell: {
      width: "20%",
      fontSize: "9px",
      padding: "2px 0",
      textAlign: "left",
    },
    valueCell: {
      borderBottom: "1px solid #000",
      padding: "2px 0",
      minWidth: "100px",
    },
    spacerCell: {
      width: "5%",
    },
    sectionTitle: {
      fontSize: "11px",
      fontWeight: "bold",
      margin: "15px 0 5px 0",
      padding: "3px 0",
      borderBottom: "1px solid #000",
    },
    paragraph: {
      margin: "8px 0",
      fontSize: "10px",
      lineHeight: "1.3",
    },
    agreementSection: {
      display: "flex",
      flexDirection: "row",
      border: "1px solid #ccc",
      marginTop: "10px",
    },
    agreementColumn: {
      width: "50%",
      padding: "5px",
      verticalAlign: "top",
    },
    agreementTitle: {
      fontSize: "10px",
      fontWeight: "bold",
      borderBottom: "1px solid #000",
      padding: "3px 0",
      textAlign: "center",
    },
    agreementList: {
      margin: "5px 0 0 15px",
      padding: "0 0 0 5px",
      fontSize: "8px",
      lineHeight: "1.3",
    },
    listItem: {
      marginBottom: "4px",
    },
    signatureGrid: {
      display: "flex",
      flexDirection: "row",
      marginTop: "15px",
      justifyContent: "space-between",
    },
    signatureColumn: {
      width: "45%",
    },
    signatureInfo: {
      fontSize: "9px",
      marginTop: "3px",
    },
    infoRow: {
      display: "flex",
      marginTop: "5px",
      fontSize: "9px",
    },
    infoLabel: {
      width: "80px",
      fontWeight: "bold",
    },
    infoValue: {
      flex: 1,
    },
  };

  // Format signature date or use current date if not available
  const formattedSignatureDate =
    formatDate(data?.signatureDate) || formatDate(new Date().toISOString());

  return (
    <div style={styles.document}>
      {/* Title section */}
      <div style={styles.title}>
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
        <div style={styles.mainTitle}>AGENCY - TO AGENCY AGREEMENT</div>
        <div style={styles.subtitle}>(Child Placed by Agency into Agency)</div>
      </div>

      {/* Client info section */}
      <table style={styles.table}>
        <tbody>
          <tr style={styles.row}>
            <td style={styles.labelCell}>Name of Child:</td>
            <td style={styles.valueCell}>{data?.name || ""}</td>
            <td style={styles.spacerCell}></td>
            <td style={styles.labelCell}>Parent's Name:</td>
            <td style={styles.valueCell}>{data?.parentsName || ""}</td>
          </tr>
          <tr style={styles.row}>
            <td style={styles.labelCell}>Birthdate of Child:</td>
            <td style={styles.valueCell}>
              {formatDate(data?.dateOfBirth) || ""}
            </td>
            <td style={styles.spacerCell}></td>
            <td style={styles.labelCell}>Date Placed:</td>
            <td style={styles.valueCell}>
              {formatDate(data?.datePlaced) ||
                formatDate(data?.transactionDate) ||
                ""}
            </td>
          </tr>
          <tr style={styles.row}>
            <td style={styles.labelCell}>Case Number:</td>
            <td style={styles.valueCell}>{data?.caseNumber || ""}</td>
            <td style={styles.spacerCell} colSpan="3"></td>
          </tr>
        </tbody>
      </table>

      {/* Duration section */}
      <div style={styles.paragraph}>
        Anticipated duration of placement is twelve (12) months.
      </div>

      {/* Payment section */}
      <div style={styles.paragraph}>
        The agency will pay{" "}
        <span style={{ fontWeight: "bold" }}>
          {data?.paymentAmount || "$2,638.00"}
        </span>{" "}
        per month for room and board, clothing, personal needs, recreation,
        transportation, education, incidentals, supervision and social services.
        First payment to be made within 45 days after placement with subsequent
        payments to be made monthly.
      </div>

      {/* Additional amounts section */}
      <div style={styles.paragraph}>
        If additional amounts are to be paid, the reason, amount and conditions
        shall be set forth in the space provided below:
        <div
          style={{
            minHeight: "20px",
            borderBottom: "1px solid #ccc",
            marginTop: "5px",
            paddingTop: "2px",
          }}
        >
          {data?.additionalAmounts || ""}
        </div>
      </div>

      {/* Special problems section - FIXED: Combined label */}
      <div style={styles.paragraph}>
        <div style={{ fontSize: "10px" }}>
          Special Problems: If yes, explain.
        </div>
        <div
          style={{
            minHeight: "20px",
            borderBottom: "1px solid #ccc",
            marginTop: "3px",
            paddingTop: "2px",
          }}
        >
          {data?.specialProblems || ""}
        </div>
      </div>

      {/* Agreements section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                width: "50%",
                padding: "3px",
                textAlign: "center",
                fontSize: "10px",
                fontWeight: "bold",
                borderBottom: "1px solid #000",
                borderRight: "1px solid #ccc",
              }}
            >
              Placing Agency Agrees To
            </th>
            <th
              style={{
                width: "50%",
                padding: "3px",
                textAlign: "center",
                fontSize: "10px",
                fontWeight: "bold",
                borderBottom: "1px solid #000",
              }}
            >
              Resource Family Agency Agrees To
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                padding: "5px",
                verticalAlign: "top",
                borderRight: "1px solid #ccc",
                fontSize: "8px",
                lineHeight: "1.3",
              }}
            >
              <ol style={{ margin: "3px 0 0 15px", paddingLeft: "0" }}>
                <li style={styles.listItem}>
                  Provide the agency with knowledge of the background and needs
                  of the child. This shall include but not limited to social
                  work assessment, medical reports, education assessment,
                  psychological/psychiatric evaluations, and identification of
                  special needs. This shall be made available to the FFA within
                  14 days from date of placement.
                </li>
                <li style={styles.listItem}>
                  Inform the FFA, before placement, of this child's behaviors
                  and proclivities that might be harmful to others (including
                  pets) in the home, school or neighborhood.
                </li>
                <li style={styles.listItem}>
                  Work with the FFA in the development and progress and services
                  plan. The county placing agency will notify and invite the FFA
                  to participate in any child and family team meetings to
                  discuss the child's needs and services plan.
                </li>
                <li style={styles.listItem}>
                  Work with FFA staff toward successful completion of the
                  child's needs and services plan, a positive placement outcome
                  and timely permancy for the child. provide the agency a JV
                  220A, Prescribing Physician's Statement, if applicable, and
                  subsequent renewals.
                </li>
                <li style={styles.listItem}>
                  Work together with the FFA to develope and maintain positive
                  relationships with the child's parents (guardians) and other
                  family members, and cooperate with the reunification process,
                  e.g. provide written information regarding a child's medical
                  and transportation needs.
                </li>
                <li style={styles.listItem}>
                  Maintain contact with the child monthly or as specified in the
                  child's approved case plan.
                </li>
                <li style={styles.listItem}>
                  Continue paying for the child's care as long as the child
                  remains in placement or in the absence of the child the agnecy
                  asks the FFA to retain an open placement.
                </li>
                <li style={styles.listItem}>
                  Provide a Medi-Cal card or other medical coverage and a
                  Medical Consent form signed by the child's parents, legal
                  guardian or court at the time of placement.
                </li>
                <li style={styles.listItem}>
                  Inform the FFA of its clothing allowance policy and provide
                  the funding consistent with those policies or any revised
                  policies.
                </li>
                <li style={styles.listItem}>
                  Pay for medical costs incurred prior to the establishment of
                  Medi-Cal eligibility.
                </li>
                <li style={styles.listItem}>
                  Verify and remit/reconcile any underpayments within 45 days of
                  FFA notification of such underpayments.
                </li>
                <li style={styles.listItem}>
                  Notify the FFA within 12 months of suspected overpayments, in
                  accordance with applicable regulations.
                </li>
                <li style={styles.listItem}>
                  Provide a contact telephone number for emergencies and after
                  business hours: 661-631-6011.
                </li>
              </ol>
              <div style={{ marginTop: "10px", fontSize: "9px" }}>
                <strong>Initial Placement:</strong>{" "}
                {data?.initialPlacement || ""}
              </div>
              <div style={{ marginTop: "5px", fontSize: "9px" }}>
                <strong>Cali</strong>
              </div>
              <div style={{ marginTop: "2px", fontSize: "9px" }}>
                <strong>Phone#</strong>
              </div>
            </td>
            <td
              style={{
                padding: "5px",
                verticalAlign: "top",
                fontSize: "8px",
                lineHeight: "1.3",
              }}
            >
              <ol style={{ margin: "3px 0 0 15px", paddingLeft: "0" }}>
                <li style={styles.listItem}>
                  Provide this child with resource parent(s) who have been
                  certified to care for the child's needs in accordance with
                  applicable laws and regulations.
                </li>
                <li style={styles.listItem}>
                  Conform to Title 22, Division 6 regulations and all laws
                  governing resource care.
                </li>
                <li style={styles.listItem}>
                  Notify the placing agency within 24 hours (unless there is a
                  seperate written agreement with the placing agency) by phone
                  followed in writing of significant changes in the child's
                  health, behavior or location as well as significant issues
                  including suspected physical or psychological abuse, death,
                  injury, unusual incidents, absence of a child, placement
                  issues and school non-attendance and all items listed under
                  section 80061 of Title 22, Division 6.
                </li>
                <li style={styles.listItem}>
                  Work together with the placing agency to encourage the
                  maintenance of the familial-child relationship and include the
                  child's family members, as indciaed in the needs and services
                  plan, in treatment planning and/or child and family teams
                  whenever possible and cooperate with the reunification
                  process.
                </li>
                <li style={styles.listItem}>
                  Use constructive alternative methods of discipline; not use
                  corporal punishment; deprivation of meals, monetary
                  allowances, visits from parents, or home visits; threat of
                  removal or any degrading or humiliating punishment.
                </li>
                <li style={styles.listItem}>
                  Respect and keep confidential information given about this
                  child and his/her family.
                </li>
                <li style={styles.listItem}>
                  Work with the placing agency to develop and submit to them a
                  needs and services plan that develops an understanding of the
                  responsibilities, objectives and requirements of the agency in
                  regard to the care of this child, including the information
                  listed on the reverse side of this form, within 30 days of
                  placement of the child. The needs and services plan shall be
                  updated at least every 6 months.
                </li>
                <li style={styles.listItem}>
                  Written progress reports shall be provided at least every six
                  months or more frequent by mutual agreement.
                </li>
                <li style={styles.listItem}>
                  Give placing agency 7 day notice of intent to discharge or
                  move this child. Notify the placing agency of any intended
                  move of this child between certified resource homes prior to the
                  move. The FFA has the authority to move a child in the case of
                  imminent risk to the child or family. The FFA shall notify the
                  placing agency within 24 hours of such move.
                </li>
                <li style={styles.listItem}>
                  FFA social worker shall visit this child in private in their
                  resource home at least once per calendar month and provide
                  documentation of these visits to the placing agency
                  caseworker/probation officer on a flow basis every month as
                  visits are completed.
                </li>
                <li style={styles.listItem}>
                  Provide state and federal agencies access to records as
                  provided by state and fedral law.
                </li>
                <li style={styles.listItem}>
                  Notify the placing agency if the child receives any source of
                  income such as income from work, SSI, SSA, child support, etc.
                  Notify the county of any property the child obtains, including
                  bank accounts. (It will be the county's responsibility to
                  verify the income/property).
                </li>
                <li style={styles.listItem}>
                  Follow any requirements associated with the county's clothing
                  allowance policy and procedures.
                </li>
                <li style={styles.listItem}>
                  Remit any overpayment in full to the county welfare department
                  upon receipt of a notice of action or following the completion
                  due process.
                </li>
                <li style={styles.listItem}>
                  Inform county upon any discovery of apparent overpayment.
                </li>
              </ol>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Agreement text */}
      <div style={styles.paragraph}>
        I have read the foregoing and agree to conform to these requirements.
        The terms of the agreement shall remain in force until changed by mutual
        agreement of both parties or this child is removed from the agency.
      </div>

      {/* Signature section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
          fontSize: "9px",
        }}
      >
        <tbody>
          {/* Signature Areas */}
          <tr>
            <td style={{ width: "45%", verticalAlign: "top" }}>
              {renderSignatureArea("", "placementWorkerSignature")}
            </td>
            <td style={{ width: "10%" }}></td>
            <td style={{ width: "45%", verticalAlign: "top" }}>
              {renderSignatureArea("", "agencyRepSignature")}
            </td>
          </tr>

          {/* Labels */}
          <tr>
            <td style={{ paddingTop: "3px", fontSize: "9px" }}>
              Children Placement Worker
            </td>
            <td></td>
            <td style={{ paddingTop: "3px", fontSize: "9px" }}>
              Authorized Agency Representative
            </td>
          </tr>

          {/* Names */}
          <tr>
            <td style={{ paddingTop: "3px", fontSize: "11px" }}>
              {data?.placementWorkerName || data?.countyWorkerName || ""}
            </td>
            <td></td>
            <td style={{ paddingTop: "3px", fontSize: "11px" }}>
              {data?.agencyRepresentative || ""}
            </td>
          </tr>

          {/* Titles */}
          <tr>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: "bold", fontSize: "8px" }}>
                Title:
              </span>{" "}
              {data?.placementWorkerTitle || "CSW"}
            </td>
            <td></td>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: "bold", fontSize: "8px" }}>
                Title:
              </span>{" "}
              {data?.agencyRepresentativeTitle || ""}
            </td>
          </tr>

          {/* Agency */}
          <tr>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: "bold", fontSize: "8px" }}>
                Agency:
              </span>{" "}
              {data?.placingAgencyName || "DHS"}
            </td>
            <td></td>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: "bold", fontSize: "8px" }}>
                Agency:
              </span>{" "}
              {data?.agencyName || "Pathway Family Services, Inc."}
            </td>
          </tr>

          {/* Address */}
          <tr>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: "bold", fontSize: "8px" }}>
                Address:
              </span>{" "}
              {data?.placingAgencyAddress || "2125 S. Centerpoint Prkwy"}
            </td>
            <td></td>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: "bold", fontSize: "8px" }}>
                Address:
              </span>{" "}
              {data?.agencyAddress || "P.O. Box 888, Bakersfield, CA 93302"}
            </td>
          </tr>

          {/* City/State/Zip */}
          <tr>
            <td style={{ whiteSpace: "nowrap" }}>
              {data?.placingAgencyCity || "Santa Maria"},{" "}
              {data?.placingAgencyState || "CA"}{" "}
              {data?.placingAgencyZip || "93455"}
            </td>
            <td></td>
            <td></td>
          </tr>

          {/* Phone and Date */}
          <tr>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  marginRight: "3px",
                }}
              >
                Phone:
              </span>{" "}
              {data?.placingAgencyPhone || "805-819-1921"}
            </td>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  marginRight: "3px",
                }}
              >
                Date:
              </span>{" "}
              {formattedSignatureDate}
            </td>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  marginRight: "3px",
                }}
              >
                Phone:
              </span>{" "}
              {data?.agencyPhone || "(805) 739-1111"}
            </td>
            <td style={{ paddingTop: "5px", whiteSpace: "nowrap" }}>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  marginRight: "3px",
                }}
              >
                Date:
              </span>{" "}
              {formattedSignatureDate}
            </td>
          </tr>
        </tbody>
      </table>

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

export default AgencyToAgencyAgreement;
