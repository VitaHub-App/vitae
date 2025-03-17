
import { readFile, readdir } from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { z } from 'zod';
import logger from '../utils/logger';
import {
  CVData,
  PersonalInfo,
  Experience,
  Education,
  Project,
  personalInfoSchema,
  experienceSchema,
  educationSchema,
  skillsSchema,
  languagesSchema,
  projectSchema,
} from '../types/cv';

// Configuration constants
const CV_DIR = path.resolve(process.env.CV_DIR || './content/cvs');
const DEFAULT_LOCALE = 'en';

// Updated frontmatter schema that includes all sections
const frontmatterSchema = personalInfoSchema.extend({
  skills: skillsSchema,
  languages: languagesSchema,
});

// Utility type for section processors
type SectionProcessor<T> = (nodes: Node[]) => Promise<T[]>;

// Define a simplified logger interface to avoid type errors
interface SimpleLogger {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  success: (message: string) => void;
  fatal: (message: string) => void;
}

/**
 * Frontmatter validation using Zod
 */
async function validateFrontmatter(data: unknown): Promise<z.infer<typeof frontmatterSchema>> {
  try {
    return frontmatterSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid frontmatter data\n` + formatZodError(error));
    }
    logger.error('Unknown validation error:', error);
    throw new Error('Invalid frontmatter data');
  }
}

/**
 * Enhanced Markdown parser with proper section extraction and processing
 */
async function parseMarkdownSections(content: string): Promise<{
  experience: Experience[];
  education: Education[];
  projects: Project[];
}> {
  const processor = remark().use(remarkParse);
  const tree = processor.parse(content);
  const rawSections: Record<string, Node[]> = {};

  try {
    let currentSection: string | null = null;
    // Split AST into section nodes
    for (const node of (tree as Parent).children) {
      // Check if node is a heading and has depth property
      if (node.type === 'heading' && 'depth' in node && node.depth === 2) {
        currentSection = extractTextContent(node).trim().toLowerCase();
        rawSections[currentSection] = [];
      } else if (currentSection) {
        rawSections[currentSection].push(node);
      }
    }
    // Process sections with their AST nodes
    const [experience, education, projects] = await Promise.all([
      processSection(rawSections.experience, parseExperience, "experience"),
      processSection(rawSections.education, parseEducation, "education"),
      processSection(rawSections.projects, parseProjects, "projects"),
    ]);

    return { experience, education, projects };
  } catch (error) {
    throw error;
  }
}

/**
 * Validated Markdown CV parser
 */
export async function parseMarkdownCV(filePath: string): Promise<CVData> {
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // Validate frontmatter data
    const frontmatter = await validateFrontmatter(data);
    const sections = await parseMarkdownSections(content);

    const { skills, languages, ...personalInfo } = frontmatter;
    const { experience, education, projects } = sections;

    // Parse and validate all sections
    return {
      personalInfo,
      experience,
      education,
      skills,
      projects,
      languages,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Optimized experience parser using direct node iteration
 */
const parseExperience = createParser<Experience>(experienceSchema, 'experience', (nodes, logger) => {
  const experiences: Experience[] = [];
  let currentExperience: Partial<Experience> = {};
  let state: 'seek' | 'company' | 'description' = 'seek';

  const validateAndAdd = () => {
    try {
      experiences.push(experienceSchema.parse(currentExperience));
    } catch (error) {
      if (error instanceof z.ZodError) throw new Error(`\n` + formatZodError(error));
      throw error;
    }
  };

  const processNode = (node: Node) => {
    switch (node.type) {
      case 'heading':
        if ('depth' in node && node.depth === 3 && state === 'seek') {
          if (currentExperience.title) validateAndAdd();
          const { content: title, angles } = extractAngleTags(extractTextContent(node));
          currentExperience = { title, angles };
          state = 'company';
        }
        logger.debug(`Processing experience entry: ${currentExperience.title}`);
        break;

      case 'paragraph':
        if (state === 'company') {
          const text = extractTextContent(node);
          const parts = text.split('|').map(part => part.trim());

          if (parts.length >= 3) {
            currentExperience.company = parts[0];
            currentExperience.location = parts[1];
            currentExperience.period = parts.slice(2).join('|').trim();
          } else {
            logger.warn(`Malformed experience header: ${text}`);
          }
          state = 'description';
        }
        break;

      case 'list':
        if (state === 'description') {
          currentExperience.description = processDescriptionList(node);
          state = 'seek';
        }
        break;
    }
  };

  nodes.forEach(processNode);
  if (currentExperience.title) validateAndAdd();

  return experiences;
});

/**
 * Optimized education parser using direct node iteration
 */
const parseEducation = createParser<Education>(educationSchema, 'education', (nodes, logger) => {
  const educations: Education[] = [];
  let currentEducation: Partial<Education> = {};
  let state: 'seek' | 'institution' | 'description' = 'seek';

  const validateAndAdd = () => {
    try {
      educations.push(educationSchema.parse(currentEducation));
    } catch (error) {
      if (error instanceof z.ZodError) throw new Error(`\n` + formatZodError(error));
      throw error;
    }
  };

  const processNode = (node: Node) => {
    switch (node.type) {
      case 'heading':
        if ('depth' in node && node.depth === 3 && state === 'seek') {
          if (currentEducation.degree) validateAndAdd();
          const { content: degree, angles } = extractAngleTags(extractTextContent(node));
          currentEducation = { degree, angles };
          logger.debug(`Processing education entry: ${currentEducation.degree}`);
          state = 'institution';
        }
        break;

      case 'paragraph':
        if (state === 'institution') {
          const text = extractTextContent(node);
          const parts = text.split('|').map(part => part.trim());
          
          if (parts.length >= 3) {
            currentEducation.institution = parts[0];
            currentEducation.location = parts[1];
            currentEducation.period = parts.slice(2).join('|');
          } else {
            logger.warn(`Malformed education header: ${text}`);
          }
          state = 'description';
        }
        break;

      case 'list':
        if (state === 'description') {
          currentEducation.description = processDescriptionList(node);
          state = 'seek';
        }
        break;
    }
  };

  nodes.forEach(processNode);
  if (currentEducation.degree) validateAndAdd();

  return educations;
});

/**
 * Optimized project parser using pre-parsed AST
 */
const parseProjects = createParser<Project>(projectSchema, 'project', (nodes, logger) => {
  const projects: Project[] = [];
  let currentProject: Partial<Project> = {};
  let state: 'seek' | 'description' | 'details' = 'seek';

  const validateAndAdd = () => {
    try {
      projects.push(projectSchema.parse(currentProject));
    } catch (error) {
      if (error instanceof z.ZodError) throw new Error(`\n` + formatZodError(error));
      throw error;
    }
  };

  const processNode = (node: Node) => {
    switch (node.type) {
      case 'heading':
        if ('depth' in node && node.depth === 3) {
          // Finalize previous project
          if (currentProject.title) validateAndAdd()
          
          // Start new project
          const { content: titleText, angles } = extractAngleTags(extractTextContent(node));
          const titleMatch = titleText.match(/^(.*?)\s*\((.*)\)$/);
          currentProject = {
            title: titleMatch?.[1]?.trim() || titleText.trim(),
            period: titleMatch?.[2]?.trim(),
            angles
          };
          logger.debug(`Processing project entry: ${currentProject.title}`);
          state = 'description';
        }
        break;

      case 'paragraph':
        if (state === 'description') {
          currentProject.description = extractTextContent(node);
          state = 'details';
        }
        break;

      case 'list':
        if (state === 'details') {
          currentProject.details ??= [];
          currentProject.technologies ??= [];
          const items = processDescriptionList(node);
          items.forEach(listItem => {
            const [key, ...values] = listItem.value.split(':').map(s => s.trim());
            const value = values.join(':').trim();

            switch (key.toLowerCase()) {
              case 'technologies':
                currentProject.technologies.push(
                 ...value.split(',')
                  .map(t => t.trim()).filter(Boolean)
                  .map(t => ({value: t, angles: listItem.angles}))
                );
                break;
              case 'link':
                currentProject.link = value;
                break;
              default:
                currentProject.details.push({value: listItem.value, angles: listItem.angles});
                break;
            }
          });
          state = 'seek';
        }
        break;
    }
  };

  // Directly iterate through nodes instead of using visit()
  nodes.forEach(processNode);

  // Add final project
  if (currentProject.title) validateAndAdd();

  return projects;
});

function processDescriptionList(listNode: Node): Array<{ value: string; angles?: string[] }> {
  if (!listNode || !('children' in listNode)) return [];
  
  return listNode.children.map(item => {
    const { content, angles } = extractAngleTags(extractTextContent(item));
    return {
      value: content.replace(/^-\s*/, ''),
      angles
    };
  });
}


/**
 * File processor with proper error handling and concurrency
 */
async function processCVFile(filePath: string): Promise<[string, CVData]> {
  const fileLabel = path.basename(filePath);
  try {
    logger.info(`Processing CV file: ${fileLabel}`);
    const langMatch = filePath.match(/_([a-z]{2})\.md$/i);
    const langCode = langMatch?.[1]?.toLowerCase() || DEFAULT_LOCALE;
    const cvData = await parseMarkdownCV(filePath);
    logger.success(`Successfully processed ${fileLabel} (${langCode})`);
    return [langCode, cvData];
  } catch (error) {
    throw error;
  }
}

/**
 * Production-ready CV generator with proper resource handling
 */
export async function generateCVDataFromMarkdown(): Promise<object> {
  logger.info(`Starting CV generation from: ${CV_DIR}`);
  const files = await readdir(CV_DIR);

  logger.info(`Found ${files.length} CV files to process`);
  const cvGroups = new Map<string, Map<string, CVData>>();

  await Promise.all(files.map(async (file) => {
    if (!file.endsWith('.md')) return;
    
    const filePath = path.join(CV_DIR, file);

    try {
      const [langCode, cvData] = await processCVFile(filePath);
      const baseName = file.replace(/(?:_[a-z]{2})?\.md$/i, '');

      cvGroups.set(baseName, (cvGroups.get(baseName) || new Map()).set(langCode, cvData));
    } catch (error) {
      logger.fatal(`CV generation failed on ${file}: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  }));

  // Convert Map to serializable object
  const output = Object.fromEntries(
    Array.from(cvGroups.entries()).map(([base, locales]) => [base, Object.fromEntries(locales)])
  );

  logger.success(`Generated CV data for ${cvGroups.size} profiles with ${files.length} files`);
  return output;
}

