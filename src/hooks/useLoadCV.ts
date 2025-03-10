
import { useState, useEffect } from 'react';
import { CVData } from '@/types/cv';
import { getCVData } from '@/data/cvData';
import { loadCV, getAvailableLanguagesForCV } from '@/utils/markdownLoader';
import { availableLanguages } from '@/data/sampleCVData';

export function useLoadCV(personName: string, language: string) {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [availableLangs, setAvailableLangs] = useState(availableLanguages);
  
  // Load CV data when person name or language changes
  useEffect(() => {
    // In development, we use the sample data
    // In production, this would load from the build-time generated JSON
    try {
      if (process.env.NODE_ENV === 'production') {
        const data = loadCV(personName, language);
        if (data) {
          setCvData(data);
          
          // Update available languages
          const langs = getAvailableLanguagesForCV(personName);
          if (langs.length > 0) {
            setAvailableLangs(
              availableLanguages.filter(lang => langs.includes(lang.code))
            );
          }
        }
      } else {
        // Use sample data in development
        setCvData(getCVData(language));
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
      // Fallback to sample data
      setCvData(getCVData(language));
    }
  }, [personName, language]);

  return { cvData, availableLangs };
}
