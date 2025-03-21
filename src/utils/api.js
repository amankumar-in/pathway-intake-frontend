import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/auth/users");
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/auth/users/${userId}`);
  return response.data;
};

// Intake Form API calls
export const getIntakeForms = async () => {
  const response = await api.get("/intake-forms");
  return response.data;
};

export const getIntakeForm = async (id) => {
  const response = await api.get(`/intake-forms/${id}`);
  return response.data;
};

export const createIntakeForm = async (formData) => {
  try {
    console.log("Sending form data to API:", formData);
    const response = await api.post("/intake-forms", formData);
    console.log("API response for createIntakeForm:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error in createIntakeForm:", error);

    // Enhanced error handling
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }

    throw error;
  }
};

export const updateIntakeForm = async (id, formData) => {
  const response = await api.put(`/intake-forms/${id}`, formData);
  return response.data;
};

export const deleteIntakeForm = async (id) => {
  const response = await api.delete(`/intake-forms/${id}`);
  return response.data;
};

export const updateSignature = async (id, signatureType, signatureData) => {
  try {
    const response = await api.put(`/intake-forms/${id}/signature`, {
      signatureType, // This name must match what backend expects
      signatureData, // This name must match what backend expects
    });
    return response.data;
  } catch (error) {
    console.error("Error updating signature:", error);
    throw error;
  }
};

// Document API calls
export const generateDocuments = async (intakeFormId) => {
  const response = await api.post(`/documents/generate/${intakeFormId}`);
  return response.data;
};

export const getDocumentsByIntakeForm = async (intakeFormId) => {
  const response = await api.get(`/documents/intake/${intakeFormId}`);
  return response.data;
};

export const getDocument = async (id) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

export const updateDocument = async (id, formData) => {
  const response = await api.put(`/documents/${id}`, { formData });
  return response.data;
};

export const updateDocumentSignature = async (
  id,
  documentArea, // Rename to better reflect it's the area in the document
  signatureData,
  position = { x: 0, y: 0 }
) => {
  try {
    console.log(`Adding signature to document ${id} in area ${documentArea}`);

    // Still send as signatureType because that's what the backend expects
    const response = await api.put(`/documents/${id}/signature`, {
      signatureType: documentArea, // Map document area to signatureType expected by backend
      signatureData,
      position,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding signature:", error);
    throw error;
  }
};

export const deleteDocumentSignature = async (id, signatureType) => {
  try {
    console.log(
      `Removing signature type '${signatureType}' from document ${id}`
    );

    const response = await api.delete(
      `/documents/${id}/signature/${signatureType}`
    );

    return response.data;
  } catch (error) {
    console.error("Error removing signature:", error);
    throw error;
  }
};

// Function to update just the form status
export const updateFormStatus = async (id, status) => {
  try {
    console.log(`Updating form ${id} status to: ${status}`);
    const response = await api.put(`/intake-forms/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating form status:", error);
    throw error;
  }
};

// Function to archive/unarchive a form
export const toggleFormArchive = async (id, archived) => {
  try {
    console.log(`${archived ? "Archiving" : "Unarchiving"} form ${id}`);
    const response = await api.put(`/intake-forms/${id}/archive`, { archived });
    return response.data;
  } catch (error) {
    console.error("Error toggling form archive status:", error);
    throw error;
  }
};

// Function to create a standalone document
export const createStandaloneDocument = async (documentData) => {
  try {
    console.log("Creating standalone document:", documentData);
    const response = await api.post("/documents/standalone", documentData);
    console.log("API response for createStandaloneDocument:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error in createStandaloneDocument:", error);

    // Enhanced error handling
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }

    throw error;
  }
};

// Function to get all standalone documents
export const getStandaloneDocuments = async () => {
  try {
    const response = await api.get("/documents/standalone");
    return response.data;
  } catch (error) {
    console.error("API error in getStandaloneDocuments:", error);

    // Enhanced error handling
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }

    throw error;
  }
};

// Function to add signatures to a standalone document
export const addStandaloneSignatures = async (id, signatures) => {
  try {
    console.log(`Adding signatures to standalone document ${id}`);
    const response = await api.post(`/documents/${id}/standalone-signatures`, {
      signatures,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding signatures to standalone document:", error);

    // Enhanced error handling
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }

    throw error;
  }
};

// Function to permanently delete a single form
export const permanentlyDeleteForm = async (id) => {
  try {
    const response = await api.delete(`/intake-forms/${id}/permanent`);
    return response.data;
  } catch (error) {
    console.error("Error permanently deleting form:", error);
    throw error;
  }
};

// Function to permanently delete a single document
export const permanentlyDeleteDocument = async (id) => {
  try {
    const response = await api.delete(`/documents/${id}/permanent`);
    return response.data;
  } catch (error) {
    console.error("Error permanently deleting document:", error);
    throw error;
  }
};

// Function to bulk delete forms
export const bulkDeleteForms = async (ids) => {
  try {
    const response = await api.post(`/intake-forms/bulk-delete`, { ids });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting forms:", error);
    throw error;
  }
};

// Function to bulk delete documents
export const bulkDeleteDocuments = async (ids) => {
  try {
    const response = await api.post(`/documents/bulk-delete`, { ids });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting documents:", error);
    throw error;
  }
};

export default api;
