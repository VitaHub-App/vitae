
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

  // Modern AMP HTML email template
  const ampHtml = `
<!doctype html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <style amp4email-boilerplate>body{visibility:hidden}</style>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp-custom>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
    .header { background-color: #3b82f6; padding: 30px 20px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 30px 25px; background-color: white; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #1f2937; font-size: 18px; margin-top: 0; margin-bottom: 15px; font-weight: 600; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; background-color: #dbeafe; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 30px; color: #3b82f6; }
    .profile-name { font-size: 20px; font-weight: 600; margin: 10px 0 5px; color: #111827; }
    .profile-title { font-size: 16px; color: #6b7280; margin: 0 0 10px; }
    .profile-bio { font-size: 14px; color: #4b5563; margin-bottom: 20px; line-height: 1.6; }
    .highlight { color: #3b82f6; font-weight: 600; }
    .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 10px; text-align: center; }
    .button:hover { background-color: #2563eb; }
    .contact-info { margin-top: 25px; background-color: #f3f4f6; padding: 15px; border-radius: 6px; }
    .contact-item { font-size: 14px; color: #4b5563; margin-bottom: 5px; }
    .contact-item strong { color: #374151; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    .social-links { display: flex; justify-content: center; gap: 15px; margin-top: 15px; }
    .social-link { display: inline-block; width: 32px; height: 32px; background-color: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #4b5563; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>${personalInfo.name}'s CV from VitaHub</h1>
    </div>
    <div class="content">
      <div class="section" style="text-align: center;">
        <div class="avatar">${personalInfo.name.charAt(0)}</div>
        <div class="profile-name">${personalInfo.name}</div>
        <div class="profile-title">${personalInfo.title}</div>
      </div>
      
      <div class="section">
        <p>Hello,</p>
        <p>I'm excited to share my professional CV with you. It provides a comprehensive overview of my skills, experience, and qualifications.</p>
        <p class="profile-bio">${personalInfo.bio}</p>
        <p>You can view my complete CV by clicking the button below:</p>
        <div style="text-align: center;">
          <a href="${url}" class="button">View My CV</a>
        </div>
      </div>
      
      <div class="contact-info">
        <div class="contact-item"><strong>Email:</strong> ${personalInfo.email}</div>
        <div class="contact-item"><strong>Phone:</strong> ${personalInfo.phone}</div>
        <div class="contact-item"><strong>Location:</strong> ${personalInfo.location}</div>
        ${personalInfo.website ? `<div class="contact-item"><strong>Website:</strong> ${personalInfo.website}</div>` : ''}
      </div>
    </div>
    
    <div class="footer">
      <p>This CV was created using <a href="https://vitahub.app" target="_blank" rel="noopener noreferrer">VitaHub</a></p>
      <p>The professional CV platform</p>
      <p>© ${new Date().getFullYear()} VitaHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  return { plainTextFallback, ampHtml };
};
