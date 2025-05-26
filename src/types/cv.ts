import { z } from 'zod';

// Define the angle tag schema
export const angleTagSchema = z.array(z.string()).optional();

// Schema for string values with angles
const stringWithAnglesSchema = z.object({
  value: z.string().min(1),
  angles: angleTagSchema,
});

const descriptionSchema = z.array(stringWithAnglesSchema);

// Zod schemas for validation
export const personalInfoSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  location: z.string().min(1),
  website: z.string().url().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  bio: z.string().min(1),
  image: z.string().optional(), // Add image property
  defaultAngle: z.string().optional(), // Default angle to display
});

export const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  period: z.string().min(1),
  description: descriptionSchema,
  angles: angleTagSchema,
});

export const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().min(1),
  period: z.string().min(1),
  description: descriptionSchema,
  angles: angleTagSchema,
});

export const skillSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(1).max(5),
  angles: angleTagSchema,
});

// New schema for skill groups
export const skillGroupSchema = z.object({
  name: z.string().min(1),
  skills: z.array(skillSchema),
  angles: angleTagSchema,
});

// Union type for either flat skills array or grouped skills
export const skillsSchema = z.union([
  z.array(skillSchema),
  z.array(skillGroupSchema)
]).optional().default([]);

export const projectSchema = z.object({
  title: z.string().min(1),
  period: z.string().min(1),
  description: z.string().min(1),
  details: descriptionSchema.optional(),
  technologies: descriptionSchema,
  link: z.string().url().optional(),
  angles: angleTagSchema,
});

export const languageSchema = z.object({
  name: z.string().min(1),
  proficiency: z.string().min(1),
  angles: angleTagSchema,
});

export const languagesSchema = z.array(languageSchema).optional().default([])

// Add these schemas to your existing types file
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Description = z.infer<typeof descriptionSchema>;

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[] | SkillGroup[];
  projects: Project[];
  languages: Language[];
}

// Constants for compact mode display
export const COMPACT_ITEMS_LIMIT = 3; // Number of items to show in compact mode
