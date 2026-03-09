import React from "react";
import { LOGO_BASE64 } from "../../constants/logo";

// EmergencyInformationLog component
const EmergencyInformationLog = ({ data }) => {
  // Format dates
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

  // Render a field with label and value
  const renderField = (label, value, width = "auto") => (
    <div style={{ marginBottom: "10px", width }}>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "9px",
          color: "#444",
        }}
      >
        {label}:
      </div>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          minHeight: "14px",
          fontSize: "10px",
          paddingTop: "2px",
          paddingBottom: "2px",
        }}
      >
        {value || ""}
      </div>
    </div>
  );

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
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
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
            fontSize: "14px",
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
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          Client Emergency Contact Information
        </h3>
      </div>

      {/* Main content */}
      <div style={{ margin: "0 auto", maxWidth: "7.5in" }}>
        {/* Client Basic Information */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            {renderField("NAME", data?.name)}
            {renderField("CSW", data?.countyWorkerName)}
            {renderField("COUNTY", data?.nameOfCounty)}
            {renderField("CASE #", data?.caseNumber)}
          </div>
          <div>
            {renderField("D.O.B.", formatDate(data?.dateOfBirth))}
            {renderField("D.O.I.", formatDate(data?.transactionDate))}
            {renderField("STATUS", data?.clientStatus)}
            <div style={{ display: "flex", gap: "10px" }}>
              {renderField("SS#", data?.ssn, "50%")}
              {renderField("MEDI-CAL#", data?.mediCalNumber, "50%")}
            </div>
          </div>
        </div>

        {/* Physical Attributes */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {renderField("HEIGHT", data?.height, "100px")}
          {renderField("WEIGHT", data?.weight, "100px")}
          {renderField("HAIR", data?.hairColor, "100px")}
          {renderField("EYES", data?.eyeColor, "100px")}
        </div>

        {renderField("DISTINGUISHING MARKS", data?.distinguishingMarks)}

        {/* Emergency Contact */}
        <div
          style={{
            marginTop: "20px",
            marginBottom: "15px",
            fontWeight: "bold",
            fontSize: "11px",
            borderBottom: "1px solid #000",
          }}
        >
          IN CASE OF EMERGENCY NOTIFY:
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "15px",
          }}
        >
          <div>
            {renderField(
              "NAME",
              data?.emergencyContactName || data?.countyWorkerName
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  minHeight: "14px",
                  fontSize: "10px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                {data?.emergencyContactAddress ||
                  data?.countyWorkerAddress ||
                  ""}
              </div>
              <div
                style={{
                  minHeight: "14px",
                  fontSize: "10px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  display: "flex",
                }}
              >
                <span>
                  {data?.emergencyContactCity || data?.countyWorkerCity || ""}
                </span>
                {(data?.emergencyContactCity || data?.countyWorkerCity) &&
                  (data?.emergencyContactState || data?.countyWorkerState) && (
                    <span>, </span>
                  )}
                <span>
                  {data?.emergencyContactState || data?.countyWorkerState || ""}
                </span>
                {(data?.emergencyContactCity ||
                  data?.countyWorkerCity ||
                  data?.emergencyContactState ||
                  data?.countyWorkerState) &&
                  (data?.emergencyContactZip || data?.countyWorkerZip) && (
                    <span> </span>
                  )}
                <span>
                  {data?.emergencyContactZip || data?.countyWorkerZip || ""}
                </span>
              </div>
            </div>
          </div>
          <div>
            {renderField(
              "RELATIONSHIP",
              data?.emergencyContactRelationship || "CSW"
            )}
            {renderField(
              "PHONE #",
              data?.emergencyContactPhone || data?.countyWorkerTelephone
            )}
          </div>
        </div>

        {/* Additional Contacts Section */}
        <div
          style={{
            marginTop: "20px",
            marginBottom: "15px",
            fontWeight: "bold",
            fontSize: "11px",
            borderBottom: "1px solid #000",
          }}
        >
          Additional Contacts:
        </div>

        {/* Doctor */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "15px",
          }}
        >
          <div>{renderField("Doctor", data?.doctorName)}</div>
          <div>{renderField("PHONE #", data?.doctorPhone)}</div>
        </div>

        {/* School */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "15px",
          }}
        >
          <div>{renderField("School", data?.schoolName)}</div>
          <div>{renderField("PHONE #", data?.schoolPhone)}</div>
        </div>

        {/* Visitation Schedule */}
        <div style={{ marginBottom: "15px" }}>
          {renderField("Visitation Schedule", data?.visitationSchedule)}
        </div>

        {/* Visitor 1 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "15px",
          }}
        >
          <div>{renderField("Name", data?.visitorName1)}</div>
          <div>{renderField("PHONE #", data?.visitorPhone1)}</div>
        </div>

        {/* Visitor 2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "15px",
          }}
        >
          <div>{renderField("Name", data?.visitorName2)}</div>
          <div>{renderField("PHONE #", data?.visitorPhone2)}</div>
        </div>

        {/* Client Employer */}
        <div
          style={{
            marginTop: "20px",
            marginBottom: "15px",
            fontWeight: "bold",
            fontSize: "11px",
            borderBottom: "1px solid #000",
          }}
        >
          Client Employer:
        </div>

        {/* Employer Contact */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "15px",
          }}
        >
          <div>{renderField("Name", data?.employerName)}</div>
          <div>{renderField("PHONE #", data?.employerPhone)}</div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "30px",
          paddingTop: "10px",
          borderTop: "1px solid #eee",
          fontSize: "8px",
          color: "#777",
          textAlign: "center",
        }}
      >
        <p>
          This information should be kept confidential and made available to
          emergency personnel only when necessary.
        </p>
      </div>
    </div>
  );
};

export default EmergencyInformationLog;
