
import { useState } from 'react';
import { BriefcaseBusiness, GraduationCap, User2, Code, Languages } from 'lucide-react';
import { CVData } from '@/types/cv';
import CVSection from './CVSection';
import TimelineItem from './TimelineItem';
import ProjectCard from './ProjectCard';

interface CVSectionsProps {
  cvData: CVData;
}

export default function CVSections({ cvData }: CVSectionsProps) {
  const [expandedSection, setExpandedSection] = useState<string>('personal');

  const handleSectionToggle = (sectionName: string) => {
    setExpandedSection(sectionName === expandedSection ? '' : sectionName);
  };

  return (
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
            <TimelineItem
              key={index}
              title={exp.title}
              organization={exp.company}
              location={exp.location}
              period={exp.period}
              description={exp.description}
            />
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
            <TimelineItem
              key={index}
              title={edu.degree}
              organization={edu.institution}
              location={edu.location}
              period={edu.period}
              description={edu.description}
            />
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
            <ProjectCard key={index} project={project} />
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
  );
}
