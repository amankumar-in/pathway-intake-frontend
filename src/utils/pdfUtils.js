// Replace your entire frontend/src/utils/pdfUtils.js with this file

import React from "react";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js"; // Keep for fallback

// Configuration - change this to match your backend API
// For standalone service:
// const PDF_SERVICE_URL = "http://localhost:3001/api/generate-pdf";
// const MULTI_PDF_SERVICE_URL = "http://localhost:3001/api/generate-multiple-pdf";

// For integrated backend:
const PDF_SERVICE_URL =
  process.env.NODE_ENV === "production"
    ? "https://pathway-intake-backend.onrender.com/api/v1/pdf/generate"
    : "http://localhost:5000/api/v1/pdf/generate";
const MULTI_PDF_SERVICE_URL =
  process.env.NODE_ENV === "production"
    ? "https://pathway-intake-backend.onrender.com/api/v1/pdf/generate-multiple"
    : "http://localhost:5000/api/v1/pdf/generate-multiple";

// Flag to control whether to use server-side PDF generation
// If false, will fall back to client-side generation (images)
const USE_SERVER_PDF = true;

/**
 * Generate a PDF from an HTML element
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {string} filename - The name of the output PDF file
 * @returns {Promise} - Promise that resolves when PDF is generated
 */
export const generatePDF = async (element, filename = "document.pdf") => {
  try {
    if (!element) {
      throw new Error("No element provided for PDF generation");
    }

    if (USE_SERVER_PDF) {
      return await generateServerPDF(element, filename);
    } else {
      return await generateClientPDF(element, filename);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

/**
 * Generate a PDF using the server-side API
 */
async function generateServerPDF(element, filename) {
  try {
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true);

    // Clean up any UI control elements
    const controlsToRemove = clone.querySelectorAll(
      ".delete-button, .signature-placeholder, .no-print"
    );
    controlsToRemove.forEach((el) => el.remove());

    // Get the HTML content
    const htmlContent = clone.outerHTML;

    // Add required styles and wrapper for proper rendering
    const completeHtml = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: white;
              color: black;
            }
            /* Add any global styles needed for PDF rendering */
            .document-container {
              padding: 20px;
              width: 8.27in;
              margin: 0 auto;
              background: white;
            }
            /* Make sure all styles get applied properly */
            * {
              box-sizing: border-box;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          </style>
        </head>
        <body>
          <div class="document-container">
            ${htmlContent}
          </div>
        </body>
      </html>
    `;

    // Call the server-side PDF generation service
    const response = await fetch(PDF_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if using integrated backend
      },
      body: JSON.stringify({
        html: completeHtml,
        filename,
      }),
    });

    if (!response.ok) {
      let errorMessage = "PDF generation failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If it's not JSON, just use the status text
        errorMessage = `PDF generation failed: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Get PDF blob from response
    const pdfBlob = await response.blob();

    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error generating server PDF:", error);
    throw error;
  }
}

/**
 * Generate a PDF on the client-side (fallback method)
 * This creates image-based PDFs that are larger in size
 */
async function generateClientPDF(element, filename) {
  try {
    // Add PDF export flag
    document.body.setAttribute("data-pdf-export", "true");

    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true);

    // Remove any elements we don't want in the PDF
    const noPrintElements = clone.querySelectorAll(
      ".no-print, .delete-button, .signature-placeholder"
    );
    noPrintElements.forEach((el) => el.remove());

    // Add CSS for better page break handling
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, dl, table {
          page-break-inside: avoid;
        }
        .MuiDivider-root, hr {
          page-break-after: auto !important;
          page-break-before: auto !important;
        }
        div {
          page-break-inside: auto;
        }
        .page-break-avoid {
          page-break-inside: avoid;
        }
      }
    `;
    clone.prepend(style);

    // Configure html2pdf with optimal settings
    const options = {
      margin: 5,
      filename: filename,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        foreignObjectRendering: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        precision: 16,
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        before: ".page-break-before",
        after: ".page-break-after",
        avoid:
          ".page-break-avoid, p, h1, h2, h3, h4, h5, h6, img, table, ul, ol",
      },
    };

    // Add attribute for better text handling
    clone.setAttribute("data-html2canvas-preserve-text", true);

    // Generate the PDF
    await html2pdf().from(clone).set(options).save();

    // Clean up
    document.body.removeAttribute("data-pdf-export");
    return true;
  } catch (error) {
    console.error("Error generating client PDF:", error);
    document.body.removeAttribute("data-pdf-export");
    throw error;
  }
}

/**
 * Generate a PDF blob from an HTML element
 */
export const generatePDFBlob = async (element) => {
  try {
    if (!element) {
      throw new Error("No element provided for PDF generation");
    }

    if (USE_SERVER_PDF) {
      return await generateServerPDFBlob(element);
    } else {
      return await generateClientPDFBlob(element);
    }
  } catch (error) {
    console.error("Error generating PDF blob:", error);
    throw error;
  }
};

/**
 * Generate a PDF blob using the server-side API
 */
async function generateServerPDFBlob(element) {
  try {
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true);

    // Clean up any UI control elements
    const controlsToRemove = clone.querySelectorAll(
      ".delete-button, .signature-placeholder, .no-print"
    );
    controlsToRemove.forEach((el) => el.remove());

    // Get the HTML content
    const htmlContent = clone.outerHTML;

    // Add required styles and wrapper for proper rendering
    const completeHtml = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: white;
              color: black;
            }
            /* Add any global styles needed for PDF rendering */
            .document-container {
              padding: 20px;
              width: 8.27in;
              margin: 0 auto;
              background: white;
            }
            /* Make sure all styles get applied properly */
            * {
              box-sizing: border-box;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          </style>
        </head>
        <body>
          <div class="document-container">
            ${htmlContent}
          </div>
        </body>
      </html>
    `;

    // Call the server-side PDF generation service
    const response = await fetch(PDF_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if using integrated backend
      },
      body: JSON.stringify({
        html: completeHtml,
        filename: "document.pdf",
      }),
    });

    if (!response.ok) {
      let errorMessage = "PDF generation failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If it's not JSON, just use the status text
        errorMessage = `PDF generation failed: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Return the PDF blob
    return await response.blob();
  } catch (error) {
    console.error("Error generating server PDF blob:", error);
    throw error;
  }
}

/**
 * Generate a PDF blob on the client-side (fallback method)
 */
async function generateClientPDFBlob(element) {
  try {
    // Add PDF export flag
    document.body.setAttribute("data-pdf-export", "true");

    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true);

    // Remove any elements we don't want in the PDF
    const noPrintElements = clone.querySelectorAll(
      ".no-print, .delete-button, .signature-placeholder"
    );
    noPrintElements.forEach((el) => el.remove());

    // Add CSS for better page break handling
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, dl, table {
          page-break-inside: avoid;
        }
        .MuiDivider-root, hr {
          page-break-after: auto !important;
          page-break-before: auto !important;
        }
        div {
          page-break-inside: auto;
        }
        .page-break-avoid {
          page-break-inside: avoid;
        }
      }
    `;
    clone.prepend(style);

    // Configure html2pdf with optimal settings
    const options = {
      margin: 5,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        foreignObjectRendering: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        precision: 16,
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        before: ".page-break-before",
        after: ".page-break-after",
        avoid:
          ".page-break-avoid, p, h1, h2, h3, h4, h5, h6, img, table, ul, ol",
      },
    };

    // Add attribute for better text handling
    clone.setAttribute("data-html2canvas-preserve-text", true);

    // Generate the PDF blob
    const blob = await html2pdf().from(clone).set(options).outputPdf("blob");

    // Clean up
    document.body.removeAttribute("data-pdf-export");

    return blob;
  } catch (error) {
    console.error("Error generating client PDF blob:", error);
    document.body.removeAttribute("data-pdf-export");
    throw error;
  }
}

