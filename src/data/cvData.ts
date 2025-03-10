
import { CVData } from '../types/cv';
import { availableLanguages, cvDataEn, cvDataEs, cvDataFr, cvDataDe } from './sampleCVData';
import { parseMarkdownCV, loadAllCVs } from '../utils/markdownProcessor';

// Function to get CV data by language code
export function getCVData(languageCode: string): CVData {
  switch (languageCode) {
    case 'es':
      return cvDataEs;
    case 'fr':
      return cvDataFr;
    case 'de':
      return cvDataDe;
    case 'en':
    default:
      return cvDataEn;
  }
}

// Re-export everything from sampleCVData and markdownProcessor
export { availableLanguages, cvDataEn, cvDataEs, cvDataFr, cvDataDe } from './sampleCVData';
export { parseMarkdownCV, loadAllCVs, generateCVDataFromMarkdown } from '../utils/markdownProcessor';
