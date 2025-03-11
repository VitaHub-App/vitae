
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cookie, ShieldCheck } from 'lucide-react';

interface CookiePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CookiePopup({ open, onOpenChange }: CookiePopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <span>Cookies Policy</span>
          </DialogTitle>
          <DialogDescription>
            Our approach to privacy and cookies
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 text-green-500">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Cookie-Free Experience</h3>
              <p className="text-sm text-muted-foreground">
                VitaHub values your privacy above all else.
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-3">
            In a digital world where tracking is the norm, we're proudly different. 
            VitaHub does not use any cookies or tracking mechanisms of any kind.
          </p>
          
          <p className="text-muted-foreground">
            Your browsing experience remains completely private. No data collection, 
            no tracking, no third-party cookies - just a clean, professional CV platform 
            that respects your right to privacy.
          </p>
          
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button>Got it, thanks</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
