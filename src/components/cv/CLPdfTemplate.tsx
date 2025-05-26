
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

const BackgroundPattern = () => (
  <svg 
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      opacity: 0.05
    }}
    viewBox="0 0 100 100" 
    preserveAspectRatio="none"
  >
    <path 
      d="M0 50 Q 25 25 50 50 T 100 50" 
      fill="none" 
      stroke="#2b3d5f" 
      strokeWidth="1"
    />
    <path 
      d="M0 30 Q 50 0 100 30 L 100 70 Q 50 100 0 70 Z" 
      fill="none" 
      stroke="#2b3d5f" 
      strokeWidth="0.5"
    />
  </svg>
);

interface CVPdfTemplateProps {
  cvData: CVData;
  personalInfo: PersonalInfo;
  cvName: string;
  isCompact: boolean;
  currentAngle?: string | null;
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

  // Color scheme
  const colors = {
    primary: '#2b3d5f',     // Navy blue
    secondary: '#4a6da7',   // Medium blue
    accent: '#6c9bd2',      // Light blue
    text: '#333333',        // Dark gray
    lightText: '#666666',   // Medium gray
    background: '#f8f9fa'   // Light gray
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
  
  const SkillBlock: React.FC<{
    skill: Skill;
  }> = ({ skill }) => (
    <div style={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      breakInside: 'avoid'
    }}>
      <span style={{ fontSize: '0.8rem', paddingRight: '0.3rem'}}>{skill.name}</span>
      <div style={{
        display: 'flex',
        gap: '0.1rem',
        paddingTop: '0.8rem' // keep: fix for html2pdf infidelity
      }}>
        {Array.from({ length: 5 }).map((_, levelIndex) => (
          <div
            key={levelIndex}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '1px',
              backgroundColor: levelIndex < skill.level ? colors.accent : colors.background,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="cv-pdf-container" style={{ 
      position: 'relative',
      // padding: '40px 50px',
      fontFamily: "'Lato', sans-serif",
      color: colors.text,
      lineHeight: 1.5,
      backgroundColor: 'white'
    }}>
      <BackgroundPattern />

    
      {/* Header section with two columns */}
      <header style={{ 
        marginBottom: '2.5rem',
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left column - Name & Title */}
        <div>
          <h1 style={{ 
            fontSize: '2.25rem',
            fontWeight: 700,
            color: colors.primary,
            marginBottom: '0.25rem',
            lineHeight: 1.1
          }}>{personalInfo.name}</h1>
          <h2 style={{ 
            fontSize: '1.4rem',
            fontWeight: 400,
            color: colors.secondary,
            lineHeight: 1.2
          }}>{personalInfo.title}</h2>
        </div>

        {/* Right column - Bio */}
        <div style={{ 
          paddingLeft: '1.5rem',
          borderLeft: `2px solid ${colors.background}`
        }}>
          <p style={{ 
            fontSize: '0.9rem',
            lineHeight: 1.5,
            color: colors.lightText,
            margin: 0
          }}>{personalInfo.bio}</p>
        </div>

        {/* Metadata row spanning both columns */}
        <div style={{ 
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem', // Reduced gap
          fontSize: '0.75rem',
          color: colors.lightText,
          marginTop: '1.5rem', // Increased top margin
          flexWrap: 'nowrap',
          overflow: 'hidden',
          padding: '0.5rem 0'
        }}>
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.website
          ].filter(Boolean).map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem', // Tighter gap
              whiteSpace: 'nowrap',
              padding: '0 0.25rem'
            }}>
              {index > 0 && <span style={{ color: colors.accent }}>•</span>}
              <span>{item}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Main content container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left column (main content) */}
        <div>
          {/* Experience section */}
          <SectionWrapper 
            title="Professional Experience"
            count={totalExperience}
            isCompact={isCompact}
            color={colors.primary}
          >
            {filteredExperience.map((job, index) => (
              <div key={index} style={{ marginBottom: '2rem', breakInside: 'avoid'}}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '0.5rem'
                }}>
                  <div>
                    <h4 style={{ 
                      fontWeight: 600,
                      color: colors.primary
                    }}>{job.title}</h4>
                    <h5 style={{ 
                      color: colors.secondary,
                      fontSize: '0.95rem'
                    }}>{job.company}</h5>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      display: 'block',
                      color: colors.lightText,
                      fontSize: '0.9rem'
                    }}>{job.period}</span>
                    <span style={{ 
                      color: colors.lightText,
                      fontSize: '0.85rem'
                    }}>{job.location}</span>
                  </div>
                </div>
                <ul style={{ 
                  listStyleType: 'none',
                  paddingLeft: '1rem',
                  borderLeft: `2px solid ${colors.accent}`
                }}>
                  {job.description.map((desc, i) => (
                    <li key={i} style={{ 
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      position: 'relative',
                      paddingLeft: '1rem'
                    }}>{desc.value}</li>
                  ))}
                </ul>
              </div>
            ))}
          </SectionWrapper>

          {/* Education section */}
          <SectionWrapper 
            title="Education"
            count={totalEducation}
            isCompact={isCompact}
            color={colors.primary}
          >
            {filteredEducation.map((edu, index) => (
              <div key={index} style={{ marginBottom: '2rem', breakInside: 'avoid' }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '0.5rem'
                }}>
                  <div>
                    <h4 style={{ 
                      fontWeight: 600,
                      color: colors.primary
                    }}>{edu.degree}</h4>
                    <h5 style={{ 
                      color: colors.secondary,
                      fontSize: '0.95rem'
                    }}>{edu.institution}</h5>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      display: 'block',
                      color: colors.lightText,
                      fontSize: '0.9rem'
                    }}>{edu.period}</span>
                    <span style={{ 
                      color: colors.lightText,
                      fontSize: '0.85rem'
                    }}>{edu.location}</span>
                  </div>
                </div>
                {edu.description && edu.description.length > 0 && (
                  <ul style={{ 
                    listStyleType: 'none',
                    paddingLeft: '1rem',
                    borderLeft: `2px solid ${colors.accent}`
                  }}>
                    {edu.description.map((desc, i) => (
                      <li key={i} style={{ 
                        marginBottom: '0.5rem',
                        fontSize: '0.95rem',
                        position: 'relative',
                        paddingLeft: '1rem'
                      }}>{desc.value}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </SectionWrapper>

          {/* Projects section */}
          <SectionWrapper 
            title="Projects"
            count={totalProjects}
            isCompact={isCompact}
            color={colors.primary}
          >
            {filteredProjects.map((project, index) => (
              <div key={index} style={{ marginBottom: '2rem', breakInside: 'avoid' }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '0.5rem'
                }}>
                  <div>
                    <h4 style={{ 
                      fontWeight: 600,
                      color: colors.primary
                    }}>{project.title}</h4>
                    <div style={{ 
                      color: colors.secondary,
                      fontSize: '0.95rem'
                    }}>{project.period}</div>
                  </div>
                </div>
      
                <p style={{ 
                  marginBottom: '0.75rem',
                  fontSize: '0.95rem',
                  color: colors.text
                }}>{project.description}</p>

                {project.details && project.details.length > 0 && (
                  <ul style={{ 
                    listStyleType: 'none',
                    paddingLeft: '1rem',
                    borderLeft: `2px solid ${colors.accent}`,
                    marginBottom: '1rem'
                  }}>
                    {project.details.map((detail, i) => (
                      <li key={i} style={{ 
                        marginBottom: '0.5rem',
                        fontSize: '0.95rem',
                        position: 'relative',
                        paddingLeft: '1rem'
                      }}>{detail.value}</li>
                    ))}
                  </ul>
                )}

                {project.technologies.length > 0 && (
                  <div style={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                  }}>
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        style={{ 
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          lineHeight: 0.75, // keep: fix for html2pdf infidelity
                          padding: '0.0rem 0.75rem 0.75rem', // keep: fix for html2pdf infidelity
                          backgroundColor: colors.background,
                          borderRadius: '4px',
                          color: colors.secondary,
                          letterSpacing: '0.5px',
                        }}
                      >
                        {tech.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </SectionWrapper>
        </div>

        {/* Right column (compact skills) */}
        <div style={{
          fontSize: '0.85rem',
          paddingLeft: '1.5rem',
          borderLeft: `2px solid ${colors.background}`
        }}>
          {/* Skills section */}
          {skillCounts.total > 0 && (
            <SectionWrapper 
              title="Skills"
              count={skillCounts.total}
              isCompact={isCompact}
              color={colors.primary}
              style={{ 
                marginBottom: '1.5rem',
                padding: '1rem',
                background: colors.background,
                borderRadius: '6px',
                breakInside: 'avoid'
              }}
            >
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {hasGroupedSkills() ? (filteredSkills as SkillGroup[]).map((group, index) => (
                    <div key={index} style={{ breakInside: 'avoid' }}>
                      <h4 style={{ 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: colors.secondary,
                        marginBottom: '0.4rem'
                      }}>{group.name}</h4>
                      <div style={{ display: 'grid', gap: '0.4rem' }}>
                        {group.skills.map((skill, i) => <SkillBlock key={i} skill={skill}/>)}
                      </div>
                    </div>
                  )) : (filteredSkills as Skill[]).map((skill, i) => <SkillBlock key={i} skill={skill}/>)}
              </div>
            </SectionWrapper>
          )}

          {/* Languages section */}
          {filteredLanguages.length > 0 && (
            <SectionWrapper 
              title="Languages"
              count={totalLanguages}
              isCompact={isCompact}
              color={colors.primary}
              style={{ 
                padding: '1rem',
                background: colors.background,
                borderRadius: '6px',
                breakInside: 'avoid'
              }}
            >
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {filteredLanguages.map((lang, index) => (
                  <div key={index}>
                    <div style={{ 
                      fontWeight: 500,
                      fontSize: '0.85rem',
                    }}>
                      {lang.name}
                    </div>
                    <div style={{
                      color: colors.lightText,
                      fontSize: '0.75rem',
                      marginTop: '0.25rem',
                      paddingLeft: '1rem'
                    }}>
                      {lang.proficiency}
                    </div>
                  </div>
                ))}
              </div>
            </SectionWrapper>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: `2px solid ${colors.background}`,
        textAlign: 'center',
        fontSize: '0.8rem',
        color: colors.lightText,
        position: 'relative',
        zIndex: 1
      }}>
        <p>Generated via VitaHub • {new Date().toLocaleDateString()}</p>
        <p style={{ marginTop: '0.25rem', marginBottom: '1rem' }}>
          View online: {window.location.origin}/cv/{cvName}
        </p>
      </footer>
    </div>
  );
};

const SectionWrapper: React.FC<{
  title: string;
  count: number;
  isCompact: boolean;
  color: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, count, isCompact, color, children, style }) => (
  <section style={{ marginBottom: '2rem', ...style }}>
    <h3 style={{ 
      fontSize: '1.25rem',
      fontWeight: 600,
      color: color,
      breakInside: 'avoid',
      marginBottom: '1.5rem',
      position: 'relative',
      paddingBottom: '0.5rem',
    }}>
      {title}
      {isCompact && count > COMPACT_ITEMS_LIMIT && (
        <span style={{ 
          fontSize: '0.9rem',
          fontWeight: 400,
          marginLeft: '0.5rem',
          color: '#666'
        }}>({COMPACT_ITEMS_LIMIT}/{count})</span>
      )}
    </h3>
    {children}
  </section>
);

export default CVPdfTemplate;

