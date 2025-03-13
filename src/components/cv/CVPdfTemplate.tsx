
import React from 'react';
import { CVData, Skill, SkillGroup } from '@/types/cv';

interface CVPdfTemplateProps {
  cvData: CVData;
  cvName: string;
}

const CVPdfTemplate = ({ cvData, cvName }: CVPdfTemplateProps) => {
  const { personalInfo, experience, education, skills, projects, languages } = cvData;
  
  // Helper function to determine if skills are grouped
  const hasGroupedSkills = (): boolean => {
    if (!skills.length) return false;
    return 'name' in skills[0] && 'skills' in skills[0];
  };

  // Render a single skill item
  const renderSkillItem = (skill: Skill, key: string) => (
    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span className="font-medium" style={{ flexBasis: '50%', textAlign: 'left' }}>{skill.name}</span>
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
      return (
        <>
          {(skills as SkillGroup[]).map((group, groupIndex) => (
            <div key={groupIndex} style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', fontSize: '1rem', fontWeight: 'bold' }}>{group.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                {group.skills.map((skill, skillIndex) => renderSkillItem(skill, `${groupIndex}-${skillIndex}`))}
              </div>
            </div>
          ))}
        </>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-4">
          {(skills as Skill[]).map((skill, index) => renderSkillItem(skill, `skill-${index}`))}
        </div>
      );
    }
  };
  
  return (
    <div className="cv-pdf-container bg-white text-black p-10" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header section */}
      <header className="text-center mb-8 border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-bold mb-2">{personalInfo.name}</h1>
        <h2 className="text-xl text-gray-600 mb-4">{personalInfo.title}</h2>
        
        <div className="flex flex-wrap justify-center gap-3 text-sm">
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
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
        <p>{personalInfo.bio}</p>
      </section>
      
      {/* Experience section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-1">Professional Experience</h3>
        {experience.map((job, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <h4 className="font-semibold">{job.title}</h4>
              <span className="text-gray-600">{job.period}</span>
            </div>
            <div className="flex justify-between mb-2">
              <h5 className="text-gray-700">{job.company}</h5>
              <span className="text-gray-600">{job.location}</span>
            </div>
            <ul style={{ listStylePosition: 'outside', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              {job.description.map((desc, i) => (
                <li key={i} className="text-sm mb-1" style={{ textAlign: 'left' }}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      
      {/* Education section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-1">Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <h4 className="font-semibold">{edu.degree}</h4>
              <span className="text-gray-600">{edu.period}</span>
            </div>
            <div className="flex justify-between mb-2">
              <h5 className="text-gray-700">{edu.institution}</h5>
              <span className="text-gray-600">{edu.location}</span>
            </div>
            {edu.description && edu.description.length > 0 && (
              <ul style={{ listStylePosition: 'outside', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                {edu.description.map((desc, i) => (
                  <li key={i} className="text-sm mb-1" style={{ textAlign: 'left' }}>{desc}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
      
      {/* Skills section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-1">Skills</h3>
        {renderSkillsSection()}
      </section>
      
      {/* Projects section */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-1">Projects</h3>
          {projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <h4 className="font-semibold">{project.title}</h4>
                <span className="text-gray-600">{project.period}</span>
              </div>
              <p className="mb-2 text-sm">{project.description}</p>
              {project.details && project.details.length > 0 && (
                <ul style={{ listStylePosition: 'outside', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  {project.details.map((detail, i) => (
                    <li key={i} className="text-sm mb-1" style={{ textAlign: 'left' }}>{detail}</li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="text-xs font-bold px-2 py-2">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
      
      {/* Languages section */}
      {languages.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-1">Languages</h3>
          <div className="grid grid-cols-2 gap-4">
            {languages.map((lang, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="font-medium">{lang.name}</span>
                <span className="text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="mt-10 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>Generated via VitaHub • {new Date().toLocaleDateString()}</p>
        <p className="mt-1">View online: {window.location.origin}/cv/{cvName}</p>
      </footer>
    </div>
  );
};

export default CVPdfTemplate;
