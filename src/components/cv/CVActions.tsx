
import { useState } from 'react';
import { Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePDF, createMailtoLink } from '@/utils/pdfGenerator';
import { PersonalInfo } from '@/types/cv';

interface CVActionsProps {
  personalInfo: PersonalInfo;
  cvName: string;
}

export default function CVActions({ personalInfo, cvName }: CVActionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownloadCV = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePDF('cv-content', `${personalInfo.name.replace(/\s+/g, '-')}-CV`);
      if (result) {
        toast({
          title: "Success!",
          description: "Your CV has been downloaded as a PDF.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleEmailCV = () => {
    const subject = `${personalInfo.name}'s CV from VitaHub`;
    const body = `Hello,\n\nPlease find my CV attached below: \n\n${window.location.origin}/cv/${cvName}\n\nBest regards,\n${personalInfo.name}\n${personalInfo.email}\n${personalInfo.phone}`;
    
    window.location.href = createMailtoLink('', subject, body);
  };
  
  return (
    <div className="flex flex-wrap gap-3 mt-6 mb-6">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleDownloadCV}
        disabled={isGenerating}
      >
        <Download size={16} />
        {isGenerating ? 'Generating...' : 'Download PDF'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleEmailCV}
      >
        <Mail size={16} />
        Email CV
      </Button>
    </div>
  );
}
