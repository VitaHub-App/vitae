
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonalInfo } from '@/types/cv';
import PDFGenerator from './pdf/PDFGenerator';
import EmailDialog from './email/EmailDialog';

interface CVActionsProps {
  personalInfo: PersonalInfo;
  cvName: string;
  cvData: any;
}

export default function CVActions({ personalInfo, cvName, cvData }: CVActionsProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  return (
    <>
      <div className="flex flex-wrap gap-3 mt-6 mb-6">
        <PDFGenerator 
          personalInfo={personalInfo}
          cvName={cvName}
          cvData={cvData}
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
