
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Language } from "@/types/lang";
import { Copy, Link, FileWarning, Check, X } from "lucide-react";
import { PersonalInfo, CVData } from "@/types/cv";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

interface SecretTitleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: PersonalInfo;
  languages: Language[];
  availableAngles: string[];
  cvData: CVData;
}

const formSchema = z.object({
  jobDescription: z.string().min(1, "Please provide a job description"),
  additionalInstructions: z.string().optional(),
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
  cvData
}: SecretTitleDialogProps) {
  const { toast } = useToast();
  const [jsonValidationStatus, setJsonValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [parsedGptData, setParsedGptData] = useState<Record<string, { title: string, bio: string }> | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      additionalInstructions: "",
      gptResponse: "",
      selectedAngle: availableAngles.length > 0 ? availableAngles[0] : undefined,
    },
  });

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
      
      // All validations passed
      setParsedGptData(data);
      setJsonValidationStatus('valid');
      toast({
        title: "JSON data valid",
        description: "Successfully parsed and validated the GPT response",
      });
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
    const { jobDescription, additionalInstructions } = form.getValues();
    
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

Do not hallucinate or invent details not present in the CV. Your output should be STRICT JSON format with this structure:
${languages.map(l => `"${l.code}": { "title": "...", "bio": "..." }`).join(', ')}

The entire response must be valid JSON that can be parsed with JSON.parse().`;

    const prompt = `${jobDescription}\n\n${additionalInstructions ? "Additional instructions: " + additionalInstructions + "\n\n" : ""}CV data:\n${JSON.stringify(cvData, null, 2)}`;

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

  const copyModifiedLink = () => {
    if (!parsedGptData) {
      toast({
        title: "No valid data",
        description: "Please paste and validate the GPT response first",
        variant: "destructive",
      });
      return;
    }
    
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
    
    // Compress and encode the modifications using pako
    const modValue = btoa(JSON.stringify(modifications));
    
    // Get the current URL and add or replace the 'mod' parameter
    const url = new URL(window.location.href);
    url.searchParams.set('mod', modValue);

    // Add the 'angle' parameter if selectedAngle is set
    if (selectedAngle) {
      url.searchParams.set('angle', selectedAngle);
    }
    
    // Copy the URL to the clipboard
    navigator.clipboard.writeText(url.toString());
    toast({
      title: "Link copied",
      description: "The modified CV link has been copied to your clipboard.",
    });
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

  return (
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
        
        <div className="overflow-y-auto pr-4 pt-2 pb-6 max-h-[calc(90vh-120px)] custom-scrollbar">
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
                name="additionalInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Instructions (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any additional instructions for GPT..." 
                        className="min-h-[100px]" 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
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
                          placeholder={`Paste the GPT response JSON here...\nExample: {\n  "en": {\n    "title": "Senior Product Designer",\n    "bio": "Experienced designer with 8+ years..."\n  },\n  "es": {\n    "title": "Diseñador Senior de Productos",\n    "bio": "Diseñador con 8+ años de experiencia..."\n  }\n}`}
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
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="button"
                  className="w-full"
                  onClick={copyModifiedLink}
                  disabled={jsonValidationStatus !== 'valid'}
                >
                  <Link className="mr-2 h-4 w-4" />
                  Generate & Copy Modified Link
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

