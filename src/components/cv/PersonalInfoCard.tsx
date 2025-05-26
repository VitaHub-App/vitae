import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Code, ShieldCheck } from 'lucide-react';
import SecretTitleDialog from './SecretTitleDialog';
import { PersonalInfo, CVData } from '@/types/cv';
import { Language } from '@/types/lang';

interface PersonalInfoCardProps {
  personalInfo: PersonalInfo;
  availableLanguages: Language[];
  cvData: CVData;
  availableAngles: string[];
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ 
  personalInfo, 
  availableLanguages, 
  cvData, 
  availableAngles 
}) => {
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const [clickCount, setClickCount] = useState(0);
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
      setShowSecretDialog(true);
      setClickCount(0);
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 rounded-md blur-md -z-10"/>
      <div className="p-6 flex items-center space-x-4">
        <Avatar className="h-40 w-40">
          <AvatarImage src={personalInfo.image} alt={personalInfo.name} />
          <AvatarFallback>{personalInfo.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">{personalInfo.name}</h1>
          <h2 
            className="text-xl text-primary font-medium mb-4 cursor-pointer"
            onClick={handleTitleClick}
          >{personalInfo.title}</h2>
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
        <div className="absolute top-6 right-6">
          <ShieldCheck className="h-6 w-6 text-green-500" />
        </div>
      </div>
      {showSecretDialog && (
        <SecretTitleDialog 
          isOpen={true}
          onClose={() => setShowSecretDialog(false)}
          personalInfo={personalInfo}
          languages={availableLanguages}
          availableAngles={availableAngles}
          cvData={cvData}
          cvName={window.location.pathname.split('/').pop() || 'cv'}
        />
      )}
    </Card>
  );
};

export default PersonalInfoCard;
