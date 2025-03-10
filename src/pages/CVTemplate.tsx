import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { BriefcaseBusiness, Building2, ChevronLeft, Code, GraduationCap, Languages, Mail, MapPin, Phone, User2 } from 'lucide-react';
import { getCVData } from '@/data/cvData';
import { availableLanguages } from '@/data/sampleCVData';
import { loadCV, getAvailableLanguagesForCV } from '@/utils/markdownLoader';
import LanguageSelector from '@/components/cv/LanguageSelector';
import CVSection from '@/components/cv/CVSection';
import { CVData } from '@/types/cv';

const CVTemplate = () => {
  const { name } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nameFromQuery = searchParams.get('name');
  
  const personName = name || nameFromQuery || 'alex-morgan';
  
  const [language, setLanguage] = useState('en');
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('personal');
  const [availableLangs, setAvailableLangs] = useState(availableLanguages);
  
  // Load CV data when person name or language changes
  useEffect(() => {
    // In development, we use the sample data
    // In production, this would load from the build-time generated JSON
    try {
      if (process.env.NODE_ENV === 'production') {
        const data = loadCV(personName, language);
        if (data) {
          setCvData(data);
          
          // Update available languages
          const langs = getAvailableLanguagesForCV(personName);
          if (langs.length > 0) {
            setAvailableLangs(
              availableLanguages.filter(lang => langs.includes(lang.code))
            );
          }
        }
      } else {
        // Use sample data in development
        setCvData(getCVData(language));
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
      // Fallback to sample data
      setCvData(getCVData(language));
    }
  }, [personName, language]);

  const handleSectionToggle = (sectionName: string) => {
    setExpandedSection(sectionName === expandedSection ? '' : sectionName);
  };

  // Show loading state if CV data is not loaded yet
  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading CV data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-accent/10">
      {/* Header */}
      <header className="sticky top-0 z-30 glassmorphism py-4 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <ChevronLeft size={18} />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <LanguageSelector 
            languages={availableLangs}
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* CV Header */}
          <div className="mb-8 animate-fade-in">
            <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{cvData.personalInfo.name}</h1>
                <h2 className="text-xl text-primary font-medium mb-4">{cvData.personalInfo.title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Mail size={16} className="mr-2 text-primary" />
                    <span>{cvData.personalInfo.email}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone size={16} className="mr-2 text-primary" />
                    <span>{cvData.personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin size={16} className="mr-2 text-primary" />
                    <span>{cvData.personalInfo.location}</span>
                  </div>
                  {cvData.personalInfo.website && (
                    <div className="flex items-center text-muted-foreground">
                      <Code size={16} className="mr-2 text-primary" />
                      <a href={`https://${cvData.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        {cvData.personalInfo.website}
                      </a>
                    </div>
                  )}
                </div>
                
                <p className="text-foreground/80">{cvData.personalInfo.bio}</p>
              </div>
            </div>
          </div>
          
          {/* CV Sections */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
            {/* Experience Section */}
            <CVSection 
              title="Experience"
              icon={BriefcaseBusiness}
              isExpanded={expandedSection === 'experience'}
              onToggle={() => handleSectionToggle('experience')}
            >
              <div className="space-y-8">
                {cvData.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-border">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary"></div>
                    <div className="mb-1">
                      <h3 className="text-xl font-semibold">{exp.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2">
                        <div className="flex items-center mr-4">
                          <Building2 size={14} className="mr-1 text-primary" />
                          <span>{exp.company}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1 text-primary" />
                          <span>{exp.location}</span>
                        </div>
                        <span className="sm:ml-auto text-sm">{exp.period}</span>
                      </div>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                      {exp.description.map((desc, idx) => (
                        <li key={idx}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CVSection>
            
            {/* Education Section */}
            <CVSection 
              title="Education"
              icon={GraduationCap}
              isExpanded={expandedSection === 'education'}
              onToggle={() => handleSectionToggle('education')}
            >
              <div className="space-y-8">
                {cvData.education.map((edu, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-border">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary"></div>
                    <div className="mb-1">
                      <h3 className="text-xl font-semibold">{edu.degree}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2">
                        <div className="flex items-center mr-4">
                          <Building2 size={14} className="mr-1 text-primary" />
                          <span>{edu.institution}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1 text-primary" />
                          <span>{edu.location}</span>
                        </div>
                        <span className="sm:ml-auto text-sm">{edu.period}</span>
                      </div>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                      {edu.description.map((desc, idx) => (
                        <li key={idx}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CVSection>
            
            {/* Skills Section */}
            <CVSection 
              title="Skills"
              icon={User2}
              isExpanded={expandedSection === 'skills'}
              onToggle={() => handleSectionToggle('skills')}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {skill.level}/5
                      </span>
                    </div>
                    <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CVSection>
            
            {/* Projects Section */}
            <CVSection 
              title="Projects"
              icon={Code}
              isExpanded={expandedSection === 'projects'}
              onToggle={() => handleSectionToggle('projects')}
            >
              <div className="grid grid-cols-1 gap-6">
                {cvData.projects.map((project, index) => (
                  <div key={index} className="border border-border rounded-lg p-5 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <span className="text-sm text-muted-foreground">{project.period}</span>
                    </div>
                    <p className="text-foreground/80 mb-3">{project.description}</p>
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-accent text-xs rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.link && (
                      <a 
                        href={`https://${project.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CVSection>
            
            {/* Languages Section */}
            <CVSection 
              title="Languages"
              icon={Languages}
              isExpanded={expandedSection === 'languages'}
              onToggle={() => handleSectionToggle('languages')}
            >
              <ul className="space-y-4">
                {cvData.languages.map((lang, index) => (
                  <li key={index} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-muted-foreground">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </CVSection>
          </div>
          
          {/* Footer */}
          <div className="mt-10 text-center text-muted-foreground text-sm">
            <p className="mb-2">
              This CV was created using markdown and Git-based publishing.
            </p>
            <p>
              <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
                Learn more about our platform
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CVTemplate;