/**
 * Create a temporary DOM element for a document ready for PDF export
 */
export const createDocumentElement = (doc, getDocumentComponent) => {
  // Get document data
  const formData = doc.formData || {};
  const signatures = doc.signatures || {};

  // Get the React component for the document with signatures
  const documentComponent = React.cloneElement(
    getDocumentComponent(formData.template, formData),
    { signatures }
  );

  // Convert to HTML
  const html = ReactDOMServer.renderToStaticMarkup(documentComponent);

  // Create a container with specific PDF-friendly styles
  const container = document.createElement("div");
  container.className = "document-container";

  // Add special styles for better PDF text handling
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "12pt";
  container.style.lineHeight = "1.5";
  container.style.color = "#000000";

  // These attributes can help pdf generators preserve text
  container.setAttribute("data-html2canvas-preserve-text", "true");
  container.setAttribute("data-pdf-preserve-text", "true");

  container.innerHTML = html;

  return container;
};

/**
 * Generate a PDF with multiple documents
 */
export const generateMultiplePDF = async (
  documents,
  getDocumentComponent,
  filename = "documents.pdf"
) => {
  try {
    if (!documents || documents.length === 0) {
      throw new Error("No documents provided for PDF generation");
    }

    if (USE_SERVER_PDF) {
      return await generateServerMultiplePDF(
        documents,
        getDocumentComponent,
        filename
      );
    } else {
      return await generateClientMultiplePDF(
        documents,
        getDocumentComponent,
        filename
      );
    }
  } catch (error) {
    console.error("Error generating multiple PDFs:", error);
    throw error;
  }
};

/**
 * Generate a PDF with multiple documents using server-side rendering
 */
