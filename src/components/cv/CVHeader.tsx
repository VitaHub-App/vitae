
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Language } from '@/types/lang';
import LanguageSelector from './LanguageSelector';

interface CVHeaderProps {
  language: string;
  availableLanguages: Language[];
  onLanguageChange: (lang: string) => void;
}

export default function CVHeader({ 
  language, 
  availableLanguages, 
  onLanguageChange
}: CVHeaderProps) {
  return (
    <header className="sticky top-0 z-30 glassmorphism py-4 px-6 shadow-sm">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
          <ChevronLeft size={18} />
          <span className="font-medium">Back to Home</span>
        </Link>
        
        <div className="flex items-center space-x-3">
          <LanguageSelector 
            languages={availableLanguages}
            currentLanguage={language}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </header>
  );
}
