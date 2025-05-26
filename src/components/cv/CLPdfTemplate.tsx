
import React from 'react';
import {
  CVData,
  PersonalInfo,
} from '@/types/cv';

const BackgroundPattern = () => (
  <svg 
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      opacity: 0.05
    }}
    viewBox="0 0 100 100" 
    preserveAspectRatio="none"
  >
    <path 
      d="M0 50 Q 25 25 50 50 T 100 50" 
      fill="none" 
      stroke="#2b3d5f" 
      strokeWidth="1"
    />
    <path 
      d="M0 30 Q 50 0 100 30 L 100 70 Q 50 100 0 70 Z" 
      fill="none" 
      stroke="#2b3d5f" 
      strokeWidth="0.5"
    />
  </svg>
);

interface CLPdfTemplateProps {
  cvData: CVData;
  personalInfo: PersonalInfo;
  coverLetter?: string;
}

const CLPdfTemplate: React.FC<CLPdfTemplateProps> = ({ 
  personalInfo,
  coverLetter
}) => {
  // Color scheme - same as CV template
  const colors = {
    primary: '#2b3d5f',     // Navy blue
    secondary: '#4a6da7',   // Medium blue
    accent: '#6c9bd2',      // Light blue
    text: '#333333',        // Dark gray
    lightText: '#666666',   // Medium gray
    background: '#f8f9fa'   // Light gray
  };

  // Get current date for the letter
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Split cover letter into paragraphs for better formatting
  const coverLetterParagraphs = coverLetter ? coverLetter.split('\n').filter(p => p.trim()) : [];

  return (
    <div className="cl-pdf-container" style={{ 
      position: 'relative',
      fontFamily: "'Lato', sans-serif",
      color: colors.text,
      lineHeight: 1.6,
      backgroundColor: 'white',
      minHeight: '100vh',
      padding: '0'
    }}>
      <BackgroundPattern />

      {/* Header section - similar to CV but simplified */}
      <header style={{ 
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 1,
        borderBottom: `2px solid ${colors.background}`,
        paddingBottom: '2rem'
      }}>
        {/* Name and contact info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem',
              fontWeight: 700,
              color: colors.primary,
              marginBottom: '0.5rem',
              lineHeight: 1.1
            }}>{personalInfo.name}</h1>
            <h2 style={{ 
              fontSize: '1.2rem',
              fontWeight: 400,
              color: colors.secondary,
              lineHeight: 1.2
            }}>{personalInfo.title}</h2>
          </div>

          {/* Contact details - vertical layout */}
          <div style={{
            textAlign: 'right',
            fontSize: '0.9rem',
            color: colors.lightText,
            lineHeight: 1.4
          }}>
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.website && <div>{personalInfo.website}</div>}
          </div>
        </div>

        {/* Date */}
        <div style={{
          textAlign: 'right',
          fontSize: '0.9rem',
          color: colors.lightText,
          marginTop: '1rem'
        }}>
          {currentDate}
        </div>
      </header>

      {/* Cover Letter Content */}
      <main style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '100%'
      }}>
        {/* Greeting */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <p style={{
            fontSize: '1rem',
            color: colors.text,
            margin: 0
          }}>
            Dear Hiring Manager,
          </p>
        </div>

        {/* Cover letter body */}
        <div style={{
          marginBottom: '2.5rem'
        }}>
          {coverLetterParagraphs.length > 0 ? (
            coverLetterParagraphs.map((paragraph, index) => (
              <p key={index} style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: colors.text,
                marginBottom: '1.5rem',
                textAlign: 'justify'
              }}>
                {paragraph.trim()}
              </p>
            ))
          ) : (
            <p style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: colors.text,
              marginBottom: '1.5rem',
              textAlign: 'justify'
            }}>
              I am writing to express my strong interest in the position at your company. 
              With my background in {personalInfo.title?.toLowerCase() || 'technology'} and proven track record 
              of delivering high-quality results, I am confident that I would be a valuable addition to your team.
            </p>
          )}
        </div>

        {/* Closing */}
        <div style={{
          marginBottom: '3rem'
        }}>
          <p style={{
            fontSize: '1rem',
            color: colors.text,
            marginBottom: '3rem'
          }}>
            Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience can contribute to your team's success.
          </p>
          
          <p style={{
            fontSize: '1rem',
            color: colors.text,
            marginBottom: '1rem'
          }}>
            Sincerely,
          </p>
          
          <p style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: colors.primary
          }}>
            {personalInfo.name}
          </p>
        </div>
      </main>
    </div>
  );
};

export default CLPdfTemplate;
