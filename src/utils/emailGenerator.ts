
// Email functionality with personalized recipient
export const createMailtoLink = (recipientName: string, email: string, subject: string, body: string) => {
  // Properly encode parameters for mailto URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  return `mailto:${recipientName} <${email}>?subject=${encodedSubject}&body=${encodedBody}`;
};

// Create an email body with fallback text
export const createEmailBody = (cvName: string, personalInfo: any, url: string, coverLetter?: string, recipientName?: string) => {
  // Plain text email with personalized greeting
  const plainTextBody = `
Hello${recipientName ? ` ${recipientName}` : ''},

${coverLetter ? `
${coverLetter}

` : ''}

Please find my CV from VitaHub below:
${url}

Best regards,
${personalInfo.name}
${personalInfo.email}
${personalInfo.phone}
`;

  return { plainTextBody };
};
