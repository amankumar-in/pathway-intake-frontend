import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Typography, Tooltip, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";

// Base64 encoded logo (actual logo would replace this)
const LOGO_BASE64 = "image-placeholder";
// AgencyToFosterParent component using proper field mapping
const AgencyToFosterParent = ({
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

  // Handle signature icon click - FIXED: handle both standalone and regular documents
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

  // Render signature area - FIXED: show add button for all document types
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
              {/* FIXED: Show add button for all document types, including standalone */}
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
        <h3
          style={{
            margin: "8px 0",
            color: "#3a3a3a",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          PATHWAY'S TO RESOURCE PARENT AGREEMENT
        </h3>
        <h4
          style={{
            margin: "8px 0",
            fontWeight: "normal",
            fontStyle: "italic",
            fontSize: "11px",
          }}
        >
          (Child Placed by Agency into Foster Home)
        </h4>
        <p style={{ margin: "8px 0", fontSize: "9px" }}>
          This agreement will be initiated when the child is placed in the
          facility and whenever the rate changes.
        </p>
      </div>

      {/* Client information section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "15%", fontSize: "9px" }}>
              <strong>Name of Child:</strong>
            </td>
            <td
              style={{
                width: "35%",
                borderBottom: "1px solid #000",

                fontSize: "9px",
              }}
            >
              {data?.name || ""}
            </td>
            <td style={{ width: "5%" }}></td>
            <td style={{ width: "15%", fontSize: "9px" }}>
              <strong>Parent's Name:</strong>
            </td>
            <td
              style={{
                width: "30%",
                borderBottom: "1px solid #000",

                fontSize: "9px",
              }}
            >
              {data?.parentsName || ""}
            </td>
          </tr>
          <tr>
            <td
              style={{
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              <strong>Birthdate of Child:</strong>
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              {formatDate(data?.dateOfBirth) || ""}
            </td>
            <td></td>
            <td
              style={{
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              <strong>Date Placed:</strong>
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              {formatDate(data?.datePlaced || data?.transactionDate) || ""}
            </td>
          </tr>
          <tr>
            <td
              style={{
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              <strong>Case Number:</strong>
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              {data?.caseNumber || ""}
            </td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td
              style={{
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              <strong>Resource Parent:</strong>
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              {data?.nameOfFosterParents || ""}
            </td>
            <td></td>
            <td
              style={{
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              <strong>Address:</strong>
            </td>
            <td
              style={{
                borderBottom: "1px solid #000",
                paddingTop: "8px",

                fontSize: "9px",
              }}
            >
              {data?.fosterParentsAddress || ""}
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "9px" }}></td>
            <td style={{ fontSize: "9px" }}></td>
            <td style={{ fontSize: "9px" }}></td>
            <td style={{ fontSize: "9px" }}></td>
            <td
              style={{
                borderBottom: "1px solid #000",

                fontSize: "9px",
              }}
            >
              {data?.fosterParentsCity || ""},{" "}
              {data?.fosterParentsState || "California"}{" "}
              {data?.fosterParentsZip || ""}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Duration and payment section */}
      <div>
        <p style={{ margin: "5px 0", fontSize: "9px" }}>
          Anticipated duration of placement is{" "}
          {data?.anticipatedDuration || "twelve (12)"} months.
        </p>
        <p style={{ margin: "5px 0", fontSize: "9px" }}>
          Pathway will pay{" "}
          <strong>{data?.fosterParentsPayment || "$1206.00"}</strong> per month
          for room and board, clothing, personal needs, recreation,
          transportation, education, incidentals, supervision and social
          services. First payment to be made within 45 days after placement with
          subsequent payments to be made no later than the 15th of the month
          following provision of care.
        </p>
      </div>

      {/* Additional services section */}
      <div>
        <p style={{ margin: "5px 0", fontSize: "9px" }}>
          Additional optional service rate in the amount of _________________
          are to be paid, the reason, amount and conditions shall be set forth
          in the space provided below:
        </p>
        <div
          style={{
            borderBottom: "1px solid #ccc",
            marginTop: "5px",
            paddingTop: "2px",
            fontSize: "9px",
          }}
        >
          {data?.additionalServices || ""}
        </div>
      </div>

      {/* Level of care section */}
      <table style={{ width: "100%", marginBottom: "10px" }}>
        <tbody>
          <tr>
            <td style={{ width: "10%", fontSize: "9px" }}>
              <strong>LEVEL:</strong>
            </td>
            <td
              style={{
                width: "40%",
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {data?.levelOfCare || "Level 1"}
            </td>
            <td style={{ width: "10%", fontSize: "9px" }}>
              <strong>explain:</strong>
            </td>
            <td
              style={{
                width: "40%",
                borderBottom: "1px solid #000",
                fontSize: "9px",
              }}
            >
              {data?.levelExplanation || ""}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Special permissions section */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            checked={data?.canBeUnsupervised || false}
            readOnly
            style={{ verticalAlign: "middle" }}
          />
          <label
            style={{
              marginLeft: "5px",
              fontSize: "9px",
              verticalAlign: "middle",
            }}
          >
            Child 15 years or older has permission to remain without adult
            supervision during temporary absences of the foster parents(s), not
            to exceed six (6) hours in any one 72 - hour period
          </label>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            checked={data?.receivingMentalHealthServices || false}
            readOnly
            style={{ verticalAlign: "middle" }}
          />
          <label
            style={{
              marginLeft: "5px",
              fontSize: "9px",
              verticalAlign: "middle",
            }}
          >
            Youth is currently receiving mental health services at{" "}
            {data?.mentalHealthServicesProvider ||
              "_________________________________________________________________________________"}
          </label>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            checked={data?.otherPermission || false}
            readOnly
            style={{ verticalAlign: "middle" }}
          />
          <label
            style={{
              marginLeft: "5px",
              fontSize: "9px",
              verticalAlign: "middle",
            }}
          >
            Other, explain
          </label>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            checked={data?.noSpecialPermissions || true}
            readOnly
            style={{ verticalAlign: "middle" }}
          />
          <label
            style={{
              marginLeft: "5px",
              fontSize: "9px",
              verticalAlign: "middle",
            }}
          >
            No special permissions granted.
          </label>
        </div>
      </div>

      {/* Agreement sections */}
      <div
        style={{
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
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
                  fontWeight: "bold",
                  fontSize: "10px",
                  borderBottom: "1px solid #000",
                  borderRight: "1px solid #ccc",
                }}
              >
                AGENCY AGREES TO
              </th>
              <th
                style={{
                  width: "50%",
                  padding: "5px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "10px",
                  borderBottom: "1px solid #000",
                }}
              >
                RESOURCE PARENTS AGREE TO
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
                  <li>
                    As made available from placing agency will provide the
                    resource parent with knowledge of the background and needs
                    of the child necessary for effective care. This may include
                    a social work assessment, medical reports, educational
                    assessment, and identification of special needs when
                    necessary.
                  </li>
                  <li>
                    Develop a plan for the child and share pertinent aspects
                    with the resource parents.
                  </li>
                  <li>
                    Provide training to ensure culturally relevant and trauma
                    informed care of foster child.
                  </li>
                  <li>
                    Not remove the child without appropriate notice unless: the
                    child is physically or psychologically endangered; court
                    orders removal; removal is from an interim placement
                    directly into an adoption.
                  </li>
                  <li>
                    Involve resource parents in future planning for the child
                    and CFT meetings. The placement shall be reviewed at least
                    every 6 months in cooperations with CFT meetings.
                  </li>
                  <li>
                    Assist the child in his use of foster care services
                    including mental health services.
                  </li>
                  <li>
                    Assist in the maintenance of the child's constructive
                    relationships with parents and other family members.
                  </li>
                  <li>
                    Provide procedures for grievances of resource parents.
                  </li>
                  <li>
                    Contact the child and parents at least twice a month. If
                    case plan would indicate less frequent contacts, the parent
                    will be informed.
                  </li>
                  <li>
                    Inform resource parents if child has any tendencies toward
                    dangerous behavior.
                  </li>
                  <li>
                    Provide Medi-Cal card or other medical coverage at time of
                    placement.
                  </li>
                  <li>
                    As provided by placing agency, provide clothing allowance as
                    permitted to meet initial clothing needs.
                  </li>
                  <li>
                    In cooperation with resource parents, assure that foster
                    child will be available and transported to visits with
                    natural family members and other service appointments.
                  </li>
                  <li>
                    To participate in a Child Family Team and other required
                    services.
                  </li>
                  <li>
                    To provide access to core services including education,
                    medical, behavioral, social activities, and mental health
                    services as necessary.
                  </li>
                  <li>
                    Provide assistance with emergencies. Telephone number for
                    after-hours or weekends is:
                  </li>
                </ol>
                <div
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    fontSize: "8px",
                  }}
                >
                  <strong>661-808-9895</strong>
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
                  <li>
                    Provide this child the nurture, care clothing and training
                    suited to his needs.
                  </li>
                  <li>
                    Develop an understanding of responsibilities, objectives,
                    and requirements of the Agency in regard to the care of this
                    child.
                  </li>
                  <li>
                    Recognize the Agency's responsibility for planning for this
                    child, as given by the court or the parent(s) and the Child
                    Family Team (CFT) Plan.
                  </li>
                  <li>
                    Recognize any limitations of consent imposed by the court or
                    the placing agency.
                  </li>
                  <li>
                    Increase their knowledge and ability to care for this child
                    and cooperate with plan.
                  </li>
                  <li>
                    Encourage the child's relationships with his parents, and
                    relatives.
                  </li>
                  <li>
                    Cooperate in visiting arrangements between child and
                    parents.
                  </li>
                  <li>
                    Not use corporal punishment, punishment in the presence of
                    others, deprivation of meals, monetary allowances, visit
                    from parent, home visits, threat of removal or any type of
                    degrading or humiliating punishment, and to use constructive
                    alternative methods of discipline.
                  </li>
                  <li>
                    Respect and keep confidential information given about the
                    child and his family.
                  </li>
                  <li>
                    Immediately notify agency of significant changes in this
                    child's health, behavior, or location.
                  </li>
                  <li>
                    Accept the child's special problems as given above in my
                    provision of care.
                  </li>
                  <li>
                    Help with termination of placement including return to the
                    county placing agency.
                  </li>
                  <li>
                    Give the agency prior notice of at least 7 days if removal
                    of child is requested unless it is agreed upon with the
                    agency that less time is acceptable.
                  </li>
                  <li>
                    Conform to the interim licensing standards requirements.
                  </li>
                  <li>
                    Provide state and county agencies access to documentation
                    when documentation is maintained on children in their care.
                  </li>
                  <li>
                    Give advance written notice to the licensing agency and the
                    person or agency responsible for the child of any
                    (parent(s)) absence of 24 hours or longer. (Absences may be
                    reported by telephone in case of emergencies.)
                  </li>
                  <li>
                    Notify the agency immediately if an application is made on
                    behalf of this child for any kind of income. Examples of
                    income include, but are not limited to, child support
                    payments, Veterans Benefits, Railroad Retirement, Social
                    Security, RSHDI, and supplemental Security Income/State
                    Supplemental Program (SSI/SSP).
                  </li>
                  <li>
                    Remit to Department of Public Services any income received
                    on behalf of this child while in foster care up to the full
                    cost of board and care plus medical cost. In addition, I
                    will cooperate to have the Social Security Administration,
                    or the appropriate agency, make the Department of Public
                    Social Services the payee for any funds received on behalf
                    of this child.
                  </li>
                  <li>
                    To participate in required Child Family Team meetings.
                  </li>
                  <li>
                    To provide Culturally Relevant and Trauma Informed care.
                  </li>
                  <li>
                    By signing this agreement I agree that I am not in the
                    process of moving to another agency. I also agree that I
                    will not accept any new placements within 60 days of moving
                    to another agency.
                  </li>
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Agreement statement */}
      <div>
        <p style={{ margin: "5px 0", fontSize: "9px" }}>
          I have read the foregoing and agree to conform to these requirements.
          The terms of the agreement shall remain in force until changed by
          mutual agreement in writing of both parties or this child is removed
          from the agency.
        </p>
      </div>

      {/* Signature section - Add page break control to keep signatures together */}
      <div
        style={{
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {renderSignatureArea("", "childPlacementWorkerSignature")}
              </td>
              <td style={{ width: "10%" }}></td>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {renderSignatureArea("", "resourceMotherSignature")}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px" }}>
                Signature of Child Placement Worker
              </td>
              <td></td>
              <td style={{ fontSize: "9px" }}>Signature of Resource Mother</td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px" }}>
                <strong>Title:</strong>{" "}
                {data?.childPlacementWorkerTitle ||
                  data?.countyWorkerTitle ||
                  "CSW"}
              </td>
              <td></td>
              <td style={{ verticalAlign: "top" }}>
                {renderSignatureArea("", "resourceFatherSignature")}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px" }}>
                <strong>Name of Agency:</strong>{" "}
                {data?.agencyName || "Pathway Family Services, Inc."}
              </td>
              <td></td>
              <td style={{ fontSize: "9px" }}>Signature of Resource Father</td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px" }}>
                <strong>Address:</strong>{" "}
                {data?.agencyAddress ||
                  "P.O. Box 888   Bakersfield,  Ca    93302"}
              </td>
              <td></td>
              <td style={{ fontSize: "9px" }}>
                <strong>Address:</strong> {data?.fosterParentsAddress || ""}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px" }}></td>
              <td style={{ fontSize: "9px" }}></td>
              <td style={{ fontSize: "9px" }}>
                {data?.fosterParentsCity || ""},{" "}
                {data?.fosterParentsState || "California"}{" "}
                {data?.fosterParentsZip || ""}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "9px" }}>
                <strong>Phone Number:</strong>{" "}
                {data?.agencyPhone || "(805) 739-1111"}
              </td>
              <td style={{ fontSize: "9px" }}>
                <strong>Date:</strong>{" "}
                {formatDate(data?.signatureDate || data?.transactionDate) || ""}
              </td>
              <td style={{ fontSize: "9px" }}>
                <strong>Phone Number:</strong>{" "}
                {data?.fosterParentsTelephone || ""}
              </td>
              <td style={{ fontSize: "9px" }}>
                <strong>Date:</strong>{" "}
                {formatDate(data?.signatureDate || data?.transactionDate) || ""}
              </td>
            </tr>
          </tbody>
        </table>
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
          Child Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("parentSignature")}>
          Parent/Guardian Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("caseworkerSignature")}>
          Caseworker Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("supervisorSignature")}>
          Supervisor Signature
        </MenuItem>
        <MenuItem onClick={() => handleSignatureSelect("agencyRepSignature")}>
          Agency Representative Signature
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AgencyToFosterParent;