// Generic text content extractor
function extractTextContent(node: Node): string {
  let text = '';
  
  visit(node, (childNode) => {
    if (childNode.type === 'text' && 'value' in childNode) {
      text += childNode.value;
    }
    return true; // Continue traversing
  });

  return text.trim();
}

/**
 * Extracts angle tags from markdown content
 * Format: {angle=tag1,tag2,tag3}
 */
export function extractAngleTags(text: string): { content: string; angles: string[] | undefined } {
  const angleTagRegex = /^\s*\{angle=([a-zA-Z0-9,\-_]+)\}\s*(.*)/;
  const match = text.match(angleTagRegex);
  
  if (match) {
    const angles = match[1].split(',').map(tag => tag.trim());
    const cleanedText = match[2];
    
    return {
      content: cleanedText,
      angles: angles.length > 0 ? angles : undefined
    };
  }
  
  return {
    content: text,
    angles: undefined
  };
}


// Updated section processor helper
async function processSection<T>(
  nodes: Node[] | undefined,
  processor: SectionProcessor<T>,
  sectionName: string
): Promise<T[]> {
  try {
    return nodes ? await processor(nodes) : [];
  } catch (error) {
    throw error;
  }
}

// Unified parser implementation pattern
function createParser<T>(
  schema: z.ZodSchema<T>,
  sectionName: string,
  stateMachine: (nodes: Node[], logger: SimpleLogger) => T[]
): SectionProcessor<T> {
  return async (nodes) => {
    try {
      logger.debug(`Processing ${sectionName} section with ${nodes?.length || 0} nodes`);
      const results = stateMachine(nodes, logger);
      logger.info(`Successfully parsed ${results.length} ${sectionName} entries`);
      return results;
    } catch (error) {
      throw new Error(`Failed to parse ${sectionName} section: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
}

function formatZodError(error: z.ZodError): string {
  return error.errors
    .map(e => `\t\t\t\t• ${e.path.join('.')}: ${e.message}`)
    .join('\n');
}
