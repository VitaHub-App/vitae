
import { readFile, readdir, writeFile, mkdir } from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { CVData, PersonalInfo, Experience, Education, Project } from '../types/cv';
import { cvDataEn } from '../data/sampleCVData';

/**
 * Parses a markdown CV file and returns structured data
 */
export async function parseMarkdownCV(filePath: string): Promise<Partial<CVData>> {
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // Process the markdown content to extract sections
    const sections = extractSectionsFromMarkdown(content);
    
    // Merge frontmatter data with extracted sections
    return {
      personalInfo: extractPersonalInfo(data),
      experience: extractExperienceFromSections(sections.experience, data.experience),
      education: extractEducationFromSections(sections.education, data.education),
      skills: data.skills || [],
      projects: extractProjectsFromSections(sections.projects, data.projects),
      languages: data.languages || [],
    };
  } catch (error) {
    console.error(`Error parsing markdown CV: ${error}`);
    return {};
  }
}

/**
 * Extracts personal information from frontmatter data
 */
function extractPersonalInfo(frontmatter: any): PersonalInfo {
  return {
    name: frontmatter.name || '',
    title: frontmatter.title || '',
    email: frontmatter.email || '',
    phone: frontmatter.phone || '',
    location: frontmatter.location || '',
    website: frontmatter.website,
    github: frontmatter.github,
    linkedin: frontmatter.linkedin,
    bio: frontmatter.bio || '',
  };
}

/**
 * Extracts sections from markdown content
 */
