// Default signature labels
export const DEFAULT_SIGNATURE_LABELS = {
  childSignature: "Foster Child",
  parentSignature: "Resource Mother",
  caseworkerSignature: "Resource Father",
  supervisorSignature: "Pathway Social Worker",
  agencyRepSignature: "County Social Worker",
};

// Get signature label with fallback to default
export const getSignatureLabel = (signatureType, customLabels = {}) => {
  return customLabels[signatureType] || DEFAULT_SIGNATURE_LABELS[signatureType] || signatureType;
};

// Get all signature labels merged with custom labels
export const getAllSignatureLabels = (customLabels = {}) => {
  return {
    ...DEFAULT_SIGNATURE_LABELS,
    ...customLabels,
  };
};
