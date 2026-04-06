import type { ResumeData } from '../types/resume';
import { getFlattenedSkills } from './resumeSkills';

export interface ATSBreakdown {
  label: string;
  score: number;
  maxScore: number;
  tips: string[];
}

export interface ATSResult {
  totalScore: number;
  breakdown: ATSBreakdown[];
}

const ACTION_VERBS = [
  'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'created',
  'delivered', 'designed', 'developed', 'directed', 'drove', 'enabled',
  'engineered', 'established', 'executed', 'generated', 'implemented',
  'improved', 'increased', 'integrated', 'launched', 'led', 'managed',
  'mentored', 'migrated', 'optimized', 'orchestrated', 'oversaw', 'pioneered',
  'planned', 'reduced', 'refactored', 'resolved', 'scaled', 'spearheaded',
  'streamlined', 'supervised', 'transformed', 'upgraded',
];

const QUANTIFIABLE_PATTERNS = [
  /\d+%/, /\$[\d,]+/, /\d+\+?\s*(users|clients|customers|projects|team|members)/i,
  /\d+x/, /\d+\s*(million|billion|thousand)/i, /reduced.*\d/, /increased.*\d/,
  /improved.*\d/, /saved.*\d/, /grew.*\d/,
];

function scoreContactInfo(data: ResumeData): ATSBreakdown {
  let score = 0;
  const maxScore = 15;
  const tips: string[] = [];

  if (data.personalInfo.fullName?.trim()) score += 3;
  else tips.push('Add your full name');

  if (data.personalInfo.email?.trim() && data.personalInfo.email.includes('@')) score += 3;
  else tips.push('Add a valid email address');

  if (data.personalInfo.phone?.trim()) score += 3;
  else tips.push('Add a phone number');

  if (data.personalInfo.location?.trim()) score += 2;
  else tips.push('Add your location');

  if (data.personalInfo.linkedin?.trim()) score += 2;
  else tips.push('Add your LinkedIn profile URL');

  if (data.personalInfo.github?.trim() || data.personalInfo.portfolio?.trim()) score += 2;
  else tips.push('Add a GitHub or portfolio link');

  return { label: 'Contact Info', score, maxScore, tips };
}

function scoreSummary(data: ResumeData): ATSBreakdown {
  let score = 0;
  const maxScore = 15;
  const tips: string[] = [];
  const summary = data.summary?.trim() || '';

  if (!summary) {
    tips.push('Add a professional summary to improve ATS matching');
    return { label: 'Summary', score, maxScore, tips };
  }

  score += 3;

  const wordCount = summary.split(/\s+/).length;
  if (wordCount >= 30 && wordCount <= 80) {
    score += 4;
  } else if (wordCount >= 15) {
    score += 2;
    tips.push('Aim for 30-80 words in your summary for optimal ATS scoring');
  } else {
    tips.push('Your summary is too short — expand it to 30-80 words');
  }

  const flatSkills = getFlattenedSkills(data);
  const hasKeywords = flatSkills.some(
    (skill) => summary.toLowerCase().includes(skill.toLowerCase())
  );
  if (hasKeywords) score += 4;
  else tips.push('Include some of your key skills in the summary');

  const hasActionVerbs = ACTION_VERBS.some((v) => summary.toLowerCase().includes(v));
  if (hasActionVerbs) score += 2;
  else tips.push('Use action verbs in your summary (e.g., "developed", "led", "implemented")');

  const hasQuantifiable = QUANTIFIABLE_PATTERNS.some((p) => p.test(summary));
  if (hasQuantifiable) score += 2;

  return { label: 'Summary', score, maxScore, tips };
}

function scoreExperience(data: ResumeData): ATSBreakdown {
  let score = 0;
  const maxScore = 30;
  const tips: string[] = [];
  const exps = data.experience || [];

  if (exps.length === 0) {
    tips.push('Add at least one work experience entry');
    return { label: 'Experience', score, maxScore, tips };
  }

  score += Math.min(exps.length, 3) * 3; // up to 9 pts for having entries

  let descriptionsWithVerbs = 0;
  let descriptionsWithMetrics = 0;
  let hasAllDates = true;
  let totalDescWords = 0;

  for (const exp of exps) {
    if (!exp.startDate) hasAllDates = false;
    if (!exp.current && !exp.endDate) hasAllDates = false;

    const desc = exp.description?.toLowerCase() || '';
    const descWords = desc.split(/\s+/).filter(Boolean).length;
    totalDescWords += descWords;

    if (ACTION_VERBS.some((v) => desc.includes(v))) descriptionsWithVerbs++;
    if (QUANTIFIABLE_PATTERNS.some((p) => p.test(desc))) descriptionsWithMetrics++;
  }

  if (hasAllDates) score += 3;
  else tips.push('Ensure all experience entries have start and end dates');

  const verbRatio = exps.length > 0 ? descriptionsWithVerbs / exps.length : 0;
  if (verbRatio >= 0.75) score += 6;
  else if (verbRatio >= 0.5) score += 3;
  else tips.push('Start bullet points with strong action verbs');

  const metricRatio = exps.length > 0 ? descriptionsWithMetrics / exps.length : 0;
  if (metricRatio >= 0.5) score += 6;
  else if (metricRatio >= 0.25) score += 3;
  else tips.push('Add quantifiable achievements (numbers, percentages, dollar amounts)');

  const avgWords = exps.length > 0 ? totalDescWords / exps.length : 0;
  if (avgWords >= 30) score += 6;
  else if (avgWords >= 15) score += 3;
  else tips.push('Add more detail to your experience descriptions (aim for 30+ words each)');

  return { label: 'Experience', score: Math.min(score, maxScore), maxScore, tips };
}