async function generateServerMultiplePDF(
  documents,
  getDocumentComponent,
  filename
) {
  try {
    // Create HTML content for each document
    const htmlDocuments = documents.map((doc) => {
      // Get document data
      const formData = doc.formData || {};
      const signatures = doc.signatures || {};

      // Get the React component
      const documentComponent = React.cloneElement(
        getDocumentComponent(formData.template, formData),
        { signatures }
      );

      // Convert to HTML string
      const html = ReactDOMServer.renderToString(documentComponent);

      // Return complete HTML document
      return `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
              }
              /* Add any global styles needed for PDF rendering */
              .document-container {
                padding: 20px;
                width: 8.27in;
                margin: 0 auto;
                background: white;
              }
              /* Make sure all styles get applied properly */
              * {
                box-sizing: border-box;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            <div class="document-container">
              ${html}
            </div>
          </body>
        </html>
      `;
    });

    // Call the server-side PDF generation service
    const response = await fetch(MULTI_PDF_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if using integrated backend
      },
      body: JSON.stringify({
        htmlDocuments,
        filename,
      }),
    });

    if (!response.ok) {
      let errorMessage = "PDF generation failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If it's not JSON, just use the status text
        errorMessage = `PDF generation failed: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Get PDF blob from response
    const pdfBlob = await response.blob();

    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error generating server multiple PDFs:", error);
    throw error;
  }
}

/**
 * Generate a PDF with multiple documents on the client-side (fallback method)
 */
async function generateClientMultiplePDF(
  documents,
  getDocumentComponent,
  filename
) {
  try {
    if (!documents || documents.length === 0) {
      throw new Error("No documents provided for PDF generation");
    }

    // Create a container for all documents
    const container = document.createElement("div");

    // Process each document
    documents.forEach((doc, index) => {
      // Create document element
      const docElement = createDocumentElement(doc, getDocumentComponent);

      // Add page break after (except last one)
      if (index < documents.length - 1) {
        const pageBreak = document.createElement("div");
        pageBreak.style.pageBreakAfter = "always";
        docElement.appendChild(pageBreak);
      }

      // Add to container
      container.appendChild(docElement);
    });

    // Create temporary container in the DOM
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Generate PDF
    await generateClientPDF(container, filename);

    // Clean up
    document.body.removeChild(container);

    return true;
  } catch (error) {
    console.error("Error generating client multiple PDFs:", error);
    throw error;
  }
}

/**
 * Generate a PDF with multiple HTML elements
 */
export const generateMultiElementsPDF = async (
  htmlElements,
  filename = "documents.pdf"
) => {
  try {
    if (!htmlElements || htmlElements.length === 0) {
      throw new Error("No elements provided for PDF generation");
    }

    if (USE_SERVER_PDF) {
      return await generateServerMultiElementsPDF(htmlElements, filename);
    } else {
      return await generateClientMultiElementsPDF(htmlElements, filename);
    }
  } catch (error) {
    console.error("Error generating multi-element PDF:", error);
    throw error;
  }
};

/**
 * Generate a PDF with multiple HTML elements using server-side rendering
 */
async function generateServerMultiElementsPDF(htmlElements, filename) {
  try {
    // Create HTML content for each element
    const htmlDocuments = htmlElements.map((element) => {
      // Clone the element to avoid modifying the original
      const clone = element.cloneNode(true);

      // Clean up any UI control elements
      const controlsToRemove = clone.querySelectorAll(
        ".delete-button, .signature-placeholder, .no-print"
      );
      controlsToRemove.forEach((el) => el.remove());

      // Get the HTML content
      const html = clone.outerHTML;

      // Return complete HTML document
      return `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
              }
              /* Add any global styles needed for PDF rendering */
              .document-container {
                padding: 20px;
                width: 8.27in;
                margin: 0 auto;
                background: white;
              }
              /* Make sure all styles get applied properly */
              * {
                box-sizing: border-box;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            <div class="document-container">
              ${html}
            </div>
          </body>
        </html>
      `;
    });

    // Call the server-side PDF generation service
    const response = await fetch(MULTI_PDF_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if using integrated backend
      },
      body: JSON.stringify({
        htmlDocuments,
        filename,
      }),
    });

    if (!response.ok) {
      let errorMessage = "PDF generation failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If it's not JSON, just use the status text
        errorMessage = `PDF generation failed: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Get PDF blob from response
    const pdfBlob = await response.blob();

    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error generating server multi-element PDF:", error);
    throw error;
  }
}

/**
 * Generate a PDF with multiple HTML elements on the client-side (fallback method)
 */
async function generateClientMultiElementsPDF(htmlElements, filename) {
  try {
    if (!htmlElements || htmlElements.length === 0) {
      throw new Error("No elements provided for PDF generation");
    }

    // Create a container for all elements with page breaks
    const container = document.createElement("div");
    container.setAttribute("data-html2canvas-preserve-text", "true");

    // Add each element with proper page breaks
    htmlElements.forEach((element, index) => {
      const wrapper = document.createElement("div");
      wrapper.style.pageBreakBefore = "always";
      wrapper.style.pageBreakAfter = "always";
      wrapper.style.backgroundColor = "white";
      wrapper.style.padding = "20px";
      wrapper.style.margin = "0";

      // Clone the element into the wrapper
      const clone = element.cloneNode(true);
      wrapper.appendChild(clone);
      container.appendChild(wrapper);
    });

    // Add to document temporarily
    document.body.appendChild(container);

    // Generate PDF with all elements
    await generateClientPDF(container, filename);

    // Clean up
    document.body.removeChild(container);

    return true;
  } catch (error) {
    console.error("Error generating client multi-element PDF:", error);
    throw error;
  }
}
