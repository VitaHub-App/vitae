import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface CookiePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CookiePopup({ open, onOpenChange }: CookiePopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Cookies Policy</span>
          </DialogTitle>
          <DialogDescription>
            We don't use Cookies
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            VitaHub values your privacy and does not use any cookies or tracking mechanisms. 
            Your browsing experience remains completely private.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
