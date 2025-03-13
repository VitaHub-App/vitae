
import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';
import { PersonalInfo } from '@/types/cv';
import CVPdfTemplate from '../CVPdfTemplate';

interface PDFGeneratorProps {
  personalInfo: PersonalInfo;
  cvName: string;
  cvData: any;
  isCompact: boolean;
}

export default function PDFGenerator({ personalInfo, cvName, cvData, isCompact }: PDFGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
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
      reactRoot.render(<CVPdfTemplate cvData={cvData} cvName={cvName} isCompact={isCompact} />);
      
      // Wait a moment for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate PDF from the template
      const result = await generatePDF('pdf-template-root', `${personalInfo.name.replace(/\s+/g, '-')}-CV${isCompact ? '-Compact' : ''}`);
      
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
  
  return (
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
  );
}
