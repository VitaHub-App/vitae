
import { useState } from 'react';
import { Mail, FileText, LayoutDashboard, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { PersonalInfo } from '@/types/cv';
import PDFGenerator from './pdf/PDFGenerator';
import EmailDialog from './email/EmailDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CVActionsProps {
  personalInfo: PersonalInfo;
  cvName: string;
  cvData: any;
  isCompact: boolean;
  onCompactToggle: () => void;
}

export default function CVActions({ 
  personalInfo, 
  cvName, 
  cvData, 
  isCompact, 
  onCompactToggle 
}: CVActionsProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  return (
    <>
      <div className="flex flex-wrap gap-3 mt-6 mb-6">
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
                  <><LayoutDashboard size={16} /> Compact</>
                ) : (
                  <><LayoutList size={16} /> Expanded</>
                )}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCompact ? 'Show full CV' : 'Show compact view'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <PDFGenerator 
          personalInfo={personalInfo}
          cvName={cvName}
          cvData={cvData}
          isCompact={isCompact}
        />
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setEmailDialogOpen(true)}
        >
          <Mail size={16} />
          Email CV
        </Button>
      </div>
      
      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        personalInfo={personalInfo}
        cvName={cvName}
      />
    </>
  );
}
