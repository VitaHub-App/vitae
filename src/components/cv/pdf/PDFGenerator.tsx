import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from "@/components/ui/button"
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CVData, PersonalInfo } from '@/types/cv';
import CVPdfTemplate from '../CVPdfTemplate';

interface PDFGeneratorProps {
  cvData: CVData;
  cvName: string;
  personalInfo: PersonalInfo;
  isCompact: boolean;
  currentAngle?: string;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ cvData, cvName, personalInfo, isCompact, currentAngle }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const options = {
    margin: 10,
    filename: `${cvName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  const handleGeneratePDF = async () => {
    setIsOpen(false);
    const domElement = componentRef.current;
    if (!domElement) {
      console.error('Could not find the component to generate PDF from.');
      return;
    }
    
    try {
      const blob = await html2pdf()
        .from(domElement)
        .set(options)
        .outputPdf('blob');

      // Function to save the PDF blob
      const saveBlob = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      saveBlob(blob, `${cvName}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Download</DialogTitle>
            <DialogDescription>
              This will generate and download your CV as a PDF file.
              Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleGeneratePDF}>Download</Button>
          </div>
          <div style={{ display: 'none' }}>
            <div ref={componentRef} >
              <CVPdfTemplate
                cvData={cvData}
                personalInfo={personalInfo}
                cvName={cvName}
                isCompact={isCompact}
                currentAngle={currentAngle}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
