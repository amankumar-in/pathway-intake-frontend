// Document copies configuration
export const documentCopiesConfig = {
  "Intake Paperwork": {
    "Notice of Action": 3,
    "ID-Emergency Information": 1,
    "Agency to Agency Agreement": 2,
    "Agency to Foster Parent": 3,
    "Client Grievance Guidelines": 2,
    "County Worker Grievance Guidelines": 2,
    "Consent For Medical Treatment": 2,
    "CHDP Form": 1,
    "PRN Authorization Letter": 1,
    "PRN Page 2": 1,
    "Client Personal Rights": 3,
    "Confirmation of T.B. Test": 1,
    "Confirmation of Ambulatory Status": 1,
    "Record of Client Cash Resources": 2,
    "Client Initial Care Plan": 2,
    "Client Disciplinary Policy & Procedures": 2,
    "Client Discharge": 2,
    "Acknowledgement of Prior Information": 3,
    "Home Placement Log": 1,
    "Monthly Medication Record": 2,
    "Medication & Destruction Record": 2,
    "Dental Treatment Record": 1,
    "Quarterly Clothing Allowance": 1,
    "Quarterly Spending Allowance": 2,
    "Consent to Release Medical/Confidential Information Authorization": 2,
    "Placement Application": 1,
    "Foster Parent Checklist": 1,
    default: 1,
  },
  "Shelter Bed Documents": {
    "Agency to Agency Agreement": 2,
    "Agency to Foster Parent": 2,
    "ID-Emergency Information": 1,
    "Client Grievance Guidelines": 1,
    "County Worker Grievance Guidelines": 1,
    "Consent For Medical Treatment": 1,
    "Client Personal Rights": 1,
    "Client Initial Care Plan": 2,
    "Client Disciplinary Policy & Procedures": 1,
    "Client Discharge": 1,
    "Acknowledgement of Prior Information": 2,
    "Consent to Release Medical/Confidential Information Authorization": 1,
    "Placement Application": 1,
    default: 2,
  },
  "In House Move": {
    "Agency to Foster Parent": 2,
    "Consent For Medical Treatment": 1,
    "Record of Client Cash Resources": 1,
    "Client Initial Care Plan": 1,
    "Acknowledgement of Prior Information": 2,
    "Home Placement Log": 1,
    "Emergency Information Log": 1,
    "Quarterly Clothing Allowance": 2,
    "Quarterly Spending Allowance": 2,
    default: 1,
  },
  default: 1,
};

// Function to get the number of copies needed for a document
export const getDocumentCopies = (document, activeCategory) => {
  // If "All Documents" tab is selected, always return 1 copy
  if (activeCategory === "All Documents") {
    return 1;
  }

  // For other tabs, use the selected category
  const category = activeCategory;

  // Check if we have a configuration for this category
  if (documentCopiesConfig[category]) {
    // Check if this specific document title has a configured copy count
    if (documentCopiesConfig[category][document.title]) {
      return documentCopiesConfig[category][document.title];
    }
    // Return the default for this category
    return documentCopiesConfig[category].default;
  }

  // Default fallback if no configuration exists
  return documentCopiesConfig.default;
};
