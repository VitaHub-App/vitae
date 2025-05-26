
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useLoadCV } from '@/hooks/useLoadCV';
import CVHeader from '@/components/cv/CVHeader';
import PersonalInfoCard from '@/components/cv/PersonalInfoCard';
import CVSections from '@/components/cv/CVSections';
import CVFooter from '@/components/cv/CVFooter';
import CVActions from '@/components/cv/CVActions';
import { CVData } from '@/types/cv';

interface ModificationData {
  titles?: Record<string, string>;
  bios?: Record<string, string>;
  angle?: string;
}

const CVTemplate = () => {
  const { name } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nameFromQuery = searchParams.get('name');
  const compactParam = searchParams.get('compact');
  const angleParam = searchParams.get('angle') === 'null' ? null : searchParams.get('angle') || undefined; // null means no filter
  const modParam = searchParams.get('mod');
  
  const personName = name || nameFromQuery || 'alex-morgan';
  const [language, setLanguage] = useState('en');
  const [isCompact, setIsCompact] = useState(compactParam !== 'false');
  const [currentAngle, setCurrentAngle] = useState<string | null | undefined>(angleParam);
  const [modifiedCVData, setModifiedCVData] = useState<CVData | null>(null);
  
  // Update URL when parameters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('compact', isCompact.toString());
    
    if (currentAngle !== undefined) {
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

  // Apply modifications from URL if present
  useEffect(() => {
    if (!cvData) return;
    
    if (modParam) {
      try {
        // Parse the encoded modification data
        const decodedData: ModificationData = JSON.parse(decodeURIComponent(atob(modParam)));
        if (!decodedData) {
          console.error('Failed to decode mod parameter');
          setModifiedCVData(cvData);
          return;
        }
        
        // Create a deep copy of the CV data to avoid mutating the original
        const modifiedData = JSON.parse(JSON.stringify(cvData)) as CVData;
        
        // Apply modifications for the current language
        if (decodedData.titles && decodedData.titles[language]) {
          modifiedData.personalInfo.title = decodedData.titles[language];
        }
        
        if (decodedData.bios && decodedData.bios[language]) {
          modifiedData.personalInfo.bio = decodedData.bios[language];
        }
        setModifiedCVData(modifiedData);
      } catch (error) {
        console.error('Error applying modifications:', error);
        setModifiedCVData(cvData);
      }
    } else {
      setModifiedCVData(cvData);
    }
  }, [cvData, modParam, language, currentAngle]);

  // Set default angle from CV data if available and no angle is otherwise specified
  useEffect(() => {
    if (modifiedCVData && currentAngle === undefined && modifiedCVData.personalInfo.defaultAngle) {
      setCurrentAngle(modifiedCVData.personalInfo.defaultAngle);
    }
  }, [modifiedCVData, currentAngle]);

  // Show loading state if CV data is not loaded yet
  if (!modifiedCVData) {
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
    modifiedCVData.experience.forEach(exp => {
      if (exp.angles) exp.angles.forEach(angle => angles.add(angle));
    });
    
    // Add angles from education
    modifiedCVData.education.forEach(edu => {
      if (edu.angles) edu.angles.forEach(angle => angles.add(angle));
    });
    
    // Add angles from projects
    modifiedCVData.projects.forEach(proj => {
      if (proj.angles) proj.angles.forEach(angle => angles.add(angle));
    });
    
    // Add angles from skills (handle both flat and grouped skills)
    modifiedCVData.skills.forEach(skillItem => {
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
    modifiedCVData.languages.forEach(lang => {
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
      />
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div id="cv-content" className="max-w-4xl mx-auto">
          <PersonalInfoCard 
            personalInfo={modifiedCVData.personalInfo} 
            availableLanguages={availableLangs}
            cvData={modifiedCVData}
            availableAngles={availableAngles}
          />
          <CVActions 
            cvName={personName} 
            cvData={modifiedCVData}
            isCompact={isCompact}
            onCompactToggle={() => setIsCompact(!isCompact)}
            currentAngle={currentAngle}
            availableAngles={availableAngles}
            onAngleChange={setCurrentAngle}
          />
          <CVSections 
            cvData={modifiedCVData} 
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
