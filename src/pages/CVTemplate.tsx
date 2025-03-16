
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useLoadCV } from '@/hooks/useLoadCV';
import CVHeader from '@/components/cv/CVHeader';
import PersonalInfoCard from '@/components/cv/PersonalInfoCard';
import CVSections from '@/components/cv/CVSections';
import CVFooter from '@/components/cv/CVFooter';
import CVActions from '@/components/cv/CVActions';

const CVTemplate = () => {
  const { name } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nameFromQuery = searchParams.get('name');
  const compactParam = searchParams.get('compact');
  const angleParam = searchParams.get('angle');
  
  const personName = name || nameFromQuery || 'alex-morgan';
  const [language, setLanguage] = useState('en');
  const [isCompact, setIsCompact] = useState(compactParam !== 'false');
  const [currentAngle, setCurrentAngle] = useState<string | null>(angleParam);
  
  // Update URL when parameters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('compact', isCompact.toString());
    
    if (currentAngle) {
      newSearchParams.set('angle', currentAngle);
    } else {
      newSearchParams.delete('angle');
    }
    
    const newSearch = newSearchParams.toString();
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    
    // Update URL without reloading page
    window.history.replaceState(null, '', newPath);
  }, [isCompact, currentAngle, location]);
  
  const { cvData, availableLangs } = useLoadCV(personName, language);

  // Set default angle from CV data if available and no angle is specified
  useEffect(() => {
    if (cvData && !currentAngle && cvData.personalInfo.defaultAngle) {
      setCurrentAngle(cvData.personalInfo.defaultAngle);
    }
  }, [cvData, currentAngle]);

  // Show loading state if CV data is not loaded yet
  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading CV data...</p>
      </div>
    );
  }

  // Extract all available angles from the CV data
  const extractAvailableAngles = () => {
    const angles = new Set<string>();
    
    // Add angles from experience
    cvData.experience.forEach(exp => {
      if (exp.angles) exp.angles.forEach(angle => angles.add(angle));
    });
    
    // Add angles from education
    cvData.education.forEach(edu => {
      if (edu.angles) edu.angles.forEach(angle => angles.add(angle));
    });
    
    // Add angles from projects
    cvData.projects.forEach(proj => {
      if (proj.angles) proj.angles.forEach(angle => angles.add(angle));
    });
    
    // Add angles from skills (handle both flat and grouped skills)
    cvData.skills.forEach(skillItem => {
      if ('skills' in skillItem) {
        // Grouped skills
        if (skillItem.angles) skillItem.angles.forEach(angle => angles.add(angle));
        skillItem.skills.forEach(skill => {
          if (skill.angles) skill.angles.forEach(angle => angles.add(angle));
        });
      } else {
        // Flat skills
        if (skillItem.angles) skillItem.angles.forEach(angle => angles.add(angle));
      }
    });
    
    // Add angles from languages
    cvData.languages.forEach(lang => {
      if (lang.angles) lang.angles.forEach(angle => angles.add(angle));
    });
    
    return Array.from(angles);
  };

  const availableAngles = extractAvailableAngles();

  return (
    <div className="min-h-screen flex flex-col bg-accent/10">
      <CVHeader 
        language={language}
        availableLanguages={availableLangs}
        onLanguageChange={setLanguage}
        currentAngle={currentAngle}
        availableAngles={availableAngles}
        onAngleChange={setCurrentAngle}
      />
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div id="cv-content" className="max-w-4xl mx-auto">
          <PersonalInfoCard personalInfo={cvData.personalInfo} />
          <CVActions 
            cvName={personName} 
            cvData={cvData}
            isCompact={isCompact}
            onCompactToggle={() => setIsCompact(!isCompact)}
            currentAngle={currentAngle}
            availableAngles={availableAngles}
            onAngleChange={setCurrentAngle}
          />
          <CVSections 
            cvData={cvData} 
            isCompact={isCompact} 
            currentAngle={currentAngle}
          />
          <CVFooter />
        </div>
      </main>
    </div>
  );
}

export default CVTemplate;
