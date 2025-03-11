
import html2pdf from 'html2pdf.js';

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  const opt = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().from(element).set(opt).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const createMailtoLink = (email: string, subject: string, body: string) => {
  const params = new URLSearchParams();
  params.append('subject', subject);
  params.append('body', body);
  
  return `mailto:${email}?${params.toString()}`;
};
