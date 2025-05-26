import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Language } from "@/types/lang";
import { Copy, Link, FileWarning, Check, X, Share2, Mail, FileText, FileDown } from "lucide-react";
import { PersonalInfo, CVData } from "@/types/cv";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import EmailDialog from "./email/EmailDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PDFGenerator } from './pdf/PDFGenerator';

interface SecretTitleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: PersonalInfo;
  languages: Language[];
  availableAngles: string[];
  cvData: CVData;
  cvName: string;
}

const formSchema = z.object({
  jobDescription: z.string().min(1, "Please provide a job description"),
  includeCoverLetter: z.boolean().default(false),
  coverLetterInstructions: z.string().optional(),
  gptResponse: z.string()
    .refine(
      value => {
        try {
          const parsed = JSON.parse(value);
          return typeof parsed === 'object' && parsed !== null;
        } catch {
          return false;
        }
      },
      { message: "Invalid JSON format" }
    ),
  selectedAngle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SecretTitleDialog({ 
  isOpen, 
  onClose, 
  personalInfo, 
  languages, 
  availableAngles,
  cvData,
  cvName
}: SecretTitleDialogProps) {
  const { toast } = useToast();
  const [jsonValidationStatus, setJsonValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [parsedGptData, setParsedGptData] = useState<Record<string, { title: string, bio: string, coverLetter?: string }> | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [modifiedUrl, setModifiedUrl] = useState<string | null>(null);
  const [modifiedPersonalInfo, setModifiedPersonalInfo] = useState<PersonalInfo | null>(null);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string | undefined>(undefined);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      includeCoverLetter: false,
      coverLetterInstructions: "",
      gptResponse: "",
      selectedAngle: availableAngles.length > 0 ? availableAngles[0] : undefined,
    },
  });

  // Watch the includeCoverLetter field to toggle additional fields
  const includeCoverLetter = form.watch("includeCoverLetter");

  const validateJsonResponse = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      
      // Check if all required languages are present
      const missingLanguages = languages
        .map(lang => lang.code)
        .filter(langCode => !data[langCode]);
      
      if (missingLanguages.length > 0) {
        setJsonValidationStatus('invalid');
        toast({
          title: "Missing languages",
          description: `The following languages are missing: ${missingLanguages.join(', ')}`,
          variant: "destructive",
        });
        return false;
      }
      
      // Validate that each language entry has title and bio
      const invalidLanguages = languages
        .map(lang => lang.code)
        .filter(langCode => {
          const entry = data[langCode];
          return !entry || !entry.title || !entry.bio;
        });
      
      if (invalidLanguages.length > 0) {
        setJsonValidationStatus('invalid');
        toast({
          title: "Invalid language data",
          description: `The following languages have missing title or bio: ${invalidLanguages.join(', ')}`,
          variant: "destructive",
        });
        return false;
      }
      
      // Check bio length (40 words max)
      const longBios = languages
        .map(lang => lang.code)
        .filter(langCode => {
          const entry = data[langCode];
          return entry && entry.bio && entry.bio.split(/\s+/).length > 40;
        });
      
      if (longBios.length > 0) {
        toast({
          title: "Warning: Long bios",
          description: `The following languages have bios longer than 40 words: ${longBios.join(', ')}`,
        });
      }
      
      // Only check for cover letter if it's requested
      if (includeCoverLetter) {
        const missingCoverLetters = languages
          .map(lang => lang.code)
          .filter(langCode => {
            const entry = data[langCode];
            return !entry || !entry.coverLetter;
          });
        
        if (missingCoverLetters.length > 0) {
          toast({
            title: "Missing cover letters",
            description: `The following languages are missing cover letters: ${missingCoverLetters.join(', ')}`,
          });
        }
      }
      
      // All validations passed
      setParsedGptData(data);
      setJsonValidationStatus('valid');
      return true;
    } catch (error) {
      setJsonValidationStatus('invalid');
      toast({
        title: "Invalid JSON",
        description: "The GPT response is not valid JSON",
        variant: "destructive",
      });
      return false;
    }
  };

  const generateGptPrompt = () => {
    const { jobDescription, coverLetterInstructions, includeCoverLetter } = form.getValues();
    
    const systemPrompt = `You are a professional CV writer who specializes in creating job titles and short bios that highlight a person's skills and experience in relation to specific job opportunities. Your task is to:

1. Analyze the provided CV (in JSON format) carefully
2. Read the job description provided by the user
3. Create a job title that:
   - Accurately reflects the person's actual skills and experience in the CV
   - Aligns well with the target job description
   - Sounds professional and modern
   - Does NOT include skills or qualifications not present in the CV
4. Write a concise professional bio of EXACTLY 40 words or less that:
   - Highlights the most relevant aspects of the person's experience for this job
   - Uses active, engaging language
   - Focuses on achievements and impact
   - Appears natural and not artificially generated
${includeCoverLetter ? `5. Write a concise cover letter (200-300 words) that:
   - Introduces the person by highlighting their key qualifications
   - Explains why the person is interested in the position
   - Highlights relevant experience, education, and qualifications
   - Matches the skills and requirements mentioned in the job description
   - Includes a call to action
   - Maintains a professional tone
   - Does NOT contain ano salutation` : ''}

Do not hallucinate or invent details not present in the CV. Your output should be STRICT JSON format with this structure:
${languages.map(l => `"${l.code}": { "title": "...", "bio": "..."${includeCoverLetter ? ', "coverLetter": "..."' : ''} }`).join(', ')}

The entire response must be valid JSON that can be parsed with JSON.parse().`;

    const prompt = `${jobDescription}\n\n${includeCoverLetter && coverLetterInstructions ? "Additional instructions for cover letter: " + coverLetterInstructions + "\n\n" : ""}CV data:\n${JSON.stringify(cvData, null, 2)}`;

    return `${systemPrompt}\n\n${prompt}`;
  };

  const copyPrompt = () => {
    const prompt = generateGptPrompt();
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied to clipboard",
      description: "The GPT prompt has been copied to your clipboard.",
    });
  };

  const generateModifiedUrl = () => {
    if (!parsedGptData) return null;
    
    const { selectedAngle } = form.getValues();
    
    // Create a modifications object with the titles and bios for each language
    const modifications = {
      titles: Object.fromEntries(
        Object.entries(parsedGptData).map(([lang, data]) => [lang, data.title])
      ),
      bios: Object.fromEntries(
        Object.entries(parsedGptData).map(([lang, data]) => [lang, data.bio])
      ),
    };
    
    // Encode the modifications using btoa (base64)
    const modValue = btoa(JSON.stringify(modifications));
    
    // Get the current URL and add or replace the 'mod' parameter
    const url = new URL(window.location.href);
    url.searchParams.set('mod', modValue);

    // Add the 'angle' parameter if selectedAngle is set
    if (selectedAngle) {
      url.searchParams.set('angle', selectedAngle);
    }
    
    return url.toString();
  };

  const createModifiedPersonalInfo = () => {
    if (!parsedGptData) return null;
    
    const defaultLanguage = languages.length > 0 ? languages[0].code : 'en';
    const titleData = parsedGptData[defaultLanguage]?.title || personalInfo.title;
    const bioData = parsedGptData[defaultLanguage]?.bio || personalInfo.bio;
    
    return {
      ...personalInfo,
      title: titleData,
      bio: bioData,
    };
  };

  const shareModifiedLink = () => {
    if (!parsedGptData) {
      toast({
        title: "No valid data",
        description: "Please paste and validate the GPT response first",
        variant: "destructive",
      });
      return;
    }
    
    const url = generateModifiedUrl();
    if (!url) return;
    
    // Store the modified URL for later use
    setModifiedUrl(url);
    
    // Try to use the Web Share API
    if (navigator.share) {
      navigator.share({
        title: `${personalInfo.name}'s CV`,
        text: `Check out ${personalInfo.name}'s CV`,
        url: url,
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback to copying the URL
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "The modified CV link has been copied to your clipboard.",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "The modified CV link has been copied to your clipboard.",
      });
    }
  };

  // Handle validating JSON when it changes
  const handleGptResponseChange = (value: string) => {
    if (value.trim()) {
      validateJsonResponse(value);
    } else {
      setJsonValidationStatus('idle');
      setParsedGptData(null);
    }
    return value;
  };

  const handleEmailClick = () => {
    // Generate the modified URL with query parameters
    const url = generateModifiedUrl();
    setModifiedUrl(url);
    
    // Create a modified personal info object with the overlayed data
    const updatedPersonalInfo = createModifiedPersonalInfo();
    setModifiedPersonalInfo(updatedPersonalInfo);
    
    // Set the cover letter if available
    if (parsedGptData && includeCoverLetter) {
      const defaultLanguage = languages.length > 0 ? languages[0].code : 'en';
      setSelectedCoverLetter(parsedGptData[defaultLanguage]?.coverLetter);
    } else {
      setSelectedCoverLetter(undefined);
    }
    
    // Open the email dialog
    setShowEmailDialog(true);
  };

  const handleDownloadClick = () => {

    if (parsedGptData && includeCoverLetter) {
      const defaultLanguage = languages.length > 0 ? languages[0].code : 'en';
      setSelectedCoverLetter(parsedGptData[defaultLanguage]?.coverLetter);
    } else {
      setSelectedCoverLetter(undefined);
    }
    
    setShowDownloadModal(true);
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="max-w-3xl overflow-hidden max-h-[90vh] pr-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 z-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          
          <AlertDialogHeader>
            <AlertDialogTitle>Customize CV Title & Bio</AlertDialogTitle>
            <AlertDialogDescription>
              Create a customized job title and bio based on the CV and job description.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="overflow-y-auto pr-4 pl-2 pt-2 pb-6 max-h-[calc(90vh-120px)] custom-scrollbar">
            <Form {...form}>
              <form className="space-y-6 mt-4">
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the job description here..." 
                          className="min-h-[150px]" 
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includeCoverLetter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Include Cover Letter
                        </FormLabel>
                        <FormDescription>
                          Generate a matching cover letter along with title and bio
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {includeCoverLetter && (
                  <FormField
                    control={form.control}
                    name="coverLetterInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Letter Instructions (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any additional instructions for the cover letter..." 
                            className="min-h-[100px]" 
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                
                <Button 
                  type="button"
                  className="w-full"
                  onClick={copyPrompt}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy GPT Prompt
                </Button>
                
                <div className="border-t pt-6">
                  {availableAngles.length > 0 && (
                    <FormField
                      control={form.control}
                      name="selectedAngle"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Select Angle</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">No filter</option>
                              {availableAngles.map(angle => (
                                <option key={angle} value={angle}>{angle}</option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                
                  <FormField
                    control={form.control}
                    name="gptResponse"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="flex items-center gap-2">
                          GPT Response (JSON)
                          {jsonValidationStatus === 'valid' && (
                            <span className="text-green-500 flex items-center text-sm font-normal">
                              <Check className="h-4 w-4 mr-1" /> Valid
                            </span>
                          )}
                          {jsonValidationStatus === 'invalid' && (
                            <span className="text-red-500 flex items-center text-sm font-normal">
                              <FileWarning className="h-4 w-4 mr-1" /> Invalid
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={`Paste the GPT response JSON here...\nExample: {\n  "en": {\n    "title": "Senior Product Designer",\n    "bio": "Experienced designer with 8+ years..."${includeCoverLetter ? ',\n    "coverLetter": "Dear Hiring Manager,\\n\\nI am writing to..."' : ''}\n  },\n  "es": {\n    "title": "Diseñador Senior de Productos",\n    "bio": "Diseñador con 8+ años de experiencia..."${includeCoverLetter ? ',\n    "coverLetter": "Estimado Gerente de Contratación,\\n\\nLe escribo para..."' : ''}\n  }\n}`}
                            className={cn(
                              "min-h-[240px] font-mono text-sm",
                              jsonValidationStatus === 'valid' && "border-green-500 focus-visible:ring-green-500",
                              jsonValidationStatus === 'invalid' && "border-red-500 focus-visible:ring-red-500"
                            )}
                            onChange={e => {
                              field.onChange(e);
                              handleGptResponseChange(e.target.value);
                            }}
                            onBlur={e => {
                              field.onBlur();
                              if (e.target.value) {
                                validateJsonResponse(e.target.value);
                              }
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                        {jsonValidationStatus === 'valid' && parsedGptData && (
                          <div className="mt-4 space-y-4">
                            <h4 className="font-medium text-sm">Preview:</h4>
                            {Object.entries(parsedGptData)
                              .filter(([langCode]) => languages.some(l => l.code === langCode))
                              .map(([langCode, data]) => {
                              const langName = languages.find(l => l.code === langCode)?.name || langCode;
                              return (
                                <div key={langCode} className="p-3 border rounded-md bg-accent/20">
                                  <div className="font-medium text-sm">{langName}:</div>
                                  <div className="font-medium mt-1">"{data.title}"</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    "{data.bio}" ({data.bio.split(/\s+/).length} words)
                                  </div>
                                  {includeCoverLetter && data.coverLetter && (
                                    <div className="mt-2 pt-2 border-t">
                                      <div className="font-medium text-sm flex items-center gap-1">
                                        <FileText className="h-3 w-3" /> Cover Letter:
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1 max-h-40 overflow-y-auto bg-background/50 p-2 rounded">
                                        {data.coverLetter.split('\n').map((paragraph, i) => (
                                          <p key={i} className="mb-1">{paragraph}</p>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      className="flex-1"
                      onClick={shareModifiedLink}
                      disabled={jsonValidationStatus !== 'valid'}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Modified CV
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleEmailClick}
                      disabled={jsonValidationStatus !== 'valid'}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email Modified CV
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleDownloadClick}
                      disabled={jsonValidationStatus !== 'valid'}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Download PDFs
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      
      {showEmailDialog && (
        <EmailDialog 
          open={showEmailDialog}
          onOpenChange={setShowEmailDialog}
          personalInfo={modifiedPersonalInfo || personalInfo}
          cvName={cvName}
          customUrl={modifiedUrl || undefined}
          coverLetter={selectedCoverLetter}
        />
      )}
      
      {showDownloadModal && (
        <PDFGenerator 
          cvName={cvName}
          cvData={cvData}
          personalInfo={modifiedPersonalInfo || personalInfo}
          isCompact={isCompact}
          currentAngle=form.getValues().selectedAngle
        />
      )}
    </>
  );
}
