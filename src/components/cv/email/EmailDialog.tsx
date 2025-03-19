
import { Mail, User, AtSign, Briefcase, ExternalLinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createMailtoLink, createEmailBody } from '@/utils/emailGenerator';
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
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personalInfo: PersonalInfo;
  cvName: string;
  customUrl?: string;
  coverLetter?: string;
}

export default function EmailDialog({ 
  open, 
  onOpenChange, 
  personalInfo, 
  cvName, 
  customUrl,
  coverLetter 
}: EmailDialogProps) {
  const { toast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  
  const handleSendEmail = () => {
    const subject = jobTitle 
      ? `Application for ${jobTitle} - ${personalInfo.name}'s CV from VitaHub` 
      : `${personalInfo.name}'s CV from VitaHub`;
      
    const url = customUrl || `${window.location.origin}/cv/${cvName}`;
    
    const { plainTextBody } = createEmailBody(cvName, personalInfo, url, coverLetter, recipientName);
    
    // Create a properly encoded mailto link with plain text
    window.open(
      createMailtoLink(recipientName, recipientEmail, subject, plainTextBody),
      "_blank"
    )
    
    toast({
      title: "Email Client Opened",
      description: "Email has been prepared in your email client.",
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
            Enter recipient details to share this CV via email
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Recipient Name
            </Label>
            <Input 
              id="recipient-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="John Smith"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipient-email" className="flex items-center gap-2">
              <AtSign className="h-4 w-4" />
              Recipient Email
            </Label>
            <Input 
              id="recipient-email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="job-title" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job Title (optional)
            </Label>
            <Input 
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Senior Developer"
            />
          </div>
          
          <div className="rounded-lg border p-4 bg-accent/30">
            <h3 className="font-medium mb-2">Email Preview</h3>
            <p className="text-sm text-muted-foreground mb-1">
              <strong>To:</strong> {recipientEmail ? `${recipientName} <${recipientEmail}>` : "Enter recipient email"}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              <strong>Subject:</strong> {jobTitle 
                ? `Application for ${jobTitle} - ${personalInfo.name}'s CV from VitaHub` 
                : `${personalInfo.name}'s CV from VitaHub`}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Content:</strong> Plain text email with CV link{coverLetter ? " and cover letter" : ""}
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSendEmail}
            disabled={!recipientEmail}
            className="gap-2"
          >
            Continue to write
            <ExternalLinkIcon className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
