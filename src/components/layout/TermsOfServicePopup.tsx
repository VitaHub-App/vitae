
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Shield } from 'lucide-react';

interface TermsOfServicePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TermsOfServicePopup({ open, onOpenChange }: TermsOfServicePopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Terms of Service</span>
          </DialogTitle>
          <DialogDescription>
            Our commitment to transparency and fairness
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 text-primary">
              <Shield className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Open Source Commitment</h3>
              <p className="text-sm text-muted-foreground">
                Our platform is built on transparency and community
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-3">
            VitaHub is provided "as is", without warranty of any kind, 
            either express or implied. We maintain complete transparency 
            through our open source licensing and development practices.
          </p>
          
          <p className="text-muted-foreground mb-3">
            By using our service, you acknowledge that:
          </p>
          
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>The platform is provided for your convenience with no guarantees of uptime or availability</li>
            <li>Content you publish is your responsibility and must comply with applicable laws</li>
            <li>We reserve the right to modify or discontinue services at any time</li>
          </ul>
          
          <p className="text-muted-foreground">
            To remove data: Submit a pull request to delete your content. 
            Only code owners (as defined in CODEOWNERS) can approve removals
            of their respective files.
          </p>
          
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button>I Understand</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
