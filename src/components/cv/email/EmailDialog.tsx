
import { Mail, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createMailtoLink, createAmpEmailBody } from '@/utils/emailGenerator';
import { PersonalInfo } from '@/types/cv';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personalInfo: PersonalInfo;
  cvName: string;
}

export default function EmailDialog({ open, onOpenChange, personalInfo, cvName }: EmailDialogProps) {
  const { toast } = useToast();
  
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
    
    onOpenChange(false);
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
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <div className="rounded-lg border p-4 bg-accent/30 hover:bg-accent/50 transition-colors">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              Plain Text Email
            </h3>
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
          
          <div className="rounded-lg border p-4 bg-accent/30 hover:bg-accent/50 transition-colors">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Copy className="h-4 w-4 text-primary" />
              HTML Rich Email
            </h3>
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
  );
}
