
import React from 'react';
import { CVData, Skill, SkillGroup, COMPACT_ITEMS_LIMIT } from '@/types/cv';

interface CVPdfTemplateProps {
  cvData: CVData;
  cvName: string;
  isCompact?: boolean;
}

const CVPdfTemplate = ({ cvData, cvName, isCompact = true }: CVPdfTemplateProps) => {
  const { personalInfo, experience, education, skills, projects, languages } = cvData;
  
  // Filter data based on compact mode
  const getFilteredData = (data: any[], limitCount = COMPACT_ITEMS_LIMIT) => {
    if (!isCompact) return data;
    return data.slice(0, limitCount);
  };

  // Filter data for display in PDF
  const filteredExperience = getFilteredData(experience);
  const filteredEducation = getFilteredData(education);
  const filteredProjects = getFilteredData(projects);
  const filteredLanguages = getFilteredData(languages);
  
  // Helper function to determine if skills are grouped
  const hasGroupedSkills = (): boolean => {
    if (!skills.length) return false;
    return 'name' in skills[0] && 'skills' in skills[0];
  };

  // Calculate total and shown skill counts for the title
  const calculateSkillCounts = () => {
    if (hasGroupedSkills()) {
      const groupedSkills = skills as SkillGroup[];
      const totalSkills = groupedSkills.reduce((total, group) => total + group.skills.length, 0);
      let shownSkills = 0;
      
      if (isCompact) {
        const limitedGroups = groupedSkills.slice(0, 3);
        shownSkills = limitedGroups.reduce((total, group) => {
          return total + Math.min(group.skills.length, 3);
        }, 0);
      } else {
        shownSkills = totalSkills;
      }
      
      return { total: totalSkills, shown: shownSkills };
    } else {
      const flatSkills = skills as Skill[];
      const totalSkills = flatSkills.length;
      const shownSkills = isCompact ? Math.min(flatSkills.length, COMPACT_ITEMS_LIMIT) : totalSkills;
      
      return { total: totalSkills, shown: shownSkills };
    }
  };

  const skillCounts = calculateSkillCounts();

  // Render a single skill item
  const renderSkillItem = (skill: Skill, key: string) => (
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
  
  // Render skills section based on structure
  const renderSkillsSection = () => {
    if (hasGroupedSkills()) {
      const groupedSkills = skills as SkillGroup[];
      const filteredSkillGroups = isCompact 
        ? groupedSkills.map(group => ({
            ...group,
            skills: group.skills.slice(0, 3) // Limit skills in each group
          })).slice(0, 3) // Limit number of groups
        : groupedSkills;

      return (
        <>
          {filteredSkillGroups.map((group, groupIndex) => (
            <div key={groupIndex} style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', fontSize: '1rem', fontWeight: 'bold' }}>{group.name}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {group.skills.map((skill, skillIndex) => renderSkillItem(skill, `${groupIndex}-${skillIndex}`))}
              </div>
            </div>
          ))}
        </>
      );
    } else {
      const filteredSkills = getFilteredData(skills as Skill[]);
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {filteredSkills.map((skill, index) => renderSkillItem(skill, `skill-${index}`))}
        </div>
      );
    }
  };
  
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
          Professional Experience {isCompact && experience.length > COMPACT_ITEMS_LIMIT ? `(${filteredExperience.length}/${experience.length})` : ''}
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
                <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', textAlign: 'left' }}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      
      {/* Education section */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
          Education {isCompact && education.length > COMPACT_ITEMS_LIMIT ? `(${filteredEducation.length}/${education.length})` : ''}
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
                  <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', textAlign: 'left' }}>{desc}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
      
      {/* Skills section */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
          Skills {isCompact && skillCounts.total > skillCounts.shown ? `(${skillCounts.shown}/${skillCounts.total})` : ''}
        </h3>
        {renderSkillsSection()}
      </section>
      
      {/* Projects section */}
      {filteredProjects.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
            Projects {isCompact && projects.length > COMPACT_ITEMS_LIMIT ? `(${filteredProjects.length}/${projects.length})` : ''}
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
                    <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', textAlign: 'left' }}>{detail}</li>
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
                    {tech}
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
            Languages {isCompact && languages.length > COMPACT_ITEMS_LIMIT ? `(${filteredLanguages.length}/${languages.length})` : ''}
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
