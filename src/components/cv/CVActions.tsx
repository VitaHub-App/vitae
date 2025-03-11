
import { useState, useRef } from 'react';
import { Download, Mail, Printer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  generatePDF, 
  createMailtoLink, 
  createAmpEmailBody 
} from '@/utils/pdfGenerator';
import { PersonalInfo } from '@/types/cv';
import CVPdfTemplate from './CVPdfTemplate';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';

interface CVActionsProps {
  personalInfo: PersonalInfo;
  cvName: string;
  cvData: any;
}

export default function CVActions({ personalInfo, cvName, cvData }: CVActionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
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
  
  const handlePlainTextEmail = () => {
    const subject = `${personalInfo.name}'s CV from VitaHub`;
    const url = `${window.location.origin}/cv/${cvName}`;
    
    const { plainTextFallback } = createAmpEmailBody(cvName, personalInfo, url);
    
    // Create a properly encoded mailto link with plain text
    window.location.href = createMailtoLink('', subject, plainTextFallback);
    
    toast({
      title: "Email Client Opened",
      description: "Plain text email has been prepared in your email client.",
    });
    
    setEmailDialogOpen(false);
  };
  
  const handleHTMLEmail = () => {
    const subject = `${personalInfo.name}'s CV from VitaHub`;
    const url = `${window.location.origin}/cv/${cvName}`;
    
    const { ampHtml } = createAmpEmailBody(cvName, personalInfo, url);
    
    // Copy HTML to clipboard
    navigator.clipboard.writeText(ampHtml)
      .then(() => {
        toast({
          title: "HTML Copied to Clipboard",
          description: "Paste the HTML into your email client to send a rich HTML email.",
        });
      })
      .catch(err => {
        console.error('Failed to copy HTML: ', err);
        toast({
          title: "Error",
          description: "Failed to copy HTML to clipboard. Please try again.",
          variant: "destructive",
        });
      });
    
    setEmailDialogOpen(false);
  };
  
  return (
    <>
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
          onClick={() => setEmailDialogOpen(true)}
        >
          <Mail size={16} />
          Email CV
        </Button>
      </div>
      
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Share CV via Email</span>
            </DialogTitle>
            <DialogDescription>
              Choose how you'd like to share this CV
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <h3 className="font-medium mb-2">Plain Text Email</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Opens your default email client with a simple text-based CV link. 
                Works with all email clients.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handlePlainTextEmail}
              >
                Send as Plain Text
              </Button>
            </div>
            
            <div className="rounded-lg border p-4 bg-muted/30">
              <h3 className="font-medium mb-2">HTML Rich Email</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Creates a beautifully formatted HTML email. Copy the HTML and paste 
                it into email clients that support HTML formatting.
              </p>
              <Button 
                className="w-full"
                onClick={handleHTMLEmail}
              >
                Copy HTML to Clipboard
              </Button>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
