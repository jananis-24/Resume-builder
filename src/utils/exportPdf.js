import html2pdf from 'html2pdf.js';

/**
 * Downloads the CV as a crisp, print-ready PDF using html2pdf.js
 * @param {HTMLElement} element - The DOM node representing the CV paper sheet
 * @param {string} filename - Filename for the downloaded PDF
 */
export async function downloadCvPdf(element, filename = 'Resume.pdf') {
  if (!element) {
    throw new Error('No preview element found for PDF generation');
  }

  // Configuration for A4 portrait document
  const opt = {
    margin: [0, 0, 0, 0],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2.2, // Crisp retina-quality rendering
      useCORS: true,
      letterRendering: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1024
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    // Generate and download
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Failed to generate PDF with html2pdf:', error);
    // Fallback: trigger print dialog if browser blocks canvas/PDF
    window.print();
    return false;
  }
}

/**
 * Triggers standard browser print dialog, optimized via @media print CSS
 */
export function printCv() {
  window.print();
}
