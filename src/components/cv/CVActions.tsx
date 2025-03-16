
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PDFGenerator } from './pdf/PDFGenerator';
import EmailDialog from './email/EmailDialog';
import { CVData, PersonalInfo } from '@/types/cv';
import { Mail, ListIcon, ListChecksIcon, PrinterIcon, Share2Icon } from 'lucide-react';
import AngleSelector from './AngleSelector';

interface CVActionsProps {
  cvName: string;
  cvData: CVData;
  isCompact: boolean;
  onCompactToggle: () => void;
  currentAngle: string | null;
  availableAngles: string[];
  onAngleChange: (angle: string | null) => void;
}

const CVActions: React.FC<CVActionsProps> = ({ 
  cvName, 
  cvData, 
  isCompact,
  onCompactToggle,
  currentAngle,
  availableAngles,
  onAngleChange
}) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  // Initialize personal info when CV data changes
  useEffect(() => {
    if (cvData?.personalInfo) {
      setPersonalInfo(cvData.personalInfo);
    }
  }, [cvData]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${personalInfo.name} - ${personalInfo.title}`,
          text: `Check out ${personalInfo.name}'s CV`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="pb-4 flex flex-col gap-4 print:hidden">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {/* Compact mode toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle 
                  variant="outline"
                  size="sm"
                  pressed={isCompact}
                  onPressedChange={onCompactToggle}
                  className="flex items-center gap-2"
                >
                  {isCompact ? (
                    <>
                      <ListChecksIcon className="h-4 w-4" />
                      <span>Compact View</span>
                    </>
                  ) : (
                    <>
                      <ListIcon className="h-4 w-4" />
                      <span>Expanded View</span>
                    </>
                  )}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCompact ? 'Show full CV' : 'Show compact view'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Angle Selector */}
          {availableAngles.length > 0 && (
            <AngleSelector 
              angles={availableAngles}
              currentAngle={currentAngle}
              onAngleChange={onAngleChange}
            />
          )}

          {/* Share button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2Icon className="h-4 w-4" />
            <span>Share</span>
          </Button>

          {/* Email Dialog button */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setEmailDialogOpen(true)}
          >
            <Mail size={16} />
            Email CV
          </Button>
          
          <PDFGenerator 
            cvName={cvName}
            cvData={cvData}
            personalInfo={personalInfo}
            isCompact={isCompact}
            currentAngle={currentAngle}
          />
          <EmailDialog
            open={emailDialogOpen}
            onOpenChange={setEmailDialogOpen}
            personalInfo={personalInfo}
            cvName={cvName}
          />
        </div>
      </div>
    </div>
  );
};

export default CVActions;
