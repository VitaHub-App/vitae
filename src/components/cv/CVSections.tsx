
import { useState } from 'react';
import { BriefcaseBusiness, GraduationCap, User2, Code, Languages } from 'lucide-react';
import { CVData, Skill, SkillGroup, COMPACT_ITEMS_LIMIT } from '@/types/cv';
import CVSection from './CVSection';
import TimelineItem from './TimelineItem';
import ProjectCard from './ProjectCard';

interface CVSectionsProps {
  cvData: CVData;
  isCompact?: boolean;
}

export default function CVSections({ cvData, isCompact = true }: CVSectionsProps) {
  const [expandedSection, setExpandedSection] = useState<string>('personal');

  const handleSectionToggle = (sectionName: string) => {
    setExpandedSection(sectionName === expandedSection ? '' : sectionName);
  };

  // Helper function to determine if skills are grouped
  const hasGroupedSkills = (): boolean => {
    if (!cvData.skills.length) return false;
    return 'name' in cvData.skills[0] && 'skills' in cvData.skills[0];
  };

  // Filter data based on compact mode
  const getFilteredData = (data: any[], limitCount = COMPACT_ITEMS_LIMIT) => {
    if (!isCompact) return data;
    return data.slice(0, limitCount);
  };

  // Calculate total and shown skill counts
  const calculateSkillCounts = () => {
    if (hasGroupedSkills()) {
      const groupedSkills = cvData.skills as SkillGroup[];
      const totalSkills = groupedSkills.reduce((total, group) => total + group.skills.length, 0);
      let shownSkills = 0;
      
      // If compact, calculate the number of shown skills
      if (isCompact) {
        // Take up to 3 groups
        const limitedGroups = groupedSkills.slice(0, 3);
        shownSkills = limitedGroups.reduce((total, group) => {
          // Take up to 3 skills per group
          return total + Math.min(group.skills.length, 3);
        }, 0);
      } else {
        shownSkills = totalSkills;
      }
      
      return { total: totalSkills, shown: shownSkills };
    } else {
      const flatSkills = cvData.skills as Skill[];
      const totalSkills = flatSkills.length;
      const shownSkills = isCompact ? Math.min(flatSkills.length, COMPACT_ITEMS_LIMIT) : totalSkills;
      
      return { total: totalSkills, shown: shownSkills };
    }
  };

  // Render a single skill item
  const renderSkillItem = (skill: Skill, index: number) => (
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
  );

  // Render skills section content based on structure
  const renderSkillsContent = () => {
    if (hasGroupedSkills()) {
      // For grouped skills
      const groupedSkills = cvData.skills as SkillGroup[];
      const filteredSkillGroups = isCompact 
        ? groupedSkills.map(group => ({
            ...group,
            skills: group.skills.slice(0, 3) // Limit skills in each group
          })).slice(0, 3) // Limit number of groups
        : groupedSkills;

      return (
        <div className="space-y-6">
          {filteredSkillGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">{group.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {group.skills.map((skill, skillIndex) => renderSkillItem(skill, skillIndex))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // For flat skills structure
      const filteredSkills = getFilteredData(cvData.skills as Skill[]);
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {filteredSkills.map((skill, index) => renderSkillItem(skill, index))}
        </div>
      );
    }
  };

  // Get skill counts for display
  const skillCounts = calculateSkillCounts();

  // Filter data for display
  const filteredExperience = getFilteredData(cvData.experience);
  const filteredEducation = getFilteredData(cvData.education);
  const filteredProjects = getFilteredData(cvData.projects);
  const filteredLanguages = getFilteredData(cvData.languages);

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
      {/* Experience Section */}
      <CVSection 
        title={`Experience${isCompact && cvData.experience.length > COMPACT_ITEMS_LIMIT ? ` (${filteredExperience.length}/${cvData.experience.length})` : ''}`}
        icon={BriefcaseBusiness}
        isExpanded={expandedSection === 'experience'}
        onToggle={() => handleSectionToggle('experience')}
      >
        <div className="space-y-8">
          {filteredExperience.map((exp, index) => (
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
        title={`Education${isCompact && cvData.education.length > COMPACT_ITEMS_LIMIT ? ` (${filteredEducation.length}/${cvData.education.length})` : ''}`}
        icon={GraduationCap}
        isExpanded={expandedSection === 'education'}
        onToggle={() => handleSectionToggle('education')}
      >
        <div className="space-y-8">
          {filteredEducation.map((edu, index) => (
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
        title={`Skills${isCompact && skillCounts.total > skillCounts.shown ? ` (${skillCounts.shown}/${skillCounts.total})` : ''}`}
        icon={User2}
        isExpanded={expandedSection === 'skills'}
        onToggle={() => handleSectionToggle('skills')}
      >
        {renderSkillsContent()}
      </CVSection>
      
      {/* Projects Section */}
      <CVSection 
        title={`Projects${isCompact && cvData.projects.length > COMPACT_ITEMS_LIMIT ? ` (${filteredProjects.length}/${cvData.projects.length})` : ''}`}
        icon={Code}
        isExpanded={expandedSection === 'projects'}
        onToggle={() => handleSectionToggle('projects')}
      >
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </CVSection>
      
      {/* Languages Section */}
      <CVSection 
        title={`Languages${isCompact && cvData.languages.length > COMPACT_ITEMS_LIMIT ? ` (${filteredLanguages.length}/${cvData.languages.length})` : ''}`}
        icon={Languages}
        isExpanded={expandedSection === 'languages'}
        onToggle={() => handleSectionToggle('languages')}
      >
        <ul className="space-y-4">
          {filteredLanguages.map((lang, index) => (
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
