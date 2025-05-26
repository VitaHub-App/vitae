
import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from 'lucide-react';
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
import CLPdfTemplate from '../CLPdfTemplate';

interface PdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cvData: CVData;
  cvName: string;
  personalInfo: PersonalInfo;
  isCompact: boolean;
  currentAngle?: string | null;
  coverLetter?: string | null;
}

export const PdfDialog: React.FC<PdfDialogProps> = ({open, onOpenChange, cvData, cvName, personalInfo, isCompact, currentAngle, coverLetter }) => {
  const cvComponentRef = useRef<HTMLDivElement>(null);
  const clComponentRef = useRef<HTMLDivElement>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");

  const options = {
    margin: 15,
    filename: `${cvName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    pagebreak: { mode: ['css'] },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  const sanitizeFileName = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const getFileStem = () => {
    if (companyName != "" && jobDescription != "") {
      return `${cvName}-${sanitizeFileName(jobDescription)}-${sanitizeFileName(companyName)}`
    } else if (companyName != "") {
      return `${cvName}-${sanitizeFileName(companyName)}`
    } else if (jobDescription != "") {
      return `${cvName}-${sanitizeFileName(jobDescription)}`
    }
    return cvName
  }

  const handleGeneratePDF = async () => {
    onOpenChange(false);
    const cvDomElement = cvComponentRef.current;
    const clDomElement = clComponentRef.current;
    if (!cvDomElement) {
      console.error('Could not find the component to generate CV PDF from.');
      return;
    }
    if (coverLetter) {
      if (!clDomElement) {
        console.error('Could not find the component to generate Cover Letter PDF from.');
        return;
      }
      
    }
    
    try {
      const cvBlob = await html2pdf()
        .from(cvDomElement)
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

      const baseFileName = getFileStem();

      // Generate CV PDF
      const cvFileName = `${baseFileName}-cv.pdf`;
      const clFileName = `${baseFileName}-cover-letter.pdf`;
      

      saveBlob(cvBlob, cvFileName);
      if (coverLetter) {
        const clBlob = await html2pdf()
          .from(clDomElement)
          .set(options)
          .outputPdf('blob');
        saveBlob(clBlob, clFileName);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
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
          <div>
            <Label htmlFor="jobDescription">Job Description/Title</Label>
            <Input
              id="jobDescription"
              placeholder="e.g. Senior Frontend Developer"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Tech Company Inc"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Files will be named: {getFileStem()}-cv.pdf
            {coverLetter && (
              <div>
                and {getFileStem()}-cover-letter.pdf
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" onClick={handleGeneratePDF}>Download</Button>
          </div>
          <div style={{ display: 'none' }}>
            <div ref={cvComponentRef} >
              <CVPdfTemplate
                cvData={cvData}
                personalInfo={personalInfo}
                cvName={cvName}
                isCompact={isCompact}
                currentAngle={currentAngle}
              />
            </div>
            <div ref={clComponentRef} >
              <CLPdfTemplate
                cvData={cvData}
                personalInfo={personalInfo}
                coverLetter={coverLetter}
                jobDescription={jobDescription}
                companyName={companyName}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
