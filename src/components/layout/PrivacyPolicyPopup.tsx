
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LockKeyhole, Eye } from 'lucide-react';

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
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 text-primary">
              <Eye className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Your Data, Your Control</h3>
              <p className="text-sm text-muted-foreground">
                Transparency about how your information is shared
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-3">
            Any information you choose to publish through our platform is 
            inherently public. However, access requires knowledge of your
            unique personal link.
          </p>
          
          <p className="text-muted-foreground mb-3">
            We want you to know:
          </p>
          
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>There is no central directory or listings page - content remains
                private unless explicitly shared through your personal link</li>
            <li>We do not sell, trade, or rent your personal information to third parties</li>
            <li>We do not use cookies or tracking mechanisms of any kind</li>
            <li>We only collect information that you voluntarily provide</li>
          </ul>
          
          <p className="text-muted-foreground">
            You retain full ownership of all content you create on VitaHub, and you can
            request removal at any time through our open source contribution process.
          </p>
          
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button>Got it</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
