export type TemplateType = 'modern' | 'classic' | 'minimal' | 'creative' | 'professional' | 'executive';

export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
};

/** Grouped skills for Executive-style layout: bold category line, comma-separated skills on the next line. */
export type SkillGroup = {
  id: string;
  category: string;
  skills: string[];
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  /** When set, Executive template shows category headings; `skills` should stay in sync (flattened) for other templates / ATS. */
  skillGroups?: SkillGroup[];
  softSkills?: string[];
  certifications?: Certification[];
  projects?: Project[];
};
