import html2pdf from "html2pdf.js";
import React from "react";
import ReactDOMServer from "react-dom/server";

// PDF generation options - optimize for text preservation

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

    // Add CSS for better page break handling (same as in generatePDFBlob)
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
    element.prepend(style);

    // Configure html2pdf with optimal settings for text preservation
    const options = {
      margin: 5, // Add margin to prevent content touching edges
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
        mode: ["avoid-all", "css", "legacy"], // Use all available page break methods
        before: ".page-break-before",
        after: ".page-break-after",
        avoid:
          ".page-break-avoid, p, h1, h2, h3, h4, h5, h6, img, table, ul, ol",
      },
    };

    // Add an attribute to trigger better text handling
    element.setAttribute("data-html2canvas-preserve-text", true);

    // Generate the PDF with better text handling
    return html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.setProperties({
          title: filename.replace(".pdf", ""),
          subject: "Document Export",
          creator: "Pathway Foster Agency",
        });
        return pdf.save(filename);
      });
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

export const generateMultiElementsPDF = async (
  htmlElements,
  filename = "documents.pdf"
) => {
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
    await generatePDF(container, filename);

    // Clean up
    document.body.removeChild(container);

    return true;
  } catch (error) {
    console.error("Error generating multi-element PDF:", error);
    throw error;
  }
};

export const generatePDFBlob = async (element) => {
  try {
    if (!element) {
      throw new Error("No element provided for PDF generation");
    }

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
    element.prepend(style);

    // Configure html2pdf with improved page break handling
    const options = {
      margin: 5, // Add margin to prevent content touching edges
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
        mode: ["avoid-all", "css", "legacy"], // Use all available page break methods
        before: ".page-break-before",
        after: ".page-break-after",
        avoid:
          ".page-break-avoid, p, h1, h2, h3, h4, h5, h6, img, table, ul, ol",
      },
    };

    // Add attributes for better text handling
    element.setAttribute("data-html2canvas-preserve-text", true);

    // Generate the PDF blob
    return html2pdf().from(element).set(options).outputPdf("blob");
  } catch (error) {
    console.error("Error generating PDF blob:", error);
    throw error;
  }
};

/**
 * Create a temporary DOM element for a document ready for PDF export
 * @param {Object} doc - Document object with formData and signatures
 * @param {Function} getDocumentComponent - Function to get document component
 * @returns {HTMLElement} - DOM element ready for PDF export
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
 * @param {Array} documents - Array of document objects
 * @param {Function} getDocumentComponent - Function to get document component
 * @param {string} filename - The name of the output PDF file
 * @returns {Promise} - Promise that resolves when PDF is generated
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
    await generatePDF(container, filename);

    // Clean up
    document.body.removeChild(container);

    return true;
  } catch (error) {
    console.error("Error generating multiple PDFs:", error);
    throw error;
  }
};
