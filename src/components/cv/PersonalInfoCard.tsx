
import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Code } from 'lucide-react';
import { PersonalInfo } from '@/types/cv';
import SecretTitleDialog from './SecretTitleDialog';
import { Language } from '@/types/lang';

interface PersonalInfoCardProps {
  personalInfo: PersonalInfo;
  availableLanguages?: Language[];
  cvData?: any;
  availableAngles?: string[];
}

export default function PersonalInfoCard({ 
  personalInfo, 
  availableLanguages = [],
  cvData = {},
  availableAngles = []
}: PersonalInfoCardProps) {
  const [clickCount, setClickCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTitleClick = () => {
    setClickCount(prev => prev + 1);
    
    // Reset the counter if no further clicks within 1.5 seconds
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }
    
    clickTimer.current = setTimeout(() => {
      setClickCount(0);
    }, 1500);
    
    // If 5 clicks reached, open the dialog
    if (clickCount >= 4) {
      setDialogOpen(true);
      setClickCount(0);
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }
    }
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{personalInfo.name}</h1>
          <h2 
            className="text-xl text-primary font-medium mb-4 cursor-pointer"
            onClick={handleTitleClick}
          >
            {personalInfo.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div className="flex items-center text-muted-foreground">
              <Mail size={16} className="mr-2 text-primary" />
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Phone size={16} className="mr-2 text-primary" />
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin size={16} className="mr-2 text-primary" />
              <span>{personalInfo.location}</span>
            </div>
            {personalInfo.website && (
              <div className="flex items-center text-muted-foreground">
                <Code size={16} className="mr-2 text-primary" />
                <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {personalInfo.website}
                </a>
              </div>
            )}
          </div>
          
          <p className="text-foreground/80">{personalInfo.bio}</p>
        </div>
      </div>

      {/* Secret Dialog */}
      {dialogOpen && (
        <SecretTitleDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          personalInfo={personalInfo}
          languages={availableLanguages}
          availableAngles={availableAngles}
          cvData={cvData}
        />
      )}
    </div>
  );
}
