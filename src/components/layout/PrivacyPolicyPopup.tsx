import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface PrivacyPolicyPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrivacyPolicyPopup({ open, onOpenChange }: PrivacyPolicyPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Your published information is public by default
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <p className="text-muted-foreground">
            Any information you choose to publish through our platform is 
            inherently public. However, access requires knowledge of your
            unique personal link.
          </p>
          <p className="text-muted-foreground">
            There is no central directory or listings page - content remains
            private unless explicitly shared through your personal link.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
