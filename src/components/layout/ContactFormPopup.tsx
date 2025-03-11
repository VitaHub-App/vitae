
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, User, FileText, Paperclip } from 'lucide-react';

interface ContactFormPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactFormPopup({ open, onOpenChange }: ContactFormPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <span>Contact Support</span>
          </DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you as soon as possible
          </DialogDescription>
        </DialogHeader>
        
        <form 
          action="/contact" 
          method="POST" 
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                className="w-full p-2 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                required
                className="w-full p-2 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Subject (optional)
            </label>
            <input
              type="text"
              name="subject"
              placeholder="How can we help?"
              className="w-full p-2 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Message
            </label>
            <textarea
              name="message"
              placeholder="Write your message here..."
              required
              className="w-full p-2 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary h-32"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attachments
            </label>
            <input
              type="file"
              name="files"
              multiple
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent file:text-accent-foreground file:cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="gap-2">
              <Mail className="h-4 w-4" />
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
