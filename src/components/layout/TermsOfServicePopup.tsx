
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Check, AlertCircle } from 'lucide-react';

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
          <div className="flex items-start gap-4 mb-5 p-4 rounded-lg bg-accent/30">
            <div className="flex-shrink-0 text-primary mt-1">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Open Source Commitment</h3>
              <p className="text-sm text-muted-foreground">
                Our platform is built on transparency and community contribution
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              VitaHub is provided "as is", without warranty of any kind, 
              either express or implied. We maintain complete transparency 
              through our open source licensing and development practices.
            </p>
            
            <p className="text-muted-foreground">
              By using our service, you acknowledge that:
            </p>
            
            <ul className="space-y-2">
              {[
                "The platform is provided for your convenience with no guarantees of uptime or availability",
                "Content you publish is your responsibility and must comply with applicable laws",
                "We reserve the right to modify or discontinue services at any time"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/30 mt-4">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                To remove data: Submit a pull request to delete your content. 
                Only code owners (as defined in CODEOWNERS) can approve removals
                of their respective files.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button className="gap-2">
                <Check className="h-4 w-4" />
                I Understand
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
