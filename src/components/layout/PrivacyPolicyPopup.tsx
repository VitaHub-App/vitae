
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LockKeyhole, Eye, Check, Shield } from 'lucide-react';

interface PrivacyPolicyPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrivacyPolicyPopup({ open, onOpenChange }: PrivacyPolicyPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-primary" />
            <span>Privacy Policy</span>
          </DialogTitle>
          <DialogDescription>
            How we handle your information and data
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-start gap-4 mb-5 p-4 rounded-lg bg-accent/30">
            <div className="flex-shrink-0 text-primary mt-1">
              <Eye className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Your Data, Your Control</h3>
              <p className="text-sm text-muted-foreground">
                Transparency about how your information is shared
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Any information you choose to publish through our platform is 
              inherently public. However, access requires knowledge of your
              unique personal link.
            </p>
            
            <p className="text-muted-foreground">
              We want you to know:
            </p>
            
            <ul className="space-y-2">
              {[
                "There is no central directory or listings page - content remains private unless explicitly shared through your personal link",
                "We do not sell, trade, or rent your personal information to third parties",
                "We do not use cookies or tracking mechanisms of any kind",
                "We only collect information that you voluntarily provide"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/30 mt-4">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                You retain full ownership of all content you create on VitaHub, and you can
                request removal at any time through our open source contribution process.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button className="gap-2">
                <Check className="h-4 w-4" />
                Got it
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