function extractSectionsFromMarkdown(content: string): Record<string, string> {
  const sections: Record<string, string> = {
    experience: '',
    education: '',
    projects: '',
  };
  
  // Simple regex-based section extraction
  // In a production implementation, consider using a proper markdown parser
  const experienceMatch = content.match(/## Experience\s+([\s\S]*?)(?=##|$)/);
  if (experienceMatch) sections.experience = experienceMatch[1].trim();
  
  const educationMatch = content.match(/## Education\s+([\s\S]*?)(?=##|$)/);
  if (educationMatch) sections.education = educationMatch[1].trim();
  
  const projectsMatch = content.match(/## Projects\s+([\s\S]*?)(?=##|$)/);
  if (projectsMatch) sections.projects = projectsMatch[1].trim();
  
  return sections;
}

/**
 * Extracts experience items from a markdown section
 */
function extractExperienceFromSections(section: string, frontmatterExperience?: any[]): Experience[] {
  if (frontmatterExperience && Array.isArray(frontmatterExperience)) {
    return frontmatterExperience;
  }
  
  // Implement markdown parsing for experience items
  // This is a simple implementation; a more robust parser would be needed for production
  const experiences: Experience[] = [];
  const experienceBlocks = section.split(/### /).filter(Boolean);
  
  for (const block of experienceBlocks) {
    const lines = block.split('\n').filter(Boolean);
    if (lines.length < 3) continue;
    
    const title = lines[0].trim();
    const companyLine = lines[1].trim();
    const companyMatch = companyLine.match(/(.*) \| (.*) \| (.*)/);
    
    if (companyMatch) {
      const company = companyMatch[1];
      const location = companyMatch[2];
      const period = companyMatch[3];
      
      // Extract description items (bullet points)
      const description = lines.slice(2)
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.trim().substring(2));
      
      experiences.push({
        title,
        company,
        location,
        period,
        description,
      });
    }
  }
  
  return experiences;
}

/**
 * Extracts education items from a markdown section
 */
function extractEducationFromSections(section: string, frontmatterEducation?: any[]): Education[] {
  if (frontmatterEducation && Array.isArray(frontmatterEducation)) {
    return frontmatterEducation;
  }
  
  // Similar implementation to experience extraction
  const educations: Education[] = [];
  const educationBlocks = section.split(/### /).filter(Boolean);
  
  for (const block of educationBlocks) {
    const lines = block.split('\n').filter(Boolean);
    if (lines.length < 3) continue;
    
    const degree = lines[0].trim();
    const institutionLine = lines[1].trim();
    const institutionMatch = institutionLine.match(/(.*) \| (.*) \| (.*)/);
    
    if (institutionMatch) {
      const institution = institutionMatch[1];
      const location = institutionMatch[2];
      const period = institutionMatch[3];
      
      // Extract description items (bullet points)
      const description = lines.slice(2)
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.trim().substring(2));
      
      educations.push({
        degree,
        institution,
        location,
        period,
        description,
      });
    }
  }
  
  return educations;
}

/**
 * Extracts project items from a markdown section
 */
function extractProjectsFromSections(section: string, frontmatterProjects?: any[]): Project[] {
  if (frontmatterProjects && Array.isArray(frontmatterProjects)) {
    return frontmatterProjects;
  }
  
  const projects: Project[] = [];
  const projectBlocks = section.split(/### /).filter(Boolean);
  
  for (const block of projectBlocks) {
    const lines = block.split('\n').filter(Boolean);
    if (lines.length < 2) continue;
    
    const titleLine = lines[0].trim();
    const titleMatch = titleLine.match(/(.*) \(([^)]*)\)/);
    
    if (titleMatch) {
      const title = titleMatch[1].trim();
      const period = titleMatch[2].trim();
      
      // Extract description
      const descriptionLines = lines.slice(1).filter(line => !line.includes('Technologies:') && !line.includes('Link:'));
      const description = descriptionLines.join(' ').trim();
      
      // Extract technologies
      let technologies: string[] = [];
      const techLine = lines.find(line => line.includes('Technologies:'));
      if (techLine) {
        technologies = techLine
          .replace('Technologies:', '')
          .split(',')
          .map(tech => tech.trim());
      }
      
      // Extract link
      let link: string | undefined;
      const linkLine = lines.find(line => line.includes('Link:'));
      if (linkLine) {
        link = linkLine.replace('Link:', '').trim();
      }
      
      projects.push({
        title,
        period,
        description,
        technologies,
        link,
      });
    }
  }
  
  return projects;
}

/**
 * Discover and load all CV markdown files in a directory
 * Returns a map of language code to CV data
 */
export async function loadAllCVs(dirPath: string): Promise<Record<string, CVData>> {
  const result: Record<string, CVData> = {};
  
  try {
    const files = await readdir(dirPath);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    for (const file of mdFiles) {
      // Extract language code from filename (e.g., john_doe_de.md => 'de')
      let langCode = 'en'; // Default language
      const langMatch = file.match(/(.*)_([a-z]{2})\.md$/);
      
      if (langMatch) {
        langCode = langMatch[2];
      }
      
      const cvData = await parseMarkdownCV(path.join(dirPath, file));
      
      // Merge with default data to ensure all required fields exist
      result[langCode] = {
        ...cvDataEn, // Use English as base template
        ...cvData,
      } as CVData;
    }
    
    return result;
  } catch (error) {
    console.error(`Error loading CV markdown files: ${error}`);
    return {};
  }
}

/**
 * Generate CV data from markdown files and save it to JSON
 * This is expected to be used at build time
 */
export async function generateCVDataFromMarkdown(): Promise<Record<string, Record<string, CVData>>> {
  const result: Record<string, Record<string, CVData>> = {};
  
  try {
    // In a real production environment, you would use a constant for the CV directory
    // We're using a relative path for this example
    const cvDir = path.resolve('./examples');
    const files = await readdir(cvDir);
    
    // Group files by base name (without language suffix)
    const fileGroups: Record<string, string[]> = {};
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      // Extract base name and language code
      const match = file.match(/(.+?)(?:_([a-z]{2}))?\.md$/);
      if (!match) continue;
      
      const [_, baseName, langCode = 'en'] = match;
      
      if (!fileGroups[baseName]) {
        fileGroups[baseName] = [];
      }
      
      fileGroups[baseName].push(file);
    }
    
    // Process each group of files
    for (const [baseName, files] of Object.entries(fileGroups)) {
      result[baseName] = {};
      
      for (const file of files) {
        // Extract language code from filename
        const langMatch = file.match(/(.+?)_([a-z]{2})\.md$/);
        const langCode = langMatch ? langMatch[2] : 'en';
        
        // Parse the markdown file
        const cvData = await parseMarkdownCV(path.join(cvDir, file));
        
        // Merge with default data to ensure all required fields exist
        result[baseName][langCode] = {
          ...cvDataEn, // Use English as base template
          ...cvData,
        } as CVData;
      }
    }
    
    // Write the output to a JSON file for client-side consumption
    const outputDir = path.resolve('./src/data/generated');
    await mkdir(outputDir, { recursive: true }).catch(() => {});
    await writeFile(
      path.join(outputDir, 'cvs.json'),
      JSON.stringify(result, null, 2)
    );
    
    return result;
  } catch (error) {
    console.error(`Error generating CV data from markdown: ${error}`);
    return {};
  }
}
