
import { useState, useRef } from 'react';
import { Download, Mail, Printer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePDF, createMailtoLink, createAmpEmailBody } from '@/utils/pdfGenerator';
import { PersonalInfo } from '@/types/cv';
import CVPdfTemplate from './CVPdfTemplate';

interface CVActionsProps {
  personalInfo: PersonalInfo;
  cvName: string;
  cvData: any;
}

export default function CVActions({ personalInfo, cvName, cvData }: CVActionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadCV = async () => {
    setIsGenerating(true);
    
    // Create a temporary container for the PDF template
    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-export-container';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);
    
    try {
      // Render the PDF template into the container
      const root = document.createElement('div');
      root.id = 'pdf-template-root';
      tempDiv.appendChild(root);
      
      // Use React to render our PDF template
      const ReactDOM = await import('react-dom/client');
      const reactRoot = ReactDOM.createRoot(root);
      reactRoot.render(<CVPdfTemplate cvData={cvData} cvName={cvName} />);
      
      // Wait a moment for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate PDF from the template
      const result = await generatePDF('pdf-template-root', `${personalInfo.name.replace(/\s+/g, '-')}-CV`);
      
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
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clean up
      if (tempDiv && tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
      }
      setIsGenerating(false);
    }
  };
  
  const handleEmailCV = () => {
    const subject = `${personalInfo.name}'s CV from VitaHub`;
    const url = `${window.location.origin}/cv/${cvName}`;
    
    // Create AMP email with fallback
    const { plainTextFallback, ampHtml } = createAmpEmailBody(cvName, personalInfo, url);
    
    // For mailto links, we'll use the plain text fallback as most email clients
    // don't support setting HTML content via mailto
    window.location.href = createMailtoLink('', subject, plainTextFallback);
    
    // Log the AMP HTML for debugging/copy-paste
    console.log("AMP HTML email template (copy this to use in email clients that support AMP):", ampHtml);
    
    // Show toast with instructions
    toast({
      title: "Email Client Opened",
      description: "For HTML formatting, check the console for the AMP HTML template you can copy.",
    });
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
        <FileText size={16} />
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
