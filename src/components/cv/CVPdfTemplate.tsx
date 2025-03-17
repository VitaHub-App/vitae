import React from 'react';
import {
  CVData,
  PersonalInfo,
  Skill,
  SkillGroup,
  Language,
  Experience,
  Education,
  Project,
  COMPACT_ITEMS_LIMIT,
} from '@/types/cv';

interface CVPdfTemplateProps {
  cvData: CVData;
  personalInfo: PersonalInfo;
  cvName: string;
  isCompact: boolean;
  currentAngle?: string;
}

const CVPdfTemplate: React.FC<CVPdfTemplateProps> = ({ 
  cvData, 
  personalInfo,
  cvName,
  isCompact,
  currentAngle 
}) => {
  const {
    experience = [],
    education = [],
    projects = [],
    languages = [],
    skills = []
  } = cvData || {};

  // Helper function to determine if an item should be visible based on angle
  const shouldShowItem = (itemAngles?: string[]) => {
    // If no angle is selected or the item has no angles, show it
    if (!currentAngle || !itemAngles || itemAngles.length === 0) {
      return true;
    }
    
    // If an angle is selected, show only items tagged with that angle
    return itemAngles.includes(currentAngle);
  };

  // Type guard for SkillGroup
  const isSkillGroup = (item: Skill | SkillGroup): item is SkillGroup => {
    return 'skills' in item && 'name' in item;
  };
  // Helper function to determine if skills are grouped
  const hasGroupedSkills = (): boolean => {
    if (!cvData.skills.length) return false;
    return isSkillGroup(cvData.skills[0]);
  };

  // Filter data based on compact mode and selected angle
  const getFilteredData = <T extends { angles?: string[] }>(data: T[], limitCount = COMPACT_ITEMS_LIMIT): T[] => {
    const angleFilteredData = data.filter(item => shouldShowItem(item.angles));
    return isCompact ? angleFilteredData.slice(0, limitCount) : angleFilteredData;
  };

  // Calculate total and shown skill counts
  const calculateSkillCounts = () => {
    if (hasGroupedSkills()) {
      const groupedSkills = cvData.skills as SkillGroup[];
      const filteredGroups = groupedSkills.filter(group => shouldShowItem(group.angles));
      
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
        const limitedGroups = filteredGroupsWithFilteredSkills.slice(0, COMPACT_ITEMS_LIMIT);
        shownSkills = limitedGroups.reduce((total, group) =>
          total + Math.min(group.skills.length, COMPACT_ITEMS_LIMIT), 0);
      } else {
        shownSkills = totalSkills;
      }
      
      return { total: totalSkills, shown: shownSkills };
    } else {
      const flatSkills = cvData.skills as Skill[];
      const filteredSkills = flatSkills.filter(skill => shouldShowItem(skill.angles));
      return {
        total: filteredSkills.length,
        shown: isCompact ? Math.min(filteredSkills.length, COMPACT_ITEMS_LIMIT) : filteredSkills.length
      };
    }
  };

  // Get skill counts for display
  const skillCounts = calculateSkillCounts();

  // Apply angle filtering to all sections
  const filteredExperience = getFilteredData<Experience>(experience);
  const filteredEducation = getFilteredData<Education>(education);
  const filteredProjects = getFilteredData<Project>(projects);
  const filteredLanguages = getFilteredData<Language>(languages);

  const filteredSkills = hasGroupedSkills()
  ? (getFilteredData<SkillGroup>(skills)).map(group => ({
      ...group,
      skills: getFilteredData(group.skills)
    }))
  : getFilteredData<Skill>(skills);

  // Get total counts after angle filtering
  const totalExperience = experience.filter(item => shouldShowItem(item.angles)).length;
  const totalEducation = education.filter(item => shouldShowItem(item.angles)).length;
  const totalProjects = projects.filter(item => shouldShowItem(item.angles)).length;
  const totalLanguages = languages.filter(item => shouldShowItem(item.angles)).length;
  
  // Render a single skill item
  const renderSkillItem = (skill: Skill, key: number) => (
    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ fontWeight: 500, flexBasis: '50%', textAlign: 'left' }}>{skill.name}</span>
      <div style={{ display: 'flex', justifyContent: 'flex-end', flexBasis: '50%' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              margin: '0 3px',
              backgroundColor: i < skill.level ? '#1f2937' : '#d1d5db'
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="cv-pdf-container bg-white text-black p-10" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header section */}
      <header style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{personalInfo.name}</h1>
        <h2 style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '1rem' }}>{personalInfo.title}</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
          {personalInfo.website && (
            <>
              <span>•</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </header>
      
      {/* Bio section */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Professional Summary</h3>
        <p>{personalInfo.bio}</p>
      </section>
      
      {/* Experience section */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
          Professional Experience {isCompact &&  totalExperience > COMPACT_ITEMS_LIMIT ? ` (${filteredExperience.length}/${totalExperience})` : ''}
        </h3>
        {filteredExperience.map((job, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h4 style={{ fontWeight: '600' }}>{job.title}</h4>
              <span style={{ color: '#6b7280' }}>{job.period}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h5 style={{ color: '#4b5563' }}>{job.company}</h5>
              <span style={{ color: '#6b7280' }}>{job.location}</span>
            </div>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              {job.description.map((desc, i) => (
                <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', textAlign: 'left' }}>{desc.value}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      
      {/* Education section */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
          Education {isCompact &&  totalEducation > COMPACT_ITEMS_LIMIT ? ` (${filteredEducation.length}/${totalEducation})` : ''}
        </h3>
        {filteredEducation.map((edu, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h4 style={{ fontWeight: '600' }}>{edu.degree}</h4>
              <span style={{ color: '#6b7280' }}>{edu.period}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h5 style={{ color: '#4b5563' }}>{edu.institution}</h5>
              <span style={{ color: '#6b7280' }}>{edu.location}</span>
            </div>
            {edu.description && edu.description.length > 0 && (
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                {edu.description.map((desc, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', textAlign: 'left' }}>{desc.value}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
      
      {/* Skills section */}
      {skillCounts.total > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
            Skills {isCompact && skillCounts.total > skillCounts.shown ? ` (${skillCounts.shown}/${skillCounts.total})` : ''}
          </h3>
          <div>
            {hasGroupedSkills() ? (
              (filteredSkills as SkillGroup[]).map((group, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold">{group.name}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.skills.map((skill, i) => renderSkillItem(skill, i))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {(filteredSkills as Skill[]).map((skill, index) => renderSkillItem(skill, index))}
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Projects section */}
      {filteredProjects.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
            Projects {isCompact &&  totalProjects > COMPACT_ITEMS_LIMIT ? ` (${filteredProjects.length}/${totalProjects})` : ''}
          </h3>
          {filteredProjects.map((project, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <h4 style={{ fontWeight: '600' }}>{project.title}</h4>
                <span style={{ color: '#6b7280' }}>{project.period}</span>
              </div>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>{project.description}</p>
              {project.details && project.details.length > 0 && (
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  {project.details.map((detail, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', textAlign: 'left' }}>{detail.value}</li>
                  ))}
                </ul>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {project.technologies.map((tech, i) => (
                  <span 
                    key={i} 
                    style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.25rem',
                      display: 'inline-block'
                    }}
                  >
                    {tech.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
      
      {/* Languages section */}
      {filteredLanguages.length > 0 && (
        <section>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
            Languages {isCompact &&  totalLanguages > COMPACT_ITEMS_LIMIT ? ` (${filteredLanguages.length}/${totalLanguages})` : ''}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {filteredLanguages.map((lang, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '500' }}>{lang.name}</span>
                <span style={{ color: '#6b7280' }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer style={{ marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
        <p>Generated via VitaHub • {new Date().toLocaleDateString()}</p>
        <p style={{ marginTop: '0.25rem' }}>View online: {window.location.origin}/cv/{cvName}</p>
      </footer>
    </div>
  );
};

export default CVPdfTemplate;
