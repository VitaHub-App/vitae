
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
}

export default function LanguageSelector({
  languages,
  currentLanguage,
  onLanguageChange
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-accent/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={16} className="text-primary" />
        <span className="text-foreground">{currentLang.name}</span>
        <ChevronDown size={16} className={cn(
          "text-foreground/70 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-36 py-1 rounded-md shadow-lg bg-card border border-border z-50 animate-scale-in">
          <ul role="listbox" className="py-1">
            {languages.map((language) => (
              <li
                key={language.code}
                role="option"
                aria-selected={language.code === currentLanguage}
                className={cn(
                  "flex items-center px-3 py-2 cursor-pointer",
                  "hover:bg-accent/50 transition-colors",
                  language.code === currentLanguage && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
              >
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
