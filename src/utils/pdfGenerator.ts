
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

// Enhanced email functionality with AMP HTML and proper URL encoding
export const createMailtoLink = (email: string, subject: string, body: string) => {
  // Properly encode parameters for mailto URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};

// Create an AMP HTML email body with fallback text
export const createAmpEmailBody = (cvName: string, personalInfo: any, url: string) => {
  // Plain text fallback for email clients that don't support HTML
  const plainTextFallback = `
Hello,

Please find my CV from VitaHub below:
${url}

Best regards,
${personalInfo.name}
${personalInfo.email}
${personalInfo.phone}
`;

  // AMP HTML email template
  const ampHtml = `
<!doctype html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <style amp4email-boilerplate>body{visibility:hidden}</style>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp-custom>
    .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
    .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { padding: 20px; background-color: white; border-left: 1px solid #e9ecef; border-right: 1px solid #e9ecef; }
    .footer { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; text-align: center; border: 1px solid #e9ecef; }
    .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; font-weight: bold; }
    .contact-info { margin-top: 20px; font-size: 14px; color: #6c757d; }
    .highlight { color: #007bff; font-weight: bold; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Professional CV from VitaHub</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>I'm excited to share my professional CV with you. It showcases my experience, skills, and qualifications:</p>
      <p><span class="highlight">${personalInfo.name}</span> - ${personalInfo.title}</p>
      <p>${personalInfo.bio}</p>
      <p>Please click the button below to view my complete CV:</p>
      <a href="${url}" class="button">View My CV</a>
      <div class="contact-info">
        <p>If you have any questions, feel free to contact me:</p>
        <p>Email: ${personalInfo.email}</p>
        <p>Phone: ${personalInfo.phone}</p>
        <p>Location: ${personalInfo.location}</p>
      </div>
    </div>
    <div class="footer">
      <p>This CV was created using VitaHub - The professional CV platform</p>
      <p>© ${new Date().getFullYear()} VitaHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  return { plainTextFallback, ampHtml };
};
