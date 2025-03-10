
import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useLoadCV } from '@/hooks/useLoadCV';
import CVHeader from '@/components/cv/CVHeader';
import PersonalInfoCard from '@/components/cv/PersonalInfoCard';
import CVSections from '@/components/cv/CVSections';
import CVFooter from '@/components/cv/CVFooter';

const CVTemplate = () => {
  const { name } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nameFromQuery = searchParams.get('name');
  
  const personName = name || nameFromQuery || 'alex-morgan';
  const [language, setLanguage] = useState('en');
  
  const { cvData, availableLangs } = useLoadCV(personName, language);

  // Show loading state if CV data is not loaded yet
  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading CV data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-accent/10">
      <CVHeader 
        language={language}
        availableLanguages={availableLangs}
        onLanguageChange={setLanguage}
      />
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <PersonalInfoCard personalInfo={cvData.personalInfo} />
          <CVSections cvData={cvData} />
          <CVFooter />
        </div>
      </main>
    </div>
  );
};

export default CVTemplate;
