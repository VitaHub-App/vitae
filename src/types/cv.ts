
// CV data structure types
export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string[];
}

export interface Skill {
  name: string;
  level: number; // 1-5
}

export interface Project {
  title: string;
  period: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  bio: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: {
    name: string;
    proficiency: string;
  }[];
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}
