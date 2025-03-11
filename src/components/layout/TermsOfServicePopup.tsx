import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface TermsOfServicePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TermsOfServicePopup({ open, onOpenChange }: TermsOfServicePopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Service provided as-is without warranty
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <p className="text-muted-foreground">
            VitaHub is provided "as is", without warranties of any kind. 
            We maintain transparency through open source licensing.
          </p>
          <p className="text-muted-foreground">
            To remove data: Submit a pull request to delete your content. 
            Only code owners (as defined in CODEOWNERS) can approve removals
            of their respective files.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