function scoreEducation(data: ResumeData): ATSBreakdown {
  let score = 0;
  const maxScore = 10;
  const tips: string[] = [];
  const edus = data.education || [];

  if (edus.length === 0) {
    tips.push('Add your education details');
    return { label: 'Education', score, maxScore, tips };
  }

  score += 4;

  const hasComplete = edus.some(
    (e) => e.degree?.trim() && e.institution?.trim() && e.startDate?.trim()
  );
  if (hasComplete) score += 3;
  else tips.push('Fill in degree, institution, and dates for each entry');

  const hasField = edus.some((e) => e.field?.trim());
  if (hasField) score += 2;
  else tips.push('Include your field of study');

  const hasGpa = edus.some((e) => e.gpa?.trim());
  if (hasGpa) score += 1;

  return { label: 'Education', score: Math.min(score, maxScore), maxScore, tips };
}

function scoreSkills(data: ResumeData): ATSBreakdown {
  let score = 0;
  const maxScore = 20;
  const tips: string[] = [];
  const skills = getFlattenedSkills(data);

  if (skills.length === 0) {
    tips.push('Add relevant technical and soft skills');
    return { label: 'Skills', score, maxScore, tips };
  }

  if (skills.length >= 10) score += 10;
  else if (skills.length >= 6) score += 7;
  else if (skills.length >= 3) score += 4;
  else {
    score += 2;
    tips.push('Add more skills — aim for at least 8-10 relevant skills');
  }

  const avgLen = skills.reduce((sum, s) => sum + s.trim().length, 0) / skills.length;
  if (avgLen >= 3 && avgLen <= 30) score += 5;
  else tips.push('Keep skill names concise and specific');

  const mentionedInExp = skills.filter((skill) =>
    data.experience.some((exp) =>
      exp.description?.toLowerCase().includes(skill.toLowerCase())
    )
  );
  const mentionRatio = skills.length > 0 ? mentionedInExp.length / skills.length : 0;
  if (mentionRatio >= 0.3) score += 5;
  else if (mentionRatio >= 0.15) score += 3;
  else tips.push('Reference your listed skills within your experience descriptions');

  return { label: 'Skills', score: Math.min(score, maxScore), maxScore, tips };
}

function scoreExtras(data: ResumeData): ATSBreakdown {
  let score = 0;
  const maxScore = 10;
  const tips: string[] = [];

  const certs = data.certifications || [];
  const projects = data.projects || [];
  const softSkills = data.softSkills || [];

  if (certs.length > 0) {
    score += Math.min(certs.length, 2) * 2;
    const complete = certs.some((c) => c.name?.trim() && c.issuer?.trim());
    if (complete) score += 1;
  } else {
    tips.push('Add certifications if you have any');
  }

  if (projects.length > 0) {
    score += Math.min(projects.length, 2) * 2;
    const hasDesc = projects.some((p) => p.description?.trim());
    if (hasDesc) score += 1;
  } else {
    tips.push('Add projects to showcase your work');
  }

  if (softSkills.length >= 3) {
    score += 2;
  } else if (softSkills.length > 0) {
    score += 1;
  } else {
    tips.push('Add soft skills (e.g., Leadership, Communication, Teamwork)');
  }

  return { label: 'Extras', score: Math.min(score, maxScore), maxScore, tips };
}

export function calculateATSScore(data: ResumeData): ATSResult {
  const breakdown = [
    scoreContactInfo(data),
    scoreSummary(data),
    scoreExperience(data),
    scoreEducation(data),
    scoreSkills(data),
    scoreExtras(data),
  ];

  const totalScore = Math.round(
    (breakdown.reduce((sum, b) => sum + b.score, 0) /
      breakdown.reduce((sum, b) => sum + b.maxScore, 0)) *
      100
  );

  return { totalScore, breakdown };
}
