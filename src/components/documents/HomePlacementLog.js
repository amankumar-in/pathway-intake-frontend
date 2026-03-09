import React from "react";
import { LOGO_BASE64 } from "../../constants/logo";

// HomePlacementLog component
const HomePlacementLog = ({ data }) => {
  // Create empty entries array with 25 rows if data.entries doesn't exist
  // or pad existing entries to ensure at least 25 rows
  const entries = Array.isArray(data?.entries)
    ? [
        ...data.entries,
        ...Array(Math.max(0, 25 - data.entries.length)).fill({}),
      ]
    : Array(25).fill({});

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
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          Home Placement Log
        </h3>
      </div>

      {/* Placement Log Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #000",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th
              style={{
                border: "1px solid #000",
                padding: "5px",
                fontWeight: "bold",
                textAlign: "center",
                width: "50%",
              }}
            >
              Name
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "5px",
                fontWeight: "bold",
                textAlign: "center",
                width: "25%",
              }}
            >
              D.O.I.
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "5px",
                fontWeight: "bold",
                textAlign: "center",
                width: "25%",
              }}
            >
              D.O.T.
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  height: "30px",
                  fontSize: "12px",
                }}
              >
                {entry?.name || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                {formatDate(entry?.dateOfIntake) || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                {formatDate(entry?.dateOfTermination) || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer section */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "8px",
          color: "#666",
          textAlign: "center",
        }}
      >
        <p>
          This log should be maintained for all placements in the home.
          <br />
          D.O.I. = Date of Intake, D.O.T. = Date of Termination
        </p>
      </div>
    </div>
  );
};

export default HomePlacementLog;
