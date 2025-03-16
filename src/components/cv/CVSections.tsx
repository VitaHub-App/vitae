
import { useState } from 'react';
import { BriefcaseBusiness, GraduationCap, User2, Code, Languages } from 'lucide-react';
import { CVData, Skill, SkillGroup, COMPACT_ITEMS_LIMIT } from '@/types/cv';
import CVSection from './CVSection';
import TimelineItem from './TimelineItem';
import ProjectCard from './ProjectCard';

interface CVSectionsProps {
  cvData: CVData;
  isCompact?: boolean;
  currentAngle?: string | null;
}

export default function CVSections({ 
  cvData, 
  isCompact = true, 
  currentAngle = null 
}: CVSectionsProps) {
  const [expandedSection, setExpandedSection] = useState<string>('personal');

  const handleSectionToggle = (sectionName: string) => {
    setExpandedSection(sectionName === expandedSection ? '' : sectionName);
  };

  // Helper function to determine if an item should be visible based on angle
  const shouldShowItem = (itemAngles?: string[]) => {
    // If no angle is selected or the item has no angles, show it
    if (!currentAngle || !itemAngles || itemAngles.length === 0) {
      return true;
    }
    
    // If an angle is selected, show only items tagged with that angle
    return itemAngles.includes(currentAngle);
  };

  // Helper function to determine if skills are grouped
  const hasGroupedSkills = (): boolean => {
    if (!cvData.skills.length) return false;
    return 'name' in cvData.skills[0] && 'skills' in cvData.skills[0];
  };

  // Filter data based on compact mode and selected angle
  const getFilteredData = (data: any[], limitCount = COMPACT_ITEMS_LIMIT) => {
    // First filter by angle
    const angleFilteredData = data.filter(item => shouldShowItem(item.angles));
    
    // Then apply compact mode limiting if needed
    if (!isCompact) return angleFilteredData;
    return angleFilteredData.slice(0, limitCount);
  };

  // Calculate total and shown skill counts
  const calculateSkillCounts = () => {
    if (hasGroupedSkills()) {
      const groupedSkills = cvData.skills as SkillGroup[];
      
      // First filter groups by angle
      const filteredGroups = groupedSkills.filter(group => shouldShowItem(group.angles));
      
      // Then filter skills within each group by angle
      const filteredGroupsWithFilteredSkills = filteredGroups.map(group => ({
        ...group,
        skills: group.skills.filter(skill => shouldShowItem(skill.angles))
      }));
      
      const totalSkills = filteredGroupsWithFilteredSkills.reduce(
        (total, group) => total + group.skills.length, 0
      );
      
      let shownSkills = 0;
      
      // If compact, calculate the number of shown skills
      if (isCompact) {
        // Take up to 3 groups
        const limitedGroups = filteredGroupsWithFilteredSkills.slice(0, 3);
        shownSkills = limitedGroups.reduce((total, group) => {
          // Take up to 3 skills per group
          return total + Math.min(group.skills.length, 3);
        }, 0);
      } else {
        shownSkills = totalSkills;
      }
      
      return { total: totalSkills, shown: shownSkills };
    } else {
      // First filter flat skills by angle
      const filteredSkills = (cvData.skills as Skill[]).filter(
        skill => shouldShowItem(skill.angles)
      );
      
      const totalSkills = filteredSkills.length;
      const shownSkills = isCompact ? Math.min(filteredSkills.length, COMPACT_ITEMS_LIMIT) : totalSkills;
      
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
      
      // Filter groups by angle
      const filteredGroups = groupedSkills.filter(group => shouldShowItem(group.angles));
      
      const filteredSkillGroups = filteredGroups.map(group => ({
        ...group,
        // Filter skills within each group by angle
        skills: group.skills.filter(skill => shouldShowItem(skill.angles))
      }));
      
      // Apply compact mode if needed
      const limitedSkillGroups = isCompact 
        ? filteredSkillGroups.map(group => ({
            ...group,
            skills: group.skills.slice(0, 3) // Limit skills in each group
          })).slice(0, 3) // Limit number of groups
        : filteredSkillGroups;

      return (
        <div className="space-y-6">
          {limitedSkillGroups.map((group, groupIndex) => (
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
      const flatSkills = cvData.skills as Skill[];
      
      // Filter skills by angle
      const filteredSkills = flatSkills.filter(skill => shouldShowItem(skill.angles));
      
      // Apply compact mode if needed
      const limitedSkills = isCompact 
        ? filteredSkills.slice(0, COMPACT_ITEMS_LIMIT)
        : filteredSkills;
        
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {limitedSkills.map((skill, index) => renderSkillItem(skill, index))}
        </div>
      );
    }
  };

  // Get skill counts for display
  const skillCounts = calculateSkillCounts();

  // Filter data for display based on angle and compact mode
  const filteredExperience = getFilteredData(cvData.experience);
  const filteredEducation = getFilteredData(cvData.education);
  const filteredProjects = getFilteredData(cvData.projects);
  const filteredLanguages = getFilteredData(cvData.languages);

  // Get total counts after angle filtering
  const totalExperience = cvData.experience.filter(item => shouldShowItem(item.angles)).length;
  const totalEducation = cvData.education.filter(item => shouldShowItem(item.angles)).length;
  const totalProjects = cvData.projects.filter(item => shouldShowItem(item.angles)).length;
  const totalLanguages = cvData.languages.filter(item => shouldShowItem(item.angles)).length;

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
      {/* Experience Section */}
      <CVSection 
        title={`Experience${isCompact && totalExperience > COMPACT_ITEMS_LIMIT ? ` (${filteredExperience.length}/${totalExperience})` : ''}`}
        icon={BriefcaseBusiness}
        isExpanded={expandedSection === 'experience'}
        onToggle={() => handleSectionToggle('experience')}
      >
        <div className="space-y-8">
          {filteredExperience.length > 0 ? (
            filteredExperience.map((exp, index) => (
              <TimelineItem
                key={index}
                title={exp.title}
                organization={exp.company}
                location={exp.location}
                period={exp.period}
                description={exp.description}
                currentAngle={currentAngle}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No experience data available for the selected filter.</p>
          )}
        </div>
      </CVSection>
      
      {/* Education Section */}
      <CVSection 
        title={`Education${isCompact && totalEducation > COMPACT_ITEMS_LIMIT ? ` (${filteredEducation.length}/${totalEducation})` : ''}`}
        icon={GraduationCap}
        isExpanded={expandedSection === 'education'}
        onToggle={() => handleSectionToggle('education')}
      >
        <div className="space-y-8">
          {filteredEducation.length > 0 ? (
            filteredEducation.map((edu, index) => (
              <TimelineItem
                key={index}
                title={edu.degree}
                organization={edu.institution}
                location={edu.location}
                period={edu.period}
                description={edu.description}
                currentAngle={currentAngle}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No education data available for the selected filter.</p>
          )}
        </div>
      </CVSection>
      
      {/* Skills Section */}
      <CVSection 
        title={`Skills${isCompact && skillCounts.total > skillCounts.shown ? ` (${skillCounts.shown}/${skillCounts.total})` : ''}`}
        icon={User2}
        isExpanded={expandedSection === 'skills'}
        onToggle={() => handleSectionToggle('skills')}
      >
        {skillCounts.total > 0 ? renderSkillsContent() : (
          <p className="text-muted-foreground">No skills data available for the selected filter.</p>
        )}
      </CVSection>
      
      {/* Projects Section */}
      <CVSection 
        title={`Projects${isCompact && totalProjects > COMPACT_ITEMS_LIMIT ? ` (${filteredProjects.length}/${totalProjects})` : ''}`}
        icon={Code}
        isExpanded={expandedSection === 'projects'}
        onToggle={() => handleSectionToggle('projects')}
      >
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} currentAngle={currentAngle} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No projects data available for the selected filter.</p>
        )}
      </CVSection>
      
      {/* Languages Section */}
      <CVSection 
        title={`Languages${isCompact && totalLanguages > COMPACT_ITEMS_LIMIT ? ` (${filteredLanguages.length}/${totalLanguages})` : ''}`}
        icon={Languages}
        isExpanded={expandedSection === 'languages'}
        onToggle={() => handleSectionToggle('languages')}
      >
        {filteredLanguages.length > 0 ? (
          <ul className="space-y-4">
            {filteredLanguages.map((lang, index) => (
              <li key={index} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                <span className="font-medium">{lang.name}</span>
                <span className="text-muted-foreground">{lang.proficiency}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No language data available for the selected filter.</p>
        )}
      </CVSection>
    </div>
  );
}
